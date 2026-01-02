import React, { useState } from "react";
import "./App.css";
import {
  BookOpen,
  Dumbbell,
  DollarSign,
  RotateCcw,
  CalendarDays,
} from "lucide-react";

import { THEME } from "./components/ui/theme";
import HabitTracker from "./components/HabitTracker/HabitTracker";
import BudgetTracker from "./components/BudgetTracker/BudgetTracker";
import FitnessTracker from "./components/FitnessTracker/FitnessTracker";
import Journal from "./components/Journal/Journal";

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [globalDate, setGlobalDate] = useState(new Date());

  return (
    <div
      className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans flex flex-col`}
    >
      <div className="liquid-bg" />
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            TRACKER<span className={THEME.cyan}>APP</span>
          </h1>
          <p className="text-xs font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] uppercase tracking-widest">
            {globalDate.toDateString()}
          </p>
        </div>
        <button
          onClick={() => setGlobalDate(new Date())}
          className="p-2 bg-gray-800 rounded-full text-white"
        >
          <RotateCcw size={16} />
        </button>
      </header>

      <main className="flex-1 px-4 overflow-y-auto pt-4">
        {activeTab === 0 && (
          <HabitTracker globalDate={globalDate} setGlobalDate={setGlobalDate} />
        )}
        {activeTab === 1 && <BudgetTracker globalDate={globalDate} />}
        {activeTab === 2 && <FitnessTracker globalDate={globalDate} />}
        {activeTab === 3 && <Journal globalDate={globalDate} />}
      </main>

      <nav
        className={`fixed bottom-0 left-0 right-0 ${THEME.nav} backdrop-blur-xl px-6 py-4 flex justify-between items-center z-50`}
      >
        <button
          onClick={() => setActiveTab(0)}
          className={activeTab === 0 ? THEME.pink : "text-gray-600"}
        >
          <CalendarDays />
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? THEME.cyan : "text-gray-600"}
        >
          <DollarSign />
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "text-lime-400" : "text-gray-600"}
        >
          <Dumbbell />
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={activeTab === 3 ? "text-white" : "text-gray-600"}
        >
          <BookOpen />
        </button>
      </nav>
    </div>
  );
}
