import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { IdiomaContexto } from '../contextos/idioma';
import { TemaContexto } from '../contextos/tema';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

export default function LayoutBase() {
  const { t } = useTranslation();
  const { cambiar, idioma } = useContext(IdiomaContexto);
  const { tema, alternar } = useContext(TemaContexto);

  return (
    <div className={clsx('min-h-screen text-gray-900 dark:text-gray-100', tema === 'claro' ? 'bg-app-claro' : 'bg-app-oscuro')}>
      <header className="sticky top-0 z-20 glass dark:glass-dark shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu className="size-5 opacity-60" />
            <Link to="/" className="font-semibold tracking-tight text-lg">
              {t('app.titulo')}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => alternar()} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition">
              {tema === 'claro' ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>
            <select value={idioma} onChange={(e) => cambiar(e.target.value)} className="bg-transparent rounded-md border border-white/20 px-2 py-1">
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <nav className="hidden sm:block">
              <ul className="flex items-center gap-6">
                <li>
                  <Link to="/inicio" className="hover:underline">
                    {t('nav.inicio')}
                  </Link>
                </li>
                <li>
                  <Link to="/onboarding" className="hover:underline">
                    {t('nav.onboarding')}
                  </Link>
                </li>
                <li>
                  <Link to="/acerca" className="hover:underline">
                    {t('nav.acerca')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
