import React, { useState, useMemo } from "react";
import { Save, Edit3, Trash2 } from "lucide-react";
import { THEME, COLORS } from "../ui/theme";
import { getLocalISOString } from "../../utils/helpers";
import AdvancedAnalytics from "../ui/AdvancedAnalytics";

const BudgetTracker = ({ globalDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = getLocalISOString(globalDate);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: "Food",
      amount: -150,
      date: formattedDate,
      category: "Food",
    },
    {
      id: 2,
      title: "Salary",
      amount: 2000,
      date: formattedDate,
      category: "Income",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const dailyData = transactions.filter((t) => t.date === formattedDate);
  const monthlyBalance = useMemo(
    () => transactions.reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (t.category !== "Income") {
        totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.entries(totals).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
    }));
  }, [transactions]);

  const add = (type) => {
    if (!newTitle || !newAmount) return;
    const val = parseFloat(newAmount);
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        title: newTitle,
        amount: type === "inc" ? val : -val,
        category: type === "inc" ? "Income" : "Expense",
        date: formattedDate,
      },
    ]);
    setNewTitle("");
    setNewAmount("");
  };
  const remove = (id) =>
    setTransactions(transactions.filter((t) => t.id !== id));

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between border-b border-gray-800 pb-4">
        <h2 className={`text-xl font-bold ${THEME.text}`}>BUDGET</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={THEME.subText}
        >
          {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
        </button>
      </div>
      <div className="text-center py-2">
        <p className={`text-xs ${THEME.subText}`}>BALANCE</p>
        <h1 className={`text-4xl font-bold ${THEME.text} text-cyan-400`}>
          ${monthlyBalance}
        </h1>
      </div>
      <AdvancedAnalytics data={categoryTotals} title="SPENDING" />
      <div
        className={`${THEME.card} glass-card p-3 rounded-xl flex flex-col gap-2`}
      >
        <div className="flex gap-2">
          <input
            placeholder="Item"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={`flex-1 ${THEME.input} text-sm`}
          />
          <input
            type="number"
            placeholder="$"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className={`w-16 ${THEME.input} text-sm`}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => add("inc")}
            className="flex-1 bg-green-500/20 text-green-500 text-xs py-2 rounded font-bold"
          >
            INCOME (+)
          </button>
          <button
            onClick={() => add("exp")}
            className="flex-1 bg-red-500/20 text-red-500 text-xs py-2 rounded font-bold"
          >
            EXPENSE (-)
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {dailyData.length === 0 && (
          <div className={`text-center ${THEME.subText} text-xs italic py-4`}>
            No transactions today.
          </div>
        )}
        {dailyData.map((t) => (
          <div
            key={t.id}
            className={`${THEME.card} glass-card p-4 rounded-xl flex justify-between items-center`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-10 rounded-full ${
                  t.amount > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <p className={`font-bold ${THEME.text}`}>{t.title}</p>
                <p className={`text-xs ${THEME.subText}`}>{t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={t.amount > 0 ? "text-green-400" : "text-white"}>
                {Math.abs(t.amount)}
              </span>
              {isEditing && (
                <button onClick={() => remove(t.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BudgetTracker;
