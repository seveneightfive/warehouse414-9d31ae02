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

    const storageHost = BUNNY_STORAGE_REGION 
      ? `${BUNNY_STORAGE_REGION}.storage.bunnycdn.com`
      : 'storage.bunnycdn.com';

    const { imageId, imageUrl } = await req.json();

    if (!imageId || !imageUrl) {
      throw new Error('imageId and imageUrl are required');
    }

    console.log(`Deleting image ${imageId} with URL ${imageUrl}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract storage path from CDN URL
    const storagePath = imageUrl.replace(BUNNY_CDN_URL + '/', '');
    
    if (storagePath && storagePath !== imageUrl) {
      // Delete from Bunny.net storage
      const deleteUrl = `https://${storageHost}/${BUNNY_STORAGE_ZONE}/${storagePath}`;
      console.log(`Deleting from Bunny: ${deleteUrl}`);
      
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': BUNNY_STORAGE_API_KEY,
        },
      });

      if (!deleteResponse.ok && deleteResponse.status !== 404) {
        const errorText = await deleteResponse.text();
        console.error(`Bunny delete warning: ${errorText}`);
        // Don't throw - still delete from database
      } else {
        console.log('Successfully deleted from Bunny storage');
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error(`Failed to delete image record: ${deleteError.message}`);
      throw new Error(`Failed to delete image record: ${deleteError.message}`);
    }

    console.log('Successfully deleted image record from database');

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Delete error:', error);
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
