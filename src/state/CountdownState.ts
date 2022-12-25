import { entity } from 'simpler-state';
import { settings } from './SettingsState';

export const countdownTimer = entity(-1);

export const startCountdownTimer = () => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + settings.get().countdownDurationSec);
  countdownTimer.set(now.getTime());
};
