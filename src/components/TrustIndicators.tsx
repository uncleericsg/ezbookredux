import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

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
        className="relative bg-gradient-to-br from-purple-600/40 to-blue-900/60 backdrop-blur-md rounded-3xl border border-purple-500/20 shadow-lg shadow-blue-900/30 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233B82F6' fill-opacity='0.5'%3E%3Ccircle cx='15' cy='15' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        ></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 p-8 md:p-12 lg:p-16">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-blue-600/30 to-indigo-800/20 border border-blue-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:shadow-lg hover:border-blue-400/40 group"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
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
              <div className="text-sm md:text-base lg:text-lg font-medium text-blue-100 mt-4 group-hover:text-white transition-colors">{indicator.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
