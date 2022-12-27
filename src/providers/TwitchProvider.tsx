import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { settings } from "../state/SettingsState";
import { addVoter, votes } from "../state/VotesState";
import tmi, { ChatUserstate } from "tmi.js";
import { EventSystem } from "../event-system/EventSystem";

export const TwitchProvider: FC<PropsWithChildren> = ({ children }) => {
  const channel = settings.use((value) => value.twitchChannel);
  const numberOptions = settings.use((value) => value.numberOptions);
  const voteCommand = settings.use((value) => value.voteCommand);
  const usingAltVoteNumbers = votes.use((value) => value.altVoteNumbers);
  const roundBusy = useRef(true);

  useEffect(() => {
    const startHandler = () => {
      roundBusy.current = true;
    };

    const endHandler = () => {
      roundBusy.current = false;
    };

    EventSystem.listen("round-start", startHandler);
    EventSystem.listen("round-end", endHandler);

    return () => {
      EventSystem.stopListening("round-start", startHandler);
      EventSystem.stopListening("round-end", endHandler);
    };
  }, []);

  const [tmiClient] = useState(() => {
    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect();

    return client;
  });

  const validOptions = useMemo(() => {
    return new Array(numberOptions)
      .fill(0)
      .map((_, i) => i + (usingAltVoteNumbers ? numberOptions + 1 : 1));
  }, [numberOptions, usingAltVoteNumbers]);

  const validateVote = useCallback(
    (vote: number) => {
      return roundBusy.current && validOptions.includes(vote);
    },
    [validOptions]
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
