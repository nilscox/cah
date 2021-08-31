export interface Question {
  id: string;
  text: string;
  blanks?: number[];
  numberOfBlanks: number;
  formatted: string;
}
