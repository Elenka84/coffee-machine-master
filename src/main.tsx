import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import siteBg from "@/assets/site-bg.png";

document.documentElement.style.setProperty("--site-bg-image", `url(${siteBg})`);

createRoot(document.getElementById("root")!).render(<App />);
