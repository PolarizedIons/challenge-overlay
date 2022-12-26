import { entity } from 'simpler-state';

export const votes = entity({
  altVoteNumbers: false,
  values: {} as Record<string, number>,
});
