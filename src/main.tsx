import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/ibm-plex-sans";
import "./index.css";
import Router from "./Router";

const temaGuardado = localStorage.getItem("tema-aljibe");
document.documentElement.dataset.theme =
  temaGuardado === "light" ? "light" : "dark";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
