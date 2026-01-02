import React, { useState, useMemo, useEffect } from "react";
import { Save, Edit3, Trash2, Flame, ChevronLeft } from "lucide-react";
import { THEME, INTENSITIES } from "../ui/theme";
import { getLocalISOString } from "../../utils/helpers";
import { getDailyQuote } from "../../utils/quotes";
import AdvancedAnalytics from "../ui/AdvancedAnalytics";
import NeonButton from "../ui/NeonButton";
import ConfirmationModal from "../ui/ConfirmationModal";
import ZoomableCalendar from "../ui/ZoomableCalendar";

const HabitTracker = ({ globalDate, setGlobalDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [graphRange, setGraphRange] = useState("Daily");
  const [habits, setHabits] = useState([
    { id: 1, name: "Jogging", streak: 5, history: {} },
    { id: 2, name: "Reading", streak: 12, history: {} },
  ]);
  const [newHabitName, setNewHabitName] = useState("");
  const formattedDate = getLocalISOString(globalDate);
  const quote = useMemo(() => getDailyQuote(globalDate), [globalDate]);

  const analyticsData = useMemo(() => {
    let completed = 0,
      missed = 0;
    habits.forEach((h) => {
      if (h.history[formattedDate] > 0) completed++;
      else missed++;
    });
    return [
      { name: "Done", value: completed, color: "#22c55e" },
      { name: "Missed", value: missed, color: "#ef4444" },
    ];
  }, [habits, formattedDate]);

  const updateIntensity = (habitId, level) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? { ...h, history: { ...h.history, [formattedDate]: level } }
          : h
      )
    );
  };

  const addHabit = () => {
    if (newHabitName) {
      setHabits([
        ...habits,
        { id: Date.now(), name: newHabitName, streak: 0, history: {} },
      ]);
      setNewHabitName("");
    }
  };
  const deleteHabit = (id) => setHabits(habits.filter((h) => h.id !== id));

  const handleSaveClick = () => setShowSaveModal(true);
  const confirmSave = () => {
    setIsEditing(false);
    setShowSaveModal(false);
  };

  const graphData = useMemo(() => {
    if (!selectedSection) return [];
    const data = [];
    const now = new Date(globalDate);
    const isDone = selectedSection === "Done";

    const getCount = (dateStr) => {
      let count = 0;
      habits.forEach((h) => {
        const val = h.history[dateStr] || 0;
        if (isDone && val > 0) count++;
        if (!isDone && val === 0) count++;
      });
      return count;
    };

    if (graphRange === "Daily") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = getLocalISOString(d);
        data.push({
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
          value: getCount(key),
        });
      }
    } else if (graphRange === "Weekly") {
      for (let i = 3; i >= 0; i--) {
        let sum = 0;
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        for (let j = 0; j < 7; j++) {
          const d = new Date(weekEnd);
          d.setDate(d.getDate() - j);
          sum += getCount(getLocalISOString(d));
        }
        data.push({
          label: i === 0 ? "This Week" : `${i}w ago`,
          value: sum,
        });
      }
    } else if (graphRange === "Monthly") {
      for (let i = 5; i >= 0; i--) {
        let sum = 0;
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const month = d.getMonth();
        const year = d.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let j = 1; j <= daysInMonth; j++) {
          const dayDate = new Date(year, month, j);
          sum += getCount(getLocalISOString(dayDate));
        }
        data.push({
          label: d.toLocaleDateString("en-US", { month: "short" }),
          value: sum,
        });
      }
    } else if (graphRange === "Yearly") {
      for (let i = 4; i >= 0; i--) {
        let sum = 0;
        const targetDate = new Date(now);
        targetDate.setFullYear(targetDate.getFullYear() - i);
        const year = targetDate.getFullYear();
        let current = new Date(year, 0, 1);
        while (current.getFullYear() === year && current <= now) {
          sum += getCount(getLocalISOString(current));
          current.setDate(current.getDate() + 1);
        }
        data.push({ label: year.toString(), value: sum });
      }
    }
    return data;
  }, [selectedSection, graphRange, globalDate, habits]);

  const maxVal = Math.max(...graphData.map((d) => d.value), 1);

  const calculateStreak = (history) => {
    let streak = 0;
    const d = new Date();
    const todayKey = getLocalISOString(d);

    if (history[todayKey] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      d.setDate(d.getDate() - 1);
      if (!history[getLocalISOString(d)]) return 0;
    }

    while (history[getLocalISOString(d)] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center py-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
        <p className="text-xl md:text-2xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] px-4 relative z-10">
          "{quote}"
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-bold ${THEME.text}`}>HABITS</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className={`${THEME.card} glass-card p-2 rounded-lg ${
              isEditing ? "text-gray-600 opacity-50" : "text-blue-400"
            }`}
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!isEditing}
            className={`${THEME.card} glass-card p-2 rounded-lg ${
              !isEditing ? "text-gray-600 opacity-50" : "text-green-400"
            }`}
          >
            <Save size={18} />
          </button>
        </div>
      </div>

      <ZoomableCalendar
        globalDate={globalDate}
        setGlobalDate={setGlobalDate}
        habits={habits}
      />

      <AdvancedAnalytics
        data={analyticsData}
        title="DAILY"
        onSliceClick={(item) =>
          setSelectedSection(item.name === selectedSection ? null : item.name)
        }
        selectedSection={selectedSection}
      />

      {selectedSection && (
        <div className={`${THEME.card} glass-card p-4 rounded-xl`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSection(null)}
                className="p-1 bg-white/5 rounded-lg hover:bg-white/10"
              >
                <ChevronLeft size={16} className={THEME.text} />
              </button>
              <h3 className={`text-xs font-bold ${THEME.text} uppercase`}>
                {selectedSection}
              </h3>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setGraphRange(range)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-all ${
                    graphRange === range
                      ? "bg-white/20 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {range.charAt(0)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-40 flex items-end justify-between gap-2 mt-4 px-2 relative bg-white/5 rounded-xl p-4 border border-white/5">
            {graphData.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
              >
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 ${
                    selectedSection === "Done" ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    height: `${Math.max(5, (d.value / maxVal) * 100)}%`,
                    opacity: 0.8,
                  }}
                ></div>
                <span className="text-[9px] text-gray-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditing && (
        <div className={`${THEME.card} glass-card p-3 rounded-xl flex gap-2`}>
          <input
            type="text"
            placeholder="New Habit..."
            className={`flex-1 ${THEME.input} text-sm`}
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
          <NeonButton onClick={addHabit} className="text-xs py-1">
            ADD
          </NeonButton>
        </div>
      )}

      <div className="space-y-3">
        {habits.map((h) => {
          const currentLevel = h.history[formattedDate] || 0;
          const currentStreak = calculateStreak(h.history);
          return (
            <div
              key={h.id}
              className={`${THEME.card} glass-card p-4 rounded-xl border-l-4 border-l-transparent`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Flame
                    size={18}
                    className={
                      currentLevel > 0
                        ? INTENSITIES[currentLevel]?.color.replace(
                            "bg-",
                            "text-"
                          )
                        : THEME.subText
                    }
                  />
                  <div>
                    <h4 className={`font-bold ${THEME.text}`}>{h.name}</h4>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${THEME.subText}`}>
                    INTENSITY
                  </span>
                  <button className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center gap-1">
                    <Flame size={10} /> {currentStreak}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 w-full justify-between">
                {[1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() =>
                      updateIntensity(h.id, currentLevel === lvl ? 0 : lvl)
                    }
                    className={`flex-1 h-8 rounded border ${
                      currentLevel === lvl
                        ? INTENSITIES[lvl].color +
                          " border-transparent text-black"
                        : "border-white/10 text-gray-500"
                    }`}
                  >
                    <span className="text-xs font-bold">{lvl}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setIsEditing(true);
        }}
        onConfirm={confirmSave}
        message="Are you sure you want to save these changes?"
      />
    </div>
  );
};
export default HabitTracker;
