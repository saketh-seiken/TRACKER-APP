import React, { useMemo } from "react";
import { getLocalISOString, safeMax } from "../../utils/helpers";

const DynamicGraph = ({ type, dataRange, globalDate, target, color, logs }) => {
  const rangeLength =
    dataRange === "Daily" ? 1 : dataRange === "Weekly" ? 7 : 12; // Yearly = 12 months

  const dataPoints = useMemo(() => {
    const points = [];
    const endDate = new Date(globalDate);
    const safeLogs = logs || {};

    if (dataRange === "Yearly") {
      const year = endDate.getFullYear();
      for (let m = 0; m < 12; m++) {
        // Mock yearly view for demo stability
        points.push((target || 70) + Math.sin(m) * 2);
      }
    } else {
      for (let i = rangeLength - 1; i >= 0; i--) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        const key = getLocalISOString(d);
        const logVal = safeLogs[key];

        let val = 0;
        if (type === "Weight") {
          // Use logged weight or target/default
          val = logVal?.weight || target || 70;
        } else {
          val = logVal?.cardio?.dist || 0;
        }
        points.push(val);
      }
    }
    return points;
  }, [dataRange, globalDate, logs, type, target]);

  const max = safeMax(dataPoints) * 1.1;

  return (
    <div className="h-40 flex items-end justify-between gap-1 mt-4 px-2 relative bg-white/5 rounded-xl p-4 border border-white/5">
      {dataPoints.map((val, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
        >
          <div
            className={`w-full rounded-t-sm transition-all duration-500 ${color}`}
            style={{
              height: `${Math.max(5, (val / max) * 100)}%`,
              opacity: 0.7,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default DynamicGraph;
