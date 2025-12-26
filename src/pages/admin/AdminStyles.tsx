import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStyles } from '@/hooks/useAdminAttributes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react';
import { AttributeFormDialog } from '@/components/admin/AttributeFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';


export default function AdminStyles() {
  const { data: styles, isLoading, create, update, remove } = useAdminStyles();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = styles.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: { name: string; slug: string }) => {
    if (editing) {
      update.mutate({ id: editing.id, ...data }, {
        onSuccess: () => setFormOpen(false),
      });
    } else {
      create.mutate(data, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl">Styles</h1>
            <p className="text-muted-foreground">Manage product styles</p>
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Style
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search styles..."
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
                <TableHead>Name</TableHead>
                <TableHead className="text-center"># Products</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No styles found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((style: { id: string; name: string; slug: string; created_at: string; productCount: number }) => (
                  <TableRow key={style.id} className="border-foreground">
                    <TableCell className="font-medium">{style.name}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{style.productCount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => { setEditing(style); setFormOpen(true); }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(style.id)}
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

      <AttributeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Style"
        attribute={editing}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            remove.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Style"
        description="Are you sure you want to delete this style? Products using this style will need to be updated."
      />
    </AdminLayout>
  );
}
