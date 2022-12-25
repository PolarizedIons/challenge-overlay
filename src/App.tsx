import type { FC } from 'react';
import { CountdownTimer } from './components/CountdownTimer';
import { startCountdownTimer } from './state/CountdownState';

export const App: FC = () => {
  return (
    <div
      className="bg-slate-900 w-full min-h-screen text-white"
      onClick={() => startCountdownTimer()}
    >
      <CountdownTimer />
    </div>
  );
};
