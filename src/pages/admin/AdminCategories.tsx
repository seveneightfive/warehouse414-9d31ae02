import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminCategoriesWithCounts, useAdminSubcategories } from '@/hooks/useAdminAttributes';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, MoreHorizontal, Pencil, Trash2, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { AttributeFormDialog } from '@/components/admin/AttributeFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
}

interface CategoryWithCounts {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  productCount: number;
  subcategoryCount: number;
  subcategories: Subcategory[];
}

export default function AdminCategories() {
  const { data: categories, isLoading, create, update, remove } = useAdminCategoriesWithCounts();
  const { create: createSubcategory, update: updateSubcategory, remove: removeSubcategory } = useAdminSubcategories();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Subcategory state
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<{ id: string; name: string; slug: string; category_id: string } | null>(null);
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null);
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState<string | null>(null);

  const filtered = (categories as CategoryWithCounts[]).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

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

  const handleSubcategorySave = (data: { name: string; slug: string }) => {
    if (editingSubcategory) {
      updateSubcategory.mutate({ id: editingSubcategory.id, category_id: editingSubcategory.category_id, ...data }, {
        onSuccess: () => {
          setSubcategoryFormOpen(false);
          setEditingSubcategory(null);
        },
      });
    } else if (addingSubcategoryTo) {
      createSubcategory.mutate({ ...data, category_id: addingSubcategoryTo }, {
        onSuccess: () => {
          setSubcategoryFormOpen(false);
          setAddingSubcategoryTo(null);
        },
      });
    }
  };

  const openAddSubcategory = (categoryId: string) => {
    setEditingSubcategory(null);
    setAddingSubcategoryTo(categoryId);
    setSubcategoryFormOpen(true);
  };

  const openEditSubcategory = (subcategory: Subcategory) => {
    setAddingSubcategoryTo(null);
    setEditingSubcategory({
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      category_id: subcategory.category_id || '',
    });
    setSubcategoryFormOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl">Categories</h1>
            <p className="text-muted-foreground">Manage product categories and subcategories</p>
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center"># Products</TableHead>
                <TableHead className="text-center"># Subcategories</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((category) => {
                  const isExpanded = expandedCategories.has(category.id);
                  return (
                    <Collapsible key={category.id} open={isExpanded} onOpenChange={() => toggleExpanded(category.id)} asChild>
                      <>
                        <TableRow className="border-foreground">
                          <TableCell className="p-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{category.productCount}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{category.subcategoryCount}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => { setEditing(category); setFormOpen(true); }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeleteId(category.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <TableRow className="border-foreground bg-muted/30">
                            <TableCell colSpan={5} className="p-0">
                              <div className="px-8 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Subcategories</span>
                                  <Button size="sm" variant="outline" onClick={() => openAddSubcategory(category.id)}>
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add Subcategory
                                  </Button>
                                </div>
                                {category.subcategories.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No subcategories</p>
                                ) : (
                                  <div className="space-y-2">
                                    {category.subcategories.map((sub) => (
                                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 border border-border rounded">
                                        <span className="text-sm">{sub.name}</span>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => openEditSubcategory(sub)}
                                          >
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => setDeleteSubcategoryId(sub.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AttributeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Category"
        attribute={editing}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
      />

      <AttributeFormDialog
        open={subcategoryFormOpen}
        onOpenChange={(open) => {
          setSubcategoryFormOpen(open);
          if (!open) {
            setEditingSubcategory(null);
            setAddingSubcategoryTo(null);
          }
        }}
        title="Subcategory"
        attribute={editingSubcategory}
        onSave={handleSubcategorySave}
        isPending={createSubcategory.isPending || updateSubcategory.isPending}
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
        title="Delete Category"
        description="Are you sure you want to delete this category? Products and subcategories using this category will need to be updated."
      />

      <DeleteConfirmDialog
        open={!!deleteSubcategoryId}
        onOpenChange={() => setDeleteSubcategoryId(null)}
        onConfirm={() => {
          if (deleteSubcategoryId) {
            removeSubcategory.mutate(deleteSubcategoryId);
            setDeleteSubcategoryId(null);
          }
        }}
        title="Delete Subcategory"
        description="Are you sure you want to delete this subcategory? Products using this subcategory will need to be updated."
      />
    </AdminLayout>
  );
}
