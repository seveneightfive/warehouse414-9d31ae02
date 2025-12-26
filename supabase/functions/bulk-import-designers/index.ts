import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DesignerData {
  name: string;
  slug: string;
  about?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { designers } = await req.json() as { designers: DesignerData[] };

    if (!designers || !Array.isArray(designers)) {
      console.error('Invalid request: designers array is required');
      return new Response(
        JSON.stringify({ error: 'Invalid request: designers array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received ${designers.length} designers for import`);

    // Validate each designer has required fields
    const validDesigners = designers.filter(d => d.name && d.slug);
    const invalidCount = designers.length - validDesigners.length;

    if (invalidCount > 0) {
      console.warn(`Skipping ${invalidCount} designers with missing name or slug`);
    }

    // Prepare data for upsert (only include fields that exist in the table)
    const designersToUpsert = validDesigners.map(d => ({
      name: d.name.trim(),
      slug: d.slug.trim(),
      about: d.about?.trim() || null,
    }));

    console.log(`Upserting ${designersToUpsert.length} valid designers`);

    // Perform upsert with slug as the conflict key
    const { data, error } = await supabase
      .from('designers')
      .upsert(designersToUpsert, { 
        onConflict: 'slug',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully imported ${data?.length || 0} designers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        imported: data?.length || 0,
        skipped: invalidCount,
        message: `Successfully imported ${data?.length || 0} designers${invalidCount > 0 ? `, skipped ${invalidCount} invalid entries` : ''}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
