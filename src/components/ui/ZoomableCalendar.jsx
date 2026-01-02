import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { THEME } from "./theme";
import ContributionGraph from "./ContributionGraph";

const ZoomableCalendar = ({ globalDate, setGlobalDate, habits }) => {
  const [displayDate, setDisplayDate] = useState(new Date(globalDate));
  const [view, setView] = useState("month");

  useEffect(() => {
    setDisplayDate(new Date(globalDate));
  }, [globalDate]);

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

  const toggleView = () => setView(view === "month" ? "year" : "month");

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
              d === globalDate.getDate() &&
              month === globalDate.getMonth() &&
              year === globalDate.getFullYear();
            return (
              <button
                key={d}
                onClick={() => {
                  const newD = new Date(date);
                  newD.setDate(d);
                  setGlobalDate(newD);
                }}
                className={`text-xs rounded-full flex items-center justify-center ${
                  isMini ? "h-6 w-6 text-[10px]" : "h-8 w-8"
                } ${
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
    <div className="flex flex-col gap-6">
      <ContributionGraph
        habits={habits}
        year={displayDate.getFullYear()}
        selectedDate={globalDate}
        setGlobalDate={setGlobalDate}
      />
      <div className={`${THEME.card} glass-card p-6 rounded-xl`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className={`font-bold ${THEME.text} uppercase`}>
              {view === "month"
                ? displayDate.toLocaleString("default", { month: "long" })
                : displayDate.getFullYear()}
            </h3>
            {view === "month" && (
              <div className="flex items-center bg-white/5 rounded-lg px-1">
                <button onClick={() => changeYear(-1)} className="p-1">
                  <ChevronLeft size={12} className={THEME.subText} />
                </button>
                <span className={`text-xs font-bold ${THEME.text} px-1`}>
                  {displayDate.getFullYear()}
                </span>
                <button onClick={() => changeYear(1)} className="p-1">
                  <ChevronRight size={12} className={THEME.subText} />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                view === "month" ? changeMonth(-1) : changeYear(-1)
              }
            >
              <ChevronLeft className={THEME.subText} />
            </button>
            <button
              onClick={() =>
                view === "month" ? changeMonth(1) : changeYear(1)
              }
            >
              <ChevronRight className={THEME.subText} />
            </button>
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
    </div>
  );
};
export default ZoomableCalendar;
