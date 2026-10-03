const SUPABASE_URL = "https://riuqiczqtyndwzcwwnql.supabase.co";
const SUPABASE_KEY = "sb_publishable_N5IH2CwdYbwNAn_dKZmkZQ_sExSWDRO";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabaseClient = supabase;
