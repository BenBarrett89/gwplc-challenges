import { Conjunction, Conjunctions, Multiplier, Multipliers, Number, Numbers } from "./numeralToNumber.types";

export const numeralToNumber = (input: string): number => {
  return input
    .toLowerCase()
    .replace(/([^a-z]+)/gi, ' ')
    .split(/\s+/)
    .reduce((total, current, index, words) => {
      const number = Numbers[current as Number];
      const multiplier = Multipliers[current as Multiplier];
      const conjunction = Conjunctions[current as Conjunction];

      const isNumber = Boolean(number);
      const isMultiplier = Boolean(multiplier);
      const isConjunction = Boolean(conjunction);

      // TODO remove logging once not valuable - for development only
      console.table([{current, number, isNumber, multiplier, isMultiplier, conjunction, isConjunction}]);

      // return NaN if the word is not recognised (cannot be converted to a number)
      if (!isNumber && !isMultiplier && !isConjunction) {
        words = words.splice(0); // amend the array to break the reduce early
        return NaN;
      }

      if (isNumber) {
        return total + number;
      }
      else {
        // TODO add in multipliers next to handle larger numbers
        return total;
      }
    }, 0)
};
