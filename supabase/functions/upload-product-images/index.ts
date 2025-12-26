import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BUNNY_STORAGE_API_KEY = Deno.env.get('BUNNY_STORAGE_API_KEY');
    const BUNNY_STORAGE_ZONE = Deno.env.get('BUNNY_STORAGE_ZONE');
    const BUNNY_CDN_URL = Deno.env.get('BUNNY_CDN_URL');
    const BUNNY_STORAGE_REGION = Deno.env.get('BUNNY_STORAGE_REGION') || '';
    
    if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE || !BUNNY_CDN_URL) {
      console.error('Missing Bunny.net configuration');
      throw new Error('Missing Bunny.net configuration');
    }

    // Determine storage host based on region
    const storageHost = BUNNY_STORAGE_REGION 
      ? `${BUNNY_STORAGE_REGION}.storage.bunnycdn.com`
      : 'storage.bunnycdn.com';

    const formData = await req.formData();
    const productId = formData.get('productId') as string;
    const sku = formData.get('sku') as string;
    const startSortOrder = parseInt(formData.get('startSortOrder') as string || '0');

    if (!productId || !sku) {
      console.error('Missing productId or sku');
      throw new Error('productId and sku are required');
    }

    console.log(`Processing upload for product ${productId} with SKU ${sku}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const uploadedImages: Array<{
      id: string;
      image_url: string;
      storage_path: string;
      sort_order: number;
    }> = [];

    // Get all files from formData
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
      }
    }

    console.log(`Found ${files.length} files to upload`);

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        console.error(`Invalid file type: ${file.type}`);
        throw new Error(`Invalid file type: ${file.type}. Allowed: jpg, png, webp, gif`);
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error(`File too large: ${file.size}`);
        throw new Error(`File too large. Maximum size is 10MB`);
      }

      // Generate filename with timestamp to avoid conflicts
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const filename = `${timestamp}-${i}.${ext}`;
      const storagePath = `${sku}/${filename}`;

      console.log(`Uploading ${filename} to ${storagePath}`);

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Upload to Bunny.net
      const uploadUrl = `https://${storageHost}/${BUNNY_STORAGE_ZONE}/${storagePath}`;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': BUNNY_STORAGE_API_KEY,
          'Content-Type': file.type,
        },
        body: arrayBuffer,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`Bunny upload failed: ${errorText}`);
        throw new Error(`Failed to upload to Bunny.net: ${errorText}`);
      }

      console.log(`Successfully uploaded ${filename} to Bunny.net`);

      // Construct CDN URL
      const cdnUrl = `${BUNNY_CDN_URL}/${storagePath}`;

      // Insert into product_images table
      const sortOrder = startSortOrder + i;
      const { data: imageRecord, error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: cdnUrl,
          sort_order: sortOrder,
          alt_text: `Product image ${sortOrder + 1}`,
        })
        .select()
        .single();

      if (insertError) {
        console.error(`Failed to insert image record: ${insertError.message}`);
        throw new Error(`Failed to save image record: ${insertError.message}`);
      }

      console.log(`Created image record with id ${imageRecord.id}`);

      uploadedImages.push({
        id: imageRecord.id,
        image_url: cdnUrl,
        storage_path: storagePath,
        sort_order: sortOrder,
      });
    }

    console.log(`Successfully uploaded ${uploadedImages.length} images`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        images: uploadedImages,
        message: `Successfully uploaded ${uploadedImages.length} images`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
