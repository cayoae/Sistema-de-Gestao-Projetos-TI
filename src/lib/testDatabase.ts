import { supabase } from './supabaseClient';

// Test database connection and table structure
export const testDatabaseConnection = async () => {
  console.log('🔍 Testing database connection...');

  try {
    // Test 1: Check if we can connect
    const { data: connectionTest, error: connectionError } = await supabase
      .from('clients')
      .select('count', { count: 'exact' })
      .limit(0);

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError);
      return { success: false, error: connectionError.message };
    }

    console.log('✅ Database connection successful');
    console.log('📊 Clients table row count:', connectionTest);

    // Test 2: Try to fetch table structure
    const { data: tableTest, error: tableError } = await supabase
      .from('clients')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table structure test failed:', tableError);
      return { success: false, error: tableError.message };
    }

    console.log('✅ Clients table structure accessible');
    if (tableTest && tableTest.length > 0) {
      console.log('📝 Sample row structure:', Object.keys(tableTest[0]));
    } else {
      console.log('📝 Table exists but is empty');
    }

    // Test 3: Try to insert a test client
    const testClient = {
      name: 'Test Client',
      company: 'Test Company',
      email: 'test@example.com',
      phone: '+55 11 99999-9999',
      status: 'lead'
    };

    console.log('🧪 Testing client creation...');
    const { data: insertData, error: insertError } = await supabase
      .from('clients')
      .insert([testClient])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Client creation failed:', insertError);
      return { success: false, error: insertError.message };
    }

    console.log('✅ Client creation successful:', insertData);

    // Test 4: Clean up test data
    if (insertData) {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.warn('⚠️ Failed to clean up test data:', deleteError);
      } else {
        console.log('🧹 Test data cleaned up');
      }
    }

    return { success: true, message: 'All database tests passed!' };

  } catch (err) {
    console.error('💥 Unexpected error during database test:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Function to check table schema
export const checkTableSchema = async () => {
  console.log('🔍 Checking table schemas...');

  try {
    const { data, error } = await supabase
      .rpc('get_table_schema', { table_name: 'clients' });

    if (error) {
      console.error('❌ Schema check failed:', error);
    } else {
      console.log('📋 Table schema:', data);
    }

  } catch (err) {
    console.log('ℹ️ Schema check not available (normal for this setup)');
  }
};