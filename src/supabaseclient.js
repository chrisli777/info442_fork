import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgjzhsqogczyhndoeoou.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnanpoc3FvZ2N6eWhuZG9lb291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzcyMzEsImV4cCI6MjA2MTcxMzIzMX0.8LqEA7WSu_cZEB1JvkYNZCrYJDpAGffoFUM0RU0O-Hs';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
