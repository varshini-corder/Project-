
import React, { useMemo } from 'react';
import { Block, Room } from '../types';

interface MapDisplayProps {
  blocks: Block[];
  selectedRoom: Room | null;
  selectedBlock: Block | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ blocks, selectedRoom, selectedBlock }) => {
  const entrance = { x: 300, y: 580 };

  const target = useMemo(() => {
    if (!selectedRoom && !selectedBlock) return null;
    return selectedRoom ? selectedRoom.coordinates : { 
      x: (selectedBlock?.coordinates.x || 0) + (selectedBlock?.dimensions.width || 0) / 2,
      y: (selectedBlock?.coordinates.y || 0) + (selectedBlock?.dimensions.height || 0) / 2
    };
  }, [selectedRoom, selectedBlock]);

  const routePath = useMemo(() => {
    if (!target) return null;

    // Check if it's the Indoor Stadium for an independent path
    if (selectedBlock?.id === 'indoor-stadium' || (selectedRoom && selectedRoom.id.startsWith('ST'))) {
      return `M ${entrance.x} ${entrance.y} L 300 540 L 470 540 L 470 230 L ${target.x} ${target.y}`;
    }

    let path = `M ${entrance.x} ${entrance.y} `;
    
    // Straight from entrance to intersection (10m ~ 40px)
    path += `L 300 540 `;

    if (target.x > 350) {
      // Right turn for Day, Evening, GB
      path += `L 470 540 L 470 ${target.y} L ${target.x} ${target.y}`;
    } else if (target.x < 250) {
      // Left turn for IT, Smart, Autonomous, Media
      path += `L 130 540 L 130 ${target.y} L ${target.x} ${target.y}`;
    } else {
      // Straight for Auditorium or Garden
      path += `L 300 ${target.y} L ${target.x} ${target.y}`;
    }

    return path;
  }, [target, entrance, selectedBlock, selectedRoom]);

  return (
    <div className="relative w-full aspect-[1/1] bg-slate-50 border border-slate-200 rounded-[40px] overflow-hidden shadow-inner">
      <svg viewBox="0 0 600 600" className="w-full h-full select-none">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Pathways */}
        <path d="M 300 580 L 300 180" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M 130 540 L 470 540" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M 130 540 L 130 300" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M 470 540 L 470 300" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" fill="none" />

        {/* Entrance Marker */}
        <g transform={`translate(${entrance.x - 15}, ${entrance.y - 25})`}>
          <rect width="30" height="15" rx="5" fill="#10b981" />
          <text x="15" y="-6" textAnchor="middle" className="text-[10px] font-black fill-emerald-600">ENTRANCE</text>
        </g>

        {/* Blocks */}
        {blocks.map((block) => {
          const isHighlighted = selectedBlock?.id === block.id || block.rooms.some(r => r.id === selectedRoom?.id);
          const color = block.category === 'Academic' ? '#ffffff' : block.category === 'Administrative' ? '#fffbeb' : '#f0fdf4';
          
          return (
            <g key={block.id} className="transition-all duration-500">
              <rect
                x={block.coordinates.x}
                y={block.coordinates.y}
                width={block.dimensions.width}
                height={block.dimensions.height}
                rx="12"
                fill={color}
                stroke={isHighlighted ? '#4f46e5' : '#cbd5e1'}
                strokeWidth={isHighlighted ? '3' : '1.5'}
                className="shadow-sm"
              />
              <text
                x={block.coordinates.x + block.dimensions.width / 2}
                y={block.coordinates.y + block.dimensions.height / 2 + 4}
                textAnchor="middle"
                className={`text-[8px] font-black uppercase tracking-tighter ${isHighlighted ? 'fill-indigo-700' : 'fill-slate-500'}`}
              >
                {block.name}
              </text>
            </g>
          );
        })}

        {/* Animated Path */}
        {routePath && (
          <g>
            <path
              d={routePath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="4"
              strokeDasharray="10 5"
              className="animate-[dash_15s_linear_infinite]"
            />
            <circle cx={entrance.x} cy={entrance.y} r="5" fill="#10b981" />
            <circle 
              cx={selectedRoom ? selectedRoom.coordinates.x : (selectedBlock?.coordinates.x || 0) + (selectedBlock?.dimensions.width || 0)/2} 
              cy={selectedRoom ? selectedRoom.coordinates.y : (selectedBlock?.coordinates.y || 0) + (selectedBlock?.dimensions.height || 0)/2} 
              r="6" 
              fill="#ef4444" 
              className="animate-pulse" 
            />
          </g>
        )}
      </svg>
      
      {/* Minimal Direction Button Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <button className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 group transition-all hover:bg-white hover:scale-105 active:scale-95">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Directions</span>
        </button>
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -300; }
        }
      `}</style>
    </div>
  );
};

export default MapDisplay;
