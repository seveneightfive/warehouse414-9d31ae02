import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminProducts, ProductFormData } from '@/hooks/useAdminProducts';
import { useAdminCategories, useAdminSubcategories, useAdminDesigners, useAdminMakers, useAdminStyles, useAdminPeriods, useAdminCountries } from '@/hooks/useAdminAttributes';
import { useProductImageManager } from '@/hooks/useProductImageManager';
import { ProductImageUploader } from '@/components/admin/ProductImageUploader';
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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  materials: z.string().optional(),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  notes: z.string().optional(),
  price: z.coerce.number().optional(),
  status: z.enum(['available', 'on_hold', 'sold', 'inventory']),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  designer_id: z.string().optional(),
  designer_attribution: z.string().optional(),
  maker_id: z.string().optional(),
  maker_attribution: z.string().optional(),
  style_id: z.string().optional(),
  period_id: z.string().optional(),
  country_id: z.string().optional(),
  year_created: z.string().optional(),
  product_dimensions: z.string().optional(),
  box_dimensions: z.string().optional(),
  featured_image_url: z.string().optional(),
  firstdibs_url: z.string().optional(),
  chairish_url: z.string().optional(),
  ebay_url: z.string().optional(),
});

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  initialTab?: string;
}

export function ProductFormDialog({ open, onOpenChange, product, initialTab = 'basic' }: ProductFormDialogProps) {
  const { createProduct, updateProduct } = useAdminProducts();
  const { data: categories } = useAdminCategories();
  const { data: subcategories } = useAdminSubcategories();
  const { data: designers } = useAdminDesigners();
  const { data: makers } = useAdminMakers();
  const { data: styles } = useAdminStyles();
  const { data: periods } = useAdminPeriods();
  const { data: countries } = useAdminCountries();
  
  const isEditing = !!product;
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    images,
    deleteImage,
    reorderImages,
    setFeaturedImage,
    refreshImages,
  } = useProductImageManager(product?.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      notes: '',
      status: 'inventory',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        sku: product.sku || '',
        tags: product.tags?.join(', ') || '',
        materials: product.materials || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        notes: product.notes || '',
        price: product.price || undefined,
        status: product.status === 'inventory' ? 'available' : (product.status || 'available'),
        category_id: product.category_id || undefined,
        subcategory_id: product.subcategory_id || undefined,
        designer_id: product.designer_id || undefined,
        designer_attribution: product.designer_attribution || undefined,
        maker_id: product.maker_id || undefined,
        maker_attribution: product.maker_attribution || undefined,
        style_id: product.style_id || undefined,
        period_id: product.period_id || undefined,
        country_id: product.country_id || undefined,
        year_created: product.year_created || undefined,
        product_dimensions: product.product_dimensions || '',
        box_dimensions: product.box_dimensions || '',
        featured_image_url: product.featured_image_url || '',
        firstdibs_url: product.firstdibs_url || '',
        chairish_url: product.chairish_url || '',
        ebay_url: product.ebay_url || '',
      });
    } else {
      form.reset({
        name: '',
        sku: '',
        notes: '',
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
    // Generate slug from SKU if available, otherwise from name
    const slug = generateSlug(data.sku || data.name);
    
    // Parse tags from comma-separated string
    const tags = data.tags 
      ? data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const formData: ProductFormData = {
      name: data.name,
      slug,
      sku: data.sku,
      tags,
      materials: data.materials,
      status: data.status,
      notes: data.notes,
      short_description: data.short_description,
      long_description: data.long_description,
      price: data.price,
      category_id: data.category_id === 'none' ? undefined : data.category_id,
      subcategory_id: data.subcategory_id === 'none' ? undefined : data.subcategory_id,
      designer_id: data.designer_id === 'none' ? undefined : data.designer_id,
      designer_attribution: data.designer_attribution === 'none' ? undefined : data.designer_attribution,
      maker_id: data.maker_id === 'none' ? undefined : data.maker_id,
      maker_attribution: data.maker_attribution === 'none' ? undefined : data.maker_attribution,
      style_id: data.style_id === 'none' ? undefined : data.style_id,
      period_id: data.period_id === 'none' ? undefined : data.period_id,
      country_id: data.country_id === 'none' ? undefined : data.country_id,
      year_created: data.year_created,
      product_dimensions: data.product_dimensions,
      box_dimensions: data.box_dimensions,
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
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="images" disabled={!isEditing}>Images</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                {/* Name - Full Width */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price, SKU, Status - 33% each */}
                <div className="grid grid-cols-3 gap-4">
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
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-foreground" placeholder="Product SKU" />
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
                            <SelectItem value="inventory">Inventory</SelectItem>
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
                        <Textarea {...field} rows={12} className="border-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} className="border-foreground" placeholder="Internal notes (not shown to customers)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </TabsContent>

              <TabsContent value="attributes" className="space-y-4 pt-4">
                {/* Category and Subcategory - Top */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset subcategory when category changes
                            form.setValue('subcategory_id', 'none');
                          }} 
                          value={field.value || 'none'}
                        >
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
                    render={({ field }) => {
                      const selectedCategoryId = form.watch('category_id');
                      const filteredSubcategories = subcategories.filter(
                        (sub) => sub.category_id === selectedCategoryId
                      );
                      return (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || 'none'}
                            disabled={!selectedCategoryId || selectedCategoryId === 'none'}
                          >
                            <FormControl>
                              <SelectTrigger className="border-foreground">
                                <SelectValue placeholder="Select subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {filteredSubcategories.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                {/* Designer with Attribution */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="designer_id"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                    name="designer_attribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attribution</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="attributed to">Attributed to</SelectItem>
                            <SelectItem value="by">By</SelectItem>
                            <SelectItem value="in the style of">In the style of</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Maker with Attribution */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="maker_id"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                  <FormField
                    control={form.control}
                    name="maker_attribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attribution</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="attributed to">Attributed to</SelectItem>
                            <SelectItem value="by">By</SelectItem>
                            <SelectItem value="in the style of">In the style of</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Style and Period/Era - 50/50 */}
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
                    name="period_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period/Era</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {periods.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country and Year Created - 50/50 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Origin</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'none'}>
                          <FormControl>
                            <SelectTrigger className="border-foreground">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {countries.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
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
                          <Input {...field} className="border-foreground" placeholder="e.g., 1960s, circa 1975" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Materials */}
                <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="Wood, brass, leather, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags - Last */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-foreground" placeholder="vintage, mid-century, brass (comma-separated)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="product_dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Dimensions</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={3} 
                          className="border-foreground" 
                          placeholder='e.g., 24"W x 36"H x 18"D, Seat height: 18 inches'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="box_dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Box/Shipping Dimensions</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={3} 
                          className="border-foreground" 
                          placeholder='e.g., 28"W x 40"H x 22"D, 45 lbs'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="images" className="space-y-4 pt-4">
                {isEditing ? (
                  <ProductImageUploader
                    productId={product.id}
                    sku={form.watch('sku') || product.sku || ''}
                    images={images}
                    featuredImageUrl={form.watch('featured_image_url') || product.featured_image_url}
                    onImagesUploaded={refreshImages}
                    onImageDeleted={async (imageId, imageUrl) => {
                      await deleteImage.mutateAsync({ imageId, imageUrl });
                    }}
                    onSetFeatured={(imageUrl) => {
                      form.setValue('featured_image_url', imageUrl);
                      setFeaturedImage.mutate(imageUrl);
                    }}
                    onReorder={async (reorderedImages) => {
                      await reorderImages.mutateAsync(reorderedImages);
                    }}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Save the product first to upload images.
                  </p>
                )}
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
