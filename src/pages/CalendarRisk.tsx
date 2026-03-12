/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Info,
  Users,
  Trophy,
  Activity,
  ArrowRight
} from 'lucide-react';
import { MOCK_CALENDAR, MOCK_ATHLETES } from '../mockData';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../components/Modal';
import { CalendarEvent } from '../types';

interface CalendarRiskProps {
  setActiveTab: (tab: string) => void;
}

export function CalendarRisk({ setActiveTab }: CalendarRiskProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    { name: 'February', year: 2026, days: 28, startDay: 0 }, // Feb 1 2026 is Sunday
    { name: 'March', year: 2026, days: 31, startDay: 0 },    // Mar 1 2026 is Sunday
    { name: 'April', year: 2026, days: 30, startDay: 3 },    // Apr 1 2026 is Wednesday
  ];

  const [monthIndex, setMonthIndex] = React.useState(1); // Default to March
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);

  const currentMonth = months[monthIndex];
  
  const monthEvents = MOCK_CALENDAR.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === (monthIndex === 0 ? 1 : monthIndex === 1 ? 2 : 3) && 
           eventDate.getFullYear() === 2026;
  });

  // Default alert/recommendations based on highest risk event in month if none selected
  const displayEvent = selectedEvent || monthEvents.sort((a, b) => {
    const riskMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return riskMap[b.riskLevel] - riskMap[a.riskLevel];
  })[0];

  const handlePrevMonth = () => setMonthIndex(prev => Math.max(0, prev - 1));
  const handleNextMonth = () => setMonthIndex(prev => Math.min(months.length - 1, prev + 1));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Competition Load Forecast</h2>
          <p className="text-sm md:text-base text-white/60">Visualize the next 14 days of squad load risk.</p>
        </div>
        <div className="flex items-center justify-between md:justify-start gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-full md:w-auto">
          <button 
            onClick={handlePrevMonth}
            disabled={monthIndex === 0}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-20 flex-1 md:flex-none flex justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 font-bold text-sm w-full md:w-32 text-center whitespace-nowrap">
            {currentMonth.name} {currentMonth.year}
          </span>
          <button 
            onClick={handleNextMonth}
            disabled={monthIndex === months.length - 1}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-20 flex-1 md:flex-none flex justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6 overflow-x-auto">
          <div className="min-w-[600px] lg:min-w-0">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-white/40 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for start day offset */}
            {Array.from({ length: currentMonth.startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: currentMonth.days }).map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-0${monthIndex === 0 ? 2 : monthIndex === 1 ? 3 : 4}-${day.toString().padStart(2, '0')}`;
              
              // Find if this day is a match day
              const matchEvent = monthEvents.find(e => e.matches?.some(m => m.date === dateStr));
              const match = matchEvent?.matches?.find(m => m.date === dateStr);
              
              // Find if this day is part of a tournament/risk block
              const riskBlock = monthEvents.find(e => {
                const start = new Date(e.date);
                const end = e.endDate ? new Date(e.endDate) : start;
                const current = new Date(dateStr);
                return current >= start && current <= end;
              });

              const isStartOfBlock = riskBlock && riskBlock.date === dateStr;
              
              return (
                <div 
                  key={i} 
                  onClick={() => (matchEvent || riskBlock) && setSelectedEvent(matchEvent || riskBlock || null)}
                  className={cn(
                    "aspect-square rounded-xl border p-2 transition-all relative group flex flex-col",
                    riskBlock ? "bg-white/5 border-white/20 cursor-pointer hover:border-teal/50" : "border-white/5",
                    day === 12 && monthIndex === 1 ? "ring-2 ring-teal" : "",
                    riskBlock?.riskLevel === 'HIGH' && "bg-risk-red/5",
                    riskBlock?.riskLevel === 'MEDIUM' && "bg-risk-yellow/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-xs font-bold",
                      day === 12 && monthIndex === 1 ? "text-teal" : "text-white/40"
                    )}>{day}</span>
                    
                    {riskBlock && (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        riskBlock.riskLevel === 'HIGH' ? "bg-risk-red shadow-[0_0_8px_rgba(255,59,48,0.5)]" : 
                        riskBlock.riskLevel === 'MEDIUM' ? "bg-risk-yellow" : "bg-risk-green"
                      )} />
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col gap-1">
                    {isStartOfBlock && (
                      <div className="text-[8px] font-bold text-teal uppercase truncate leading-none">
                        {riskBlock.title}
                      </div>
                    )}
                    
                    {match && (
                      <div className="bg-teal/20 text-teal text-[8px] font-bold py-0.5 px-1 rounded flex items-center gap-1 truncate">
                        <span>⚽</span>
                        <span className="truncate">vs {match.opponent.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>

                  {riskBlock && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy border border-white/10 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      <p className="text-[10px] text-teal font-bold uppercase mb-1">{riskBlock.squad}</p>
                      <p className="text-xs font-bold mb-1">{riskBlock.title}</p>
                      <p className="text-[10px] text-white/60 leading-tight">
                        {riskBlock.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={cn(
                          "text-[8px] font-bold px-1.5 py-0.5 rounded",
                          riskBlock.riskLevel === 'HIGH' ? "bg-risk-red/20 text-risk-red" : "bg-risk-yellow/20 text-risk-yellow"
                        )}>
                          {riskBlock.riskLevel} RISK
                        </span>
                        <span className="text-[8px] text-white/40 italic">Click for details</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Analysis Sidebar */}
      <div className="space-y-6">
          <AnimatePresence mode="wait">
            {displayEvent ? (
              <motion.div 
                key={displayEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "glass-card p-6 border-l-4",
                  displayEvent.riskLevel === 'HIGH' ? "border-l-risk-red" : "border-l-risk-yellow"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    displayEvent.riskLevel === 'HIGH' ? "bg-risk-red/10" : "bg-risk-yellow/10"
                  )}>
                    <AlertTriangle className={displayEvent.riskLevel === 'HIGH' ? "text-risk-red" : "text-risk-yellow"} size={20} />
                  </div>
                  <h3 className="font-bold">Forecast Alert: {displayEvent.squad}</h3>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  "{displayEvent.description}"
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Predicted Fatigue</span>
                      <span className={cn(
                        "font-bold",
                        displayEvent.riskLevel === 'HIGH' ? "text-risk-red" : "text-risk-yellow"
                      )}>+{displayEvent.predictedFatigue || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(displayEvent.predictedFatigue || 0) * 2}%` }}
                        className={cn(
                          "h-full",
                          displayEvent.riskLevel === 'HIGH' ? "bg-risk-red" : "bg-risk-yellow"
                        )} 
                      />
                    </div>
                  </div>

                  {displayEvent.riskReasons && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Risk Drivers</p>
                      <ul className="space-y-1">
                        {displayEvent.riskReasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-white/60 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-6 text-center text-white/40 italic">
                No major risk events forecast for this month.
              </div>
            )}
          </AnimatePresence>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info size={18} className="text-teal" />
              Strategic Recommendations
            </h3>
            <div className="space-y-4">
              {displayEvent?.recommendations ? (
                displayEvent.recommendations.map((rec, idx) => (
                  <RecommendationItem 
                    key={idx}
                    title={rec.title} 
                    desc={rec.description}
                  />
                ))
              ) : (
                <p className="text-xs text-white/40 italic">Select an event to see recommendations.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || ''}
        variant="drawer"
      >
        {selectedEvent && (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Squad</span>
                </div>
                <p className="font-bold">{selectedEvent.squad}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <CalendarIcon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Date Range</span>
                </div>
                <p className="font-bold">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {selectedEvent.endDate && ` – ${new Date(selectedEvent.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </p>
              </div>
            </div>

            {/* Risk Explanation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className="text-risk-red" />
                Why this block is risky
              </h4>
              <div className="bg-risk-red/5 border border-risk-red/10 rounded-2xl p-4">
                <ul className="space-y-2">
                  {selectedEvent.riskReasons?.map((reason, idx) => (
                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-risk-red mt-1.5 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Matches */}
            {selectedEvent.matches && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={14} className="text-teal" />
                  Match Details
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedEvent.matches.map((match, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/40">
                          {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">vs {match.opponent}</span>
                          <span className="text-[10px] text-white/40">Competition: {selectedEvent.title}</span>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-teal" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Player Projections */}
            {selectedEvent.players && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-teal" />
                  Predicted Load Impact
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedEvent.players.map((p, idx) => {
                    const athlete = MOCK_ATHLETES.find(a => a.id === p.athleteId);
                    return (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedEvent(null);
                          setActiveTab('athletes');
                        }}
                        className="group flex flex-col p-3 bg-white/5 rounded-xl border border-white/5 hover:border-teal/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold group-hover:text-teal transition-colors">
                            {athlete?.name || 'Unknown Athlete'}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            p.status === 'AVAILABLE' ? "bg-risk-green/20 text-risk-green" :
                            p.status === 'LIMITED' ? "bg-risk-yellow/20 text-risk-yellow" :
                            "bg-risk-red/20 text-risk-red"
                          )}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 leading-tight">
                          Reason: {p.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ArrowRight size={14} className="text-teal" />
                Strategic Recommendations
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {selectedEvent.recommendations?.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-teal/5 border border-teal/10 rounded-2xl">
                    <h5 className="text-xs font-bold text-teal uppercase mb-1">{rec.title}</h5>
                    <p className="text-sm text-white/80">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RecommendationItem({ title, desc }: any) {
  return (
    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
      <h4 className="text-xs font-bold text-teal uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-xs text-white/60 leading-normal">{desc}</p>
    </div>
  );
}
