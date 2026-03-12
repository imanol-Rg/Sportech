/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Library, 
  Search, 
  Clock, 
  Zap, 
  Play, 
  ExternalLink,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { MOCK_PRESCRIPTIONS, MOCK_ATHLETES } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../components/Modal';
import { cn } from '../utils/cn';

const INITIAL_PROTOCOLS = [
  ...MOCK_PRESCRIPTIONS.map(p => ({
    ...p,
    instructions: p.id === 'p2' ? [
      '1. 3 minutes cold immersion',
      '2. 1 minute hot immersion',
      '3. Repeat 5 cycles',
      '4. Finish with cold exposure'
    ] : ['Follow standard recovery guidelines for this protocol.'],
    videoUrl: p.id === 'p2' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined
  })),
  {
    id: 'p3',
    title: 'Optimal Sleep Hygiene',
    category: 'SLEEP',
    duration: '8-10 hrs',
    intensity: 'LOW',
    description: 'Pre-sleep routine including blue light reduction and temperature control.',
    instructions: [
      'Stop using electronic devices 60 minutes before bed.',
      'Maintain room temperature between 18-20°C.',
      'Avoid caffeine after 2 PM.',
      'Ensure total darkness in the sleeping area.'
    ]
  },
  {
    id: 'p4',
    title: 'Post-Match Nutrition',
    category: 'NUTRITION',
    duration: '30 min',
    intensity: 'LOW',
    description: 'The 3 Rs: Rehydrate, Refuel, and Repair. Specific macro targets.',
    instructions: [
      'Rehydrate: Drink 1.5L of fluid for every kg of body mass lost.',
      'Refuel: Consume 1.2g of carbohydrates per kg of body mass.',
      'Repair: Consume 20-30g of high-quality protein.',
      'Avoid alcohol for 24 hours post-match.'
    ]
  }
];

export function PrescriptionLibrary() {
  const categories = ['ALL', 'MOBILITY', 'HYDRO', 'NUTRITION', 'SLEEP'];
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [protocols, setProtocols] = React.useState(INITIAL_PROTOCOLS);
  
  // Modals state
  const [selectedProtocol, setSelectedProtocol] = React.useState<any>(null);
  const [assigningProtocol, setAssigningProtocol] = React.useState<any>(null);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);
  const [isAddingProtocol, setIsAddingProtocol] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  // Filter logic
  const filteredProtocols = protocols.filter(p => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProtocol = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProtocol = {
      id: `p${Date.now()}`,
      title: formData.get('title') as string,
      category: formData.get('category') as any,
      description: formData.get('description') as string,
      duration: formData.get('duration') as string,
      intensity: formData.get('intensity') as string,
      instructions: ['New protocol instructions.'],
      videoUrl: formData.get('videoUrl') as string || undefined
    };
    setProtocols([newProtocol, ...protocols]);
    setIsAddingProtocol(false);
  };

  const handleAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAssigningProtocol(null);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Recovery Prescription Library</h2>
          <p className="text-sm md:text-base text-white/60">Evidence-based recovery protocols for elite athletes.</p>
        </div>
        <button 
          onClick={() => setIsAddingProtocol(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors w-full md:w-auto"
        >
          <Plus size={18} />
          Add Protocol
        </button>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search protocols..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal/50 w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-teal text-navy' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProtocols.length > 0 ? (
          filteredProtocols.map((p) => (
            <ProtocolCard 
              key={p.id}
              protocol={p}
              onOpen={() => setSelectedProtocol(p)}
              onAssign={() => setAssigningProtocol(p)}
              onPlay={() => setPlayingVideo((p as any).videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ')}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 italic">
            No protocols found.
          </div>
        )}
      </div>

      {/* Confirmation Toast */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-teal text-navy px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={20} />
            Protocol successfully assigned.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
        title="Protocol Details"
      >
        {selectedProtocol && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedProtocol.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/20">
                  {selectedProtocol.category}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs text-white/60 justify-end">
                  <Clock size={14} className="text-teal" />
                  {selectedProtocol.duration}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/60 justify-end">
                  <Zap size={14} className="text-teal" />
                  {selectedProtocol.intensity} Intensity
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Description</h4>
              <p className="text-sm text-white/80 leading-relaxed">{selectedProtocol.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Instructions</h4>
              <ul className="space-y-2">
                {selectedProtocol.instructions?.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => {
                  setAssigningProtocol(selectedProtocol);
                  setSelectedProtocol(null);
                }}
                className="flex-1 py-3 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors"
              >
                Assign to Squad
              </button>
              <button 
                onClick={() => setSelectedProtocol(null)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={!!assigningProtocol}
        onClose={() => setAssigningProtocol(null)}
        title="Assign Protocol"
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Select Athlete or Squad</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50">
              <option value="squad">U16 Academy (Full Squad)</option>
              <option value="u18">U18 Elite (Full Squad)</option>
              {MOCK_ATHLETES.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Start Date</label>
            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Optional Notes</label>
            <textarea 
              placeholder="Add specific instructions for this assignment..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50 min-h-[100px]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors">
              Assign Protocol
            </button>
            <button type="button" onClick={() => setAssigningProtocol(null)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Video Modal */}
      <Modal
        isOpen={!!playingVideo}
        onClose={() => setPlayingVideo(null)}
        title="Protocol Video"
      >
        <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
          {playingVideo && (
            <iframe 
              src={playingVideo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <button 
          onClick={() => setPlayingVideo(null)}
          className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
        >
          Close
        </button>
      </Modal>

      {/* Add Protocol Modal */}
      <Modal
        isOpen={isAddingProtocol}
        onClose={() => setIsAddingProtocol(false)}
        title="Create New Protocol"
      >
        <form onSubmit={handleAddProtocol} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Protocol Name</label>
            <input name="title" required type="text" placeholder="e.g. Advanced Foam Rolling" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</label>
              <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50">
                <option value="MOBILITY">Mobility</option>
                <option value="HYDRO">Hydro</option>
                <option value="NUTRITION">Nutrition</option>
                <option value="SLEEP">Sleep</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Intensity</label>
              <select name="intensity" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description</label>
            <textarea name="description" required placeholder="Brief overview of the protocol..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50 min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Duration</label>
              <input name="duration" required type="text" placeholder="e.g. 15 min" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Video Link (Optional)</label>
              <input name="videoUrl" type="text" placeholder="YouTube/Vimeo URL" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-teal text-navy font-bold rounded-xl hover:bg-teal/90 transition-colors">
              Save Protocol
            </button>
            <button type="button" onClick={() => setIsAddingProtocol(false)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProtocolCard({ protocol, onOpen, onAssign, onPlay }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden flex flex-col"
    >
      <div 
        onClick={onOpen}
        className="h-40 bg-white/5 relative group cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="w-12 h-12 bg-teal rounded-full flex items-center justify-center text-navy shadow-lg hover:scale-110 transition-transform"
          >
            <Play size={24} fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-teal/20 text-teal text-[10px] font-bold rounded uppercase tracking-widest border border-teal/30">
            {protocol.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 cursor-pointer hover:text-teal transition-colors" onClick={onOpen}>{protocol.title}</h3>
        <p className="text-sm text-white/60 mb-6 flex-1">{protocol.description}</p>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Clock size={14} className="text-teal" />
              {protocol.duration}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Zap size={14} className="text-teal" />
              {protocol.intensity}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onAssign}
            className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Assign to Squad
          </button>
          <button 
            onClick={onOpen}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-teal transition-colors"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
