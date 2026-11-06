export type QuestionType =
  | "collection"
  | "section_header"
  | "mcq"
  | "fill_blank"
  | "match"
  | "true_false"
  | "word_meaning"
  | "short"
  | "long"
  | "picture"
  | "diagram"
  | "one_word"
  | "assertion_reason"
  | "case_study";

export type ImageAsset = {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  width?: number;
  height?: number;
};

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

export type WordMeaningPair = {
  id: string;
  word: string;
  meaning?: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  marks: number;
  sectionSubtitle?: string;
  // Question Collection properties
  collectionType?: QuestionType; // Question format for all items in collection
  subQuestions?: Question[];     // Sub-questions inside this collection
  // MCQ
  options?: string[];
  correctOptionIndex?: number;
  // Fill in the blanks
  blankAnswers?: string[];
  // Match the following
  matchPairs?: MatchPair[];
  // Word Meaning
  wordMeaningPairs?: WordMeaningPair[];
  // True / False
  isTrue?: boolean;
  // Short / Long Answer
  answerLines?: number;
  // Picture / Diagram
  image?: ImageAsset;
  // One Word
  expectedAnswer?: string;
  // Assertion & Reason
  assertion?: string;
  reason?: string;
  assertionOption?: string;
  // Case Study / Passage
  passage?: string;
};

export type Section = {
  id: string;
  title: string;
  questionType: QuestionType;
  instructions?: string;
  marksPerQuestion: number;
  questions: Question[];
};

export type PaperFormat = "a5" | "a4" | "a3";

export type Paper = {
  id: string;
  title: string;
  schoolId?: string;
  schoolName: string;
  schoolLogo?: ImageAsset;
  board: string;
  className: string;
  subject: string;
  examName: string;
  date: string;
  duration: string;
  maximumMarks: number;
  instructions: string[];
  sections: Section[];
  templateFormat: PaperFormat;
  fontFamily: "Mangal" | "Calibri" | "Inter" | "Times New Roman";
  includeAnswerKey?: boolean;
  updatedAt: string;
};

export const questionMeta: Record<
  QuestionType,
  { label: string; description: string; defaultMarks: number; category: "core" | "advanced" }
> = {
  collection: {
    label: "Question Collection (Group)",
    description: "Group of multiple questions sharing the same format under a single heading",
    defaultMarks: 1,
    category: "core",
  },
  section_header: {
    label: "Section Heading / Header Divider",
    description: "Header line dividing exam sections (e.g. I. Objective Type Questions)",
    defaultMarks: 0,
    category: "core",
  },
  mcq: {
    label: "Multiple Choice (MCQ)",
    description: "Question with 4 selectable options (A, B, C, D)",
    defaultMarks: 1,
    category: "core",
  },
  fill_blank: {
    label: "Fill in the Blanks",
    description: "Statements with missing words indicated by underlines",
    defaultMarks: 1,
    category: "core",
  },
  match: {
    label: "Match the Following",
    description: "Two parallel columns (Column A & Column B) to be matched",
    defaultMarks: 4,
    category: "core",
  },
  true_false: {
    label: "True / False",
    description: "Statements requiring a True or False answer",
    defaultMarks: 1,
    category: "core",
  },
  word_meaning: {
    label: "Word Meaning / शब्दार्थ",
    description: "Vocabulary terms or word-meaning pairs with blank answer lines",
    defaultMarks: 3,
    category: "core",
  },
  short: {
    label: "Short Answer",
    description: "Concise answer questions with 2–4 answer lines",
    defaultMarks: 2,
    category: "core",
  },
  long: {
    label: "Long Answer",
    description: "Detailed explanatory questions with 6–10 answer lines",
    defaultMarks: 5,
    category: "core",
  },
  picture: {
    label: "Describe the Picture",
    description: "Image-based prompt requiring description or analysis",
    defaultMarks: 3,
    category: "core",
  },
  diagram: {
    label: "Diagram / Illustration",
    description: "Diagram to label, identify parts, or answer questions on",
    defaultMarks: 4,
    category: "core",
  },
  one_word: {
    label: "One-Word Answer",
    description: "Direct questions expecting a single word or phrase",
    defaultMarks: 1,
    category: "core",
  },
  assertion_reason: {
    label: "Assertion & Reason",
    description: "Assertion statement (A) paired with Reason statement (R)",
    defaultMarks: 1,
    category: "advanced",
  },
  case_study: {
    label: "Case Study / Passage",
    description: "Comprehension passage or scenario followed by sub-questions",
    defaultMarks: 5,
    category: "advanced",
  },
};

export const uid = (): string => Math.random().toString(36).substring(2, 9);

export const createDefaultQuestion = (type: QuestionType): Question => {
  const meta = questionMeta[type];
  const base: Question = {
    id: uid(),
    type,
    prompt: "",
    marks: meta.defaultMarks,
  };

  switch (type) {
    case "collection":
      return {
        ...base,
        prompt: "Write the answer for the following questions:",
        sectionSubtitle: "(Attempt all questions)",
        collectionType: "word_meaning",
        marks: 1,
        subQuestions: [
          {
            id: uid(),
            type: "word_meaning",
            prompt: "Word 1",
            marks: 1,
            wordMeaningPairs: [{ id: uid(), word: "सूर्य", meaning: "सूरज" }],
          },
          {
            id: uid(),
            type: "word_meaning",
            prompt: "Word 2",
            marks: 1,
            wordMeaningPairs: [{ id: uid(), word: "जल", meaning: "पानी" }],
          },
        ],
      };
    case "section_header":
      return {
        ...base,
        prompt: "Section Heading",
        sectionSubtitle: "",
        marks: 0,
      };
    case "mcq":
      return {
        ...base,
        prompt: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
      };
    case "fill_blank":
      return {
        ...base,
        prompt: "",
        blankAnswers: [""],
      };
    case "match":
      return {
        ...base,
        prompt: "",
        matchPairs: [
          { id: uid(), left: "", right: "" },
          { id: uid(), left: "", right: "" },
        ],
      };
    case "true_false":
      return {
        ...base,
        prompt: "",
        isTrue: true,
      };
    case "word_meaning":
      return {
        ...base,
        prompt: "दिए गए शब्दों के अर्थ लिखो:",
        wordMeaningPairs: [
          { id: uid(), word: "निबौरी" },
          { id: uid(), word: "आसरा" },
          { id: uid(), word: "सवाल" },
          { id: uid(), word: "हल" },
          { id: uid(), word: "निर्णय" },
          { id: uid(), word: "परिचय" },
        ],
      };
    case "short":
      return {
        ...base,
        prompt: "",
        answerLines: 3,
      };
    case "long":
      return {
        ...base,
        prompt: "",
        answerLines: 6,
      };
    case "picture":
      return {
        ...base,
        prompt: "",
      };
    case "diagram":
      return {
        ...base,
        prompt: "",
        answerLines: 5,
      };
    case "one_word":
      return {
        ...base,
        prompt: "",
        expectedAnswer: "",
      };
    case "assertion_reason":
      return {
        ...base,
        prompt: "",
        assertion: "",
        reason: "",
        assertionOption: "",
      };
    case "case_study":
      return {
        ...base,
        prompt: "",
        passage: "",
        subQuestions: [],
      };
    default:
      return base;
  }
};

export const createDefaultSection = (
  letter: string,
  title?: string,
  questionType: QuestionType = "mcq"
): Section => ({
  id: uid(),
  title: title || `Section ${letter}`,
  questionType,
  marksPerQuestion: 1,
  instructions: "",
  questions: [],
});

export const createDefaultPaper = (): Paper => ({
  id: uid(),
  title: "",
  schoolName: "",
  board: "",
  className: "",
  subject: "",
  examName: "",
  date: "",
  duration: "",
  maximumMarks: 0,
  instructions: [],
  sections: [],
  templateFormat: "a5",
  fontFamily: "Calibri",
  includeAnswerKey: false,
  updatedAt: new Date().toISOString(),
});

export const createHindiSamplePaper = (): Paper => ({
  id: uid(),
  title: "FIRST TERM EXAMINATION 2026-27",
  schoolName: "",
  board: "",
  className: "CLASS – 2ND",
  subject: "HINDI",
  examName: "FIRST TERM EXAMINATION 2026-27",
  date: "",
  duration: "2 HRS.",
  maximumMarks: 80,
  instructions: [],
  sections: [
    {
      id: uid(),
      title: "Main Section",
      questionType: "mcq",
      instructions: "",
      marksPerQuestion: 1,
      questions: [
        // 1. Essay
        {
          id: uid(),
          type: "long",
          prompt: "1. किसी एक विषय पर निबंध लिखो :-\n   'मेरी गाय'   अथवा   'मेरा स्कूल'",
          marks: 10,
          answerLines: 6,
        },
        // 2. Application
        {
          id: uid(),
          type: "long",
          prompt: "2. बीमारी के कारण छुट्टी लेने के लिए मुख्य अध्यापिका को प्रार्थना पत्र लिखो।",
          marks: 10,
          answerLines: 6,
        },
        // 3. Moral Story
        {
          id: uid(),
          type: "short",
          prompt: "3. कहानी – 'लालची कुत्ता' की शिक्षा भावार्थ सहित लिखो।",
          marks: 4,
          answerLines: 4,
        },
        // 4. Collection: Word Meanings
        {
          id: uid(),
          type: "collection",
          prompt: "4. दिए गए शब्दों के अर्थ लिखो (कोई 5 करो) :-",
          sectionSubtitle: "",
          collectionType: "word_meaning",
          marks: 2,
          subQuestions: [
            { id: uid(), type: "word_meaning", prompt: "गुफा", marks: 2, wordMeaningPairs: [{ id: uid(), word: "गुफा" }] },
            { id: uid(), type: "word_meaning", prompt: "अब्बा", marks: 2, wordMeaningPairs: [{ id: uid(), word: "अब्बा" }] },
            { id: uid(), type: "word_meaning", prompt: "मुसीबत", marks: 2, wordMeaningPairs: [{ id: uid(), word: "मुसीबत" }] },
            { id: uid(), type: "word_meaning", prompt: "सदा", marks: 2, wordMeaningPairs: [{ id: uid(), word: "सदा" }] },
            { id: uid(), type: "word_meaning", prompt: "कूड़ेदान", marks: 2, wordMeaningPairs: [{ id: uid(), word: "कूड़ेदान" }] },
            { id: uid(), type: "word_meaning", prompt: "निराली", marks: 2, wordMeaningPairs: [{ id: uid(), word: "निराली" }] },
          ],
        },
        // 5. Collection: MCQ Tick Box Questions
        {
          id: uid(),
          type: "collection",
          prompt: "5. सही उत्तर पर (✓) का निशान लगाओ :-",
          sectionSubtitle: "",
          collectionType: "mcq",
          marks: 1,
          subQuestions: [
            {
              id: uid(),
              type: "mcq",
              prompt: "क ) चूज़े के ऊपर क्या गिरा था ?",
              marks: 1,
              options: ["पेड़ ( )", "आसमान ( )", "आम ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ख ) होली पर क्या खाया जाता है ?",
              marks: 1,
              options: ["जलेबी ( )", "गुझिया ( )", "लड्डू ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ग ) चिड़िया क्या देखकर परेशान हो गई ?",
              marks: 1,
              options: ["केले का छिलका ( )", "साफ़ सफ़ाई ( )", "मूंगफली के छिलके ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "घ ) पेड़ के नीचे कौन लेता था ?",
              marks: 1,
              options: ["खरगोश ( )", "चूहा ( )", "चूज़ा ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ङ ) चूज़े की बात पर कौन हँसा था ?",
              marks: 1,
              options: ["शेर ( )", "हाथी ( )", "लोमड़ी ( )"],
            },
          ],
        },
        // 6. Collection: Fill in the Blanks with Word Bank
        {
          id: uid(),
          type: "collection",
          prompt: "6. खाली स्थान भरकर वाक्य पूरे कीजिए :-",
          sectionSubtitle: "(पुस्तके , सफ़ाई , झाड़ू , परदे , अलमारी)",
          collectionType: "fill_blank",
          marks: 2.5,
          subQuestions: [
            { id: uid(), type: "fill_blank", prompt: "क) पापा ने ______ झाड़े।", marks: 2.5 },
            { id: uid(), type: "fill_blank", prompt: "ख) भैया ने ____ मे ____ लगाई ।", marks: 2.5 },
            { id: uid(), type: "fill_blank", prompt: "ग) आज सबने घर मे _____ की।", marks: 2.5 },
            { id: uid(), type: "fill_blank", prompt: "घ) मम्मी ने ______ लगाई ।", marks: 2.5 },
          ],
        },
        // 7. Collection: Short Answer Questions
        {
          id: uid(),
          type: "collection",
          prompt: "7. दिए गए प्रश्नों के उत्तर लिखो :- कोई 5 करो",
          sectionSubtitle: "",
          collectionType: "short",
          marks: 2,
          subQuestions: [
            { id: uid(), type: "short", prompt: "क) चिड़िया ने नेहा को क्या समझाया ?", marks: 2, answerLines: 2 },
            { id: uid(), type: "short", prompt: "ख) हवाई जहाज़ का रंग कैसा था?", marks: 2, answerLines: 2 },
            { id: uid(), type: "short", prompt: "ग) दीवाली पर क्या जलते हैं ?", marks: 2, answerLines: 2 },
            { id: uid(), type: "short", prompt: "घ) शेर को किस बात पर हैरानी हुई?", marks: 2, answerLines: 2 },
            { id: uid(), type: "short", prompt: "ङ) होली पर हम क्या करते है?", marks: 2, answerLines: 2 },
          ],
        },
        // 8. Section Header: Grammar Section
        {
          id: uid(),
          type: "section_header",
          prompt: "8. व्याकरण भाग",
          sectionSubtitle: "",
          marks: 0,
        },
        // 8.1 Match Opposites
        {
          id: uid(),
          type: "match",
          prompt: "1) उलटे अर्थ वाले शब्दो से मिलाओ :-",
          marks: 5,
          matchPairs: [
            { id: uid(), left: "हँसना", right: "बड़ा" },
            { id: uid(), left: "अंदर", right: "पास" },
            { id: uid(), left: "आगे", right: "बाहर" },
            { id: uid(), left: "छोटा", right: "रोना" },
            { id: uid(), left: "दूर", right: "पीछे" },
          ],
        },
        // 8.2 Collection: Odd One Out / Rhyming
        {
          id: uid(),
          type: "collection",
          prompt: "2) समान तुक वाले शब्दो से अलग शब्द पर (✓) लगाओ :-",
          sectionSubtitle: "",
          collectionType: "mcq",
          marks: 1,
          subQuestions: [
            { id: uid(), type: "mcq", prompt: "शेर -", marks: 1, options: ["बेर", "सेब", "देर"] },
            { id: uid(), type: "mcq", prompt: "भाग -", marks: 1, options: ["जाग", "दाग", "दवात"] },
            { id: uid(), type: "mcq", prompt: "कितना -", marks: 1, options: ["कहाँ", "जितना", "इतना"] },
          ],
        },
        // 8.3 Collection: Anusvara
        {
          id: uid(),
          type: "collection",
          prompt: "3) सही जगह पर (ं) लगाकर शब्द बनाओ -",
          sectionSubtitle: "",
          collectionType: "one_word",
          marks: 1,
          subQuestions: [
            { id: uid(), type: "one_word", prompt: "गदा", marks: 1 },
            { id: uid(), type: "one_word", prompt: "सतरा", marks: 1 },
            { id: uid(), type: "one_word", prompt: "बदर", marks: 1 },
          ],
        },
        // 8.4 Match Gender
        {
          id: uid(),
          type: "match",
          prompt: "4) जोड़े बनाओ -",
          marks: 4,
          matchPairs: [
            { id: uid(), left: "चाचा", right: "मामी" },
            { id: uid(), left: "नाना", right: "माता" },
            { id: uid(), left: "पिता", right: "चाची" },
            { id: uid(), left: "मामा", right: "नानी" },
          ],
        },
        // 8.5 Collection: Fill 'मे' or 'मैं'
        {
          id: uid(),
          type: "collection",
          prompt: "5) ' मे ' या ' मै ' लगाकर वाक्य पूरे करो -",
          sectionSubtitle: "",
          collectionType: "fill_blank",
          marks: 1,
          subQuestions: [
            { id: uid(), type: "fill_blank", prompt: "क) सब नगर - कीर्तन ___ जाते है।", marks: 1 },
            { id: uid(), type: "fill_blank", prompt: "ख) होली ---------- रंग लगाते है।", marks: 1 },
            { id: uid(), type: "fill_blank", prompt: "ग) _____ सबके साथ प्यार से रहता हूँ।", marks: 1 },
            { id: uid(), type: "fill_blank", prompt: "घ) _____ दीवाली पर मिठाई खाता हूँ।", marks: 1 },
          ],
        },
        // 8.6 Picture Composition
        {
          id: uid(),
          type: "picture",
          prompt: "6) नीचे दिए गए दृश्य पर पाँच पंक्तियाँ लिखे ।",
          marks: 2,
          answerLines: 5,
        },
      ],
    },
  ],
  templateFormat: "a4",
  fontFamily: "Mangal",
  includeAnswerKey: false,
  updatedAt: new Date().toISOString(),
});

export const calculateQuestionMarks = (q: Question): number => {
  if (q.type === "section_header") return 0;
  if (q.type === "collection") {
    return Number(q.marks) || 0;
  }
  return Number(q.marks) || 0;
};

export const calculateTotalQuestions = (paper: Paper): number =>
  paper.sections.reduce((acc, sec) => {
    return (
      acc +
      sec.questions.reduce((qAcc, q) => {
        if (q.type === "section_header") return qAcc;
        if (q.type === "collection") return qAcc + (q.subQuestions?.length || 0);
        return qAcc + 1;
      }, 0)
    );
  }, 0);

export const calculateTotalMarks = (paper: Paper): number => {
  const raw = paper.sections.reduce(
    (acc, sec) =>
      acc +
      sec.questions.reduce((qAcc, q) => qAcc + calculateQuestionMarks(q), 0),
    0
  );
  return Math.round(raw * 100) / 100;
};

export function toRoman(num: number): string {
  const lookup: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let roman = "";
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman || "I";
}

export function formatSectionTitleWithRoman(title: string, index: number): string {
  const roman = toRoman(index + 1);
  const trimmed = (title || "").trim();
  if (!trimmed) return `SECTION ${roman}`;
  if (/^([I|V|X|L|C|D|M]+\.|\(?SECTION\)?)/i.test(trimmed)) {
    return trimmed;
  }
  return `${roman}. ${trimmed}`;
}
