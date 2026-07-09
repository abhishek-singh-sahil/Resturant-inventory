export const toBusinessDateString = (date) => {
  const d = new Date(date);

  const ist = new Date(
    d.getTime() + 5.5 * 60 * 60 * 1000
  );

  const year = ist.getUTCFullYear();
  const month = String(
    ist.getUTCMonth() + 1
  ).padStart(2, "0");
  const day = String(
    ist.getUTCDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};