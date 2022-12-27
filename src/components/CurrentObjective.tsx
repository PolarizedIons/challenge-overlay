import { FC } from "react";
import { votes } from "../state/VotesState";

export const CurrentObjective: FC = () => {
  const winningOption = votes.use((value) => value.winningOption);

  return (
    <div className="absolute top-[64px] left-4">
      <div className="text-2xl">Current Objective:</div>
      <div className="text-4xl max-w-[400px]">{winningOption || "none"}</div>
    </div>
  );
};
