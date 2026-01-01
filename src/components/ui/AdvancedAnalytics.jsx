import React from "react";
import { PieChart } from "lucide-react";
import { THEME } from "./theme";

const AdvancedAnalytics = ({ data, title }) => {
  const total = (data || []).reduce((acc, item) => acc + (item.value || 0), 0);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  if (total === 0)
    return (
      <div
        className={`${THEME.card} p-6 rounded-xl text-center text-xs ${THEME.subText}`}
      >
        No Data for {title}
      </div>
    );

  return (
    <div className={`${THEME.card} p-5 rounded-2xl mb-6`}>
      <h3
        className={`text-xs font-bold ${THEME.text} mb-4 flex items-center gap-2 uppercase`}
      >
        <PieChart size={14} /> {title} Analytics
      </h3>
      <div className="flex gap-6 items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#1f2937"
              strokeWidth="8"
              fill="transparent"
            />
            {data.map((d, i) => {
              const percentage = total === 0 ? 0 : d.value / total;
              const dashArray = percentage * circumference;
              const offset = currentOffset;
              currentOffset += dashArray;
              return (
                <circle
                  key={i}
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke={d.color}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${THEME.text}`}>{total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span style={{ color: d.color }} className="font-bold">
                {d.name}
              </span>
              <span className={THEME.text}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
