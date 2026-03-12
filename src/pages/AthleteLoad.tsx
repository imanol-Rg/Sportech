/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  Heart, 
  Zap, 
  Moon,
  AlertCircle,
  ChevronDown,
  TrendingUp,
  ShieldAlert,
  X
} from 'lucide-react';
import { MOCK_ATHLETES, MOCK_CALENDAR } from '../mockData';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip } from '../components/Tooltip';
import { Modal } from '../components/Modal';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip,
  CartesianGrid
} from 'recharts';
import { Athlete, RiskStatus, CalendarEvent } from '../types';

export function AthleteLoad() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [selectedLoadTrend, setSelectedLoadTrend] = React.useState<Athlete | null>(null);
  
  // Filter states
  const [riskFilter, setRiskFilter] = React.useState<string>('ALL');
  const [squadFilter, setSquadFilter] = React.useState<string>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = React.useState<string>('ALL');
  const [showFilters, setShowFilters] = React.useState(false);

  const squads = Array.from(new Set(MOCK_ATHLETES.map(a => a.squad)));

  const filteredAthletes = MOCK_ATHLETES.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.squad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || a.riskStatus === riskFilter;
    const matchesSquad = squadFilter === 'ALL' || a.squad === squadFilter;
    const matchesAvailability = availabilityFilter === 'ALL' || a.availabilityStatus === availabilityFilter;
    
    return matchesSearch && matchesRisk && matchesSquad && matchesAvailability;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Athlete Load Analysis</h2>
          <p className="text-sm md:text-base text-white/60">Individual monitoring and risk translation.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search athletes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal/50 w-full"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2.5 border rounded-xl transition-all flex items-center justify-center gap-2 text-sm px-4 w-full sm:w-auto",
                showFilters ? "bg-teal text-navy border-teal" : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <Filter size={18} />
              Filters
              {(riskFilter !== 'ALL' || squadFilter !== 'ALL' || availabilityFilter !== 'ALL') && (
                <span className="w-2 h-2 bg-risk-red rounded-full" />
              )}
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-navy border border-white/10 rounded-2xl shadow-2xl p-4 z-50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Advanced Filters</h4>
                    <button 
                      onClick={() => {
                        setRiskFilter('ALL');
                        setSquadFilter('ALL');
                        setAvailabilityFilter('ALL');
                      }}
                      className="text-[10px] text-teal font-bold uppercase tracking-widest hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-3">
                    <FilterSelect 
                      label="Risk Level" 
                      value={riskFilter} 
                      onChange={setRiskFilter}
                      options={['ALL', 'SAFE', 'CAUTION', 'OVERLOAD']}
                    />
                    <FilterSelect 
                      label="Squad" 
                      value={squadFilter} 
                      onChange={setSquadFilter}
                      options={['ALL', ...squads]}
                    />
                    <FilterSelect 
                      label="Availability" 
                      value={availabilityFilter} 
                      onChange={setAvailabilityFilter}
                      options={['ALL', 'AVAILABLE', 'LIMITED', 'UNAVAILABLE']}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredAthletes.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/40">
            No athletes found matching your filters.
          </div>
        ) : (
          filteredAthletes.map((athlete) => (
            <AthleteCard 
              key={athlete.id} 
              athlete={athlete} 
              isExpanded={expandedId === athlete.id}
              onToggle={() => toggleExpand(athlete.id)}
              onShowTrend={() => setSelectedLoadTrend(athlete)}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedLoadTrend}
        onClose={() => setSelectedLoadTrend(null)}
        title={`${selectedLoadTrend?.name} - Training Load Trend`}
      >
        {selectedLoadTrend && (
          <div className="space-y-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedLoadTrend.lastSessionsLoad.map((load, i) => ({ session: `S${i+1}`, load }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="session" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#0A1628', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#00D4AA' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#00D4AA" 
                    strokeWidth={3} 
                    dot={{ fill: '#00D4AA', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Average Load</p>
                <p className="text-xl font-bold">
                  {Math.round(selectedLoadTrend.lastSessionsLoad.reduce((a, b) => a + b, 0) / selectedLoadTrend.lastSessionsLoad.length)} AU
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Peak Load</p>
                <p className="text-xl font-bold">{Math.max(...selectedLoadTrend.lastSessionsLoad)} AU</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
              value === opt ? "bg-teal text-navy" : "bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

interface AthleteCardProps {
  key?: string;
  athlete: Athlete;
  isExpanded: boolean;
  onToggle: () => void;
  onShowTrend: () => void;
}

function AthleteCard({ athlete, isExpanded, onToggle, onShowTrend }: AthleteCardProps) {
  const calendarEvents = MOCK_CALENDAR.filter(event => 
    event.players?.some(p => p.athleteId === athlete.id)
  );

  const availabilityDefinitions = {
    AVAILABLE: 'Cleared for full participation',
    LIMITED: 'Can participate with reduced load or restrictions',
    UNAVAILABLE: 'Should not participate due to high risk or insufficient recovery'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "glass-card overflow-visible group transition-all relative hover:z-50",
        isExpanded ? "border-teal/50 ring-1 ring-teal/20 z-40" : "hover:border-teal/30"
      )}
    >
      <div 
        onClick={onToggle}
        className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center gap-6 md:gap-8 cursor-pointer overflow-visible"
      >
        {/* Profile Info */}
        <div className="flex items-center gap-4 min-w-0 lg:min-w-[280px]">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold text-lg md:text-xl shrink-0">
            {athlete.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base md:text-lg truncate">{athlete.name}</h3>
            <p className="text-[10px] md:text-xs text-white/40">{athlete.squad}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 overflow-visible">
              <Tooltip content={
                <div className="space-y-2">
                  <p className="font-bold text-teal">{athlete.availabilityStatus}</p>
                  <p className="text-white/80">{availabilityDefinitions[athlete.availabilityStatus as keyof typeof availabilityDefinitions]}</p>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Current Reason</p>
                    <p className="italic">"{athlete.availabilityReason}"</p>
                  </div>
                </div>
              }>
                <span className={cn(
                  "status-badge w-fit",
                  athlete.availabilityStatus === 'AVAILABLE' ? "bg-risk-green/20 text-risk-green" :
                  athlete.availabilityStatus === 'LIMITED' ? "bg-risk-yellow/20 text-risk-yellow" :
                  "bg-risk-red/20 text-risk-red"
                )}>
                  {athlete.availabilityStatus}
                </span>
              </Tooltip>
              {athlete.availabilityReason && (
                <p className="text-[10px] text-white/60 italic truncate max-w-[150px] sm:max-w-[200px]">
                  {athlete.availabilityReason}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Translation Metrics */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          <MetricBox 
            label="HRV" 
            value={athlete.hrv} 
            icon={Heart} 
            status={athlete.hrv < 45 ? 'OVERLOAD' : athlete.hrv < 60 ? 'CAUTION' : 'SAFE'} 
            tooltip={
              <div>
                <p className="font-bold text-teal mb-1">Heart Rate Variability</p>
                <p>Measures nervous system recovery.</p>
                <p className="mt-2 text-white/40">Typical range for youth athletes: <span className="text-white">50-80</span></p>
                <p className="mt-1">Low HRV indicates fatigue or stress.</p>
              </div>
            }
          />
          <MetricBox 
            label="Load" 
            value={athlete.trainingLoad} 
            icon={Activity} 
            status={athlete.trainingLoad > 800 ? 'OVERLOAD' : athlete.trainingLoad > 600 ? 'CAUTION' : 'SAFE'} 
            onClick={(e) => {
              e.stopPropagation();
              onShowTrend();
            }}
            tooltip={
              <div>
                <p className="font-bold text-teal mb-1">Training Load Score (AU)</p>
                <p>Calculated using: <span className="italic">Session RPE × duration</span></p>
                <p className="mt-2 text-white/40">Example: <span className="text-white">RPE 8 × 60 min = 480</span></p>
                <p className="mt-1">Weekly load is used to detect spikes.</p>
              </div>
            }
          />
          <MetricBox 
            label="Recovery" 
            value={`${athlete.recoveryScore}%`} 
            icon={Zap} 
            status={athlete.recoveryScore < 50 ? 'OVERLOAD' : athlete.recoveryScore < 75 ? 'CAUTION' : 'SAFE'} 
            tooltip={
              <div>
                <p className="font-bold text-teal mb-1">Recovery Index</p>
                <p>Composite score based on: <span className="italic">HRV, Sleep, Previous load</span></p>
                <p className="mt-2">Below <span className="text-risk-red font-bold">50%</span> indicates increased injury risk.</p>
              </div>
            }
          />
          <MetricBox 
            label="Wellness" 
            value={`${athlete.wellness}/10`} 
            icon={Moon} 
            status={athlete.wellness < 4 ? 'OVERLOAD' : athlete.wellness < 7 ? 'CAUTION' : 'SAFE'} 
            tooltip={
              <div>
                <p className="font-bold text-teal mb-1">Wellness Score (1-10)</p>
                <p>Athlete self-reported based on:</p>
                <ul className="mt-1 list-disc list-inside text-white/60">
                  <li>Fatigue</li>
                  <li>Muscle soreness</li>
                  <li>Sleep quality</li>
                  <li>Mood</li>
                </ul>
              </div>
            }
          />
        </div>

        {/* Risk Translation */}
        <div className="lg:w-64 flex flex-row lg:flex-col items-center justify-between lg:justify-center p-4 bg-white/5 rounded-2xl border border-white/5 gap-4">
          <div className="text-left lg:text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 lg:mb-2 font-bold">Risk Status</p>
            <div className={cn(
              "text-lg lg:text-xl font-black tracking-tighter px-4 py-1.5 lg:py-2 rounded-lg",
              athlete.riskStatus === 'SAFE' ? "text-risk-green bg-risk-green/10" :
              athlete.riskStatus === 'CAUTION' ? "text-risk-yellow bg-risk-yellow/10" :
              "text-risk-red bg-risk-red/10 animate-pulse"
            )}>
              {athlete.riskStatus}
            </div>
          </div>
          {athlete.recentSpike > 20 && (
            <div className="flex items-center gap-1 text-risk-red text-[10px] font-bold uppercase">
              <AlertCircle size={12} />
              Spike: +{athlete.recentSpike}%
            </div>
          )}
        </div>

        <div className={cn(
          "hidden lg:block p-2 text-white/20 group-hover:text-teal transition-all",
          isExpanded && "rotate-90 text-teal"
        )}>
          <ChevronRight size={24} />
        </div>
      </div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Load Trend */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Load Trend (Last 5)</h4>
                  <div className="flex items-center gap-1 text-risk-red text-[10px] font-bold">
                    <TrendingUp size={12} />
                    +{athlete.recentSpike}% SPIKE
                  </div>
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={athlete.lastSessionsLoad.map((load, i) => ({ val: load }))}>
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#00D4AA" 
                        strokeWidth={2} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold uppercase">Last Session</span>
                  <span className="text-lg font-bold text-teal">{athlete.lastSessionsLoad[athlete.lastSessionsLoad.length - 1]} AU</span>
                </div>
              </div>

              {/* Risk Drivers */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Risk Drivers</h4>
                {(athlete.riskStatus === 'OVERLOAD' || athlete.riskStatus === 'CAUTION') ? (
                  <div className="space-y-3">
                    <DriverItem 
                      label="Load Spike" 
                      value={`+${athlete.recentSpike}%`} 
                      status={athlete.recentSpike > 30 ? 'HIGH' : 'MEDIUM'} 
                    />
                    <DriverItem 
                      label="Recovery Deficit" 
                      value={`${100 - athlete.recoveryScore}%`} 
                      status={athlete.recoveryScore < 50 ? 'HIGH' : 'MEDIUM'} 
                    />
                    <DriverItem 
                      label="Wellness Drop" 
                      value={`${athlete.wellness}/10`} 
                      status={athlete.wellness < 4 ? 'HIGH' : 'MEDIUM'} 
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-risk-green/5 border border-risk-green/10 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-risk-green/20 rounded-full flex items-center justify-center text-risk-green mb-3">
                      <Zap size={20} />
                    </div>
                    <p className="text-xs font-bold text-risk-green uppercase tracking-wider">Metrics Stable</p>
                    <p className="text-[10px] text-white/40 mt-1">No significant risk drivers detected.</p>
                  </div>
                )}
              </div>

              {/* Calendar Impact */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Calendar Impact</h4>
                {calendarEvents.length > 0 ? (
                  <div className="space-y-3">
                    {calendarEvents.map(event => {
                      const playerProj = event.players?.find(p => p.athleteId === athlete.id);
                      return (
                        <div key={event.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Included in:</p>
                            <p className="text-sm font-bold text-teal">{event.title}</p>
                            <p className="text-[10px] text-white/60">
                              {new Date(event.date).toLocaleDateString()} {event.endDate && `– ${new Date(event.endDate).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Participation Status:</p>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded",
                              playerProj?.status === 'AVAILABLE' ? "bg-risk-green/20 text-risk-green" :
                              playerProj?.status === 'LIMITED' ? "bg-risk-yellow/20 text-risk-yellow" :
                              "bg-risk-red/20 text-risk-red"
                            )}>
                              {playerProj?.status}
                            </span>
                            <p className="text-[10px] text-white/60 mt-2 italic">
                              Reason: {playerProj?.reason}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-[10px] text-white/40 uppercase font-bold">No competition blocks</p>
                    <p className="text-[10px] text-white/20 mt-1 italic">Not currently in any high-risk calendar periods.</p>
                  </div>
                )}
              </div>

              {/* AI Prescription */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">AI Coaching Prescription</h4>
                <div className="p-6 bg-teal/10 border border-teal/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal/20 rounded-lg">
                      <ShieldAlert className="text-teal" size={20} />
                    </div>
                    <span className="text-sm font-bold">Recommended Adjustments</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                      Reduce sprint volume by 20% in next session.
                    </li>
                    <li className="flex items-start gap-2 text-xs text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                      Mandatory 15-min mobility and hydrotherapy block.
                    </li>
                    <li className="flex items-start gap-2 text-xs text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                      Prioritize 9+ hours sleep; monitor morning HRV.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DriverItem({ label, value, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
      <span className="text-xs text-white/60">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">{value}</span>
        <span className={cn(
          "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
          status === 'HIGH' ? "bg-risk-red text-white" : "bg-risk-yellow text-navy"
        )}>
          {status}
        </span>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon: Icon, status, tooltip, onClick }: any) {
  return (
    <div className="space-y-1">
      <Tooltip content={tooltip}>
        <div className="flex items-center gap-1.5 text-white/40">
          <Icon size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
      </Tooltip>
      <div 
        onClick={onClick}
        className={cn(
          "flex items-baseline gap-2 min-w-0",
          onClick && "cursor-pointer hover:text-teal transition-colors"
        )}
      >
        <span className="text-lg md:text-xl font-bold truncate">{value}</span>
        <div className={cn(
          "w-2 h-2 rounded-full shrink-0",
          status === 'SAFE' ? "bg-risk-green" :
          status === 'CAUTION' ? "bg-risk-yellow" :
          "bg-risk-red"
        )} />
      </div>
    </div>
  );
}
