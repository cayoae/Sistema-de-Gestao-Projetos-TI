import { supabase } from './supabaseClient';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');

    // Test 1: Check if client is configured
    console.log('Supabase URL:', supabase.supabaseUrl);

    // Test 2: Simple query to test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Connection test successful:', data);
    return { success: true, data };

  } catch (err) {
    console.error('Connection test error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

export const testAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Auth test:', session ? 'User logged in' : 'No session');
    return { success: true, session };

  } catch (err) {
    console.error('Auth test error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};