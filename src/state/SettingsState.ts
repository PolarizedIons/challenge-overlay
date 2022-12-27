import { entity } from "simpler-state";
import { urlPersistence } from "./UrlStorage";

const defaultSettings = {
  countdownDurationSec: 30,
  breakBetweenRoundsSec: 3,
  twitchChannel: "polarizedions",
  voteCommand: "!vote",
  numberOptions: 4,
  options: [
    "Do a flip",
    "Pushups time",
    "Avoid saying a swear word for 3 mins",
    "Pet Cat",
    "Avoid death",
    "Kill Glados",
    "Kill Wheatley",
    "Shoot the moon",
    "Portal here portal there throw a turret in the air",
    "Play a diffrent game",
    "I'm in your walls",
    "100 Gift subs",
  ],
};

export const settings = entity(defaultSettings, [urlPersistence("settings")]);

if (!window.location.search) {
  settings.set(defaultSettings);
}
