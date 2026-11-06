import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { Paper, Question, Section, formatSectionTitleWithRoman } from "../model/paper";

// Convert base64 data URL to Uint8Array for docx ImageRun
function dataUrlToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    const base64Index = dataUrl.indexOf(";base64,");
    if (base64Index === -1) return null;
    const base64 = dataUrl.substring(base64Index + 8);
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Failed to convert image dataUrl:", e);
    return null;
  }
}

function hasExistingNumberingPrefix(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  // Only match: (a), (1), Q1., 1., 1) — strict numeric/alpha prefixes at start
  // Does NOT match plain Hindi/English words
  return /^\s*(\([a-zA-Z0-9]+\)|Q\d+[\.\)]|\d+[\.\)]|[a-zA-Z][\.\)])/i.test(trimmed);
}

export async function generatePaperDocxBlob(
  paper: Paper,
  showAnswers: boolean = false
): Promise<Blob> {
  const font = paper.fontFamily || "Calibri";
  const shouldIncludeAnswers = showAnswers || !!paper.includeAnswerKey;

  // Dimensions based on page format (A5 default)
  let pageWidth = 8391;
  let pageHeight = 11906;

  if (paper.templateFormat === "a4") {
    pageWidth = 11906;
    pageHeight = 16838;
  } else if (paper.templateFormat === "a3") {
    pageWidth = 16838;
    pageHeight = 23811;
  }

  // Narrow Margins: 720 twips (1.27cm = 0.5 inch) — Word "Narrow" preset
  const marginTwips = 720;

  // Base font size: 12pt = 24 half-points
  const SZ = 24;       // 12pt body text
  const SZ_SM = 22;    // 11pt smaller text (subtitles, instructions)
  const SZ_HDR = 28;   // 14pt school name header
  const SZ_SUB = 24;   // 12pt sub-header lines

  const children: (Paragraph | Table)[] = [];

  // 1. School Header (Centered)
  if (paper.schoolName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: paper.schoolName.toUpperCase(),
            bold: true,
            size: SZ_HDR, // 14pt
            font,
          }),
        ],
      })
    );
  }

  // Exam Name & Class (Centered)
  const subHeaderLine = [paper.examName, paper.className, paper.board]
    .filter(Boolean)
    .join(" | ");

  if (subHeaderLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: subHeaderLine.toUpperCase(),
            bold: true,
            size: SZ_SM, // 11pt sub-header
            font,
          }),
        ],
      })
    );
  }

  // Subject & Date (Centered)
  const subjectDateLine = [
    paper.subject ? `SUBJECT: ${paper.subject.toUpperCase()}` : null,
    paper.date ? `DATE: ${paper.date}` : null,
  ]
    .filter(Boolean)
    .join("   •   ");

  if (subjectDateLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: subjectDateLine,
            bold: true,
            size: SZ_SUB, // 10pt
            font,
          }),
        ],
      })
    );
  }

  // 2. Time & Max Marks Table Box (Centered Header Block)
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
        new TableRow({ cantSplit: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `TIME ALLOWED: ${paper.duration ? paper.duration.toUpperCase() : "N/A"}`,
                      bold: true,
                      size: SZ,
                      font,
                    }),
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
                    new TextRun({
                      text: `MAXIMUM MARKS: ${paper.maximumMarks || 0}`,
                      bold: true,
                      size: SZ,
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

  children.push(new Paragraph({ spacing: { after: 100 } }));

  // ========================================================
  // FROM GENERAL INSTRUCTIONS ONWARDS: EVERYTHING IS LEFT-ALIGNED! NO DECOS!
  // ========================================================

  if (paper.instructions && paper.instructions.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: "GENERAL INSTRUCTIONS:",
            bold: true,
            underline: {},
            size: SZ,
            font,
          }),
        ],
      })
    );

    paper.instructions.forEach((inst, idx) => {
      if (inst.trim()) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${inst}`,
                size: SZ,
                font,
              }),
            ],
          })
        );
      }
    });
    children.push(new Paragraph({ spacing: { after: 100 } }));
  }

  // Collect all questions & section headers across sections
  const allQuestions: Question[] = [];
  paper.sections.forEach((sec) => {
    if (sec.questions) {
      allQuestions.push(...sec.questions);
    }
  });

  // Global question counter across questions (excluding section headers)
  let globalQNum = 1;
  let headingCount = 0;

  // Process Questions & Section Dividers
  allQuestions.forEach((q: Question, qIdx: number) => {
    // If Item is a Section Header Divider
    if (q.type === "section_header") {
      // Calculate marks for questions following this header until next header
      let subMarks = 0;
      for (let i = qIdx + 1; i < allQuestions.length; i++) {
        if (allQuestions[i].type === "section_header") break;
        subMarks += Number(allQuestions[i].marks) || 0;
      }
      subMarks = Math.round(subMarks * 100) / 100;

      const formattedSectionTitle = formatSectionTitleWithRoman(
        q.prompt || "SECTION",
        headingCount
      );
      headingCount++;

      // Clean Section Header Table (Left title, Right total marks [X], NO DECOS!)
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({ cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 85, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      spacing: { before: 140, after: 20 },
                      children: [
                        new TextRun({
                          text: formattedSectionTitle,
                          bold: true,
                          size: SZ_SUB,
                          font,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 140, after: 20 },
                      children: [
                        new TextRun({
                          text: subMarks > 0 ? `[${subMarks}]` : "",
                          size: SZ,
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

      if (q.sectionSubtitle) {
        const secSubtitle = q.sectionSubtitle.startsWith("(") ? q.sectionSubtitle : `(${q.sectionSubtitle})`;
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            keepNext: true,
            children: [
              new TextRun({
                text: secSubtitle,
                italics: true,
                size: SZ_SM,
                font,
              }),
            ],
          })
        );
      }

      return;
    }

    // If Item is a Question Collection
    if (q.type === "collection") {
      const collectionFormat = q.collectionType || "word_meaning";
      const subQs = q.subQuestions || [];
      // Collection marks are entered once for the whole group. Do not derive
      // them from sub-question count because groups may use "attempt any" rules.
      const totalColMarks = Number(q.marks) || 0;
      const colQNum = globalQNum++;
      const colPrompt = q.prompt || "Question Collection";
      // Always show Q number for collections (they are top-level questions)
      const colPrefix = `Q${colQNum}. `;

      // Render Collection Header Table
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({ cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 85, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      spacing: { before: 120, after: 20 },
                      keepNext: true,
                      children: [
                        // Collection instruction heading — bold (it is the instruction, not a question)
                        new TextRun({
                          text: colPrefix,
                          bold: false,
                          size: SZ,
                          font,
                        }),
                        new TextRun({
                          text: colPrompt,
                          bold: true,
                          size: SZ,
                          font,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 120, after: 20 },
                      children: [
                        new TextRun({
                          text: totalColMarks > 0 ? `[${totalColMarks}]` : "",
                          size: SZ,
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

      if (q.sectionSubtitle) {
        const subtitle = q.sectionSubtitle.startsWith("(") ? q.sectionSubtitle : `(${q.sectionSubtitle})`;
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            keepNext: true,
            children: [
              new TextRun({
                text: subtitle,
                italics: true,
                size: SZ_SM,
                font,
              }),
            ],
          })
        );
      }

      // If Word Meaning collection: format in 2-column pairs table
      if (collectionFormat === "word_meaning") {
        for (let i = 0; i < subQs.length; i += 2) {
          const leftQ = subQs[i];
          const rightQ = subQs[i + 1];
          const leftWord = leftQ?.wordMeaningPairs?.[0]?.word || leftQ?.prompt || `Word ${i + 1}`;
          const rightWord = rightQ ? (rightQ.wordMeaningPairs?.[0]?.word || rightQ.prompt || `Word ${i + 2}`) : null;

          const leftLetter = String.fromCharCode(97 + i);
          const rightLetter = String.fromCharCode(97 + i + 1);

          const leftPrefix = hasExistingNumberingPrefix(leftWord) ? "" : `(${leftLetter}) `;
          const rightPrefix = rightWord && !hasExistingNumberingPrefix(rightWord) ? `(${rightLetter}) ` : "";

          children.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({ cantSplit: true,
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          spacing: { before: 30, after: 30 },
                          children: [
                            new TextRun({ text: leftPrefix, size: SZ, font }),
                            new TextRun({ text: `${leftWord} `, size: SZ, font }),
                            new TextRun({ text: "____________________", size: SZ, font }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        rightQ
                          ? new Paragraph({
                              alignment: AlignmentType.LEFT,
                              spacing: { before: 30, after: 30 },
                              children: [
                                new TextRun({ text: rightPrefix, size: SZ, font }),
                                new TextRun({ text: `${rightWord} `, size: SZ, font }),
                                new TextRun({ text: "____________________", size: SZ, font }),
                              ],
                            })
                          : new Paragraph({ children: [] }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          );
        }
      } else {
        // Render sub-questions based on collectionFormat
        subQs.forEach((sq, sqIdx) => {
          const letter = String.fromCharCode(97 + sqIdx);
          const sqPrefix = hasExistingNumberingPrefix(sq.prompt) ? "" : `(${letter}) `;
          // Per-item hint (word bank stored in sectionSubtitle for fill_blank items)
          const sqHint = (sq.sectionSubtitle || "").trim();
          const showHint = sqHint.length > 0;

          if (collectionFormat === "true_false") {
            // True/False: prompt left, [ True / False ] right
            children.push(
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
                },
                rows: [
                  new TableRow({ cantSplit: true,
                    children: [
                      new TableCell({
                        width: { size: 75, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 30, after: 30 },
                            children: [
                              // sub-label bold, question text normal
                              new TextRun({ text: sqPrefix, size: SZ, font }),
                              new TextRun({ text: sq.prompt || "", size: SZ, font }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 25, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 30, after: 30 },
                            children: [
                              new TextRun({ text: "[ True / False ]", size: SZ_SM, font }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              })
            );

          } else if (collectionFormat === "fill_blank" && showHint) {
            // Fill-in-blanks WITH per-item hint: prompt left, hint right (like reference image)
            children.push(
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
                },
                rows: [
                  new TableRow({ cantSplit: true,
                    children: [
                      new TableCell({
                        width: { size: 65, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 30, after: 30 },
                            children: [
                              new TextRun({ text: sqPrefix, size: SZ, font }),
                              new TextRun({ text: sq.prompt || "", size: SZ, font }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 35, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 30, after: 30 },
                            children: [
                              // Hint in parentheses on the right — e.g. ( गायों / भेड़ों )
                              new TextRun({
                                text: sqHint.startsWith("(") ? sqHint : `( ${sqHint} )`,
                                size: SZ_SM,
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

          } else {
            // Default: Prompt line (MCQ, short, fill_blank without hint, etc.)
            const hasOpts = sq.options && sq.options.filter(o => o.trim()).length > 0;
            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 40, after: hasOpts ? 20 : 40 },
                keepNext: hasOpts,
                children: [
                  // sub-label bold, question text normal
                  new TextRun({ text: sqPrefix, size: SZ, font }),
                  new TextRun({ text: sq.prompt || "", size: SZ, font }),
                ],
              })
            );

            // MCQ Options inside Collection — filter out empty options
            if (hasOpts) {
              const validOpts = (sq.options || []).filter(o => o.trim().length > 0);
              const optTexts = validOpts.map((opt, oIdx) => {
                const optLetter = String.fromCharCode(65 + oIdx);
                const isTickBox = opt.includes("( )");
                return isTickBox ? `${opt}   ` : `(${optLetter}) ${opt}   `;
              });

              let itemsPerLine = 2;
              if (optTexts.length === 3 || optTexts.length === 5 || optTexts.length === 6) {
                itemsPerLine = 3;
              }

              for (let i = 0; i < optTexts.length; i += itemsPerLine) {
                const chunk = optTexts.slice(i, i + itemsPerLine);
                children.push(
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    indent: { left: 360 },
                    spacing: { before: i === 0 ? 20 : 10, after: (i + itemsPerLine >= optTexts.length) ? 40 : 10 },
                    children: [
                      new TextRun({
                        text: chunk.join("        "),
                        size: SZ_SM,
                        font,
                      })
                    ],
                  })
                );
              }
            }

            // Answer lines for Short/Long answers inside Collection
            if (sq.answerLines && sq.answerLines > 0) {
              for (let l = 0; l < sq.answerLines; l++) {
                children.push(
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    indent: { left: 360 },
                    spacing: { before: 20, after: 20 },
                    children: [
                      new TextRun({
                        text: "________________________________________",
                        size: SZ_SM,
                        font,
                      }),
                    ],
                  })
                );
              }
            }
          }
        });
      }

      // NOTE: globalQNum already incremented above for collection
      return;
    }

    // True/False questions: 100% INLINE layout (Question prompt on Left, [ True / False ] on Right on SAME line!)
      if (q.type === "true_false") {
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
              new TableRow({ cantSplit: true,
                children: [
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 50, after: 30 },
                        children: [
                          new TextRun({
                            text: hasExistingNumberingPrefix(q.prompt) ? "" : `Q${globalQNum}. `,
                            bold: false,
                            size: SZ,
                            font,
                          }),
                          new TextRun({
                            text: q.prompt || "",
                            size: SZ,
                            font,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 50, after: 30 },
                        children: [
                          new TextRun({
                            text: "[ True / False ]",
                            size: SZ_SM,
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
        globalQNum++;
        return;
      }

      // Standard question line: keep the question text normal and show marks
      // consistently for every top-level question.
      const qNum = globalQNum;
      const qParagraph = new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 50, after: 20 },
        keepLines: true,
        keepNext: true,
        children: [
          // Q prefix — NOT bold (matches Word style)
          new TextRun({
            text: hasExistingNumberingPrefix(q.prompt) ? "" : `Q${qNum}. `,
            bold: false,
            size: SZ,
            font,
          }),
          new TextRun({
            text: q.prompt || "",
            size: SZ,
            font,
          }),
        ],
      });
      const qMarks = Number(q.marks) > 0 ? `[${q.marks}]` : "";
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({ cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 85, type: WidthType.PERCENTAGE },
                  children: [qParagraph],
                }),
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 50, after: 20 },
                      children: [new TextRun({ text: qMarks, size: SZ, font })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Question Image if present
      if (q.image && q.image.dataUrl) {
        const imageBytes = dataUrlToUint8Array(q.image.dataUrl);
        if (imageBytes) {
          try {
            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 40, after: 60 },
                children: [
                  new ImageRun({
                    data: imageBytes,
                    transformation: {
                      width: q.image.width || 240,
                      height: q.image.height || 150,
                    },
                    type: "png",
                  }),
                ],
              })
            );
          } catch (err) {
            console.error("Error embedding image:", err);
          }
        }
      }

      // Handle Question Types
      switch (q.type) {
        case "mcq":
          const validOptions = (q.options || []).filter((opt) => opt.trim().length > 0);
          if (validOptions.length > 0) {
            const optTexts = validOptions.map(
              (opt, idx) => `(${String.fromCharCode(65 + idx)}) ${opt}`
            );
            const line1 = optTexts.slice(0, 2).join("        ");
            const line2 = optTexts.slice(2).join("        ");

            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 30 },
                children: [new TextRun({ text: line1, size: SZ_SM, font })],
              })
            );

            if (line2) {
              children.push(
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { after: 60 },
                  children: [new TextRun({ text: line2, size: SZ_SM, font })],
                })
              );
            }
          }
          break;

        case "word_meaning":
          if (q.wordMeaningPairs && q.wordMeaningPairs.length > 0) {
            const pairs = q.wordMeaningPairs;
            for (let i = 0; i < pairs.length; i += 2) {
              const pair1 = pairs[i];
              const pair2 = pairs[i + 1];

              let lineText = `${pair1.word} ___________`;
              if (pair2) {
                lineText += `          ${pair2.word} ___________`;
              }

              children.push(
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: lineText,
                      size: SZ,
                      font,
                    }),
                  ],
                })
              );
            }
          }
          break;

        case "match":
          if (q.matchPairs && q.matchPairs.length > 0) {
            const tableRows = [
              new TableRow({ cantSplit: true,
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({ text: "COLUMN A", bold: true, size: SZ_SM, font }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({ text: "COLUMN B", bold: true, size: SZ_SM, font }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ];

            q.matchPairs.forEach((pair, pIdx) => {
              tableRows.push(
                new TableRow({ cantSplit: true,
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: `${pIdx + 1}. ${pair.left}`,
                              size: SZ_SM,
                              font,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: `(${String.fromCharCode(97 + pIdx)}) ${pair.right}`,
                              size: SZ_SM,
                              font,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                })
              );
            });

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
                rows: tableRows,
              })
            );
            children.push(new Paragraph({ spacing: { after: 80 } }));
          }
          break;

        case "short":
        case "long":
        case "diagram":
          // SOLID UNDERLINES '___' (Skip if answerLines === 0)
          const lineCount = q.answerLines !== undefined ? q.answerLines : (q.type === "long" ? 6 : 3);
          for (let l = 0; l < lineCount; l++) {
            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 20 },
                children: [
                  new TextRun({
                    text: "__________________________________________________________________________________",
                    color: "9CA3AF",
                    size: SZ_SM,
                    font,
                  }),
                ],
              })
            );
          }
          break;

        case "one_word":
        case "fill_blank":
          break;

        case "assertion_reason":
          if (q.assertion || q.reason) {
            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 20 },
                children: [
                  new TextRun({ text: "Assertion (A): ", bold: true, size: SZ_SM, font }),
                  new TextRun({ text: q.assertion || "", size: SZ_SM, font }),
                ],
              })
            );
            children.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: "Reason (R): ", bold: true, size: SZ_SM, font }),
                  new TextRun({ text: q.reason || "", size: SZ_SM, font }),
                ],
              })
            );
          }
          break;

        case "case_study":
          if (q.passage) {
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
                  new TableRow({ cantSplit: true,
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 30, after: 30 },
                            children: [
                              new TextRun({
                                text: `PASSAGE: ${q.passage}`,
                                italics: true,
                                size: SZ_SM,
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
            children.push(new Paragraph({ spacing: { after: 40 } }));
          }

          if (q.subQuestions && q.subQuestions.length > 0) {
            q.subQuestions.forEach((subQ, subIdx) => {
              children.push(
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { after: 30 },
                  children: [
                    new TextRun({
                      text: `(${String.fromCharCode(97 + subIdx)}) `,
                      bold: true,
                      size: SZ_SM,
                      font,
                    }),
                    new TextRun({
                      text: `${subQ.prompt}`,
                      size: SZ_SM,
                      font,
                    }),
                  ],
                })
              );
            });
          }
          break;
      }

      globalQNum++;
    });

  // Optional Answer Key Section at End (Left Aligned)
  if (shouldIncludeAnswers) {
    children.push(new Paragraph({ spacing: { before: 200, after: 80 } }));
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: "ANSWER KEY (FOR TEACHERS)",
            bold: true,
            size: SZ_SUB,
            font,
          }),
        ],
      })
    );

    let answerNum = 1;
    paper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        let ansText = "";
        if (q.type === "mcq" && q.correctOptionIndex !== undefined && q.options) {
          ansText = `(${String.fromCharCode(65 + q.correctOptionIndex)}) ${q.options[q.correctOptionIndex] || ""}`;
        } else if (q.type === "fill_blank" && q.blankAnswers) {
          ansText = q.blankAnswers.join(", ");
        } else if (q.type === "true_false") {
          ansText = q.isTrue ? "True" : "False";
        } else if (q.type === "one_word" && q.expectedAnswer) {
          ansText = q.expectedAnswer;
        } else if (q.type === "word_meaning" && q.wordMeaningPairs) {
          ansText = q.wordMeaningPairs.map((p) => `${p.word} = ${p.meaning || "______"}`).join("; ");
        }

        if (ansText) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `Q${answerNum}: `, bold: true, size: SZ_SM, font }),
                new TextRun({ text: ansText, size: SZ_SM, font }),
              ],
            })
          );
        }
        answerNum++;
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageWidth,
              height: pageHeight,
            },
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadPaperDocx(paper: Paper, showAnswers: boolean = false) {
  // Automatically record in history
  if (typeof window !== "undefined") {
    try {
      const { usePaperStore } = require("../store/paper-store");
      usePaperStore.getState().saveToHistory(paper);
    } catch (err) {
      console.warn("Could not save paper to history:", err);
    }
  }

  generatePaperDocxBlob(paper, showAnswers).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedTitle = (paper.schoolName || paper.title || "Question_Paper")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 40);
    a.download = `${sanitizedTitle}_${paper.subject || "Exam"}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
