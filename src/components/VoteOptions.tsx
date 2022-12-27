import { useTransition, animated } from "@react-spring/web";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EventSystem } from "../event-system/EventSystem";
import { startCountdownTimer } from "../state/CountdownState";
import { settings } from "../state/SettingsState";
import { resetVotes, setWinningOption, votes } from "../state/VotesState";
import { ObjectEntries, ObjectKeys } from "../Utils";

export const VoteOptions: FC = () => {
  const breakBetweenRounds = settings.use(
    (value) => value.breakBetweenRoundsSec
  );
  const numberOptions = settings.use((value) => value.numberOptions);
  const allVoteOptions = settings.use((value) => value.options);
  const [currentVoteOptions, setCurrentOptions] = useState<
    Record<number, string>
  >({});
  const currentVotesRaw = votes.use((value) => value.values);
  const usingAltNumbers = votes.use((value) => value.altVoteNumbers);

  const resetOptions = useCallback(() => {
    const optionsToChooseFrom = [...allVoteOptions];
    const newVoteOptions: Record<number, string> = {};

    for (let i = 0; i < numberOptions; i++) {
      newVoteOptions[i + (usingAltNumbers ? numberOptions + 1 : 1)] =
        optionsToChooseFrom.splice(
          Math.floor(Math.random() * optionsToChooseFrom.length),
          1
        )[0];
    }

    setCurrentOptions(newVoteOptions);
  }, [allVoteOptions, usingAltNumbers, numberOptions]);

  const currentVotes = useMemo(() => {
    return Object.values(currentVotesRaw).reduce((acc, curr) => {
      acc[curr] ? ++acc[curr] : (acc[curr] = 1);
      return acc;
    }, {} as Record<number, number>);
  }, [currentVotesRaw]);

  useEffect(() => {
    resetOptions();
  }, [resetOptions]);

  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        const maxVotes =
          Object.keys(currentVotes).length > 0
            ? Math.max(...Object.values(currentVotes))
            : 0;
        let winningOptionsIds = ObjectEntries(currentVotes)
          .filter(([_, votes]) => votes === maxVotes)
          .map(([id, _]) => id);
        if (winningOptionsIds.length === 0) {
          winningOptionsIds = ObjectKeys(currentVoteOptions);
        }
        const winningOptionId =
          winningOptionsIds[
            Math.floor(Math.random() * winningOptionsIds.length)
          ];
        setWinningOption(currentVoteOptions[winningOptionId]);

        resetVotes();
        resetOptions();

        setTimeout(() => {
          startCountdownTimer();
        }, (breakBetweenRounds / 2) * 1000);
      }, (breakBetweenRounds / 2) * 1000);
    };

    EventSystem.listen("round-end", handler);

    return () => EventSystem.stopListening("round-end", handler);
  }, [breakBetweenRounds, resetOptions, currentVotes, currentVoteOptions]);

  const totalVotes = useMemo(() => {
    return Object.values(currentVotes).reduce((prev, curr) => prev + curr, 0);
  }, [currentVotes]);

  const options = useMemo(() => {
    return ObjectEntries(currentVoteOptions).map(([id, option]) => ({
      id,
      option,
      votes:
        totalVotes === 0 ? 0 : ((currentVotes[id] || 0) / totalVotes) * 100,
    }));
  }, [currentVoteOptions, currentVotes, totalVotes]);

  const transitions = useTransition(options, {
    keys: (item) => item.id,
    exitBeforeEnter: true,
    from: { opacity: 0, transform: "translateX(300px)" },
    enter: {
      opacity: 1,
      transform: "translateX(0px)",
    },
    leave: {
      opacity: 0,
      transform: "translateX(+300px)",
    },
  });

  return (
    <div className="absolute top-[64px] right-0">
      {transitions((style, item) => (
        <animated.div
          className="w-[300px] relative bg-blue-300 py-2 px-4 my-2"
          style={style}
        >
          <animated.div
            className="absolute bg-blue-900 left-0 top-0 bottom-0 z-0 transition-all duration-300"
            style={{ width: item.votes + "%" }}
          />
          <span className="flex justify-between items-center gap-4 w-full z-10 relative">
            <span>#{item.id}</span> <span>{item.option}</span>
          </span>
        </animated.div>
      ))}
    </div>
  );
};
