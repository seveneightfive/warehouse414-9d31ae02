import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, MoreHorizontal, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

// Custom crosslisting icons as SVG components
const FirstDibsIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? 'text-foreground' : 'text-muted-foreground/40'}`} fill="currentColor">
    <text x="2" y="18" fontSize="14" fontWeight="bold" fontFamily="serif">1D</text>
  </svg>
);

const ChairishIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? 'text-foreground' : 'text-muted-foreground/40'}`} fill="currentColor">
    <text x="4" y="18" fontSize="14" fontWeight="bold" fontFamily="serif">C</text>
  </svg>
);

const EbayIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? 'text-foreground' : 'text-muted-foreground/40'}`} fill="currentColor">
    <text x="4" y="18" fontSize="14" fontWeight="bold" fontFamily="sans-serif">e</text>
  </svg>
);

export default function AdminProducts() {
  const { products, isLoading, deleteProduct } = useAdminProducts();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState('basic');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'inventory':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return '';
    }
  };

  const handleOpenForm = (product: any = null, tab: string = 'basic') => {
    setEditingProduct(product);
    setInitialTab(tab);
    setFormOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl">Products</h1>
            <p className="text-muted-foreground">Manage your inventory</p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-foreground"
            />
          </div>
        </div>

        <div className="border-2 border-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Crosslisted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-foreground">
                    <TableCell>
                      {product.featured_image_url ? (
                        <img
                          src={product.featured_image_url}
                          alt={product.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>{product.category?.name || '—'}</TableCell>
                    <TableCell className="text-right">
                      {product.price ? `$${product.price.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleOpenForm(product, 'links')}
                        className="flex items-center justify-center gap-1.5 w-full hover:bg-muted/50 rounded p-1 transition-colors"
                        title="Edit crosslisting links"
                      >
                        <FirstDibsIcon active={!!product.firstdibs_url} />
                        <ChairishIcon active={!!product.chairish_url} />
                        <EbayIcon active={!!product.ebay_url} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(product.status)}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 touch-manipulation">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          <DropdownMenuItem asChild>
                            <Link to={`/product/${product.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenForm(product)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        initialTab={initialTab}
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
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </AdminLayout>
  );
}
