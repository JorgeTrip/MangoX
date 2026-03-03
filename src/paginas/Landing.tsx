import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, Sparkles, LineChart, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <section className="rounded-3xl p-8 md:p-12 glass dark:glass-dark surface-card">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="chip inline-flex items-center gap-1"><Sparkles className="size-3.5" /> Experiencia premium</span>
          <span className="chip inline-flex items-center gap-1"><ShieldCheck className="size-3.5" /> Privado y seguro</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl">{t('landing.hero_titulo')}</h1>
        <p className="opacity-80 mt-3 max-w-2xl">{t('app.subtitulo')} con una interfaz clara, rápida y pensada para decisiones diarias.</p>
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <Link to="/onboarding" className="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-black/80 text-white hover:opacity-90 transition dark:bg-white/10">
            {t('landing.cta')}
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/inicio" className="inline-flex items-center gap-2 rounded-full px-5 py-3 border border-white/25 hover:bg-black/5 transition dark:hover:bg-white/10">
            Ver demo
          </Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        <Feature icono={<LineChart className="size-5" />} titulo="Análisis en tiempo real" texto="Detectá desvíos de gastos y oportunidades de ahorro al instante." />
        <Feature icono={<WalletCards className="size-5" />} titulo="Tarjetas y cuentas unificadas" texto="Consolidá saldos, vencimientos y consumos en una vista única." />
        <Feature icono={<ShieldCheck className="size-5" />} titulo="Control y previsibilidad" texto="Reglas, alertas y proyecciones para cuidar tu patrimonio." />
      </section>
      <section className="rounded-3xl p-6 md:p-8 glass dark:glass-dark surface-card">
        <h2 className="text-xl font-semibold tracking-tight">Comparativa de planes</h2>
        <p className="opacity-75 text-sm mt-1">Escalá desde control personal hasta gestión familiar colaborativa.</p>
        <div className="mt-5">
          <Planes />
        </div>
      </section>
    </div>
  );
}

function Planes() {
  const planes = [
    { nombre: 'Free', desc: '1 tarjeta, mono-moneda', precio: '$0', detalles: ['1 tarjeta', 'Categorías básicas'] },
    { nombre: 'Pro', desc: 'Multi-moneda y reportes', precio: '$', detalles: ['Multi-moneda', 'Dashboard avanzado'] },
    { nombre: 'Family', desc: 'Roles y colaboración', precio: '$$', detalles: ['Roles (Admin/Lectura)', 'Compartir perfiles'] },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {planes.map((p) => (
        <div key={p.nombre} className={`rounded-2xl p-6 glass dark:glass-dark surface-card space-y-2 ${p.nombre === 'Pro' ? 'ring-1 ring-blue-400/50' : ''}`}>
          <div className="text-lg font-medium flex items-center justify-between">{p.nombre}{p.nombre === 'Pro' ? <span className="chip">Popular</span> : null}</div>
          <div className="opacity-70 text-sm">{p.desc}</div>
          <div className="text-2xl">{p.precio}</div>
          <ul className="text-sm opacity-80 list-disc pl-5">
            {p.detalles.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Feature({ icono, titulo, texto }: { icono: React.ReactNode; titulo: string; texto: string }) {
  return (
    <article className="rounded-2xl p-5 glass dark:glass-dark surface-card">
      <div className="inline-flex rounded-full p-2 bg-white/30 dark:bg-white/10">{icono}</div>
      <h3 className="mt-3 font-medium">{titulo}</h3>
      <p className="opacity-75 text-sm mt-1">{texto}</p>
    </article>
  );
}
