export type ClientStatus = 'new' | 'in_progress' | 'closed';

export interface Client {
  id: string;
  name: string;
  phone: string;
  status: ClientStatus;
  createdAt: string;
}

export const STATUS_META: Record<
  ClientStatus,
  { label: string; dotClass: string; badgeClass: string; accentClass: string }
> = {
  new: {
    label: 'Новый',
    dotClass: 'bg-sky-500',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-200',
    accentClass: 'from-sky-500 to-sky-600',
  },
  in_progress: {
    label: 'В работе',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 ring-amber-200',
    accentClass: 'from-amber-500 to-amber-600',
  },
  closed: {
    label: 'Закрыт',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    accentClass: 'from-emerald-500 to-emerald-600',
  },
};

export const STATUS_ORDER: ClientStatus[] = ['new', 'in_progress', 'closed'];
