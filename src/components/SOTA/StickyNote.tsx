import { motion } from 'framer-motion';

export default function StickyNote({ 
  title, 
  content, 
  footer, 
  rotation = 2,
  className = "" 
}: { 
  title: string; 
  content: string; 
  footer?: string;
  rotation?: number;
  className?: string;
}) {
  return (
    <motion.div 
      initial={{ rotate: rotation }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      className={`bg-acid-lime p-10 rounded-lg text-stone-black shadow-xl ${className}`}
      style={{ borderRadius: '24px' }}
    >
      <h3 className="text-3xl font-serif italic mb-4">{title}</h3>
      <p className="text-lg mb-8 font-sans leading-relaxed">{content}</p>
      {footer && (
        <div className="pt-4 border-t border-stone-black/10 font-mono text-xs uppercase tracking-widest">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
