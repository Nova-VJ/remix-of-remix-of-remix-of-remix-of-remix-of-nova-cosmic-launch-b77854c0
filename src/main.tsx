import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getLocale } from "./i18n";

document.documentElement.lang = getLocale();

createRoot(document.getElementById("root")!).render(<App />);
