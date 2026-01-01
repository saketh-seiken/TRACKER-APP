import React, { useState, useMemo } from "react";
import { Save, Edit3, Trash2, Flame } from "lucide-react";
import { THEME, INTENSITIES } from "../ui/theme";
import { getLocalISOString } from "../../utils/helpers";
import { getDailyQuote } from "../../utils/quotes";
import AdvancedAnalytics from "../ui/AdvancedAnalytics";
import NeonButton from "../ui/NeonButton";
import ConfirmationModal from "../ui/ConfirmationModal";
import ContributionGraph from "../ui/ContributionGraph";
import ZoomableCalendar from "../ui/ZoomableCalendar";

const HabitTracker = ({ globalDate, setGlobalDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
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

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center py-4 border-b border-white/10">
        <p className={`text-sm italic ${THEME.subText}`}>"{quote}"</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-bold ${THEME.text}`}>HABITS</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className={`${THEME.card} p-2 rounded-lg ${
              isEditing ? "text-gray-600 opacity-50" : "text-blue-400"
            }`}
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!isEditing}
            className={`${THEME.card} p-2 rounded-lg ${
              !isEditing ? "text-gray-600 opacity-50" : "text-green-400"
            }`}
          >
            <Save size={18} />
          </button>
        </div>
      </div>

      <ZoomableCalendar globalDate={globalDate} setGlobalDate={setGlobalDate} />
      <ContributionGraph
        habits={habits}
        year={globalDate.getFullYear()}
        selectedDate={globalDate}
        setGlobalDate={setGlobalDate}
      />
      <AdvancedAnalytics data={analyticsData} title="DAILY" />

      {isEditing && (
        <div className={`${THEME.card} p-3 rounded-xl flex gap-2`}>
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
          return (
            <div
              key={h.id}
              className={`${THEME.card} p-4 rounded-xl border-l-4 border-l-transparent`}
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
                    <p className={`text-[10px] ${THEME.subText}`}>
                      Streak: {h.streak}
                    </p>
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
        onClose={() => setShowSaveModal(false)}
        onConfirm={confirmSave}
        message="Are you sure you want to save these changes?"
      />
    </div>
  );
};
export default HabitTracker;
