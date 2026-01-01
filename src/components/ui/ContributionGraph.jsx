import React from "react";
import { THEME, INTENSITIES } from "./theme";
import { getLocalISOString } from "../../utils/helpers";

const ContributionGraph = ({ habits, year, selectedDate, setGlobalDate }) => {
  const selectedDateKey = selectedDate ? getLocalISOString(selectedDate) : null;

  const getAvgIntensity = (dateKey) => {
    if (!habits || habits.length === 0) return 0;
    let sum = 0;
    habits.forEach((h) => {
      sum += h.history[dateKey] || 0;
    });
    return sum / habits.length;
  };

  const getColor = (level) => {
    if (level === 0) return "bg-white/5";
    const rounded = Math.ceil(level);
    return INTENSITIES[rounded]?.color || "bg-white/5";
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const days = [];
    const date = new Date(year, i, 1);
    const daysInMonth = new Date(year, i + 1, 0).getDate();
    const startDay = date.getDay(); // 0 = Sunday

    for (let k = 0; k < startDay; k++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, i, d));

    return { name: date.toLocaleString("default", { month: "short" }), days };
  });

  return (
    <div className={`${THEME.card} p-4 rounded-xl`}>
      <h3 className={`text-xs font-bold ${THEME.text} mb-4 uppercase`}>
        Yearly Consistency
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {months.map((m, idx) => (
          <div key={idx} className="shrink-0">
            <div className={`text-[10px] font-bold ${THEME.subText} mb-2`}>
              {m.name}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
              {m.days.map((date, i) => {
                if (!date) return <div key={i} className="w-2 h-2"></div>;
                const dateKey = getLocalISOString(date);
                const level = getAvgIntensity(dateKey);
                const isSelected = dateKey === selectedDateKey;
                return (
                  <div
                    key={i}
                    onClick={() => date && setGlobalDate(date)}
                    title={`${dateKey}: ${level.toFixed(1)}`}
                    className={`w-2 h-2 rounded-[1px] cursor-pointer transition-all hover:opacity-80 ${getColor(
                      level
                    )} ${isSelected ? "ring-2 ring-white z-10 scale-125" : ""}`}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ContributionGraph;
