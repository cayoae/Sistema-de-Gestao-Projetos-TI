import { supabase } from '../supabaseClient';
import { Client } from '../../types';

export interface DatabaseClient {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'lead';
  created_at: string;
  updated_at: string;
}

export class ClientsService {

  /**
   * Get all active clients for dropdowns
   */
  static async getActiveClients(): Promise<{ data: DatabaseClient[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, company, email')
        .eq('status', 'active')
        .order('company', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Clients service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get all clients with full information
   */
  static async getAllClients(): Promise<{ data: Client[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all clients:', error);
        return { data: null, error: error.message };
      }

      // Transform database clients to frontend Client type
      const clients: Client[] = (data as DatabaseClient[]).map(dbClient => ({
        id: dbClient.id,
        name: dbClient.name,
        company: dbClient.company,
        email: dbClient.email || '',
        phone: dbClient.phone || '',
        avatar: dbClient.avatar_url || `https://i.pravatar.cc/40?img=${dbClient.id}`,
        totalValue: 0, // TODO: Calculate from projects
        status: dbClient.status as 'active' | 'inactive' | 'lead'
      }));

      return { data: clients, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Clients service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: {
    name: string;
    company: string;
    email?: string;
    phone?: string;
  }): Promise<{ data: DatabaseClient | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create client error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get a single client by ID
   */
  static async getClientById(id: string): Promise<{ data: DatabaseClient | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Get client error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update a client
   */
  static async updateClient(id: number, clientData: Partial<{
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'lead';
  }>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);

      if (error) {
        console.error('Error updating client:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update client error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Delete client error:', err);
      return { error: errorMessage };
    }
  }
}