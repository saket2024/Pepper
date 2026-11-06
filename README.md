# 🌶️ Pepper – Intelligent Exam Preparation Platform

<p align="center">
  <img width="1862" height="1055" alt="Pepper landing page" src="https://github.com/user-attachments/assets/b1dcf162-c681-4b24-a98f-10dccf21a598" />
</p>

> An intelligent full-stack web application designed to simplify exam preparation through previous-year question papers, AI-powered question generation, customizable exam patterns, and downloadable PDF papers.

---

## 📖 Description

**Pepper** is an intelligent full-stack web application designed to simplify exam preparation by providing a centralized platform for sharing previous-year question papers and generating new practice papers.

It combines an organized question paper repository, AI-powered question generation, customizable exam patterns, and downloadable PDF papers to help students prepare more effectively for examinations.

The platform aims to make exam preparation more accessible, organized, and efficient by bringing essential study resources and practice tools together in one place.

### Key Highlights

- Centralized repository for previous-year question papers.
- AI-powered question generation for practice and preparation.
- Customizable examination patterns and paper formats.
- Question organization by subject, topic, and difficulty.
- Multiple question formats, including MCQs, short answers, essays, and numerical questions.
- PDF generation and downloading.
- User-friendly and responsive interface.
- Organized examination preparation workflow.

---

## ✨ Features

### 1. Question Paper Repository
- Centralized platform for accessing previous-year question papers.
- Organized question paper resources.
- Easy access to examination preparation material.

### 2. AI-Powered Question Generation
- Generate new practice questions using AI.
- Support more effective self-practice.
- Assist students in preparing for different examination patterns.

### 3. Customizable Exam Patterns
- Customize examination paper structure.
- Organize questions according to marks allocation.
- Configure different question formats.

### 4. Question Management
- Organize questions by subject, topic, and difficulty.
- Support MCQ, short answer, long answer, numerical, and essay questions.
- Manage question collections.

### 5. Paper Generation
- Select and arrange questions.
- Customize paper layouts.
- Randomize questions where supported.
- Preview generated examination papers.

### 6. PDF Export
- Generate downloadable question papers.
- Maintain structured document formatting.
- Make practice papers accessible offline.

### 7. User Interface
- Modern and intuitive interface.
- Responsive design.
- Organized navigation and application components.

---

## 🧠 Tech Stack

### Frontend
- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Remix Icon / Lucide icons

### Question & Paper Management
- TipTap / ProseMirror for rich question content editing
- jsPDF / react-pdf for PDF generation
- Markdown support with remark/rehype
- React Hook Form for dynamic form handling

### Data & Authentication
- Firebase Realtime Database
- Clerk Authentication
- Local Storage for draft management

### Visualization & UI
- React PDF Viewer
- Framer Motion / Motion
- DiceBear avatar URLs
- Custom question paper templates

---

## 🏗️ Architecture / Workflow

```text
              STUDENT / USER
                    |
                    v
             PEPPER WEB APP
                    |
          ---------------------
          |         |         |
          v         v         v
       Previous   AI-Based   Exam Pattern
       Papers     Questions  Customization
          |         |         |
          ---------------------
                    |
                    v
             QUESTION MANAGEMENT
                    |
                    v
              PAPER GENERATION
                    |
                    v
              PAPER PREVIEW
                    |
                    v
                PDF EXPORT
                    |
                    v
          DOWNLOAD / PRACTICE
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (recommended LTS version)
- npm
- Git
- A code editor such as Visual Studio Code

### Quick Start (Windows / Linux / macOS)

**1. Clone the repository**

```bash
git clone https://github.com/saket2024/Pepper.git
```

**2. Navigate to the project directory**

```bash
cd Pepper
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit:

```text
http://localhost:3000
```

---

## ⚙️ Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# PDF Generation
PDF_GENERATION_API_URL=http://localhost:3001
```

Replace the placeholder values with your actual configuration.

**Important:** Never commit `.env.local` or expose private API keys, authentication secrets, or credentials on GitHub.

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### 5. Lint

```bash
npm run lint
```

---

## 🐳 Docker Support

This project does not include a dedicated root `docker-compose.yml` by default.

It can be containerized as a standard Next.js application.

Basic production workflow:

```bash
npm install
npm run build
npm start
```

---

## 🔐 Environment Variables

Create `.env.local` in the project root.

The following variables may be required depending on the configured services:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk server-side authentication |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase application ID |
| `PDF_GENERATION_API_URL` | Optional PDF generation service URL |

### Notes

- Configure Clerk credentials to enable the corresponding authentication functionality.
- Firebase configuration is required for the corresponding cloud data functionality.
- `PDF_GENERATION_API_URL` is optional if client-side PDF generation is supported by the application.
- Local fallback behavior may be available for draft question storage.

---

## 📚 Usage

Follow the general application workflow:

1. Start the application using `npm run dev`.
2. Open `http://localhost:3000`.
3. Sign in if authentication is configured.
4. Explore the available previous-year question papers.
5. Select a subject or examination.
6. Generate practice questions using the available AI functionality.
7. Customize the examination pattern.
8. Arrange and preview the question paper.
9. Export the generated paper as a PDF.
10. Download the paper for examination practice.

### Example Workflow

```text
Open Pepper
     |
     v
Select Subject / Previous-Year Paper
     |
     v
Generate or Select Questions
     |
     v
Customize Exam Pattern
     |
     v
Arrange Questions
     |
     v
Preview Question Paper
     |
     v
Download PDF
     |
     v
Practice for Examination
```

---

## 🖼️ Screenshots

<p align="center">
  <img alt="Pepper Landing Page" src="screenshots/Landing_page.png" width="800" />
  <img alt="Question Bank" src="screenshots/Question_Bank.png" width="800" />
  <br/>
  <img alt="Paper Generator" src="screenshots/Paper_Generator.png" width="800" />
  <img alt="PDF Preview" src="screenshots/PDF_Preview.png" width="800" />
</p>

---

## 📂 Project Structure

```text
Pepper/
├── README.md
├── changes.md
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── assets/
│
├── screenshots/
│   ├── Landing_page.png
│   ├── Question_Bank.png
│   ├── Paper_Generator.png
│   └── PDF_Preview.png
│
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   ├── questions/
    │   │   ├── papers/
    │   │   ├── pdf/
    │   │   ├── clerk/
    │   │   └── export/
    │   │
    │   ├── [username]/papers/
    │   ├── question-bank/
    │   ├── paper-generator/
    │   ├── templates/
    │   ├── settings/
    │   ├── help/
    │   ├── profile/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── components/
    │   ├── app-sidebar.tsx
    │   ├── question-editor.tsx
    │   ├── question-list.tsx
    │   ├── paper-builder.tsx
    │   ├── pdf-preview.tsx
    │   ├── question-selector.tsx
    │   ├── template-selector.tsx
    │   ├── formatting-toolbar.tsx
    │   └── sidebar.tsx
    │
    ├── contexts/
    │   ├── auth-context.tsx
    │   ├── question-context.tsx
    │   ├── paper-context.tsx
    │   ├── template-context.tsx
    │   ├── settings-context.tsx
    │   └── theme-context.tsx
    │
    ├── hooks/
    │   ├── use-firebase-auth.ts
    │   ├── use-questions.ts
    │   ├── use-paper-generator.ts
    │   ├── use-pdf-export.ts
    │   └── use-mobile.ts
    │
    └── lib/
        ├── question-service.ts
        ├── paper-service.ts
        ├── template-service.ts
        ├── pdf-generator.ts
        ├── firebase-service.ts
        ├── firebase.ts
        ├── clerk-config.ts
        ├── question-utils.ts
        └── utils.ts
```

*Note: This is the documented project structure. Update it if the actual repository structure differs.*

---

## 🚧 Future Improvements

- [ ] Add bulk question import from CSV/Excel files.
- [ ] Add question paper analytics and statistics.
- [ ] Add collaborative question banks for school teams.
- [ ] Add answer key generation and student answer tracking.
- [ ] Add OCR support for scanned question papers.
- [ ] Add examination schedule management.
- [ ] Add student dashboard for viewing papers and answers.
- [ ] Add marking and grading tools.
- [ ] Improve test coverage and performance optimization.
- [ ] Expand AI-powered question generation and difficulty analysis.

---

## 🛠️ Troubleshooting

### PDF Export Is Not Working

- Verify the PDF generation configuration.
- Check whether client-side PDF generation is available.
- Verify the configured PDF generation service URL, if used.

Example:

```env
PDF_GENERATION_API_URL=http://localhost:3001
```

Restart the development server after changing `.env.local`.

### Firebase Data Is Not Syncing

- Confirm that `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is correct.
- Check Firebase Realtime Database rules.
- Verify that questions are being saved correctly.

### Clerk Sign-In Redirects to the Wrong Route

- Verify Clerk configuration.
- Check application redirect settings.
- Confirm the configured routes.

### Questions Are Not Appearing in the Generator

- Verify that questions have been saved.
- Check question categories and metadata.
- Inspect the browser console for errors.

### PDF Formatting Looks Incorrect

- Verify the selected template.
- Check page size and margins.
- Ensure question content fits the available space.

---

## 👨‍💻 Author

**Saket Kumar Suman**

- GitHub: [@saket2024](https://github.com/saket2024)
- Project Repository: [Pepper](https://github.com/saket2024/Pepper)

---

## ⚠️ Disclaimer

Pepper is an educational project designed to support examination preparation and question paper creation.

Users should verify generated questions and exported papers for accuracy and suitability before using them in academic assessments.

Question papers and answer keys should be handled responsibly and according to applicable institutional policies.

This project is developed for educational purposes.

---

## 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

We acknowledge the developers and communities behind the technologies and tools used in this project:

- Next.js and React teams.
- Clerk for authentication services.
- Firebase for database services.
- Radix UI for accessible components.
- TipTap / ProseMirror for rich-text editing.
- jsPDF / react-pdf for PDF generation.
- React Hook Form for form management.
- Open-source community for their contributions.

---

<p align="center">
  <b>🌶️ Pepper – Prepare Smarter. Practice Better.</b>
  <br/>
  Built with ❤️ for better examination preparation.
</p>