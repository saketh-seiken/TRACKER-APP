import React, { useState, useMemo } from "react";
import { Save, Edit3, Minus, Plus } from "lucide-react";
import { THEME } from "../ui/theme";
import { getLocalISOString, calcNutrients } from "../../utils/helpers";
import NeonButton from "../ui/NeonButton";
import DynamicGraph from "../ui/DynamicGraph";
import AdvancedAnalytics from "../ui/AdvancedAnalytics";

const FitnessTracker = ({ globalDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    height: 175,
    weight: 70,
    age: 25,
    gender: "Male",
    targetWeight: 75,
    targetType: "Bulking",
    experience: "Beginner",
  });
  const dateKey = getLocalISOString(globalDate);
  const [logs, setLogs] = useState({
    [dateKey]: {
      weight: 70,
      calories: { b: 600, l: 800, d: 700, s: 200, burnt: 0 },
      cardio: { type: "Running", dist: 5, time: 30 },
    },
  });
  const dayLog = logs[dateKey] || {
    weight: profile.weight,
    calories: { b: 0, l: 0, d: 0, s: 0, burnt: 0 },
    cardio: { type: "Running", dist: 0, time: 0 },
  };
  const [detailedPlan, setDetailedPlan] = useState(null);
  const [graphView, setGraphView] = useState("Weight");
  const [graphRange, setGraphRange] = useState("Weekly");

  const updateLog = (section, field, val) => {
    const safeLog = logs[dateKey] || {
      weight: profile.weight,
      calories: { b: 0, l: 0, d: 0, s: 0, burnt: 0 },
      cardio: { type: "Running", dist: 0, time: 0 },
    };
    let newSectionData;
    if (section === "calories")
      newSectionData = { ...safeLog.calories, [field]: parseFloat(val) || 0 };
    else if (section === "cardio")
      newSectionData = { ...(safeLog.cardio || {}), ...field };
    setLogs((prev) => ({
      ...prev,
      [dateKey]: { ...safeLog, [section]: newSectionData },
    }));
  };

  const generateFullPlan = () => {
    const cals = profile.targetType === "Bulking" ? 2800 : 1800;
    const workout =
      profile.targetType === "Bulking"
        ? ["Bench Press: 3x10", "Incline DB: 3x12", "Shoulder Press: 3x10"]
        : ["Circuit Training: 3 Rounds", "HIIT: 20 Mins"];
    setDetailedPlan({
      calories: cals,
      workout: workout,
      diet: { b: "Eggs + Oats", l: "Rice + Chicken", d: "Roti + Paneer" },
    });
  };

  const totalConsumed =
    (dayLog.calories.b || 0) +
    (dayLog.calories.l || 0) +
    (dayLog.calories.d || 0) +
    (dayLog.calories.s || 0);
  const netCalories = totalConsumed - (dayLog.calories.burnt || 0);
  const fitnessData = [
    { name: "Consumed", value: totalConsumed, color: "#f59e0b" },
    { name: "Burnt", value: dayLog.calories.burnt || 0, color: "#ef4444" },
  ];

  const MealInput = ({ label, mealKey }) => {
    const cals = dayLog.calories[mealKey] || 0;
    const macros = useMemo(() => calcNutrients(cals), [cals]);
    return (
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${THEME.text}`}>{label}</span>
            <span className={`text-[10px] ${THEME.subText}`}>{cals} kcal</span>
          </div>
          {isEditing && (
            <div className="flex gap-1">
              <button
                onClick={() => updateLog("calories", mealKey, cals - 50)}
                className="p-1 bg-red-500/20 text-red-400 rounded"
              >
                <Minus size={12} />
              </button>
              <button
                onClick={() => updateLog("calories", mealKey, cals + 50)}
                className="p-1 bg-green-500/20 text-green-400 rounded"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
        {cals > 0 && (
          <div className="flex justify-between text-[9px] text-gray-400 border-t border-white/5 pt-2">
            <span>P: {macros.p}g</span>
            <span>C: {macros.c}g</span>
            <span>F: {macros.f}g</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between border-b border-gray-800 pb-2">
        <h2 className={`text-xl font-bold ${THEME.text}`}>FITNESS</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={THEME.subText}
        >
          {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
        </button>
      </div>
      <div
        className={`${THEME.card} glass-card p-4 rounded-xl flex flex-col gap-4`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-xs ${THEME.subText}`}>Weight</p>
            <p className={`text-lg font-bold ${THEME.text}`}>
              {profile.weight}kg
            </p>
          </div>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2 w-40 text-right">
              <input
                type="number"
                placeholder="kg"
                value={profile.weight}
                onChange={(e) =>
                  setProfile({ ...profile, weight: e.target.value })
                }
                className={`bg-transparent border-b ${THEME.text} text-center text-xs`}
              />
              <select
                value={profile.targetType}
                onChange={(e) =>
                  setProfile({ ...profile, targetType: e.target.value })
                }
                className="col-span-2 bg-black text-white text-[10px] p-1 rounded"
              >
                <option>Bulking</option>
                <option>Cutting</option>
              </select>
            </div>
          ) : (
            <div className="text-right text-xs text-gray-400">
              <p>{profile.targetType}</p>
            </div>
          )}
        </div>
        <NeonButton onClick={generateFullPlan}>GENERATE PLAN</NeonButton>
      </div>
      <div className={`${THEME.card} glass-card p-4 rounded-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-sm font-bold ${THEME.text}`}>{graphView}</h3>
          <div className="flex gap-2">
            <select
              value={graphView}
              onChange={(e) => setGraphView(e.target.value)}
              className="bg-black text-white text-[10px] p-1 rounded border border-white/20"
            >
              <option>Weight</option>
              <option>Cardio</option>
            </select>
            <select
              value={graphRange}
              onChange={(e) => setGraphRange(e.target.value)}
              className="bg-black text-white text-[10px] p-1 rounded border border-white/20"
            >
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
        <DynamicGraph
          type={graphView}
          dataRange={graphRange}
          globalDate={globalDate}
          target={graphView === "Weight" ? profile.targetWeight : null}
          color={graphView === "Weight" ? "bg-cyan-400" : "bg-orange-400"}
          logs={logs}
        />
      </div>
      {detailedPlan && (
        <div
          className={`${THEME.card} glass-card p-4 rounded-xl border-l-4 border-l-lime-500`}
        >
          <div className="flex justify-between mb-2">
            <h4 className={`text-sm font-bold ${THEME.text}`}>PLAN</h4>
            <span className="text-lime-400 text-xs font-bold">
              {detailedPlan.calories} kcal
            </span>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="bg-white/5 p-2 rounded">
              <strong className="text-white block mb-1">WORKOUT</strong>
              {detailedPlan.workout.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      <AdvancedAnalytics data={fitnessData} title="CALORIE" />
      <div className={`${THEME.card} glass-card p-4 rounded-xl`}>
        <h3 className={`text-sm font-bold ${THEME.text} mb-3`}>LOGS</h3>
        <MealInput label="BREAKFAST" mealKey="b" />
        <MealInput label="LUNCH" mealKey="l" />
        <MealInput label="DINNER" mealKey="d" />
        <div className="mt-4 pt-2 border-t border-white/20 flex justify-between font-bold">
          <span className={THEME.subText}>NET</span>
          <span className={netCalories > 0 ? "text-green-400" : "text-red-400"}>
            {netCalories} kcal
          </span>
        </div>
      </div>
    </div>
  );
};
export default FitnessTracker;
