import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminProducts, ProductFormData, useProductImages } from '@/hooks/useAdminProducts';
import { useAdminCategories, useAdminSubcategories, useAdminDesigners, useAdminMakers, useAdminStyles } from '@/hooks/useAdminAttributes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  price: z.coerce.number().optional(),
  status: z.enum(['available', 'on_hold', 'sold']),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  designer_id: z.string().optional(),
  maker_id: z.string().optional(),
  style_id: z.string().optional(),
  year_created: z.coerce.number().optional(),
  product_width: z.coerce.number().optional(),
  product_height: z.coerce.number().optional(),
  product_depth: z.coerce.number().optional(),
  box_width: z.coerce.number().optional(),
  box_height: z.coerce.number().optional(),
  box_depth: z.coerce.number().optional(),
  featured_image_url: z.string().optional(),
  firstdibs_url: z.string().optional(),
  chairish_url: z.string().optional(),
  ebay_url: z.string().optional(),
});

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { createProduct, updateProduct } = useAdminProducts();
  const { data: categories } = useAdminCategories();
  const { data: subcategories } = useAdminSubcategories();
  const { data: designers } = useAdminDesigners();
  const { data: makers } = useAdminMakers();
  const { data: styles } = useAdminStyles();
  
  const isEditing = !!product;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      status: 'available',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        slug: product.slug || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        price: product.price || undefined,
        status: product.status || 'available',
        category_id: product.category_id || undefined,
        subcategory_id: product.subcategory_id || undefined,
        designer_id: product.designer_id || undefined,
        maker_id: product.maker_id || undefined,
        style_id: product.style_id || undefined,
        year_created: product.year_created || undefined,
        product_width: product.product_width || undefined,
        product_height: product.product_height || undefined,
        product_depth: product.product_depth || undefined,
        box_width: product.box_width || undefined,
        box_height: product.box_height || undefined,
        box_depth: product.box_depth || undefined,
        featured_image_url: product.featured_image_url || '',
        firstdibs_url: product.firstdibs_url || '',
        chairish_url: product.chairish_url || '',
        ebay_url: product.ebay_url || '',
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        status: 'available',
      });
    }
  }, [product, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData: ProductFormData = {
      name: data.name,
      slug: data.slug,
      status: data.status,
      short_description: data.short_description,
      long_description: data.long_description,
      price: data.price,
      category_id: data.category_id === 'none' ? undefined : data.category_id,
      subcategory_id: data.subcategory_id === 'none' ? undefined : data.subcategory_id,
      designer_id: data.designer_id === 'none' ? undefined : data.designer_id,
      maker_id: data.maker_id === 'none' ? undefined : data.maker_id,
      style_id: data.style_id === 'none' ? undefined : data.style_id,
      year_created: data.year_created,
      product_width: data.product_width,
      product_height: data.product_height,
      product_depth: data.product_depth,
      box_width: data.box_width,
      box_height: data.box_height,
      box_depth: data.box_depth,
      featured_image_url: data.featured_image_url,
      firstdibs_url: data.firstdibs_url,
      chairish_url: data.chairish_url,
      ebay_url: data.ebay_url,
    };

    if (isEditing) {
      await updateProduct.mutateAsync({ id: product.id, data: formData });
    } else {
      await createProduct.mutateAsync(formData);
    }
    onOpenChange(false);
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-foreground"
                            onChange={(e) => {
                              field.onChange(e);
                              if (!isEditing) {
                                form.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="border-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} className="border-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="long_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} className="border-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="designer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designer</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select designer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {designers.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maker_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maker</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select maker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {makers.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="style_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {styles.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year_created"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Created</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="border-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium mb-3">Product Dimensions (inches)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="product_width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="product_height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="product_depth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depth</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Box/Shipping Dimensions (inches)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="box_width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="box_height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="box_depth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depth</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="border-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="links" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="firstdibs_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1stDibs URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="https://1stdibs.com/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chairish_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chairish URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="https://chairish.com/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ebay_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>eBay URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="https://ebay.com/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
