import { createRoot } from "react-dom/client";

import "./style.css";

// const div = document.createElement("div");
// div.id = "__root__applier";
// document.body.appendChild(div);

// const rootContainer = document.querySelector("#__root__applier");
// if (!rootContainer) throw new Error("Can't find Options root element");
// const root = createRoot(rootContainer);
// root.render(
//   <div className="font-sans absolute bottom-0 left-0 z-50 bg-amber-400 text-lg text-black">
//     content script loaded - applier
//   </div>,
// );

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
