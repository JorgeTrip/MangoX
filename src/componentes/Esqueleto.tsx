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
