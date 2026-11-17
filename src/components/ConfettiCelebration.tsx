'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger?: boolean;
}

export function ConfettiCelebration({ trigger = true }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    // First burst: Festive Red, Gold, Green, and White
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#DA291C', '#FBBF24', '#166534', '#FFFFFF', '#F59E0B'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return null;
}
