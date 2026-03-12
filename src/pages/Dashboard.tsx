/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { MOCK_ATHLETES, MOCK_ALERTS } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { Modal } from '../components/Modal';
import { X } from 'lucide-react';

const loadData7Days = [
  { name: 'Mon', load: 450 },
  { name: 'Tue', load: 520 },
  { name: 'Wed', load: 860 },
  { name: 'Thu', load: 480 },
  { name: 'Fri', load: 620 },
  { name: 'Sat', load: 920 },
  { name: 'Sun', load: 300 },
];

const loadData30Days = [
  { name: 'W1', load: 320 },
  { name: 'W1', load: 400 },
  { name: 'W1', load: 500 },
  { name: 'W1', load: 450 },
  { name: 'W2', load: 600 },
  { name: 'W2', load: 720 },
  { name: 'W2', load: 810 },
  { name: 'W2', load: 900 },
  { name: 'W3', load: 870 },
  { name: 'W3', load: 650 },
  { name: 'W3', load: 580 },
  { name: 'W3', load: 610 },
];

const squadRiskData = [
  { name: 'U14', risk: 12 },
  { name: 'U15', risk: 25 },
  { name: 'U16', risk: 45 },
  { name: 'U17', risk: 18 },
  { name: 'U18', risk: 32 },
];

const COLORS = ['#34C759', '#FF9500', '#FF3B30'];

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const [chartRange, setChartRange] = React.useState('7');
  const [selectedAthlete, setSelectedAthlete] = React.useState<any>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);

  const availabilityRate = 88.4;
  const overloadCount = MOCK_ATHLETES.filter(a => a.riskStatus === 'OVERLOAD').length;
  const spikesDetected = MOCK_ATHLETES.filter(a => a.recentSpike > 30).length;

  const currentLoadData = chartRange === '7' ? loadData7Days : loadData30Days;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Club Load Command Center</h2>
        <p className="text-sm md:text-base text-white/60">Operational insights for technical directors.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Athlete Availability" 
          value={`${availabilityRate}%`} 
          change="+2.4%" 
          trend="up"
          icon={Users}
          onClick={() => setActiveTab('athletes')}
        />
        <StatCard 
          title="Overload Risk" 
          value={overloadCount.toString()} 
          change="+1" 
          trend="down"
          icon={AlertTriangle}
          color="text-risk-red"
          onClick={() => setActiveTab('athletes')}
        />
        <StatCard 
          title="Load Spikes" 
          value={spikesDetected.toString()} 
          change="-12%" 
          trend="up"
          icon={TrendingUp}
          onClick={() => setActiveTab('athletes')}
        />
        <StatCard 
          title="High-Risk Periods" 
          value="2" 
          change="Next 14d" 
          trend="neutral"
          icon={Calendar}
          onClick={() => setActiveTab('calendar')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-semibold">Squad Training Load</h3>
              <p className="text-xs text-white/40">Aggregated load across all academy squads</p>
            </div>
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentLoadData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1628', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#00D4AA' }}
                />
                <Area 
                  key={chartRange}
                  type="monotone" 
                  dataKey="load" 
                  stroke="#00D4AA" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLoad)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Squad Risk Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 md:p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Squad Overload Risk %</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={squadRiskData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff60" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#0A1628', border: '1px solid #ffffff20', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="risk" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  onClick={() => setActiveTab('heatmap')}
                  className="cursor-pointer"
                >
                  {squadRiskData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk > 40 ? '#FF3B30' : entry.risk > 20 ? '#FF9500' : '#34C759'} 
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Highest Risk</span>
              <span className="text-risk-red font-bold">U16 Academy</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Lowest Risk</span>
              <span className="text-risk-green font-bold">U14 Development</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-bold">Critical Overload Alerts</h3>
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => (
              <motion.div 
                key={alert.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedAthlete(alert)}
                className="glass-card p-4 flex flex-col sm:flex-row items-start gap-4 border-l-4 border-l-risk-red cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="p-2 bg-risk-red/10 rounded-lg shrink-0">
                  <AlertTriangle className="text-risk-red" size={20} />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold">{alert.athleteName}</h4>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">High Severity</span>
                  </div>
                  <p className="text-sm text-white/80 mb-2">{alert.message}</p>
                  <div className="bg-white/5 p-2 rounded-lg text-xs text-teal">
                    <span className="font-bold uppercase mr-2">Rec:</span>
                    {alert.recommendation}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-bold">Upcoming Calendar Risk</h3>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px] lg:min-w-0">
              <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Squad</th>
                  <th className="px-6 py-4 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr 
                  onClick={() => setSelectedEvent({
                    name: 'Regional Tournament',
                    team: 'U16 Academy',
                    riskLevel: 'HIGH',
                    riskDrivers: ['3 matches in 4 days', 'travel fatigue'],
                    adjustment: 'Reduce high intensity training before tournament.'
                  })}
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">Mar 14</td>
                  <td className="px-6 py-4 font-medium">Regional Tournament</td>
                  <td className="px-6 py-4 text-white/60">U16 Academy</td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-risk-red text-white">High</span>
                  </td>
                </tr>
                <tr 
                  onClick={() => setSelectedEvent({
                    name: 'Intensive Block',
                    team: 'U18 Elite',
                    riskLevel: 'MEDIUM',
                    riskDrivers: ['Double sessions', 'High volume'],
                    adjustment: 'Monitor recovery scores closely.'
                  })}
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">Mar 18</td>
                  <td className="px-6 py-4 font-medium">Intensive Block</td>
                  <td className="px-6 py-4 text-white/60">U18 Elite</td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-risk-yellow text-white">Medium</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Athlete Detail Modal */}
      <Modal
        isOpen={!!selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
        title="Athlete Risk Profile"
      >
        {selectedAthlete && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold">{selectedAthlete.athleteName}</h4>
                <p className="text-white/40">U16 Academy</p>
              </div>
              <div className="px-3 py-1 bg-risk-red/20 text-risk-red rounded-full text-xs font-bold uppercase tracking-wider">
                High Risk
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Injury Risk Type</p>
                <p className="text-sm font-semibold text-risk-red">Hamstring strain</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Load Spike</p>
                <p className="text-sm font-semibold text-risk-red">+42%</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold mb-3">Last 3 Training Loads</p>
              <div className="flex items-end gap-2 h-20">
                <div className="flex-1 bg-teal/20 rounded-t-lg" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-teal/40 rounded-t-lg" style={{ height: '75%' }}></div>
                <div className="flex-1 bg-risk-red/60 rounded-t-lg" style={{ height: '100%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-white/40">
                <span>MD-3</span>
                <span>MD-2</span>
                <span>MD-1</span>
              </div>
            </div>

            <div className="p-4 bg-teal/10 rounded-xl border border-teal/20">
              <p className="text-[10px] text-teal font-bold uppercase mb-2">Coaching Prescription</p>
              <p className="text-sm leading-relaxed">
                {selectedAthlete.recommendation}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Calendar Event Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Calendar Risk Detail"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold">{selectedEvent.name}</h4>
                <p className="text-white/40">{selectedEvent.team}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                selectedEvent.riskLevel === 'HIGH' ? "bg-risk-red/20 text-risk-red" : "bg-risk-yellow/20 text-risk-yellow"
              )}>
                {selectedEvent.riskLevel} Risk
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold mb-3">Risk Drivers</p>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.riskDrivers.map((driver: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs">
                    {driver}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-risk-yellow/10 rounded-xl border border-risk-yellow/20">
              <p className="text-[10px] text-risk-yellow font-bold uppercase mb-2">Suggested Load Adjustment</p>
              <p className="text-sm leading-relaxed">
                {selectedEvent.adjustment}
              </p>
            </div>

            <button 
              onClick={() => setSelectedEvent(null)}
              className="w-full py-3 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors"
            >
              Acknowledge Risk
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, color = "text-white", onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-card p-4 md:p-6 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-teal/10 rounded-lg group-hover:bg-teal/20 transition-colors">
          <Icon className="text-teal" size={18} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] md:text-xs font-bold",
          trend === 'up' ? "text-risk-green" : trend === 'down' ? "text-risk-red" : "text-white/40"
        )}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
          {change}
        </div>
      </div>
      <h4 className="text-white/40 text-[10px] md:text-xs font-medium uppercase tracking-widest mb-1">{title}</h4>
      <p className={cn("text-2xl md:text-3xl font-bold tracking-tight transition-colors", color)}>{value}</p>
    </motion.div>
  );
}
