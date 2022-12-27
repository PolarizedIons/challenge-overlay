import { FC, useEffect, useState } from "react";
import { EventSystem } from "../event-system/EventSystem";
import { Events } from "../event-system/Events";
import { useTransition, animated } from "@react-spring/web";

type VoteEvent = Events["person-voted"];
const MAX_SHOWN = 5;

export const VoterDisplay: FC = () => {
  const [voters, setVoters] = useState<VoteEvent[]>([]);
  const transitions = useTransition(voters, {
    from: { opacity: 0, height: "0px", transform: "translateY(10px)" },
    enter: { opacity: 1, height: "24px", transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-10px)" },
  });

  useEffect(() => {
    const handler = (event: VoteEvent) => {
      setVoters((prev) => [...prev, event].slice(-1 * MAX_SHOWN));
    };

    EventSystem.listen("person-voted", handler);

    return () => {
      EventSystem.stopListening("person-voted", handler);
    };
  }, []);

  return (
    <div className="absolute bottom-4 right-4">
      {transitions((style, item) => (
        <animated.div style={style}>
          <span className="text-blue-600">{item.name}</span> voted for{" "}
          <span className="text-blue-600">{item.vote}</span>
        </animated.div>
      ))}
    </div>
  );
};
