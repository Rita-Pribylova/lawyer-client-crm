import { useEffect, useRef, useState } from 'react';
import type { ClientStatus } from '../types';
import { STATUS_META, STATUS_ORDER } from '../types';
import { X, User, Phone, Check } from 'lucide-react';

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; phone: string; status: ClientStatus }) => void;
}

export function AddClientModal({ open, onClose, onAdd }: AddClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ClientStatus>('new');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setStatus('new');
      setErrors({});
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = 'Введите имя клиента';
    if (!phone.trim()) nextErrors.phone = 'Введите номер телефона';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onAdd({ name, phone, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-[modalIn_0.2s_ease-out] rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Добавить клиента
              </h2>
              <p className="text-xs text-slate-400">
                Заполните данные нового клиента
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Имя
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-slate-400'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Телефон
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-slate-400'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Начальный статус
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_ORDER.map((s) => {
                const meta = STATUS_META[s];
                const selected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
                      selected
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${meta.badgeClass}`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-slate-900 hover:to-black hover:shadow-md"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
