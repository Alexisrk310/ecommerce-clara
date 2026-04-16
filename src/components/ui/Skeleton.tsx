import { motion } from 'framer-motion';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white overflow-hidden shadow-sm">
      <div className="aspect-[4/5] bg-clara-gray relative overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/4 bg-clara-gray rounded-none" />
        <div className="h-4 w-3/4 bg-clara-gray rounded-none" />
        <div className="h-4 w-1/2 bg-clara-gray rounded-none" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 shadow-premium border border-clara-pink-50 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-clara-gray" />
            <div className="h-8 w-8 bg-clara-gray rounded-full" />
          </div>
          <div className="h-8 w-16 bg-clara-gray" />
          <div className="h-3 w-40 bg-clara-gray" />
        </div>
      ))}
    </div>
  );
};
