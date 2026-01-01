export const getLocalISOString = (date) => {
  const d = new Date(date);
  const z = d.getTimezoneOffset() * 60000;
  return new Date(d - z).toISOString().split("T")[0];
};

export const safeMax = (arr) => {
  if (!arr || arr.length === 0) return 100;
  const max = Math.max(...arr);
  return max === 0 ? 100 : max;
};

export const calcNutrients = (cals) => {
  const val = parseInt(cals) || 0;
  return {
    p: Math.round((val * 0.3) / 4),
    c: Math.round((val * 0.4) / 4),
    f: Math.round((val * 0.3) / 9),
  };
};
