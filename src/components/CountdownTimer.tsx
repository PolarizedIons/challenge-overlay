import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EventSystem } from '../event-system/EventSystem';
import { countdownTimer } from '../state/CountdownState';
import { settings } from '../state/SettingsState';

export const CountdownTimer: FC = () => {
  const countingTowards = countdownTimer.use();
  const countdownDuration = settings.use((value) => value.countdownDurationSec);

  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const now = new Date().getTime();
    const diff = countingTowards - now;
    const progress = diff / (countdownDuration * 1000);
    const width = window.innerWidth * progress;
    const text = Math.round(countdownDuration * progress);

    ref.current.style.width = `${width}px`;
    setText(`${text}`);
  }, [countingTowards, countdownDuration]);

  useEffect(() => {
    const handler = () => {
      const now = new Date().getTime();
      if (countingTowards < now) {
        if (countingTowards > 0) EventSystem.fireEvent('round-end', null);
        if (ref.current) ref.current.style.width = '0px';
        return;
      }

      update();
      requestAnimationFrame(handler);
    };

    requestAnimationFrame(handler);
  }, [update, countingTowards]);

  return (
    <>
      <div ref={ref} className="bg-red-600 h-[48px] w-full" />
      <div className="absolute top-0 left-0 right-0 text-center text-4xl">
        {text}
      </div>
    </>
  );
};
