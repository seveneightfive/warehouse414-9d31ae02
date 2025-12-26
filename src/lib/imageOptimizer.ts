export interface ImageOptimizationOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0-1
  format: 'jpeg' | 'webp' | 'png';
}

export const defaultOptimizationOptions: ImageOptimizationOptions = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.85,
  format: 'webp',
};

export async function optimizeImage(
  file: File,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<File> {
  const opts = { ...defaultOptimizationOptions, ...options };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > opts.maxWidth || height > opts.maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, opts.maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, opts.maxHeight);
          width = height * aspectRatio;
        }
      }
      
      // Round to avoid subpixel rendering
      width = Math.round(width);
      height = Math.round(height);
      
      canvas.width = width;
      canvas.height = height;
      
      // Use better image smoothing for downscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression
      const mimeType = `image/${opts.format}`;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          
          // Create new file with optimized content
          const extension = opts.format === 'jpeg' ? 'jpg' : opts.format;
          const originalName = file.name.replace(/\.[^/.]+$/, '');
          const optimizedFile = new File(
            [blob],
            `${originalName}.${extension}`,
            { type: mimeType }
          );
          
          console.log(
            `Image optimized: ${file.name} (${formatBytes(file.size)}) → ${optimizedFile.name} (${formatBytes(optimizedFile.size)}) - ${Math.round((1 - optimizedFile.size / file.size) * 100)}% reduction`
          );
          
          resolve(optimizedFile);
        },
        mimeType,
        opts.quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function optimizeImages(
  files: File[],
  options: Partial<ImageOptimizationOptions> = {},
  onProgress?: (completed: number, total: number) => void
): Promise<File[]> {
  const optimizedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Skip non-image files
    if (!file.type.startsWith('image/')) {
      optimizedFiles.push(file);
      continue;
    }
    
    // Skip already small files (under 100KB) unless they exceed max dimensions
    if (file.size < 100 * 1024) {
      optimizedFiles.push(file);
      onProgress?.(i + 1, files.length);
      continue;
    }
    
    try {
      const optimized = await optimizeImage(file, options);
      optimizedFiles.push(optimized);
    } catch (error) {
      console.warn(`Failed to optimize ${file.name}, using original:`, error);
      optimizedFiles.push(file);
    }
    
    onProgress?.(i + 1, files.length);
  }
  
  return optimizedFiles;
}
