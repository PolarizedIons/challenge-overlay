import { FC, useEffect, useState } from 'react';
import { CountdownTimer } from './components/CountdownTimer';
import { EventSystem } from './event-system/EventSystem';
import { startCountdownTimer } from './state/CountdownState';
import { settings } from './state/SettingsState';

export const App: FC = () => {
  const [waiting, setWaiting] = useState(true);
  const breakBetweenRounds = settings.use(
    (value) => value.breakBetweenRoundsSec,
  );

  useEffect(() => {
    if (!waiting) {
      startCountdownTimer();
    }
  }, [waiting]);

  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        startCountdownTimer();
      }, breakBetweenRounds * 1000);
    };

    EventSystem.listen('round-end', handler);

    return () => EventSystem.stopListening('round-end', handler);
  }, [breakBetweenRounds]);

  if (waiting) {
    return (
      <div
        onClick={() => setWaiting(false)}
        className="flex justify-center items-center w-full min-h-screen text-white text-shadow text-4xl"
      >
        Click to start Challenge
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-white text-shadow">
      <CountdownTimer />
    </div>
  );
};
