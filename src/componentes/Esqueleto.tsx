export function EsqueletoLinea({ ancho = 'w-full' }: { ancho?: string }) {
  return <div className={`h-3 rounded-full bg-white/20 dark:bg-white/10 ${ancho} animate-pulse`} />;
}

export function TarjetaSkeleton() {
  return (
    <div className="rounded-2xl p-4 glass dark:glass-dark shadow space-y-3">
      <EsqueletoLinea ancho="w-1/3" />
      <EsqueletoLinea />
      <EsqueletoLinea ancho="w-2/3" />
    </div>
  );
}

export function GraficoSkeleton() {
  return (
    <div className="rounded-2xl p-4 glass dark:glass-dark shadow space-y-4">
      <EsqueletoLinea ancho="w-1/4" />
      <div className="h-64 rounded-xl bg-white/20 dark:bg-white/10 animate-pulse" />
    </div>
  );
}

export function ListaSkeleton({ lineas = 4 }: { lineas?: number }) {
  return (
    <div className="rounded-2xl p-4 glass dark:glass-dark shadow space-y-3">
      <EsqueletoLinea ancho="w-1/3" />
      {Array.from({ length: lineas }).map((_, i) => (
        <div key={i} className="h-9 rounded-lg bg-white/20 dark:bg-white/10 animate-pulse" />
      ))}
    </div>
  );
}
