/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // If there's less than 220px above the trigger, show it below
      if (rect.top < 220) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block group overflow-visible" ref={triggerRef}>
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="flex items-center gap-1 cursor-help overflow-visible"
      >
        {children}
        <Info size={12} className="text-white/20 group-hover:text-teal transition-colors" />
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-[260px] p-4 bg-navy/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-[9999] pointer-events-none",
              position === 'top' ? "bottom-full mb-3" : "top-full mt-3"
            )}
          >
            <div className="text-xs text-white/90 leading-relaxed space-y-2">
              {content}
            </div>
            {/* Arrow */}
            <div className={cn(
              "absolute left-1/2 -translate-x-1/2 border-8 border-transparent",
              position === 'top' 
                ? "top-full border-t-navy/95" 
                : "bottom-full border-b-navy/95"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
