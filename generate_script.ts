import fs from "fs";
import { generatePaperDocxBlob } from "./lib/docx/generate-paper-docx";
import { Paper, createDefaultPaper, uid } from "./lib/model/paper";

async function saveBlob(blob: Blob, paths: string[]) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  for (const path of paths) {
    try {
      fs.writeFileSync(path, buffer);
      console.log(`Saved to ${path} (size: ${buffer.length} bytes)`);
    } catch (e) {
      console.log(`Failed to save to ${path}`, e);
    }
  }
}

async function main() {
  // Paper 1: All_Question_Types_Conditions_Spec
  const paper1: Paper = createDefaultPaper();
  paper1.title = "All Question Types Spec";
  paper1.templateFormat = "a4";
  paper1.sections = [
    {
      id: uid(),
      title: "Section A",
      questionType: "collection",
      marksPerQuestion: 1,
      questions: [
        {
          id: uid(),
          type: "collection",
          prompt: "MCQ Collection",
          collectionType: "mcq",
          marks: 1,
          subQuestions: [
            {
              id: uid(),
              type: "mcq",
              prompt: "2 Options",
              marks: 1,
              options: ["Opt 1 ( )", "Opt 2 ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "3 Options",
              marks: 1,
              options: ["Opt 1 ( )", "Opt 2 ( )", "Opt 3 ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "4 Options",
              marks: 1,
              options: ["Opt 1 ( )", "Opt 2 ( )", "Opt 3 ( )", "Opt 4 ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "5 Options",
              marks: 1,
              options: ["Opt 1 ( )", "Opt 2 ( )", "Opt 3 ( )", "Opt 4 ( )", "Opt 5 ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "6 Options",
              marks: 1,
              options: ["Opt 1 ( )", "Opt 2 ( )", "Opt 3 ( )", "Opt 4 ( )", "Opt 5 ( )", "Opt 6 ( )"],
            },
          ],
        },
      ],
    },
  ];

  const blob1 = await generatePaperDocxBlob(paper1);
  await saveBlob(blob1, [
    "d:\\Projects\\Pepper\\public\\All_Question_Types_Conditions_Spec.docx"
  ]);

  // Paper 2: Replica_Unit_Test_2_Hindi_A5
  const paper2: Paper = createDefaultPaper();
  paper2.title = "Unit Test 2";
  paper2.className = "Class 4th";
  paper2.subject = "Hindi";
  paper2.maximumMarks = 20;
  paper2.duration = "1 Hour";
  paper2.templateFormat = "a5";
  paper2.fontFamily = "Mangal";

  paper2.sections = [
    {
      id: uid(),
      title: "Main",
      questionType: "mcq",
      marksPerQuestion: 1,
      questions: [
        {
          id: uid(),
          type: "collection",
          prompt: "1. दिए गए शब्दों के अर्थ लिखो :",
          collectionType: "word_meaning",
          marks: 0.5,
          subQuestions: [
            { id: uid(), type: "word_meaning", prompt: "स्वास्थ", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "स्वास्थ" }] },
            { id: uid(), type: "word_meaning", prompt: "समाप्त", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "समाप्त" }] },
            { id: uid(), type: "word_meaning", prompt: "नन्हा", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "नन्हा" }] },
            { id: uid(), type: "word_meaning", prompt: "बौर", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "बौर" }] },
            { id: uid(), type: "word_meaning", prompt: "पुरस्कार", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "पुरस्कार" }] },
            { id: uid(), type: "word_meaning", prompt: "व्यायाम", marks: 0.5, wordMeaningPairs: [{ id: uid(), word: "व्यायाम" }] },
          ],
        },
        {
          id: uid(),
          type: "collection",
          prompt: "2. सही उत्तर पर (✓) का निशान लगाओ :",
          collectionType: "mcq",
          marks: 0.5,
          subQuestions: [
            {
              id: uid(),
              type: "mcq",
              prompt: "क) योगाभ्यास क्या होता है ?",
              marks: 0.5,
              options: ["योग विद्या ( )", "प्रतियोगिता ( )", "विशेष प्रकार का व्यायाम ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ख) सुबह-सुबह सब पार्क में क्यों गए ?",
              marks: 0.5,
              options: ["दौड़ लगाने ( )", "खेलने ( )", "मित्रों से मिलने ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ग) प्रोजेक्ट बनाने के लिए किसकी सहायता लेनी पड़ती है ?",
              marks: 0.5,
              options: ["टेलीविजन ( )", "टेलीफोन ( )", "कंप्यूटर ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "घ) भेड़ों को कौन भगा रहा था ?",
              marks: 0.5,
              options: ["चित्रकार ( )", "गडरिया ( )", "किसान ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "ङ) सुमित का नाम किस प्रतियोगिता के लिए चुना गया ?",
              marks: 0.5,
              options: ["गायन ( )", "नृत्य ( )", "चित्रकला ( )"],
            },
            {
              id: uid(),
              type: "mcq",
              prompt: "च) झुंड का अर्थ क्या है ?",
              marks: 0.5,
              options: ["समूह ( )", "होश ( )", "गहरा ( )"],
            },
          ],
        },
        {
          id: uid(),
          type: "collection",
          prompt: "3. खाली स्थान भरकर वाक्य पूरे कीजिए :",
          collectionType: "fill_blank",
          marks: 0.5,
          subQuestions: [
            { id: uid(), type: "fill_blank", marks: 0.5, prompt: "क) …………का झुंड घर लौट रहा था । ( गायों / भेड़ों )" },
            { id: uid(), type: "fill_blank", marks: 0.5, prompt: "ख) शाम को sub  सुमित ……….पर गया । ( छत / बालकनी )" },
            { id: uid(), type: "fill_blank", marks: 0.5, prompt: "ग) ……….अभी भी उसकी जेब में थी । (टॉफी / चॉक )" },
            { id: uid(), type: "fill_blank", marks: 0.5, prompt: "घ) सभापति जी ने बड़ा सा …………सुमित को थमा दिया । ( चॉक / कप )" },
          ],
        },
        {
          id: uid(),
          type: "collection",
          prompt: "4. दिए गए प्रश्नों के उत्तर लिखो :",
          collectionType: "short",
          marks: 4/3,
          subQuestions: [
            { id: uid(), type: "short", marks: 4/3, prompt: "क) माँ ने सुमित को क्या समझाया ?", answerLines: 2 },
            { id: uid(), type: "short", marks: 4/3, prompt: "ख) मनु क्या कर रहा था ?", answerLines: 2 },
            { id: uid(), type: "short", marks: 4/3, prompt: "ग) सुमित का चित्र कैसे बिगड़ गया ?", answerLines: 2 },
          ],
        },
        {
          id: uid(),
          type: "collection",
          prompt: "5. वाक्य बनाओ :",
          collectionType: "short",
          marks: 1,
          subQuestions: [
            { id: uid(), type: "short", marks: 1, prompt: "क) सुबह", answerLines: 2 },
            { id: uid(), type: "short", marks: 1, prompt: "ख) छत", answerLines: 2 },
            { id: uid(), type: "short", marks: 1, prompt: "ग) चित्र", answerLines: 2 },
          ],
        },
        {
          id: uid(),
          type: "long",
          prompt: "6. मेरा अध्यापक पर निबंध लिखिए।",
          marks: 5,
          answerLines: 6,
        },
      ],
    },
  ];

  const blob2 = await generatePaperDocxBlob(paper2);
  await saveBlob(blob2, [
    "d:\\Projects\\Pepper\\public\\Replica_Unit_Test_2_Hindi_A5.docx"
  ]);
}

main().catch(console.error);
