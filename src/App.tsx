import { FC, useEffect, useState } from "react";
import { CountdownTimer } from "./components/CountdownTimer";
import { VoteOptions } from "./components/VoteOptions";
import { VoterDisplay } from "./components/VoterDisplay";
import { EventSystem } from "./event-system/EventSystem";
import { TwitchProvider } from "./providers/TwitchProvider";
import { startCountdownTimer } from "./state/CountdownState";
import { settings } from "./state/SettingsState";
import { resetVotes } from "./state/VotesState";

export const App: FC = () => {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (!waiting) {
      startCountdownTimer();
    }
  }, [waiting]);

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
      <VoteOptions />
      <VoterDisplay />
    </div>
  );
};
