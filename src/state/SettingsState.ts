import { entity } from 'simpler-state';
import { urlPersistence } from './UrlStorage';

const defaultSettings = {
  countdownDurationSec: 30,
  breakBetweenRoundsSec: 3,
  twitchChannel: 'portalrunner',
  voteCommand: '!vote',
};

export const settings = entity(defaultSettings, [urlPersistence('settings')]);

if (!window.location.search) {
  settings.set(defaultSettings);
}
