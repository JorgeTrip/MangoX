import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <section className="rounded-3xl p-8 md:p-12 glass dark:glass-dark shadow">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{t('landing.hero_titulo')}</h1>
        <p className="opacity-80 mt-2">{t('app.subtitulo')}</p>
        <Link to="/onboarding" className="inline-flex items-center gap-2 mt-6 rounded-full px-5 py-3 bg-black/80 text-white hover:opacity-90 transition dark:bg-white/10">
          {t('landing.cta')}
          <ArrowRight className="size-4" />
        </Link>
      </section>
      <Planes />
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
        <div key={p.nombre} className="rounded-2xl p-6 glass dark:glass-dark shadow space-y-2">
          <div className="text-lg font-medium">{p.nombre}</div>
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
