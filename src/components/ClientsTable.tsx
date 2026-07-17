import type { Client, ClientStatus } from '../types';
import { STATUS_META, STATUS_ORDER } from '../types';
import { Phone, Trash2, Calendar, ChevronDown, Users } from 'lucide-react';

interface ClientsTableProps {
  clients: Client[];
  filter: ClientStatus | 'all';
  onStatusChange: (id: string, status: ClientStatus) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ClientsTable({
  clients,
  filter,
  onStatusChange,
  onDelete,
}: ClientsTableProps) {
  const rows =
    filter === 'all'
      ? clients
      : clients.filter((c) => c.status === filter);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Users className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">
          {filter === 'all'
            ? 'Пока нет клиентов'
            : `Нет клиентов со статусом «${STATUS_META[filter].label}»`}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Нажмите «Добавить клиента», чтобы создать первую запись
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Имя
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Телефон
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Статус
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Дата добавления
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((client) => {
              const meta = STATUS_META[client.status];
              return (
                <tr
                  key={client.id}
                  className="group transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {client.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-slate-800">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`tel:${client.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {client.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={client.status}
                        onChange={(e) =>
                          onStatusChange(
                            client.id,
                            e.target.value as ClientStatus,
                          )
                        }
                        className={`cursor-pointer appearance-none rounded-lg py-1.5 pl-3 pr-8 text-xs font-medium ring-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${meta.badgeClass} focus:ring-slate-400`}
                      >
                        {STATUS_ORDER.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-white text-slate-700"
                          >
                            {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      {formatDate(client.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(client.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                      title="Удалить клиента"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
