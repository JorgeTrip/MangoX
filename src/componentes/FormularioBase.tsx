import type { ReactNode } from 'react';

export default function FormularioBase({
  titulo,
  descripcion,
  children,
  onSubmit,
  cta = 'Guardar',
}: {
  titulo: string;
  descripcion: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  cta?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-6 md:p-7 glass dark:glass-dark surface-card">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
        <span className="chip">Alta rápida</span>
      </div>
      <p className="opacity-75">{descripcion}</p>
      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        {children}
        <button className="btn-primary">{cta}</button>
      </form>
    </div>
  );
}
