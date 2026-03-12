import React from 'react';
import { AlertCircle, Info, User, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

type RiskLevel = 'HIGH' | 'MODERATE' | 'LOW';

const PLAYERS = [
  { id: '1', name: 'Marcus Johnson' },
  { id: '2', name: 'Leo Silva' },
  { id: '3', name: 'Sarah Chen' },
  { id: '4', name: 'David Okafor' },
];

const ZONE_RISKS: Record<string, RiskLevel[]> = {
  'head': ['LOW', 'LOW', 'LOW', 'LOW'],
  'shoulder-l': ['MODERATE', 'LOW', 'LOW', 'LOW'],
  'shoulder-r': ['LOW', 'LOW', 'MODERATE', 'LOW'],
  'back': ['HIGH', 'LOW', 'LOW', 'MODERATE'],
  'hamstring-l': ['HIGH', 'MODERATE', 'MODERATE', 'LOW'],
  'hamstring-r': ['HIGH', 'MODERATE', 'LOW', 'LOW'],
  'knee-l': ['LOW', 'LOW', 'LOW', 'HIGH'],
  'knee-r': ['LOW', 'LOW', 'LOW', 'HIGH'],
  'ankle-l': ['LOW', 'LOW', 'HIGH', 'LOW'],
  'ankle-r': ['LOW', 'LOW', 'HIGH', 'LOW'],
};

const ZONE_DETAILS: Record<string, { factors: string[], action: string }> = {
  'hamstring-l': {
    factors: [
      'Recent 42% spike in high-speed running volume across U16 squad.',
      'Congested match schedule (3 games in 7 days).',
      'Subjective wellness scores for "Muscle Soreness" dropped by 30%.',
    ],
    action: 'Reduce sprint distance by 20% tomorrow. Mandatory eccentric hamstring protocol. Monitor Marcus and David before next match.',
  },
  'back': {
    factors: [
      'Increased core loading in recent strength block.',
      'Reported stiffness in 2 athletes following travel.',
      'HRV suppression indicating systemic fatigue.',
    ],
    action: 'Modify deadlift volume in gym session. Implement 15-min decompression and mobility block.',
  },
  'knee-l': {
    factors: [
      'High deceleration load in recent tactical drills.',
      'Previous injury history for David Okafor.',
      'Increased knee joint stiffness reported post-match.',
    ],
    action: 'Limit change-of-direction intensity. Mandatory ice compression and physio review for David.',
  },
  'default': {
    factors: [
      'General training load monitoring.',
      'Routine recovery protocols in place.',
      'No significant cluster concerns detected.',
    ],
    action: 'Continue standard recovery and monitoring protocols.',
  }
};

const bodyParts = [
  { id: 'head', label: 'Head / Neck', x: '50%', y: '10%' },
  { id: 'shoulder-l', label: 'Left Shoulder', x: '30%', y: '20%' },
  { id: 'shoulder-r', label: 'Right Shoulder', x: '70%', y: '20%' },
  { id: 'back', label: 'Lower Back', x: '50%', y: '45%' },
  { id: 'hamstring-l', label: 'Left Hamstring', x: '34%', y: '65%' },
  { id: 'hamstring-r', label: 'Right Hamstring', x: '66%', y: '65%' },
  { id: 'knee-l', label: 'Left Knee', x: '34%', y: '78%' },
  { id: 'knee-r', label: 'Right Knee', x: '66%', y: '78%' },
  { id: 'ankle-l', label: 'Left Ankle', x: '34%', y: '92%' },
  { id: 'ankle-r', label: 'Right Ankle', x: '66%', y: '92%' },
];

export function SquadHeatmap() {
  const [selectedId, setSelectedId] = React.useState('hamstring-l');

  const selectedPart = bodyParts.find(p => p.id === selectedId) || bodyParts[4];
  const selectedRisks = ZONE_RISKS[selectedId] || ['LOW', 'LOW', 'LOW', 'LOW'];
  const details = ZONE_DETAILS[selectedId] || ZONE_DETAILS['default'];

  const getAggregatedStatus = (risks: RiskLevel[]) => {
    const highCount = risks.filter(r => r === 'HIGH').length;
    const modCount = risks.filter(r => r === 'MODERATE').length;
    
    if (highCount >= 1) return 'HIGH';
    if (modCount >= 2) return 'MODERATE';
    return 'LOW';
  };

  const highCount = selectedRisks.filter(r => r === 'HIGH').length;
  const modCount = selectedRisks.filter(r => r === 'MODERATE').length;
  const lowCount = selectedRisks.filter(r => r === 'LOW').length;

  const severity = getAggregatedStatus(selectedRisks);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Squad Risk Heatmap</h2>
        <p className="text-sm md:text-base text-white/60">Aggregated injury risk clusters for the core squad.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Body Map Visual */}
        <div className="glass-card p-4 md:p-8 flex items-center justify-center relative min-h-[500px] md:min-h-[700px]">
          <div className="relative w-full max-w-[280px] md:max-w-[340px] aspect-[1/2.2]">
            {/* Premium Anatomical Silhouette SVG */}
            <svg viewBox="0 0 100 220" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main Body Path - More Anatomical */}
              <path 
                d="M50,5 C56,5 61,10 61,17 C61,24 56,29 50,29 C44,29 39,24 39,17 C39,10 44,5 50,5 
                   M46,30 L54,30 L55,38 L45,38 Z
                   M28,45 C35,40 65,40 72,45 C78,48 85,65 85,85 C85,95 80,100 75,100 L72,60 L68,110 L70,140 L65,180 L68,215 L55,215 L58,180 L55,140 L50,145 L45,140 L42,180 L45,215 L32,215 L35,180 L30,140 L32,110 L28,60 L25,100 C20,100 15,95 15,85 C15,65 22,48 28,45 Z" 
                fill="url(#bodyGradient)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />
              
              {/* Subtle Depth Lines */}
              <path d="M40,50 Q50,45 60,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <path d="M42,80 Q50,85 58,80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <path d="M40,115 Q50,120 60,115" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <path d="M45,150 L45,170 M55,150 L55,170" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </svg>

            {/* Heatmap Points - Multi-Badge Logic */}
            {bodyParts.map((part) => {
              const risks = ZONE_RISKS[part.id] || ['LOW', 'LOW', 'LOW', 'LOW'];
              const high = risks.filter(r => r === 'HIGH').length;
              const mod = risks.filter(r => r === 'MODERATE').length;
              const low = risks.filter(r => r === 'LOW').length;
              
              return (
                <div
                  key={part.id}
                  style={{ left: part.x, top: part.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                >
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedId(part.id)}
                    className={cn(
                      "flex gap-1 p-1.5 rounded-full transition-all group relative",
                      selectedId === part.id ? "bg-white/10 ring-2 ring-teal shadow-[0_0_20px_rgba(45,212,191,0.2)]" : "hover:bg-white/5"
                    )}
                  >
                    {high > 0 && (
                      <div className="w-7 h-7 rounded-full bg-risk-red border border-white/20 flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(255,59,48,0.4)]">
                        {high}
                      </div>
                    )}
                    {mod > 0 && (
                      <div className="w-7 h-7 rounded-full bg-risk-yellow border border-white/20 flex items-center justify-center text-[10px] font-black text-navy shadow-[0_0_10px_rgba(255,159,10,0.3)]">
                        {mod}
                      </div>
                    )}
                    {low > 0 && (
                      <div className="w-7 h-7 rounded-full bg-risk-green border border-white/20 flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(52,199,89,0.3)]">
                        {low}
                      </div>
                    )}
                    
                    {/* Tooltip Label */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-navy border border-white/10 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {part.label}
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex justify-between items-end">
            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-risk-red shadow-[0_0_5px_rgba(255,59,48,0.5)]" />
                <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-wider">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-risk-yellow" />
                <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-wider">Moderate Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-risk-green" />
                <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-wider">Low Risk</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] md:text-[10px] text-white/40 uppercase font-bold tracking-widest">Active Squad Size</p>
              <p className="text-xl md:text-2xl font-black text-teal">4 MVP</p>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 border-l-4 border-l-teal"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{selectedPart.label}</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cluster Analysis</p>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl font-black text-xs tracking-widest w-fit",
                  severity === 'HIGH' ? 'bg-risk-red/20 text-risk-red' : 
                  severity === 'MODERATE' ? 'bg-risk-yellow/20 text-risk-yellow' : 
                  'bg-risk-green/20 text-risk-green'
                )}>
                  {severity === 'HIGH' ? 'CRITICAL' : severity === 'MODERATE' ? 'ELEVATED' : 'STABLE'}
                </div>
              </div>

              {/* Cluster Summary */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-8">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Cluster Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black text-risk-red">{highCount}</p>
                    <p className="text-[8px] text-white/40 uppercase font-bold">High</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-risk-yellow">{modCount}</p>
                    <p className="text-[8px] text-white/40 uppercase font-bold">Mod</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-risk-green">{lowCount}</p>
                    <p className="text-[8px] text-white/40 uppercase font-bold">Low</p>
                  </div>
                </div>
              </div>

              {/* Player Breakdown */}
              <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} />
                  Individual Player Status
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {PLAYERS.map((player, idx) => {
                    const risk = selectedRisks[idx];
                    return (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-sm font-bold">{player.name}</span>
                        <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                          risk === 'HIGH' ? "bg-risk-red text-white" : 
                          risk === 'MODERATE' ? "bg-risk-yellow text-navy" : 
                          "bg-risk-green/20 text-risk-green"
                        )}>
                          {risk} RISK
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} className="text-teal" />
                  Contributing Factors
                </h4>
                <ul className="space-y-2">
                  {details.factors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-teal/10 rounded-2xl border border-teal/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={16} className="text-teal" />
                  <h4 className="text-teal font-black text-[10px] uppercase tracking-widest">Recommended Action</h4>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "{details.action}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} />
              Heatmap Logic
            </h3>
            <div className="space-y-3 text-[10px] text-white/60 leading-relaxed">
              <p><span className="text-risk-red font-bold">CRITICAL:</span> At least 1 athlete is at High risk in this zone.</p>
              <p><span className="text-risk-yellow font-bold">ELEVATED:</span> No High risk, but 2+ athletes are at Moderate risk.</p>
              <p><span className="text-risk-green font-bold">STABLE:</span> Most athletes are Low risk with no cluster concern.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
