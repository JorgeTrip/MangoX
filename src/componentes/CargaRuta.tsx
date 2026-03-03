import { EsqueletoLinea } from './Esqueleto';

export default function CargaRuta() {
  return (
    <div className="rounded-3xl p-6 glass dark:glass-dark surface-card max-w-4xl mx-auto">
      <div className="space-y-4">
        <EsqueletoLinea ancho="w-1/4" />
        <EsqueletoLinea ancho="w-2/3" />
        <div className="h-40 rounded-2xl bg-white/20 dark:bg-white/10 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="h-24 rounded-2xl bg-white/20 dark:bg-white/10 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/20 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
