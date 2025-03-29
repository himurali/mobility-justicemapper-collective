
import { useRef, useCallback } from 'react';
import { getCategoryColor, getSeverityColor } from '@/utils/mapUtils';

type MarkerElements = { [key: string]: HTMLElement };

export function useMarkerAnimation() {
  const blinkIntervalRef = useRef<number | null>(null);
  
  const stopBlinking = useCallback((markerElements: MarkerElements, selectedIssue: string | undefined) => {
    // Clear any existing animation interval
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    // Reset all markers to their default state
    Object.entries(markerElements).forEach(([issueId, element]) => {
      if (!element) return;
      
      const category = element.getAttribute('data-category');
      const severity = element.getAttribute('data-severity');
      
      if (!category || !severity) return;
      
      const isSelected = issueId === selectedIssue;
      const scale = isSelected ? 'scale-125' : '';
      const borderWidth = isSelected ? 'border-3' : 'border-2';
      const categoryColor = getCategoryColor(category);
      const severityColor = getSeverityColor(severity);
      
      const markerInner = element.querySelector('.marker-inner');
      if (markerInner) {
        markerInner.className = `w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg ${borderWidth} ${scale} transition-transform duration-300`;
        markerInner.setAttribute('style', `border-color: ${categoryColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: ${isSelected ? 30 : 10};`);
        
        const innerCircle = markerInner.querySelector('div');
        if (innerCircle) {
          innerCircle.setAttribute('style', `background-color: ${severityColor}`);
        }
      }
    });
  }, []);

  const startBlinking = useCallback((issueId: string, markerElements: MarkerElements) => {
    // Stop any existing animations first
    stopBlinking(markerElements, issueId);
    
    if (!markerElements[issueId]) {
      console.error("Element not found for issue:", issueId);
      return;
    }
    
    const element = markerElements[issueId];
    const category = element.getAttribute('data-category') || 'other';
    const severity = element.getAttribute('data-severity') || 'minor';
    
    const categoryColor = getCategoryColor(category);
    const severityColor = getSeverityColor(severity);
    let isLarge = true;
    
    // Start a new blink animation
    blinkIntervalRef.current = window.setInterval(() => {
      if (!markerElements[issueId]) {
        if (blinkIntervalRef.current) {
          window.clearInterval(blinkIntervalRef.current);
        }
        return;
      }
      
      isLarge = !isLarge;
      const scale = isLarge ? 'scale-150' : 'scale-125';
      const glow = isLarge ? `box-shadow: 0 0 10px ${categoryColor}, 0 0 20px ${categoryColor}` : '';
      
      const markerInner = markerElements[issueId].querySelector('.marker-inner');
      if (markerInner) {
        markerInner.className = `w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-3 ${scale} transition-transform duration-300`;
        markerInner.setAttribute('style', `border-color: ${categoryColor}; ${glow}; z-index: 30;`);
        
        const innerCircle = markerInner.querySelector('div');
        if (innerCircle) {
          innerCircle.setAttribute('style', `background-color: ${severityColor}`);
        }
      }
    }, 500);
  }, [stopBlinking]);
  
  return { stopBlinking, startBlinking, blinkIntervalRef };
}
