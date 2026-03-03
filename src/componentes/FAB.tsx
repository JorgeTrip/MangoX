import { motion } from 'framer-motion';
import { Plus, CreditCard, HandCoins, ShoppingBag, Cog } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FAB() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="fixed bottom-6 right-6">
      <div className="relative">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: abierto ? 1 : 0, scale: abierto ? 1 : 0.9 }} className="absolute bottom-14 right-0 flex flex-col gap-2">
          <Accion to="/nuevo/gasto" icono={<CreditCard className="size-4" />} texto="Nuevo Gasto" />
          <Accion to="/nuevo/prestamo" icono={<HandCoins className="size-4" />} texto="Nuevo Préstamo" />
          <Accion to="/nuevo/operacion" icono={<ShoppingBag className="size-4" />} texto="Nueva Operación" />
          <Accion to="/configuracion" icono={<Cog className="size-4" />} texto="Configuración" />
        </motion.div>
        <button onClick={() => setAbierto((v) => !v)} className="rounded-full p-4 shadow-lg bg-white/80 dark:bg-white/10 backdrop-blur hover:scale-105 transition">
          <Plus className="size-6" />
        </button>
      </div>
    </div>
  );
}

function Accion({ to, icono, texto }: { to: string; icono: React.ReactNode; texto: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 rounded-full px-3 py-2 bg-white/80 dark:bg-white/10 backdrop-blur shadow text-sm">
      {icono}
      <span>{texto}</span>
    </Link>
  );
}
