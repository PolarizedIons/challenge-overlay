import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { App } from "./App";
import { TwitchProvider } from "./providers/TwitchProvider";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <TwitchProvider />
    <App />
  </StrictMode>
);
