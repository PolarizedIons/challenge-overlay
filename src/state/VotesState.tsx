import { entity } from "simpler-state";

export const votes = entity({
  altVoteNumbers: false,
  values: {} as Record<string, number>,
  winningOption: "",
});

export const addVoter = (name: string, option: number) => {
  votes.set((prev) => ({
    ...prev,
    values: { ...prev.values, [name]: option },
  }));
};

export const resetVotes = () => {
  votes.set((prev) => ({
    ...prev,
    altVoteNumbers: !prev.altVoteNumbers,
    values: {},
  }));
};

export const setWinningOption = (option: string) => {
  votes.set((prev) => ({ ...prev, winningOption: option }));
};
