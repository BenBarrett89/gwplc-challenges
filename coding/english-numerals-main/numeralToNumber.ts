export const numeralToNumber = (input: string): number => {
  return input
    .toLowerCase()
    .replace(/([^a-z]+)/gi, ' ')
    .split(/\s+/)
    .reduce((total, current, index, words) => {
      console.log(current);
      return NaN;
    }, NaN)
};
