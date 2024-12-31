import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppContactCard: React.FC = () => {
  return (
    <a 
      href="https://wa.me/6591874498" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-gradient-to-br from-emerald-900/40 to-slate-900/60 border-2 border-[#25D366]/20 rounded-lg p-6 cursor-pointer hover:border-[#25D366]/40 hover:shadow-lg hover:shadow-[#25D366]/10 transition-all duration-200 backdrop-blur-sm flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]"
    >
      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#25D366] to-emerald-600 text-white px-3 py-1 rounded-bl-lg font-semibold text-sm">
        CONTACT
      </div>
      <div className="absolute inset-0 bg-[#25D366]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <div className="flex flex-col items-center gap-4">
        <motion.svg
          className="w-12 h-12 text-[#25D366]"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </motion.svg>
        <div>
          <h3 className="text-xl font-bold text-[#25D366] mb-1">Need More Units?</h3>
          <p className="text-gray-300 text-sm">Contact us for custom quotes</p>
        </div>
      </div>
      
      <div className="mt-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#25D366] text-sm font-medium">
          Chat with us on WhatsApp
        </span>
      </div>
    </a>
  );
};

export default WhatsAppContactCard;