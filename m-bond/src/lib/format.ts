export const fmtDT = (d = new Date()) =>
  d.toLocaleString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

export const todayAt = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return fmtDT(d);
};
export const isoDate = () => new Date().toISOString().slice(0, 10);
