import * as fs from 'fs';
import { Paper, Question, Section, uid } from './lib/model/paper';
import { generatePaperDocxBlob } from './lib/docx/generate-paper-docx';

async function main() {
  const paper: Paper = {
    id: uid(),
    title: 'All Question Types and Conditions Spec',
    schoolName: 'MASTER A5 LAYOUT ENGINE SPEC',
    board: 'TEST BOARD',
    className: 'CLASS – TEST',
    subject: 'SPECIFICATION',
    examName: 'ALL QUESTION TYPES AND CONDITIONS',
    date: '2026-08-04',
    duration: '3 HRS.',
    maximumMarks: 100,
    instructions: [
      'This document contains all possible question types and conditions.',
      'It uses the Master A5 layout engine from generate-paper-docx.ts.',
    ],
    templateFormat: 'a5',
    fontFamily: 'Calibri',
    includeAnswerKey: true,
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: uid(),
        title: 'Section 1: Section Headings & Collections',
        questionType: 'collection',
        marksPerQuestion: 1,
        questions: [
          {
            id: uid(),
            type: 'section_header',
            prompt: 'I. OBJECTIVE QUESTIONS',
            sectionSubtitle: 'Attempt all questions',
            marks: 10,
          },
          // Collection of Word Meanings
          {
            id: uid(),
            type: 'collection',
            prompt: '1. Collection of Word Meanings (1 pair, 2 pairs, 4 pairs, 6 pairs):',
            collectionType: 'word_meaning',
            marks: 1,
            subQuestions: [
              { id: uid(), type: 'word_meaning', prompt: 'Pair 1', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Happy' }] },
              
              { id: uid(), type: 'word_meaning', prompt: 'Pair 2A', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Sad' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 2B', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Angry' }] },
              
              { id: uid(), type: 'word_meaning', prompt: 'Pair 4A', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Big' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 4B', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Small' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 4C', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Hot' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 4D', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Cold' }] },
              
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6A', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Fast' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6B', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Slow' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6C', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Up' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6D', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Down' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6E', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Left' }] },
              { id: uid(), type: 'word_meaning', prompt: 'Pair 6F', marks: 1, wordMeaningPairs: [{ id: uid(), word: 'Right' }] },
            ],
          },
          // Collection of MCQs
          {
            id: uid(),
            type: 'collection',
            prompt: '2. Collection of MCQs:',
            collectionType: 'mcq',
            marks: 1,
            subQuestions: [
              { id: uid(), type: 'mcq', prompt: '2 options MCQ:', marks: 1, options: ['Option A', 'Option B'] },
              { id: uid(), type: 'mcq', prompt: '3 options MCQ:', marks: 1, options: ['Option A', 'Option B', 'Option C'] },
              { id: uid(), type: 'mcq', prompt: '4 options MCQ:', marks: 1, options: ['Option A', 'Option B', 'Option C', 'Option D'] },
              { id: uid(), type: 'mcq', prompt: '5 options MCQ:', marks: 1, options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'] },
              { id: uid(), type: 'mcq', prompt: '6 options (Tick box) MCQ:', marks: 1, options: ['A ( )', 'B ( )', 'C ( )', 'D ( )', 'E ( )', 'F ( )'] },
            ],
          },
          // Collection of Fill in Blanks
          {
            id: uid(),
            type: 'collection',
            prompt: '3. Collection of Fill in Blanks:',
            sectionSubtitle: '(पुस्तके, सफ़ाई, झाड़ू, परदे, अलमारी)',
            collectionType: 'fill_blank',
            marks: 1,
            subQuestions: [
              { id: uid(), type: 'fill_blank', prompt: 'Single blank ______ here.', marks: 1 },
              { id: uid(), type: 'fill_blank', prompt: 'Multiple blanks ______ and ______. ', marks: 1 },
            ],
          },
          // Collection of Short Answers
          {
            id: uid(),
            type: 'collection',
            prompt: '4. Collection of Short Answers:',
            collectionType: 'short',
            marks: 2,
            subQuestions: [
              { id: uid(), type: 'short', prompt: '1 line answer:', marks: 1, answerLines: 1 },
              { id: uid(), type: 'short', prompt: '2 lines answer:', marks: 2, answerLines: 2 },
              { id: uid(), type: 'short', prompt: '4 lines answer:', marks: 4, answerLines: 4 },
            ],
          },
          // Collection of True/False
          {
            id: uid(),
            type: 'collection',
            prompt: '5. Collection of True/False:',
            collectionType: 'true_false',
            marks: 1,
            subQuestions: [
              { id: uid(), type: 'true_false', prompt: 'The sky is blue.', marks: 1, isTrue: true },
              { id: uid(), type: 'true_false', prompt: 'The grass is red.', marks: 1, isTrue: false },
            ],
          },
        ],
      },
      {
        id: uid(),
        title: 'Section 2: Standalone Questions',
        questionType: 'mcq',
        marksPerQuestion: 1,
        questions: [
          {
            id: uid(),
            type: 'section_header',
            prompt: 'II. STANDALONE QUESTIONS',
            sectionSubtitle: 'Subjective & Objective Mix',
            marks: 20,
          },
          // Standalone MCQ
          { id: uid(), type: 'mcq', prompt: 'Standalone MCQ (2 options)', marks: 1, options: ['Yes', 'No'] },
          { id: uid(), type: 'mcq', prompt: 'Standalone MCQ (3 options)', marks: 1, options: ['A', 'B', 'C'] },
          { id: uid(), type: 'mcq', prompt: 'Standalone MCQ (4 options)', marks: 1, options: ['A', 'B', 'C', 'D'] },
          { id: uid(), type: 'mcq', prompt: 'Standalone MCQ (5 options)', marks: 1, options: ['A', 'B', 'C', 'D', 'E'] },
          // Standalone Fill in Blanks
          { id: uid(), type: 'fill_blank', prompt: 'Standalone single blank ______.', marks: 1 },
          { id: uid(), type: 'fill_blank', prompt: 'Standalone multiple blanks ______ and ______.', marks: 2 },
          // Match the Following
          {
            id: uid(),
            type: 'match',
            prompt: 'Match the Following (2 pairs):',
            marks: 2,
            matchPairs: [
              { id: uid(), left: 'A', right: 'Apple' },
              { id: uid(), left: 'B', right: 'Banana' },
            ],
          },
          {
            id: uid(),
            type: 'match',
            prompt: 'Match the Following (4 pairs):',
            marks: 4,
            matchPairs: [
              { id: uid(), left: 'Cat', right: 'Meow' },
              { id: uid(), left: 'Dog', right: 'Bark' },
              { id: uid(), left: 'Cow', right: 'Moo' },
              { id: uid(), left: 'Duck', right: 'Quack' },
            ],
          },
          {
            id: uid(),
            type: 'match',
            prompt: 'Match the Following (6 pairs text and number matching):',
            marks: 6,
            matchPairs: [
              { id: uid(), left: '1', right: 'One' },
              { id: uid(), left: '2', right: 'Two' },
              { id: uid(), left: '3', right: 'Three' },
              { id: uid(), left: '4', right: 'Four' },
              { id: uid(), left: '5', right: 'Five' },
              { id: uid(), left: '6', right: 'Six' },
            ],
          },
          // True/False
          { id: uid(), type: 'true_false', prompt: 'Standalone True/False inline prompt.', marks: 1, isTrue: true },
          // Word Meaning standalone
          {
            id: uid(),
            type: 'word_meaning',
            prompt: 'Word Meaning standalone 2-column grid:',
            marks: 2,
            wordMeaningPairs: [
              { id: uid(), word: 'Sun' },
              { id: uid(), word: 'Moon' },
              { id: uid(), word: 'Star' },
              { id: uid(), word: 'Planet' },
            ],
          },
          // Short Answer
          { id: uid(), type: 'short', prompt: 'Standalone Short Answer (1 line):', marks: 1, answerLines: 1 },
          { id: uid(), type: 'short', prompt: 'Standalone Short Answer (2 lines):', marks: 2, answerLines: 2 },
          { id: uid(), type: 'short', prompt: 'Standalone Short Answer (4 lines):', marks: 4, answerLines: 4 },
          // Long Answer
          { id: uid(), type: 'long', prompt: 'Standalone Long Answer (6 lines):', marks: 5, answerLines: 6 },
          { id: uid(), type: 'long', prompt: 'Standalone Long Answer (10 lines):', marks: 8, answerLines: 10 },
          // Picture / Diagram prompt
          {
            id: uid(),
            type: 'picture',
            prompt: 'Identify the object in this picture:',
            marks: 3,
            answerLines: 3,
          },
          {
            id: uid(),
            type: 'diagram',
            prompt: 'Label the diagram below:',
            marks: 4,
            answerLines: 5,
          },
          // One Word Answer
          { id: uid(), type: 'one_word', prompt: 'Standalone One Word Answer prompt:', marks: 1 },
          // Assertion & Reason
          {
            id: uid(),
            type: 'assertion_reason',
            prompt: 'Evaluate the statements:',
            assertion: 'Water boils at 100 degrees Celsius.',
            reason: 'Heat causes molecules to move faster.',
            marks: 1,
            options: [
              'Both A and R are true, and R is the correct explanation of A.',
              'Both A and R are true, but R is not the correct explanation of A.',
              'A is true, but R is false.',
              'A is false, but R is true.',
            ],
          },
          // Case Study / Passage
          {
            id: uid(),
            type: 'case_study',
            prompt: 'Read the passage and answer the questions:',
            passage: 'Once upon a time in a dense forest, lived a clever fox and a foolish crow. The crow found a piece of cheese. The fox wanted the cheese.',
            marks: 3,
            subQuestions: [
              { id: uid(), type: 'short', prompt: 'Who are the animals?', marks: 1, answerLines: 1 },
              { id: uid(), type: 'short', prompt: 'What did the crow find?', marks: 1, answerLines: 1 },
              { id: uid(), type: 'short', prompt: 'What did the fox want?', marks: 1, answerLines: 1 },
            ],
          },
        ],
      },
    ],
  };

  try {
    const blob = await generatePaperDocxBlob(paper, true); // true for showAnswers
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const path1 = 'C:/Users/Ranbi/Downloads/All_Question_Types_Conditions_Spec.docx';
    const path2 = 'd:/Projects/Paperly/public/All_Question_Types_Conditions_Spec.docx';

    fs.writeFileSync(path1, buffer);
    console.log(`Document successfully saved to ${path1} (Size: ${buffer.length} bytes)`);

    fs.writeFileSync(path2, buffer);
    console.log(`Document successfully saved to ${path2} (Size: ${buffer.length} bytes)`);
  } catch (error) {
    console.error('Error generating document:', error);
  }
}

main();
