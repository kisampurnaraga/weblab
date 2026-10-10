export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Exercise = {
  title: string;
  instruction: string;
  starterCode: string;
  expectedOutput?: string;
  hints: string[];
};

export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  objectives: string[];
  explanation: string[];
  exampleCode: string;
  commonMistake?: string;
  predict?: { code: string; question: string; options: string[]; answer: number; explanation: string };
  debug?: { code: string; instruction: string };
  exercise: Exercise;
  quiz: QuizQuestion;
};

export type Module = {
  slug: string;
  order: number;
  title: string;
  stage: string;
  description: string;
  lessons: Lesson[];
};
