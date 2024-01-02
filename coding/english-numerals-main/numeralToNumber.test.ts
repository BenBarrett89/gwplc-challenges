import { numeralToNumber } from "./numeralToNumber";

describe("numeralToNumber", () => {
  it('should return single digit numbers when provided with their English equivalents (zero)', () => {
    const result = numeralToNumber("ZERO");
    expect(result).toBe(0);
  })
  it('should return single digit numbers when provided with their English equivalents (lower case)', () => {
    const result = numeralToNumber("three");
    expect(result).toBe(3);
  })
  it('should return single digit numbers when provided with their English equivalents (capitalized)', () => {
    const result = numeralToNumber("Three");
    expect(result).toBe(3);
  })
  it('should return double digit numbers when provided with their English equivalents (single words)', () => {
    const result = numeralToNumber("Twelve");
    expect(result).toBe(12);
  })
  it('should return double digit numbers when provided with their English equivalents (hyphenated)', () => {
    const result = numeralToNumber("Twenty-four");
    expect(result).toBe(24);
  })
  it('should return double digit numbers when provided with their English equivalents (space separated)', () => {
    const result = numeralToNumber("twenty four");
    expect(result).toBe(24);
  })
  it('should return three digit numbers when provided with their English equivalents (exact hundred)', () => {
    const result = numeralToNumber("Eight hundred");
    expect(result).toBe(800);
  })
  it('should return three digit numbers when provided with their English equivalents (with other numbers)', () => {
    const result = numeralToNumber("Eight hundred and twelve");
    expect(result).toBe(812);
  })
  it('should return four digit numbers when provided with their English equivalents', () => {
    const result = numeralToNumber("six thousand five hundred and thirty seven")
    expect(result).toBe(6537);
  })
  it('should return five digit numbers when provided with their English equivalents', () => {
    const result = numeralToNumber("eighty thousand six hundred and sixty six")
    expect(result).toBe(80666);
  })
  it('should return six digit numbers when provided with their English equivalents (exact hundreds of thousands)', () => {
    const result = numeralToNumber("Two hundred thousand");
    expect(result).toBe(200000);
  })
  it('should return six digit numbers when provided with their English equivalents', () => {
    const result = numeralToNumber("Seven hundred and forty nine thousand, five hundred and eighty one");
    expect(result).toBe(749581);
  })
  it('should return nine hundred and ninety nine thousand nine hundred and ninety nine when provided with the English equivalent', () => {
    const result = numeralToNumber("nine hundred and ninety nine thousand, nine hundred and ninety nine");
    expect(result).toBe(999999);
  })
  it('should return 1 million when provided with one million (maximum)', () => {
    const result = numeralToNumber("One million");
    expect(result).toBe(1000000);
  })
  it('should return NaN when provided with a number over one million', () => {
    // TODO this is an assumption as the task is ambiguous as to how numbers greater than one million should be handled
    const result = numeralToNumber("one hundred million");
    expect(result).toBe(NaN);
  })
  it('should return NaN when not provided with a valid number in English', () => {
    const result = numeralToNumber("This is not a number");
    expect(result).toBe(NaN);
  })
  it('does not handle awkward English numbers that are above the maximum', () => {
    // TODO it would be nice to rectify this
    const result = numeralToNumber("two thousand thousand");
    expect(result).toBe(2000); // rather than 2000000, which is over the maximum of 1 million anyway...
  })
  it('will handle awkward English to do with zero', () => {
    // TODO it would be nice to rectify this
    const firstResult = numeralToNumber("zero hundred thousand and thirteen");
    expect(firstResult).toBe(13);
    const secondResult = numeralToNumber("zero hundred and forty five");
    expect(secondResult).toBe(45);
    const thirdResult = numeralToNumber("fifty zero and two");
    expect(thirdResult).toBe(52);
    const fourthResult = numeralToNumber("thirty zero thousand and zero zero nine");
    expect(fourthResult).toBe(30009);
    const fifthResult = numeralToNumber("zero million zero hundred thousand zero thousand zero hundred zero and one");
    expect(fifthResult).toBe(1);
  })
  it('will handle some other awkward English', () => {
    // TODO it would be nice to rectify these
    const firstResult = numeralToNumber("twenty and fourteen thousand");
    expect(firstResult).toBe(34000);
    const secondResult = numeralToNumber("ten and ten and ten ten ten");
    expect(secondResult).toBe(50);
    const thirdResult = numeralToNumber("eleven and eleven and eleven thousand")
    expect(thirdResult).toBe(33000);
    const fourthResult = numeralToNumber("ten nine eight seven six five four three two one and hundred and and and and fifty and and five");
    expect(fourthResult).toBe(5555);
    const fifthResult = numeralToNumber("zero one zero zero zero one one zero zero one one zero one zero");
    expect(fifthResult).toBe(6);
  })
})
