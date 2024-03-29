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

      const isNumber = Boolean(number || number === 0); // zero will not coerce to true / is not truthy
      const isHundred = current === "hundred";
      const isMultiplier = Boolean(multiplier);
      const isConjunction = Boolean(conjunction);
      const isFinal = words.length === index + 1;

      // return NaN if the word is not recognised (cannot be converted to a number)
      if (!isNumber && !isHundred && !isMultiplier && !isConjunction) {
        words = words.splice(0); // amend the array to break the reduce early
        return Object.assign(total, { error: true });
      }

      let sum = total.sum;
      let carry = total.carry;

      if (isNumber) {
        carry += number;
      }
      else if (isHundred) {
        carry *= 100;
      }
      else if (isMultiplier) {
        sum += carry * multiplier;
        carry = 0;
      }

      if (isFinal) {
        sum += carry;
      }

      return {
        sum,
        carry,
        error: false,
      }
    }, { sum: 0, carry: 0, error: false} as Total)

    return processing.error || processing.sum > 1000000 ? NaN : processing.sum;
};
