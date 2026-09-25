import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

// Fades a grid item up when it scrolls into view; `index` staggers items in the same row
const Reveal = ({ children, index = 0, className = '' }: RevealProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 4) * 0.08 }}
  >
    {children}
  </motion.div>
);

export default Reveal;
