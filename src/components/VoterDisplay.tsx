import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { settings } from '../state/SettingsState';
import { votes } from '../state/VotesState';
import tmi, { ChatUserstate } from 'tmi.js';
import { EventSystem } from '../event-system/EventSystem';

const Voter: FC<{ name: string }> = ({ name }) => {
  return <div>{name}</div>;
};

export const VoterDisplay: FC = () => {
  const [voters, setVoters] = useState<string[]>([]);
  const channel = settings.use((value) => value.twitchChannel);
  const voteCommand = settings.use((value) => value.voteCommand);
  const usingAltVoteNumbers = votes.use((value) => value.altVoteNumbers);

  const [tmiClient] = useState(
    () =>
      new tmi.Client({
        channels: [channel],
      }),
  );

  const validateVote = useCallback(
    (vote: number) => {
      return usingAltVoteNumbers
        ? [5, 6, 7, 8].includes(vote)
        : [1, 2, 3, 4].includes(vote);
    },
    [usingAltVoteNumbers],
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

      const name = tags['display-name']!;
      EventSystem.fireEvent('person-voted', { name, vote });
      setVoters((prev) => [...prev, name]);
    },
    [],
  );

  useEffect(() => {
    tmiClient.connect();

    tmiClient.on('chat', onChat);

    return () => {
      tmiClient.removeAllListeners();
      tmiClient.disconnect();
    };
  }, [onChat]);

  return (
    <div className="absolute bottom-0 right-0">
      {voters.map((name) => (
        <Voter key={name} name={name} />
      ))}
    </div>
  );
};
