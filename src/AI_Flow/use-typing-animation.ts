import { useState, useEffect, useRef } from 'react';

const QUERIES = [
  'Direct trip from New York to Boston, tomorrow after 10 am, 2 people',
  'Night trip from Chicago to Nashville, at July 12, arriving no later than 6 am',
  'Cheapest round trip from Los Angeles to Phoenix July 10-20',
];


const TYPING_MS = 50;
const DELETING_MS = 30;
const PAUSE_AFTER_TYPED_MS = 2000;
const PAUSE_AFTER_DELETED_MS = 500;

export function useTypingAnimation(paused = false): string {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [displayed, setDisplayed] = useState(prefersReducedMotion ? QUERIES[0] : '');
  const queryIndex = useRef(0);
  const charIndex = useRef(0);
  const phase = useRef<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing');
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;

    const tick = () => {
      const query = QUERIES[queryIndex.current];

      if (phase.current === 'typing') {
        charIndex.current += 1;
        setDisplayed(query.slice(0, charIndex.current));
        if (charIndex.current >= query.length) {
          phase.current = 'pausing';
          timeoutId.current = setTimeout(tick, PAUSE_AFTER_TYPED_MS);
        } else {
          timeoutId.current = setTimeout(tick, TYPING_MS);
        }
      } else if (phase.current === 'pausing') {
        phase.current = 'deleting';
        timeoutId.current = setTimeout(tick, DELETING_MS);
      } else if (phase.current === 'deleting') {
        charIndex.current -= 1;
        setDisplayed(query.slice(0, charIndex.current));
        if (charIndex.current <= 0) {
          phase.current = 'waiting';
          timeoutId.current = setTimeout(tick, PAUSE_AFTER_DELETED_MS);
        } else {
          timeoutId.current = setTimeout(tick, DELETING_MS);
        }
      } else {
        queryIndex.current = (queryIndex.current + 1) % QUERIES.length;
        charIndex.current = 0;
        phase.current = 'typing';
        timeoutId.current = setTimeout(tick, TYPING_MS);
      }
    };

    timeoutId.current = setTimeout(tick, TYPING_MS);

    return () => {
      if (timeoutId.current !== null) clearTimeout(timeoutId.current);
    };
  }, [prefersReducedMotion, paused]);

  return displayed;
}
