import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WAcard: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/659187448"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-green-600/90 to-emerald-700/90 border border-green-500/50 cursor-pointer h-full flex flex-col items-center justify-center min-h-[280px] gap-8"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon and Title */}
      <motion.div 
        className="flex flex-col items-center text-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            6 Units or More?
          </h2>
          <p className="text-green-100 text-lg">
            Chat with us on WhatsApp
          </p>
        </motion.div>
      </motion.div>

      {/* Chat Button */}
      <motion.div
        className="px-6 py-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg hover:shadow-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        animate={{ 
          boxShadow: ["0px 4px 12px rgba(0,0,0,0.1)", "0px 8px 24px rgba(0,0,0,0.2)"],
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        <span className="text-white font-medium flex items-center gap-2">
          Click to chat <span className="text-lg">→</span>
        </span>
      </motion.div>
    </motion.a>
  );
};

export default WAcard;