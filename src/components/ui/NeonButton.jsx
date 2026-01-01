import React from "react";
import { THEME } from "./theme";

const NeonButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`${THEME.cyanBg} text-black font-bold py-2 px-4 rounded-xl active:scale-95 transition-all shadow-lg ${className}`}
  >
    {children}
  </button>
);

export default NeonButton;
