/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Search,
  Download,
  ShieldAlert,
  Smartphone,
  Check
} from 'lucide-react';
import { MOCK_COMM_LOGS } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../components/Modal';
import { cn } from '../utils/cn';

// Extend the mock logs with some extra data for better demo
const EXTENDED_LOGS = [
  ...MOCK_COMM_LOGS,
  {
    id: 'l2',
    athleteId: '4',
    athleteName: 'David Okafor',
    parentName: 'Grace Okafor',
    status: 'READ',
    message: 'Urgent: David has entered RED status due to critical recovery deficit.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    method: 'App',
    confirmationStatus: 'Confirmed'
  },
  {
    id: 'l3',
    athleteId: '3',
    athleteName: 'Sarah Chen',
    parentName: 'Li Chen',
    status: 'DELIVERED',
    message: 'Caution: Sarah has entered YELLOW status. Ankle monitoring recommended.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    method: 'SMS',
    confirmationStatus: 'Delivered'
  }
].map(log => ({
  ...log,
  method: (log as any).method || 'Email',
  confirmationStatus: (log as any).confirmationStatus || 'Confirmed'
}));

export function ParentLogs() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = React.useState(false);
  const [complianceCheckState, setComplianceCheckState] = React.useState<'idle' | 'checking' | 'completed'>('idle');

  const filteredLogs = EXTENDED_LOGS.filter(log => 
    log.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['timestamp', 'athlete', 'parent', 'alert type', 'message content', 'delivery status'];
    const rows = EXTENDED_LOGS.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.athleteName,
      log.parentName,
      'Overload Alert',
      log.message.replace(/,/g, ';'), // Simple CSV escaping
      log.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'communication_audit_log.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runComplianceCheck = () => {
    setIsComplianceModalOpen(true);
    setComplianceCheckState('checking');
    setTimeout(() => {
      setComplianceCheckState('completed');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Parent Communication Log</h2>
          <p className="text-sm md:text-base text-white/60">Automated risk alerts and liability protection records.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm w-full sm:w-auto"
          >
            <Download size={18} />
            Export Audit Log
          </button>
          <button 
            onClick={runComplianceCheck}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors text-sm w-full sm:w-auto"
          >
            <ShieldCheck size={18} />
            Verify Compliance
          </button>
        </div>
      </header>

      {/* Compliance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-teal">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Alert Delivery Rate</p>
          <p className="text-3xl font-bold">100%</p>
          <div className="mt-2 flex items-center gap-1 text-teal text-xs">
            <CheckCircle2 size={14} />
            All RED status alerts delivered
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Avg. Response Time</p>
          <p className="text-3xl font-bold">14m</p>
          <div className="mt-2 flex items-center gap-1 text-white/40 text-xs">
            <Clock size={14} />
            From risk detection to alert
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Parent Read Rate</p>
          <p className="text-3xl font-bold">92%</p>
          <div className="mt-2 flex items-center gap-1 text-risk-green text-xs">
            <CheckCircle2 size={14} />
            High engagement on risk alerts
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold">Recent Communications</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Search by athlete or parent..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-teal/50 w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Athlete</th>
                <th className="px-6 py-4 font-medium">Parent</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Message Preview</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => setExpandedRowId(expandedRowId === log.id ? null : log.id)}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-white/40 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 font-bold">{log.athleteName}</td>
                      <td className="px-6 py-4 text-white/60">{log.parentName}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-risk-red font-bold text-[10px] uppercase">
                          <ShieldAlert size={12} />
                          Overload Alert
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-white/60">
                        {log.message}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${
                          log.status === 'READ' ? 'bg-teal/20 text-teal' : 'bg-white/10 text-white/40'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRowId === log.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-0 bg-white/[0.02]">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1 tracking-widest">Full Message Content</p>
                                    <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                      {log.message}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1 tracking-widest">Delivery Timestamp</p>
                                    <p className="text-sm font-medium">{new Date(log.timestamp).toLocaleString()}</p>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1 tracking-widest">Notification Method</p>
                                    <div className="flex items-center gap-2">
                                      {log.method === 'App' ? <Smartphone size={14} className="text-teal" /> : <Mail size={14} className="text-teal" />}
                                      <p className="text-sm font-medium">{log.method}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1 tracking-widest">Confirmation Status</p>
                                    <div className="flex items-center gap-2 text-teal">
                                      <CheckCircle2 size={14} />
                                      <p className="text-sm font-bold">{log.confirmationStatus}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 italic">
                    No communication records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        title="Compliance Verification"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              "All RED alerts delivered",
              "Parent notification within 15 minutes",
              "Communication records stored",
              "Liability audit trail complete"
            ].map((check, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: complianceCheckState === 'completed' || (complianceCheckState === 'checking' && idx === 0) ? 1 : 0.3, 
                  x: 0 
                }}
                transition={{ delay: idx * 0.3 }}
                className="flex items-center gap-3"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                  complianceCheckState === 'completed' ? "bg-teal text-navy" : "bg-white/10 text-white/20"
                )}>
                  {complianceCheckState === 'completed' ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                </div>
                <span className="text-sm font-medium">{check}</span>
              </motion.div>
            ))}
          </div>

          {complianceCheckState === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-teal/10 border border-teal/20 rounded-xl text-center"
            >
              <p className="text-teal font-bold text-sm">Club communication compliance verified.</p>
            </motion.div>
          )}

          <button
            onClick={() => setIsComplianceModalOpen(false)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Shield Info */}
      <div className="p-4 md:p-6 bg-navy border border-teal/30 rounded-2xl flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="p-3 bg-teal/10 rounded-2xl shrink-0">
          <ShieldCheck className="text-teal" size={32} />
        </div>
        <div>
          <h4 className="text-lg md:text-xl font-bold mb-2">Parent Communication Shield</h4>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-3xl">
            InjuryIQ automatically documents every risk alert sent to parents. This creates a tamper-proof audit trail 
            demonstrating the club's proactive duty of care. In the event of an injury, these logs serve as 
            evidence of professional load management and transparent communication.
          </p>
        </div>
      </div>
    </div>
  );
}
