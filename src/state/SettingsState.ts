import { entity } from "simpler-state";
import { urlPersistence } from "./UrlStorage";

const defaultSettings = {
  countdownDurationSec: 30,
  breakBetweenRoundsSec: 3,
  twitchChannel: "portalrunner",
  voteCommand: "!vote",
  options: [
    "Do thing A",
    "Do thing B",
    "Avoid thing C",
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
