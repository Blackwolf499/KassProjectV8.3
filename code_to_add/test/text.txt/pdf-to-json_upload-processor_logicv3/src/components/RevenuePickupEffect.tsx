import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PickupIndicator {
  id: string;
  amount: number;
  position: { x: number; y: number };
}

interface RevenuePickupEffectProps {
  value: number;
  previousValue: number;
}

export const RevenuePickupEffect: React.FC<RevenuePickupEffectProps> = ({ value, previousValue }) => {
  const [indicators, setIndicators] = useState<PickupIndicator[]>([]);

  useEffect(() => {
    if (value > previousValue) {
      const difference = value - previousValue;
      const newIndicator: PickupIndicator = {
        id: Math.random().toString(),
        amount: difference,
        position: {
          x: Math.random() * 40 - 20, // Random X offset between -20 and 20
          y: 0
        }
      };

      setIndicators(prev => [...prev, newIndicator]);

      // Remove indicator after animation
      setTimeout(() => {
        setIndicators(prev => prev.filter(i => i.id !== newIndicator.id));
      }, 1000);
    }
  }, [value, previousValue]);

  return (
    <div className="relative">
      <AnimatePresence>
        {indicators.map(indicator => (
          <motion.div
            key={indicator.id}
            initial={{ 
              opacity: 0,
              scale: 0.5,
              y: 0,
              x: indicator.position.x 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              y: -50,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <div className="flex items-center space-x-1 text-green-500 font-bold text-lg">
              <span>+</span>
              <span className="font-mono">${indicator.amount.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};