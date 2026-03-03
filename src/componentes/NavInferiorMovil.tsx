import { House, BadgeHelp, Scale3D, Building2, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

const items = [
  { to: '/inicio', label: 'Inicio', icono: House },
  { to: '/reparto', label: 'Reparto', icono: Scale3D },
  { to: '/selector-entidad', label: 'Entidades', icono: Building2 },
  { to: '/acerca', label: 'Acerca', icono: BadgeHelp },
  { to: '/configuracion', label: 'Config', icono: Settings },
];

export default function NavInferiorMovil() {
  return (
    <nav className="sm:hidden fixed bottom-3 inset-x-0 z-40 px-4">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/20 glass dark:glass-dark shadow-lg">
        <ul className="grid grid-cols-5">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-col items-center justify-center gap-1 py-2 text-[11px] transition',
                    isActive ? 'text-black dark:text-white' : 'opacity-70'
                  )
                }
              >
                <item.icono className="size-4" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
