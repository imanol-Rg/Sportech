/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-navy/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-white/60 hover:text-teal transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-navy" size={18} />
          </div>
          <span className="font-bold tracking-tight">InjuryIQ</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold">
          IF
        </div>
      </div>
    </header>
  );
}
