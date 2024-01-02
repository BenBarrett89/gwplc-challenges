import { numeralToNumber } from "./numeralToNumber";

test("Should return a number", () => {
  const result = numeralToNumber("");

  expect(typeof result).toBe("number");
});
