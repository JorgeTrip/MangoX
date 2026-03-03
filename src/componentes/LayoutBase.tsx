import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IdiomaContexto } from '../contextos/idioma';
import { TemaContexto } from '../contextos/tema';
import { SesionContexto } from '../contextos/sesion';
import { Menu, Sun, Moon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import NavInferiorMovil from './NavInferiorMovil';

export default function LayoutBase() {
  const { t } = useTranslation();
  const { cambiar, idioma } = useContext(IdiomaContexto);
  const { tema, alternar } = useContext(TemaContexto);
  const { autenticado, cerrarSesion } = useContext(SesionContexto);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const esRutaPublica = location.pathname === '/' || location.pathname === '/onboarding';
  const mostrarNavegacionApp = autenticado && !esRutaPublica;

  const links = [
    { to: '/inicio', label: t('nav.inicio') },
    { to: '/acerca', label: t('nav.acerca') },
    { to: '/reparto', label: 'Reparto' },
    { to: '/prestamos', label: 'Préstamos' },
    { to: '/selector-entidad', label: 'Entidades' },
    { to: '/configuracion', label: 'Configuración' },
  ];

  return (
    <div className={clsx('min-h-screen text-gray-900 dark:text-gray-100', tema === 'claro' ? 'bg-app-claro' : 'bg-app-oscuro')}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-sky-200/30 dark:bg-sky-900/20 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-indigo-200/25 dark:bg-indigo-900/20 blur-3xl" />
      </div>
      <header className="sticky top-0 z-30 glass dark:glass-dark border-b border-white/15">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mostrarNavegacionApp ? (
              <button onClick={() => setMenuAbierto((v) => !v)} className="sm:hidden rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition">
                {menuAbierto ? <X className="size-5 opacity-70" /> : <Menu className="size-5 opacity-70" />}
              </button>
            ) : null}
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
            {autenticado ? (
              <button
                onClick={() => {
                  cerrarSesion();
                  navigate('/');
                }}
                className="rounded-lg px-3 py-1.5 text-sm border border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Salir
              </button>
            ) : (
              <Link to="/onboarding" className="rounded-lg px-3 py-1.5 text-sm border border-white/20 hover:bg-black/5 dark:hover:bg-white/10">
                Ingresar
              </Link>
            )}
          </div>
        </div>
        {mostrarNavegacionApp ? (
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
        ) : null}
        {mostrarNavegacionApp && menuAbierto ? (
          <div className="sm:hidden mx-4 mb-4 rounded-2xl p-3 glass dark:glass-dark border border-white/20">
            <nav className="grid gap-2">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setMenuAbierto(false)} className="rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 pb-28 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {mostrarNavegacionApp ? <NavInferiorMovil /> : null}
    </div>
  );
}
