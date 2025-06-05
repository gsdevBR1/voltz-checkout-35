
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: string;
  name: string;
  description: string | null;
  domain: string | null;
  logo_url: string | null;
  status: string;
  plan_type: string;
  cycle_limit: number;
  current_cycle_revenue: number;
  total_revenue: number;
  settings: any;
  created_at: string;
  updated_at: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStores = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: "Erro ao carregar lojas",
          description: "Não foi possível carregar suas lojas.",
          variant: "destructive",
        });
        return;
      }

      setStores(data || []);
      
      // Set current store to first one if none selected
      if (data && data.length > 0 && !currentStore) {
        setCurrentStore(data[0]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: "Erro ao carregar lojas",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: Partial<Store>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          ...storeData,
          owner_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating store:', error);
        toast({
          title: "Erro ao criar loja",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Loja criada com sucesso!",
        description: `A loja "${data.name}" foi criada.`,
      });

      await fetchStores();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating store:', error);
      toast({
        title: "Erro ao criar loja",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateStore = async (storeId: string, updates: Partial<Store>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating store:', error);
        toast({
          title: "Erro ao atualizar loja",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Loja atualizada!",
        description: "As informações foram salvas com sucesso.",
      });

      await fetchStores();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating store:', error);
      toast({
        title: "Erro ao atualizar loja",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteStore = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) {
        console.error('Error deleting store:', error);
        toast({
          title: "Erro ao excluir loja",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Loja excluída",
        description: "A loja foi removida com sucesso.",
      });

      await fetchStores();
      
      // Clear current store if it was deleted
      if (currentStore?.id === storeId) {
        setCurrentStore(stores.find(s => s.id !== storeId) || null);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting store:', error);
      toast({
        title: "Erro ao excluir loja",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchStores();
    }
  }, [user]);

  return {
    stores,
    loading,
    currentStore,
    setCurrentStore,
    createStore,
    updateStore,
    deleteStore,
    refetch: fetchStores,
  };
};
