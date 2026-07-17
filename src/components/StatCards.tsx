import type { ClientStatus } from '../types';
import { STATUS_META, STATUS_ORDER } from '../types';
import type { LucideIcon } from 'lucide-react';
import { UserPlus, Loader, CheckCircle2 } from 'lucide-react';

const ICONS: Record<ClientStatus, LucideIcon> = {
  new: UserPlus,
  in_progress: Loader,
  closed: CheckCircle2,
};

interface StatCardProps {
  status: ClientStatus;
  count: number;
  total: number;
  active: boolean;
  onToggle: () => void;
}

export function StatCard({ status, count, total, active, onToggle }: StatCardProps) {
  const meta = STATUS_META[status];
  const Icon = ICONS[status];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <button
      onClick={onToggle}
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        active
          ? 'border-slate-300 ring-2 ring-slate-900/10 shadow-md'
          : 'border-slate-200 shadow-sm'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.accentClass}`}
      />
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accentClass} text-white shadow-sm`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.badgeClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
          {meta.label}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {count}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            {pct}% от всех
          </p>
        </div>
        <div className="mb-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meta.accentClass} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  );
}

interface StatCardsProps {
  counts: Record<ClientStatus, number>;
  total: number;
  filter: ClientStatus | 'all';
  setFilter: (f: ClientStatus | 'all') => void;
}

export function StatCards({ counts, total, filter, setFilter }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATUS_ORDER.map((status) => (
        <StatCard
          key={status}
          status={status}
          count={counts[status]}
          total={total}
          active={filter === status}
          onToggle={() =>
            setFilter(filter === status ? 'all' : status)
          }
        />
      ))}
    </div>
  );
}
