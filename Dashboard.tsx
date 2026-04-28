
import React, { useState, useEffect, useMemo } from 'react';
import { User, Block, Room } from '../types';
import { BLOCKS } from '../data';
import MapDisplay from './MapDisplay';
import { getFacilityInfo } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredBlocks = useMemo(() => {
    return BLOCKS.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredRooms = useMemo(() => {
    const allRooms: (Room & { blockName: string })[] = [];
    BLOCKS.forEach(b => {
      b.rooms.forEach(r => {
        if (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase())) {
          allRooms.push({ ...r, blockName: b.name });
        }
      });
    });
    return allRooms;
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        const info = await getFacilityInfo(searchQuery);
        setAiInsight(info);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectBlock = (block: Block) => {
    setSelectedBlock(block);
    setSelectedRoom(null);
    setSearchQuery(block.name);
    setIsDropdownOpen(false);
  };

  const handleSelectRoom = (room: Room, blockName: string) => {
    const parentBlock = BLOCKS.find(b => b.name === blockName);
    setSelectedBlock(parentBlock || null);
    setSelectedRoom(room);
    setSearchQuery(room.name);
    setIsDropdownOpen(false);
  };

  const targetCoordinates = useMemo(() => {
    if (!selectedRoom && !selectedBlock) return null;
    return selectedRoom ? selectedRoom.coordinates : { 
      x: (selectedBlock?.coordinates.x || 0) + (selectedBlock?.dimensions.width || 0) / 2,
      y: (selectedBlock?.coordinates.y || 0) + (selectedBlock?.dimensions.height || 0) / 2
    };
  }, [selectedRoom, selectedBlock]);

  const navigationSteps = useMemo(() => {
    if (!targetCoordinates) return [];
    
    // Independent steps for Indoor Stadium
    if (selectedBlock?.id === 'indoor-stadium' || (selectedRoom && selectedRoom.id.startsWith('ST'))) {
      return [
        { text: "Start at the Entrance.", icon: "start" },
        { text: "Go straight for 10 meters, then turn Right.", icon: "right" },
        { text: "Walk past the Day Block towards the GB area.", icon: "up" },
        { text: "Follow the specialized sports path to the Stadium.", icon: "up" },
        { text: `Arrive at the Indoor Stadium.`, icon: "finish" }
      ];
    }

    const steps = [
      { text: "Start at the Entrance.", icon: "start" },
      { text: "Go straight for 10 meters to the main intersection.", icon: "up" }
    ];

    if (targetCoordinates.x > 350) {
      steps.push({ text: "Turn Right and proceed towards the Day Block area.", icon: "right" });
    } else if (targetCoordinates.x < 250) {
      steps.push({ text: "Turn Left towards the IT and Smart Blocks area.", icon: "left" });
    } else {
      steps.push({ text: "Continue straight along the main pathway.", icon: "up" });
    }

    steps.push({ 
      text: `Arrive at ${selectedRoom ? selectedRoom.name : selectedBlock?.name}.`, 
      icon: "finish" 
    });

    return steps;
  }, [targetCoordinates, selectedRoom, selectedBlock]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* V-Map Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
            <span className="text-white text-2xl font-black italic">V</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">V-Map</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Smart Navigation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
             <p className="text-sm font-bold text-slate-800">{user.username}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase">Campus User</p>
          </div>
          <button className="relative p-0.5 rounded-full border-2 border-indigo-100 hover:border-indigo-500 transition-all duration-300">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-100">
               <svg className="w-2 h-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
               </svg>
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search Campus
            </h2>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find IT, Day, GB Block..." 
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 transition-all text-slate-700 font-bold outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />

              {isDropdownOpen && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-[300px] overflow-y-auto p-2">
                  {filteredBlocks.map(block => (
                    <div 
                      key={block.id}
                      onClick={() => handleSelectBlock(block)}
                      className="px-4 py-3 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <span className="font-bold text-slate-700">{block.name}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-600 font-black px-2 py-1 rounded-md uppercase">Block</span>
                    </div>
                  ))}
                  {filteredRooms.map(room => (
                    <div 
                      key={room.id}
                      onClick={() => handleSelectRoom(room, room.blockName)}
                      className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-700">{room.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{room.blockName}</div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-1 rounded-md uppercase">Room</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {aiInsight && (
              <div className="mt-6 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">✨ AI Guide</p>
                <p className="text-sm text-indigo-900 font-medium italic">"{aiInsight}"</p>
              </div>
            )}
          </div>

          {/* Quick Shortcuts / Key Locations */}
          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Key Locations</h3>
             <div className="grid grid-cols-1 gap-2">
               {BLOCKS.filter(b => b.category === 'Academic' || b.id === 'indoor-stadium').map(block => (
                 <button
                   key={block.id}
                   onClick={() => handleSelectBlock(block)}
                   className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      selectedBlock?.id === block.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-white text-slate-600 hover:border-indigo-100'
                   }`}
                 >
                   <span className="font-bold text-sm">{block.name}</span>
                   <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                 </button>
               ))}
             </div>
          </div>

          {/* Navigational Directions Section - Repositioned alongside Key Locations */}
          {targetCoordinates && (
            <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-left-4 duration-500">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.106-1.789L9 2l5 2.5L20 2v8.618a2 2 0 01-1.106 1.789L14 15l-5 5z" /></svg>
                Navigation Guide
              </h3>
              <div className="space-y-6">
                {navigationSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                        step.icon === 'start' ? 'bg-emerald-500 ring-4 ring-emerald-50' : 
                        step.icon === 'finish' ? 'bg-red-500 ring-4 ring-red-50' : 'bg-indigo-500'
                      }`} />
                      {idx !== navigationSteps.length - 1 && (
                        <div className="w-0.5 h-10 bg-slate-100 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-snug font-bold ${idx === navigationSteps.length - 1 ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.text}
                      </p>
                      <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight mt-1">
                        {step.icon === 'start' ? 'Departure' : step.icon === 'finish' ? 'Arrival' : 'Step ' + (idx + 1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <MapDisplay blocks={BLOCKS} selectedRoom={selectedRoom} selectedBlock={selectedBlock} />
          
          {/* Detailed Info Card */}
          {(selectedBlock || selectedRoom) && (
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {selectedRoom ? selectedRoom.name : selectedBlock?.name}
                  </h2>
                  <p className="text-lg text-slate-400 font-medium">
                    {selectedRoom ? `Inside ${selectedBlock?.name}` : selectedBlock?.description}
                  </p>
                </div>
                {selectedRoom && (
                  <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <span className="text-[10px] font-black opacity-75 uppercase tracking-widest block">Room ID</span>
                    <span className="text-2xl font-black">{selectedRoom.id}</span>
                  </div>
                )}
              </div>

              {selectedRoom ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Floor</p>
                     <p className="text-xl font-black text-slate-800">{selectedRoom.floor} Floor</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead</p>
                     <p className="text-xl font-black text-slate-800">{selectedRoom.inCharge}</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                     <p className="text-xl font-black text-slate-800">{selectedRoom.type}</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBlock?.rooms.map(room => (
                    <div 
                      key={room.id}
                      onClick={() => handleSelectRoom(room, selectedBlock.name)}
                      className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-300 hover:bg-white cursor-pointer transition-all flex items-center justify-between"
                    >
                      <p className="font-black text-slate-800">{room.name}</p>
                      <span className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm text-xs font-bold">Details →</span>
                    </div>
                  ))}
                  {selectedBlock?.rooms.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-slate-400 font-bold italic bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                       No interior rooms defined for this area.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="p-8 text-center opacity-50">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          V-Map Navigation System &bull; &copy; 2024
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
