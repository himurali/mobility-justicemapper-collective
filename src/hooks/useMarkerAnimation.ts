
import { useRef } from 'react';
import { getCategoryColor, getSeverityColor } from '@/utils/mapUtils';

type MarkerElements = { [key: string]: HTMLElement };

export function useMarkerAnimation() {
  const blinkIntervalRef = useRef<number | null>(null);
  
  const stopBlinking = (markerElements: MarkerElements, selectedIssue: string | undefined) => {
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    Object.entries(markerElements).forEach(([issueId, element]) => {
      if (!element) return;
      
      const issue = element.getAttribute('data-category');
      const severity = element.getAttribute('data-severity');
      
      if (!issue || !severity) return;
      
      const isSelected = issueId === selectedIssue;
      const scale = isSelected ? 'scale-150' : '';
      const borderWidth = isSelected ? 'border-3' : 'border-2';
      
      element.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg ${borderWidth} ${scale} transition-transform duration-300" 
             style="border-color: ${getCategoryColor(issue)}">
          <div class="w-5 h-5 rounded-full" 
               style="background-color: ${getSeverityColor(severity)}"></div>
        </div>
      `;
    });
  };

  const startBlinking = (issueId: string, markerElements: MarkerElements) => {
    if (!markerElements[issueId]) return;
    
    const element = markerElements[issueId];
    const category = element.getAttribute('data-category') || 'other';
    const severity = element.getAttribute('data-severity') || 'minor';
    
    const color = getCategoryColor(category);
    const severityColor = getSeverityColor(severity);
    let isLarge = true;
    
    blinkIntervalRef.current = window.setInterval(() => {
      if (!markerElements[issueId]) return;
      
      isLarge = !isLarge;
      const scale = isLarge ? 'scale-150' : 'scale-125';
      const glow = isLarge ? `box-shadow: 0 0 10px ${color}, 0 0 20px ${color}` : '';
      
      markerElements[issueId].innerHTML = `
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-3 ${scale} transition-transform duration-300" 
             style="border-color: ${color}; ${glow}">
          <div class="w-5 h-5 rounded-full" 
               style="background-color: ${severityColor}"></div>
        </div>
      `;
    }, 500);
  };
  
  return { stopBlinking, startBlinking, blinkIntervalRef };
}
