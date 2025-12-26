import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, MoreHorizontal, Pencil, CalendarIcon, Trash2 } from 'lucide-react';
import { InventoryFormDialog } from '@/components/admin/InventoryFormDialog';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { GoLiveDatePicker } from '@/components/admin/GoLiveDatePicker';
import { toast } from 'sonner';

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('status', 'inventory')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateGoLiveDate = useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string | null }) => {
      const { error } = await supabase
        .from('products')
        .update({ go_live_date: date })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Go live date updated');
    },
    onError: (error) => {
      toast.error('Failed to update date: ' + error.message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  // Group products by go_live_date
  const scheduledProducts = products
    .filter((p) => p.go_live_date)
    .sort((a, b) => new Date(a.go_live_date!).getTime() - new Date(b.go_live_date!).getTime());

  const unscheduledProducts = products.filter((p) => !p.go_live_date);

  // Group scheduled by date
  const groupedScheduled: Record<string, typeof products> = {};
  scheduledProducts.forEach((p) => {
    const dateKey = p.go_live_date!;
    if (!groupedScheduled[dateKey]) {
      groupedScheduled[dateKey] = [];
    }
    groupedScheduled[dateKey].push(p);
  });

  const renderProductRow = (product: any) => (
    <TableRow key={product.id} className="border-foreground">
      <TableCell>
        <div className="font-medium">{product.name}</div>
        {product.sku && <div className="text-xs text-muted-foreground">{product.sku}</div>}
      </TableCell>
      <TableCell>
        <div className="text-sm max-w-xs truncate">{product.notes || '—'}</div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {format(new Date(product.created_at), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-foreground">
              <CalendarIcon className="mr-2 h-3 w-3" />
              {product.go_live_date
                ? format(parseISO(product.go_live_date), 'MMM d')
                : 'Set Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <GoLiveDatePicker
              value={product.go_live_date ? parseISO(product.go_live_date) : undefined}
              onChange={(date) => {
                updateGoLiveDate.mutate({
                  id: product.id,
                  date: date?.toISOString().split('T')[0] || null,
                });
              }}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingProduct(product);
                setProductFormOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Full Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteId(product.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl">Inventory</h1>
            <p className="text-muted-foreground">Manage items not yet ready for shop</p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-foreground/20">
            <p className="text-lg mb-2">No inventory items</p>
            <p className="text-sm">Add items that aren't ready for the shop yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Scheduled sections - by date */}
            {Object.entries(groupedScheduled).map(([dateKey, items]) => (
              <div key={dateKey} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="border-2 border-foreground">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-foreground">
                        <TableHead>Name</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Go Live</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{items.map(renderProductRow)}</TableBody>
                  </Table>
                </div>
              </div>
            ))}

            {/* Unscheduled section */}
            {unscheduledProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    Unscheduled
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {unscheduledProducts.length} item{unscheduledProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="border-2 border-foreground">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-foreground">
                        <TableHead>Name</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Go Live</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{unscheduledProducts.map(renderProductRow)}</TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <InventoryFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ProductFormDialog
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={editingProduct}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteProduct.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Inventory Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </AdminLayout>
  );
}
