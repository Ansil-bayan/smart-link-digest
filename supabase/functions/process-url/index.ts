import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing URL:', url);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Jina AI API key from secrets
    const jinaApiKey = Deno.env.get('JINA_API_KEY');
    if (!jinaApiKey) {
      return new Response(
        JSON.stringify({ error: 'Jina AI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch page content and generate summary using Jina AI
    const targetUrl = encodeURIComponent(url);
    const jinaResponse = await fetch(`https://r.jina.ai/http://${targetUrl}`, {
      headers: {
        'Authorization': `Bearer ${jinaApiKey}`,
      },
    });

    if (!jinaResponse.ok) {
      console.error('Jina AI request failed:', jinaResponse.status, jinaResponse.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to process URL with Jina AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const summary = await jinaResponse.text();
    console.log('Generated summary length:', summary.length);

    // Extract title from summary (first line usually contains the title)
    const lines = summary.split('\n').filter(line => line.trim());
    const title = lines[0]?.trim() || 'Untitled';

    // Generate favicon URL
    const urlObj = new URL(url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

    return new Response(
      JSON.stringify({
        title,
        summary: summary.substring(0, 1000), // Limit summary length
        faviconUrl,
        processedUrl: url
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing URL:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});