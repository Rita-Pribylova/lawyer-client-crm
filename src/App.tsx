import { useMemo, useState } from 'react';
import { useClients } from './useClients';
import type { ClientStatus } from './types';
import { STATUS_META, STATUS_ORDER } from './types';
import { StatCards } from './components/StatCards';
import { ClientsTable } from './components/ClientsTable';
import { AddClientModal } from './components/AddClientModal';
import { Scale, Plus, Search, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Filter = ClientStatus | 'all';

export default function App() {
  const { clients, addClient, updateStatus, deleteClient } = useClients();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const base: Record<ClientStatus, number> = { new: 0, in_progress: 0, closed: 0 };
    for (const c of clients) base[c.status]++;
    return base;
  }, [clients]);

  const filtered = useMemo(() => {
    let list = clients;
    if (filter !== 'all') list = list.filter((c) => c.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
      );
    }
    return list;
  }, [clients, filter, query]);

  const activeFilterLabel =
    filter === 'all' ? 'Все клиенты' : STATUS_META[filter].label;

  const handleAdd = (data: { name: string; phone: string; status: ClientStatus }) => {
    const client = addClient(data);
    toast.success(
      `🚀 Уведомление отправлено юристу в Telegram/Email о новом клиенте ${client.name}`,
      { duration: 5000 },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900">
                Юрист CRM
              </h1>
              <p className="text-xs text-slate-400">
                Управление клиентами и делами
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-slate-900 hover:to-black hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Добавить клиента</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900">Дашборд</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Обзор клиентов по статусам и быстрое управление записями
          </p>
        </div>

        <StatCards
          counts={counts}
          total={clients.length}
          filter={filter}
          setFilter={setFilter}
        />

        <div className="mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {activeFilterLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 tabular-nums">
              {filtered.length}
            </span>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени или телефону"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <ClientsTable
          clients={filtered}
          filter={filter}
          onStatusChange={updateStatus}
          onDelete={deleteClient}
        />

        <footer className="mt-10 text-center text-xs text-slate-400">
          Данные хранятся локально в вашем браузере
        </footer>
      </main>

      <AddClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: { primary: '#38bdf8', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}
