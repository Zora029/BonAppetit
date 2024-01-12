exports.getWeekDays = (date) => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();
  const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(currentDate.setDate(diff));
  const weekDays = [];

  for (let i = 0; i < 5; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day.toISOString().split("T")[0]);
  }

  return weekDays;
};
exports.getAllDatesInMonth = (date) => {
  const d = new Date(date);
  const month = d.getMonth();
  const _date = new Date(d.getFullYear(), d.getMonth(), 1, 12);

  const dates = [];

  while (_date.getMonth() === month) {
    dates.push(_date.toISOString().split("T")[0]);
    _date.setDate(_date.getDate() + 1);
  }

  return dates;
};
exports.getDate = (date) => {
  const d = new Date(date);
  const result = d.toISOString().split("T")[0];
  return result;
};
exports.isDateBefore = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 < d2;
};
exports.getDateNow = () => {
  const now = new Date();
  const [result] = now.toISOString().split("T");
  return result;
};
exports.countOccurrencesChar = (text) => {
  const occurrences = {};
  for (const char of text) {
    if (char != " ") {
      occurrences[char] = (occurrences[char] || 0) + 1;
    }
  }
  return occurrences;
};
