import { Conjunction, Conjunctions, Multiplier, Multipliers, Number, Numbers, Total } from "./numeralToNumber.types";

export const numeralToNumber = (input: string): number => {
  const processing = input
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
      const isFinal = words.length === index + 1;

      // TODO remove logging once not valuable - for development only
      console.table([{current, number, multiplier, conjunction, isFinal, sum: total.sum, carry: total.carry, totalMultiplier: total.multiplier}]);

      // return NaN if the word is not recognised (cannot be converted to a number)
      if (!isNumber && !isMultiplier && !isConjunction) {
        words = words.splice(0); // amend the array to break the reduce early
        return Object.assign(total, { error: true });
      }

      let newSum = total.sum;
      let newCarry = total.carry;
      let newMultiplier = total.multiplier;

      if (isNumber) {
        newCarry += number;
      }
      else if (isMultiplier) {
        newMultiplier *= multiplier;
      }

      if (isFinal || isConjunction) {
        newSum += (newCarry * newMultiplier);
        newCarry = 0;
        newMultiplier = 1;
      }

      return {
        sum: newSum,
        carry: newCarry,
        multiplier: newMultiplier,
        error: false,
      }
    }, { sum: 0, carry: 0, multiplier: 1, error: false} as Total)

    // TODO remove logging once not valuable - for development only
    console.table([processing])

    return processing.error ? NaN : processing.sum;
};
