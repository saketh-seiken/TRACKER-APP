import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { THEME } from "../ui/theme";
import { getLocalISOString } from "../../utils/helpers";

const Journal = ({ globalDate }) => {
  const [text, setText] = useState("");
  const dateKey = getLocalISOString(globalDate);
  const [entries, setEntries] = useState({
    "2025-11-23": "Journal entry for specific date...",
  });

  useEffect(() => {
    setText(entries[dateKey] || "");
  }, [dateKey, entries]);

  const saveEntry = () => {
    setEntries((prev) => ({ ...prev, [dateKey]: text }));
  };

  return (
    <div className="fixed inset-0 top-120  px-4 flex flex-col z-10">
      <div
        className={`${THEME.card} flex-1 flex flex-col rounded-2xl relative overflow-hidden`}
      >
        <div className="p-3 bg-black/20 flex justify-between items-center">
          <span className="text-[10px] uppercase text-gray-500 tracking-widest">
            LOG • {globalDate.toDateString()}
          </span>
          <button onClick={saveEntry} className="text-green-500">
            <Save size={18} />
          </button>
        </div>
        <textarea
          className={`w-full flex-1 bg-transparent p-4 text-lg outline-none resize-none leading-loose font-mono ${THEME.text} placeholder-gray-600`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write here..."
        ></textarea>
      </div>
    </div>
  );
};
export default Journal;
