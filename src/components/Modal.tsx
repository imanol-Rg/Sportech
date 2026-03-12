/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'center' | 'drawer';
}

export function Modal({ isOpen, onClose, title, children, variant = 'center' }: ModalProps) {
  const isDrawer = variant === 'drawer';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn(
          "fixed inset-0 z-[100] flex",
          isDrawer ? "justify-end" : "items-center justify-center p-4"
        )}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
          />
          <motion.div
            initial={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "relative glass-card shadow-2xl border-white/20 flex flex-col",
              isDrawer 
                ? "w-full md:w-[500px] h-full rounded-none border-l" 
                : "w-full max-w-lg p-4 md:p-6 rounded-2xl max-h-[90vh] md:max-h-[none]"
            )}
          >
            <div className={cn(
              "flex items-center justify-between shrink-0",
              isDrawer ? "p-6 border-b border-white/10" : "mb-6"
            )}>
              <h3 className="text-xl font-bold tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className={cn(
              "flex-1 overflow-y-auto",
              isDrawer ? "p-6" : ""
            )}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
