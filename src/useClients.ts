import { useCallback, useEffect, useState } from 'react';
import type { Client, ClientStatus } from './types';

const STORAGE_KEY = 'lawyer-crm-clients';

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>(() => loadClients());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {
      // ignore quota errors
    }
  }, [clients]);

  const addClient = useCallback(
    (data: { name: string; phone: string; status: ClientStatus }) => {
      const client: Client = {
        id: uid(),
        name: data.name.trim(),
        phone: data.phone.trim(),
        status: data.status,
        createdAt: new Date().toISOString(),
      };
      setClients((prev) => [client, ...prev]);
      return client;
    },
    [],
  );

  const updateStatus = useCallback((id: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { clients, addClient, updateStatus, deleteClient };
}
