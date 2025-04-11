
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Store {
  id: string;
  name: string;
  isDemo: boolean;
  status: {
    billing: boolean;
    domain: boolean;
    gateway: boolean;
    shipping: boolean;
  };
  createdAt: Date;
}

interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  addStore: (name: string) => void;
  deleteStore: (id: string) => void;
  isStoresLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};

const DEMO_STORE: Store = {
  id: 'demo-store',
  name: 'Loja de Demonstração',
  isDemo: true,
  status: {
    billing: true,
    domain: true,
    gateway: true,
    shipping: true,
  },
  createdAt: new Date(),
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [isStoresLoading, setIsStoresLoading] = useState(true);

  // Initialize stores from localStorage
  useEffect(() => {
    const loadStores = () => {
      const storedStores = localStorage.getItem('voltz-stores');
      const storedCurrentStoreId = localStorage.getItem('voltz-current-store-id');
      
      let parsedStores: Store[] = [];
      
      if (storedStores) {
        try {
          parsedStores = JSON.parse(storedStores).map((store: any) => ({
            ...store,
            createdAt: new Date(store.createdAt)
          }));
        } catch (error) {
          console.error('Error parsing stores:', error);
        }
      }
      
      // Always ensure the demo store exists
      const demoStoreExists = parsedStores.some(store => store.isDemo);
      
      if (!demoStoreExists) {
        parsedStores = [DEMO_STORE, ...parsedStores];
      }
      
      setStores(parsedStores);
      
      // Set current store - if user has no stores, always use demo store
      if (parsedStores.length === 1 && parsedStores[0].isDemo) {
        // Only demo store exists, force using it
        setCurrentStore(parsedStores[0]);
      } else if (storedCurrentStoreId && parsedStores.some(store => store.id === storedCurrentStoreId)) {
        // User has previously selected a store, use that one
        setCurrentStore(parsedStores.find(store => store.id === storedCurrentStoreId) || parsedStores[0]);
      } else {
        // Default to first non-demo store if available, otherwise use demo
        const firstNonDemoStore = parsedStores.find(store => !store.isDemo);
        setCurrentStore(firstNonDemoStore || parsedStores[0]);
      }
      
      setIsStoresLoading(false);
    };
    
    loadStores();
  }, []);

  // Update localStorage when stores change
  useEffect(() => {
    if (!isStoresLoading) {
      localStorage.setItem('voltz-stores', JSON.stringify(stores));
    }
  }, [stores, isStoresLoading]);

  // Update localStorage when current store changes
  useEffect(() => {
    if (currentStore && !isStoresLoading) {
      localStorage.setItem('voltz-current-store-id', currentStore.id);
    }
  }, [currentStore, isStoresLoading]);

  const addStore = (name: string) => {
    const newStore: Store = {
      id: `store-${Date.now()}`,
      name,
      isDemo: false,
      status: {
        billing: false,
        domain: false,
        gateway: false,
        shipping: false,
      },
      createdAt: new Date(),
    };
    
    setStores(prevStores => [...prevStores, newStore]);
    setCurrentStore(newStore);
    toast.success('Loja criada com sucesso', {
      description: `A loja "${name}" foi criada e selecionada.`,
    });
  };

  const deleteStore = (id: string) => {
    // Prevent deletion of the demo store
    if (id === DEMO_STORE.id) {
      toast.error('A loja de demonstração não pode ser excluída.');
      return;
    }
    
    const storeToDelete = stores.find(store => store.id === id);
    if (!storeToDelete) return;
    
    setStores(prevStores => {
      const updatedStores = prevStores.filter(store => store.id !== id);
      
      // If deleting current store, set first available store as current
      if (currentStore?.id === id && updatedStores.length > 0) {
        const firstNonDemoStore = updatedStores.find(store => !store.isDemo);
        setCurrentStore(firstNonDemoStore || updatedStores[0]);
      }
      
      return updatedStores;
    });
    
    toast.success('Loja excluída', {
      description: `A loja "${storeToDelete.name}" foi excluída com sucesso.`,
    });
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        setCurrentStore,
        addStore,
        deleteStore,
        isStoresLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
