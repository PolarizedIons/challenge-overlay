import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { settings } from "../state/SettingsState";
import { addVoter, votes } from "../state/VotesState";
import tmi, { ChatUserstate } from "tmi.js";
import { EventSystem } from "../event-system/EventSystem";

export const TwitchProvider: FC<PropsWithChildren> = ({ children }) => {
  const channel = settings.use((value) => value.twitchChannel);
  const voteCommand = settings.use((value) => value.voteCommand);
  const usingAltVoteNumbers = votes.use((value) => value.altVoteNumbers);

  const [tmiClient] = useState(() => {
    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect();

    return client;
  });

  const validateVote = useCallback(
    (vote: number) => {
      return usingAltVoteNumbers
        ? [5, 6, 7, 8].includes(vote)
        : [1, 2, 3, 4].includes(vote);
    },
    [usingAltVoteNumbers]
  );

  const onChat = useCallback(
    (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
      if (!message.startsWith(voteCommand)) {
        return;
      }

      const voteForRaw = message.substring(voteCommand.length).trim();
      if (!/[0-9]/.test(voteForRaw)) {
        return;
      }

      const vote = parseInt(voteForRaw, 10);
      if (!validateVote(vote)) {
        return;
      }

      const name = tags["display-name"]!;
      EventSystem.fireEvent("person-voted", { name, vote });
      addVoter(name, vote);
    },
    [validateVote]
  );

  useEffect(() => {
    tmiClient.on("chat", onChat);

    return () => {
      tmiClient.removeAllListeners();
    };
  }, [onChat]);

  return <>{children}</>;
};
