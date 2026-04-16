import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Users, Package, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { database } from '../../api/database';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Ventas Totales', value: formatPrice(0), icon: TrendingUp, color: 'text-green-500' },
    { name: 'Pedidos', value: '0', icon: ShoppingBag, color: 'text-clara-pink-500' },
    { name: 'Clientes', value: '0', icon: Users, color: 'text-blue-500' },
    { name: 'Productos', value: '0', icon: Package, color: 'text-orange-500' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await database.getDashboardStats();
        setStats([
          { name: 'Ventas Totales', value: formatPrice(data.totalSales), icon: TrendingUp, color: 'text-green-500' },
          { name: 'Pedidos', value: data.ordersCount.toString(), icon: ShoppingBag, color: 'text-clara-pink-500' },
          { name: 'Categorías', value: data.categoriesCount.toString(), icon: Users, color: 'text-blue-500' },
          { name: 'Productos', value: data.productsCount.toString(), icon: Package, color: 'text-orange-500' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
        <p className="text-xs uppercase tracking-widest text-clara-black/30">Cargando métricas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif">Bienvenido de nuevo, Clara</h2>
          <p className="text-sm text-clara-black/40">Aquí tienes un resumen de lo que está pasando hoy.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 shadow-premium border border-clara-pink-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-clara-black/40 mb-1">{stat.name}</p>
                <p className="text-2xl font-serif">{stat.value}</p>
              </div>
              <div className={stat.color}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 shadow-premium border border-clara-pink-50">
          <h3 className="font-serif text-lg mb-6">Ventas Recientes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between py-4 border-b border-clara-gray last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-clara-pink-50 rounded-full flex items-center justify-center text-clara-pink-500 font-bold text-xs">
                    #00{order}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cliente Ejemplo {order}</p>
                    <p className="text-xs text-clara-black/40">Hace {order * 2} horas</p>
                  </div>
                </div>
                <p className="text-sm font-bold">{formatPrice(129000)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 shadow-premium border border-clara-pink-50 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-clara-pink-100 mb-4" />
          <h3 className="font-serif text-lg">Próximamente: Gráficas Detalladas</h3>
          <p className="text-sm text-clara-black/40 max-w-xs mt-2">
            Estamos preparando integraciones visuales para que analices tu crecimiento en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
