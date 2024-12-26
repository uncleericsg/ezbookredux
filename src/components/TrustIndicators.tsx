import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { RootState } from '@store';

interface TrustIndicator {
  value: number;
  startValue: number;
  label: string;
  suffix?: string;
}

const trustIndicators: TrustIndicator[] = [
  {
    value: 10,
    startValue: 8,
    label: 'Years Experience',
    suffix: '+'
  },
  {
    value: 10500,
    startValue: 9800,
    label: 'Happy Customers',
    suffix: '+'
  },
  {
    value: 25000,
    startValue: 23000,
    label: 'TikTok Followers',
    suffix: '+'
  },
  {
    value: 160000,
    startValue: 155000,
    label: 'Services Completed',
    suffix: '+'
  }
];

const TrustIndicators: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className="mb-16">
      <div 
        ref={counterRef} 
        className="bg-gradient-to-br from-cyan-500/20 to-blue-900/20 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 md:p-6 lg:p-8">
          {trustIndicators.map((indicator, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-cyan-500/30 to-blue-800/20 border border-cyan-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm hover:shadow-lg hover:border-cyan-400/40 group"
            >
              <div className="text-2xl md:text-3xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                {hasAnimated ? (
                  <CountUp
                    start={indicator.startValue}
                    end={indicator.value}
                    duration={2.5}
                    separator=","
                    suffix={indicator.suffix}
                  />
                ) : `${indicator.value.toLocaleString()}${indicator.suffix}`}
              </div>
              <div className="text-sm md:text-base font-medium text-[#F7F7F7] mt-2 group-hover:text-white transition-colors">{indicator.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
