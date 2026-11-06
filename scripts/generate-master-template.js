const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
} = require('docx');

async function createMasterTemplate() {
  const font = "Calibri";

  const children = [];

  // Header - School Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "ST. XAVIER'S SENIOR SECONDARY SCHOOL",
          bold: true,
          size: 32, // 16pt
          font,
        }),
      ],
    })
  );

  // Exam Subheader
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "ANNUAL EXAMINATION 2026 | CLASS X (10TH) | CBSE BOARD",
          bold: true,
          size: 24, // 12pt
          font,
        }),
      ],
    })
  );

  // Subject & Date Row
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "SUBJECT: SCIENCE (086)   •   DATE: 15-09-2026",
          bold: true,
          size: 22, // 11pt
          font,
        }),
      ],
    })
  );

  // Time & Max Marks Table Box
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "TIME ALLOWED: 3 HOURS", bold: true, size: 20, font }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "MAXIMUM MARKS: 80", bold: true, size: 20, font }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { after: 120 } }));

  // General Instructions Header
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "GENERAL INSTRUCTIONS:",
          bold: true,
          underline: {},
          size: 20,
          font,
        }),
      ],
    })
  );

  const instructions = [
    "All questions are compulsory.",
    "The question paper consists of 10 sections covering all question formats.",
    "Section A contains Multiple Choice Questions (1 mark each).",
    "Section B contains Fill in the Blanks.",
    "Section C contains Match the Following.",
    "Section D contains True / False questions.",
    "Section E contains Short Answer Questions (2 marks each).",
    "Section F contains Long Answer Questions (5 marks each).",
    "Section G contains Picture & Diagram based questions.",
    "Section H contains One-Word Answers.",
    "Section I contains Assertion & Reason questions.",
    "Section J contains Case Study / Passage based questions.",
    "Use of calculators or log tables is strictly prohibited.",
  ];

  instructions.forEach((inst, idx) => {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: `${idx + 1}. ${inst}`,
            size: 20,
            font,
          }),
        ],
      })
    );
  });

  children.push(new Paragraph({ spacing: { after: 160 } }));

  // SECTION A: MCQ
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION A (MULTIPLE CHOICE QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "(Each question carries 1 mark)", italic: true, size: 20, font }),
      ],
    })
  );

  // Q1 MCQ
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q1. Which of the following is a chemical change?", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "(A) Melting of ice          (B) Rusting of iron\n(C) Boiling of water         (D) Breaking of glass", size: 20, font }),
      ],
    })
  );

  // Q2 MCQ
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q2. What is the pH value of a neutral solution at 25°C?", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({ text: "(A) 0               (B) 7               (C) 14              (D) 1", size: 20, font }),
      ],
    })
  );

  // SECTION B: FILL IN BLANKS
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION B (FILL IN THE BLANKS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q3. The functional unit of the human kidney is ___________.", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({ text: "Q4. Green plants synthesize their food through the process of ___________.", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );

  // SECTION C: MATCH THE FOLLOWING
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION C (MATCH THE FOLLOWING)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Q5. Match the items in Column A with Column B correctly:", bold: true, size: 20, font }),
        new TextRun({ text: "   [4 Marks]", bold: true, size: 20, font }),
      ],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "COLUMN A", bold: true, size: 20, font })] })],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "COLUMN B", bold: true, size: 20, font })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. Amylase", size: 20, font })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(a) Protein Digestion", size: 20, font })] })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "2. Pepsin", size: 20, font })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(b) Starch Breakdown", size: 20, font })] })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3. Lipase", size: 20, font })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(c) Fat Emulsification", size: 20, font })] })] }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { after: 160 } }));

  // SECTION D: TRUE / FALSE
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION D (TRUE / FALSE)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q6. State whether the following statements are True or False:", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "(a) Acids turn red litmus paper to blue.   [ True / False ]   [1 Mark]", size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({ text: "(b) Light travels in a straight line path.   [ True / False ]   [1 Mark]", size: 20, font }),
      ],
    })
  );

  // SECTION E: SHORT ANSWER QUESTIONS
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION E (SHORT ANSWER QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q7. Differentiate between autotrophic and heterotrophic nutrition with suitable examples.", bold: true, size: 20, font }),
        new TextRun({ text: "   [2 Marks]", bold: true, size: 20, font }),
      ],
    })
  );
  for (let i = 0; i < 4; i++) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "__________________________________________________________________________________", size: 16, color: "888888", font })],
      })
    );
  }

  // SECTION F: LONG ANSWER QUESTIONS
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "SECTION F (LONG ANSWER QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q8. Explain the working principle and construction of an Electric Motor with a labeled diagram.", bold: true, size: 20, font }),
        new TextRun({ text: "   [5 Marks]", bold: true, size: 20, font }),
      ],
    })
  );
  for (let i = 0; i < 6; i++) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "__________________________________________________________________________________", size: 16, color: "888888", font })],
      })
    );
  }

  // SECTION G: PICTURE / DIAGRAM QUESTION
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "SECTION G (DIAGRAM & ILLUSTRATION BASED QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q9. Observe the diagram below and label parts (A), (B), and (C):", bold: true, size: 20, font }),
        new TextRun({ text: "   [3 Marks]", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "[ IMAGE / DIAGRAM PLACEHOLDER HERE ]", italic: true, bold: true, size: 20, color: "555555", font }),
      ],
    })
  );

  // SECTION H: ONE-WORD ANSWER
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION H (ONE-WORD ANSWER QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q10. Name the SI unit of Electric Current: ____________________", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );

  // SECTION I: ASSERTION & REASON
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: "SECTION I (ASSERTION AND REASON QUESTIONS)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Q11. Evaluate the given Assertion (A) and Reason (R):", bold: true, size: 20, font }),
        new TextRun({ text: "   [1 Mark]", bold: true, size: 20, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: "Assertion (A): Clear sky appears blue during daytime.", italic: true, size: 20, font })],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: "Reason (R): Atmosphere scatters shorter wavelengths of light more effectively.", italic: true, size: 20, font })],
    })
  );

  // SECTION J: CASE STUDY
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "SECTION J (CASE STUDY / PASSAGE BASED QUESTION)", bold: true, size: 22, font }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Q12. Read the passage carefully and answer the sub-questions below:", bold: true, size: 20, font }),
        new TextRun({ text: "   [5 Marks]", bold: true, size: 20, font }),
      ],
    })
  );

  // Passage Box Table
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  spacing: { before: 60, after: 60 },
                  children: [
                    new TextRun({
                      text: "PASSAGE: Photosynthesis is the chemical process by which green plants manufacture glucose from carbon dioxide and water in the presence of sunlight absorbed by chlorophyll pigments.",
                      italic: true,
                      size: 20,
                      font,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: "(a) Write the balanced chemical equation of photosynthesis. [2 Marks]", size: 20, font })],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: "(b) Name the site of photosynthesis in plant cells. [1 Mark]", size: 20, font })],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Master_Exam_Paper_Template.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Master Word Template successfully generated at:', outputPath);
}

createMasterTemplate().catch(console.error);
