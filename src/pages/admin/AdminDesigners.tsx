import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminDesigners } from '@/hooks/useAdminAttributes';
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
import { Plus, MoreHorizontal, Pencil, Trash2, Search, Upload } from 'lucide-react';
import { AttributeFormDialog } from '@/components/admin/AttributeFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';


export default function AdminDesigners() {
  const { data: designers, isLoading, create, update, remove } = useAdminDesigners();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; slug: string; about?: string | null } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const designers: { name: string; slug: string; about?: string }[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV with quoted fields containing commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const nameIdx = headers.indexOf('name');
      const slugIdx = headers.indexOf('slug');
      const aboutIdx = headers.indexOf('about');
      
      if (nameIdx !== -1 && slugIdx !== -1 && values[nameIdx] && values[slugIdx]) {
        designers.push({
          name: values[nameIdx],
          slug: values[slugIdx],
          about: aboutIdx !== -1 ? values[aboutIdx] || undefined : undefined,
        });
      }
    }
    
    return designers;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const parsedDesigners = parseCSV(text);
      
      if (parsedDesigners.length === 0) {
        toast.error('No valid designers found in CSV');
        return;
      }

      toast.info(`Importing ${parsedDesigners.length} designers...`);

      const { data, error } = await supabase.functions.invoke('bulk-import-designers', {
        body: { designers: parsedDesigners },
      });

      if (error) {
        throw error;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-designers'] });
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import designers');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filtered = designers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: { name: string; slug: string; about?: string }) => {
    if (editing) {
      update.mutate({ id: editing.id, ...data }, {
        onSuccess: () => {
          setFormOpen(false);
          setEditing(null);
        },
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
            <h1 className="font-display text-4xl">Designers</h1>
            <p className="text-muted-foreground">Manage product designers</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? 'Importing...' : 'Import CSV'}
            </Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Designer
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designers..."
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
                <TableHead>About</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No designers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((designer: { id: string; name: string; slug: string; about?: string | null; created_at: string; productCount: number }) => (
                  <TableRow key={designer.id} className="border-foreground">
                    <TableCell className="font-medium">{designer.name}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{designer.productCount}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {designer.about || '—'}
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
                            onClick={() => { setEditing(designer); setFormOpen(true); }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(designer.id)}
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
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        title="Designer"
        attribute={editing}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
        showAbout
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
        title="Delete Designer"
        description="Are you sure you want to delete this designer? Products using this designer will need to be updated."
      />
    </AdminLayout>
  );
}
