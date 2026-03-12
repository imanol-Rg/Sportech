/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Activity, 
  MessageSquare, 
  Library,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'athletes', label: 'Athlete Load', icon: Activity },
  { id: 'calendar', label: 'Calendar Risk', icon: Calendar },
  { id: 'heatmap', label: 'Squad Heatmap', icon: Users },
  { id: 'comms', label: 'Parent Logs', icon: MessageSquare },
  { id: 'library', label: 'Prescriptions', icon: Library },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-navy border-r border-white/10 z-40 transition-all duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-navy" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">InjuryIQ</h1>
              <p className="text-[10px] text-teal font-bold uppercase tracking-widest">Load Intelligence</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
          <nav className="mt-4 lg:mt-8 px-4 space-y-1.5 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                  activeTab === item.id 
                    ? "bg-teal text-navy font-semibold" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  activeTab === item.id ? "text-navy" : "text-teal group-hover:scale-110 transition-transform"
                )} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto px-6 py-8 shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Active Club</p>
              <p className="text-sm font-semibold truncate">Manchester City Academy</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
