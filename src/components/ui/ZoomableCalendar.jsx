import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { THEME } from "./theme";

const ZoomableCalendar = ({ globalDate, setGlobalDate }) => {
  const [view, setView] = useState("month"); // 'month' | 'year'
  const [displayDate, setDisplayDate] = useState(new Date(globalDate));

  const toggleView = () => setView(view === "month" ? "year" : "month");

  const changeMonth = (delta) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setDisplayDate(newDate);
  };

  const changeYear = (delta) => {
    const newDate = new Date(displayDate);
    newDate.setFullYear(newDate.getFullYear() + delta);
    setDisplayDate(newDate);
  };

  const MonthGrid = ({ date, isMini }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyStart = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="text-center">
        {isMini && (
          <div className={`text-[10px] font-bold ${THEME.text} mb-1`}>
            {date.toLocaleString("default", { month: "short" })}
          </div>
        )}
        <div className="grid grid-cols-7 gap-1">
          {!isMini &&
            ["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className={`text-xs ${THEME.subText}`}>
                {d}
              </div>
            ))}
          {emptyStart.map((i) => (
            <div key={`e-${i}`} />
          ))}
          {days.map((d) => {
            const isSelected =
              !isMini &&
              d === globalDate.getDate() &&
              month === globalDate.getMonth();
            return (
              <button
                key={d}
                onClick={() => {
                  if (!isMini) {
                    const newD = new Date(date);
                    newD.setDate(d);
                    setGlobalDate(newD);
                  }
                }}
                className={`text-xs h-8 w-8 rounded-full flex items-center justify-center ${
                  isSelected
                    ? THEME.cyanBg + " text-black font-bold"
                    : "text-gray-400 hover:bg-white/10"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`${THEME.card} p-4 rounded-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold ${THEME.text} uppercase`}>
          {view === "month"
            ? displayDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            : displayDate.getFullYear()}
        </h3>
        <div className="flex gap-2 items-center">
          {view === "month" && (
            <>
              <button onClick={() => changeMonth(-1)}>
                <ChevronLeft className={THEME.subText} />
              </button>
              <button onClick={() => changeMonth(1)}>
                <ChevronRight className={THEME.subText} />
              </button>
            </>
          )}
          <button
            onClick={toggleView}
            className={`p-2 rounded-full bg-white/5 ${THEME.text}`}
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {view === "month" ? (
        <MonthGrid date={displayDate} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <MonthGrid
              key={i}
              date={new Date(displayDate.getFullYear(), i, 1)}
              isMini
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ZoomableCalendar;
