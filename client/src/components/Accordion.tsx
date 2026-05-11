import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedIds);
    
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      if (!allowMultiple) {
        newExpanded.clear();
      }
      newExpanded.add(id);
    }
    
    setExpandedIds(newExpanded);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id);
        
        return (
          <div
            key={item.id}
            className="border border-stone-700 rounded-lg overflow-hidden bg-stone-800"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-700 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-amber-400">
                {item.title}
              </h3>
              <ChevronDown
                size={24}
                className={`text-amber-400 transition-transform duration-300 flex-shrink-0 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className="border-t border-stone-700 px-6 py-4 bg-stone-800/50">
                <div className="text-stone-300 space-y-4">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
