export enum Numbers {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
    four = 4,  
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    ten = 10,
    eleven = 11,
    twelve = 12,
    thirteen = 13,
    fourteen = 14,
    fifteen = 15,
    sixteen = 16,
    seventeen = 17,
    eighteen = 18,
    nineteen = 19,
    twenty = 20,
    thirty = 30,
    forty = 40,
    fifty = 50,
    sixty = 60,
    seventy = 70,
    eighty = 80,
    ninety = 90,
  }
  
  export enum Multipliers {
    hundred = 100,
    thousand = 1000,
    million = 1000000,
  }
  
  export enum Conjunctions {
    and = 1
  }
  
  export type Number = keyof typeof Numbers;
  
  export type Multiplier = keyof typeof Multipliers;
  
  export type Conjunction = keyof typeof Conjunctions;
  