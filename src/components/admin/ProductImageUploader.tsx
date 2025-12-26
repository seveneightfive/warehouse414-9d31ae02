import { useState, useCallback, useRef } from 'react';
import { Upload, X, Star, GripVertical, Loader2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { optimizeImages, formatBytes, type ImageOptimizationOptions } from '@/lib/imageOptimizer';

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ProductImageUploaderProps {
  productId: string;
  sku: string;
  images: ProductImage[];
  featuredImageUrl: string | null;
  onImagesUploaded: () => void;
  onImageDeleted: (imageId: string, imageUrl: string) => Promise<void>;
  onSetFeatured: (imageUrl: string) => void;
  onReorder: (reorderedImages: { id: string; sort_order: number }[]) => Promise<void>;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

interface PreviewFile {
  file: File;
  preview: string;
  originalSize: number;
  optimizedSize?: number;
}

export function ProductImageUploader({
  productId,
  sku,
  images,
  featuredImageUrl,
  onImagesUploaded,
  onImageDeleted,
  onSetFeatured,
  onReorder,
  isUploading,
  setIsUploading,
}: ProductImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Optimization settings
  const [optimizationOptions, setOptimizationOptions] = useState<ImageOptimizationOptions>({
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.85,
    format: 'webp',
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      processFiles(files);
    }
  }, [optimizationOptions]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }, [optimizationOptions]);

  const processFiles = async (files: File[]) => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      const optimizedFiles = await optimizeImages(
        files,
        optimizationOptions,
        (completed, total) => {
          setOptimizationProgress(Math.round((completed / total) * 100));
        }
      );
      
      const newPreviews: PreviewFile[] = optimizedFiles.map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        originalSize: files[i].size,
        optimizedSize: file.size,
      }));
      
      setPreviewFiles(prev => [...prev, ...newPreviews]);
      
      const totalOriginal = files.reduce((acc, f) => acc + f.size, 0);
      const totalOptimized = optimizedFiles.reduce((acc, f) => acc + f.size, 0);
      const savings = totalOriginal - totalOptimized;
      
      if (savings > 0) {
        toast.success(`Optimized ${files.length} images, saved ${formatBytes(savings)}`);
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize some images');
      
      // Fall back to original files
      const newPreviews = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        originalSize: file.size,
      }));
      setPreviewFiles(prev => [...prev, ...newPreviews]);
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  const removePreview = (index: number) => {
    setPreviewFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (previewFiles.length === 0) return;
    if (!sku) {
      toast.error('Product must have an SKU before uploading images');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('sku', sku);
      formData.append('startSortOrder', String(images.length));

      previewFiles.forEach((pf, index) => {
        formData.append(`file_${index}`, pf.file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-product-images`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Clear previews
      previewFiles.forEach(pf => URL.revokeObjectURL(pf.preview));
      setPreviewFiles([]);
      
      toast.success(`Uploaded ${result.images.length} images`);
      onImagesUploaded();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    setDeletingId(imageId);
    try {
      await onImageDeleted(imageId, imageUrl);
    } finally {
      setDeletingId(null);
    }
  };

  // Drag-to-reorder handlers for existing images
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    // Update sort orders
    const reorderedImages = newImages.map((img, i) => ({
      id: img.id,
      sort_order: i,
    }));
    
    setDraggedIndex(index);
    onReorder(reorderedImages);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalOriginalSize = previewFiles.reduce((acc, pf) => acc + pf.originalSize, 0);
  const totalOptimizedSize = previewFiles.reduce((acc, pf) => acc + (pf.optimizedSize || pf.originalSize), 0);
  const totalSavings = totalOriginalSize - totalOptimizedSize;

  return (
    <div className="space-y-4">
      {/* Optimization Settings */}
      <Collapsible open={showSettings} onOpenChange={setShowSettings}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Image Optimization Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Width: {optimizationOptions.maxWidth}px</Label>
                <Slider
                  value={[optimizationOptions.maxWidth]}
                  onValueChange={([v]) => setOptimizationOptions(prev => ({ ...prev, maxWidth: v }))}
                  min={800}
                  max={4000}
                  step={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Height: {optimizationOptions.maxHeight}px</Label>
                <Slider
                  value={[optimizationOptions.maxHeight]}
                  onValueChange={([v]) => setOptimizationOptions(prev => ({ ...prev, maxHeight: v }))}
                  min={800}
                  max={4000}
                  step={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quality: {Math.round(optimizationOptions.quality * 100)}%</Label>
                <Slider
                  value={[optimizationOptions.quality * 100]}
                  onValueChange={([v]) => setOptimizationOptions(prev => ({ ...prev, quality: v / 100 }))}
                  min={50}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select
                  value={optimizationOptions.format}
                  onValueChange={(v: 'jpeg' | 'webp' | 'png') => 
                    setOptimizationOptions(prev => ({ ...prev, format: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webp">WebP (Best compression)</SelectItem>
                    <SelectItem value="jpeg">JPEG (Wide compatibility)</SelectItem>
                    <SelectItem value="png">PNG (Lossless)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              WebP offers the best compression with good quality. Images are automatically resized 
              if they exceed the max dimensions while maintaining aspect ratio.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Existing Images Grid */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">
            Current Images ({images.length})
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={cn(
                  "relative group aspect-square rounded-lg border overflow-hidden cursor-move",
                  draggedIndex === index && "opacity-50",
                  featuredImageUrl === image.image_url && "ring-2 ring-primary"
                )}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Product image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => onSetFeatured(image.image_url)}
                    title="Set as featured"
                  >
                    <Star className={cn(
                      "h-4 w-4",
                      featuredImageUrl === image.image_url && "fill-yellow-400 text-yellow-400"
                    )} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => handleDelete(image.id, image.image_url)}
                    disabled={deletingId === image.id}
                    title="Delete"
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100">
                  <GripVertical className="h-4 w-4 text-white drop-shadow" />
                </div>
                {featuredImageUrl === image.image_url && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isOptimizing && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isOptimizing ? "cursor-wait" : "cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isOptimizing}
        />
        {isOptimizing ? (
          <>
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-2" />
            <p className="text-sm font-medium">
              Optimizing images... {optimizationProgress}%
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Drag & drop images here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Images will be auto-optimized to {optimizationOptions.format.toUpperCase()} 
              ({Math.round(optimizationOptions.quality * 100)}% quality, max {optimizationOptions.maxWidth}x{optimizationOptions.maxHeight}px)
            </p>
          </>
        )}
      </div>

      {/* Preview Files */}
      {previewFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">
              Ready to upload ({previewFiles.length})
            </h4>
            {totalSavings > 0 && (
              <span className="text-xs text-green-600 dark:text-green-400">
                Saved {formatBytes(totalSavings)} ({Math.round((totalSavings / totalOriginalSize) * 100)}% reduction)
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {previewFiles.map((pf, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg border overflow-hidden group"
              >
                <img
                  src={pf.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePreview(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5">
                  {formatBytes(pf.optimizedSize || pf.originalSize)}
                  {pf.optimizedSize && pf.optimizedSize < pf.originalSize && (
                    <span className="text-green-300 ml-1">
                      (-{Math.round((1 - pf.optimizedSize / pf.originalSize) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              onClick={uploadFiles}
              disabled={isUploading || !sku}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {previewFiles.length} Images
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                previewFiles.forEach(pf => URL.revokeObjectURL(pf.preview));
                setPreviewFiles([]);
              }}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>
          {!sku && (
            <p className="text-sm text-destructive mt-2">
              Please add an SKU to the product before uploading images
            </p>
          )}
        </div>
      )}
    </div>
  );
}
