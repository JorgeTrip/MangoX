import { Link, NavLink, Outlet } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IdiomaContexto } from '../contextos/idioma';
import { TemaContexto } from '../contextos/tema';
import { Menu, Sun, Moon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

export default function LayoutBase() {
  const { t } = useTranslation();
  const { cambiar, idioma } = useContext(IdiomaContexto);
  const { tema, alternar } = useContext(TemaContexto);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { to: '/inicio', label: t('nav.inicio') },
    { to: '/onboarding', label: t('nav.onboarding') },
    { to: '/acerca', label: t('nav.acerca') },
    { to: '/selector-entidad', label: 'Entidades' },
    { to: '/configuracion', label: 'Configuración' },
  ];

  return (
    <div className={clsx('min-h-screen text-gray-900 dark:text-gray-100', tema === 'claro' ? 'bg-app-claro' : 'bg-app-oscuro')}>
      <header className="sticky top-0 z-30 glass dark:glass-dark border-b border-white/15">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuAbierto((v) => !v)} className="sm:hidden rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition">
              {menuAbierto ? <X className="size-5 opacity-70" /> : <Menu className="size-5 opacity-70" />}
            </button>
            <Link to="/" className="font-semibold tracking-tight text-lg">
              {t('app.titulo')}
            </Link>
            <span className="chip hidden md:inline-flex">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alternar()} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition">
              {tema === 'claro' ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>
            <select value={idioma} onChange={(e) => cambiar(e.target.value)} className="bg-transparent rounded-md border border-white/20 px-2 py-1">
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-3 hidden sm:block">
          <nav className="flex items-center gap-2 flex-wrap">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-full px-3 py-1.5 text-sm transition border',
                    isActive ? 'bg-black/80 text-white border-black/70 dark:bg-white/15 dark:border-white/30' : 'border-white/20 hover:bg-black/5 dark:hover:bg-white/10'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        {menuAbierto && (
          <div className="sm:hidden mx-4 mb-4 rounded-2xl p-3 glass dark:glass-dark border border-white/20">
            <nav className="grid gap-2">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setMenuAbierto(false)} className="rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
