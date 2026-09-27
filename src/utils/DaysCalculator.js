const DaysCalculator = () => {
  const now = new Date();

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  return daysInMonth;
};

export default DaysCalculator;