import { motion } from 'framer-motion';

export function FilaResumen({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 flex items-center justify-between gap-2">
      <span className="opacity-80">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function Barra({ label, valor }: { label: string; valor: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span>{label}</span>
        <span className="opacity-70">{valor}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-black/70 dark:bg-white/40" style={{ width: `${valor}%` }} />
      </div>
    </div>
  );
}

export function Tarjeta({
  titulo,
  alto = false,
  contenido,
  delta,
  children,
  className,
  index = 0,
}: {
  titulo: string;
  alto?: boolean;
  contenido?: string;
  delta?: string;
  children?: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, delay: index * 0.03, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
      className={`rounded-2xl p-4 glass dark:glass-dark surface-card min-h-32 ${className ?? ''}`}
    >
      <div className="font-medium mb-1">{titulo}</div>
      {contenido && <div className="text-xl font-semibold">{contenido}</div>}
      {delta && <div className="opacity-70 text-sm mt-1">{delta}</div>}
      {alto ? <div className="mt-4">{children}</div> : null}
    </motion.article>
  );
}
