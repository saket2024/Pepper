<!-- PROJECT IMAGE / BANNER -->
<p align="center">
  <img width="1862" height="1055" alt="Paperly landing page" src = "https://github.com/user-attachments/assets/b1dcf162-c681-4b24-a98f-10dccf21a598" />
</p>

# 📋 Paperly

> A modern, intelligent exam question paper generation platform designed for small schools and solo teachers to create, manage, and distribute question papers effortlessly.

---

## 📖 Description

Paperly is a sophisticated Next.js application focused on simplifying the exam question paper creation process for educators. It combines an intuitive question bank interface, intelligent paper generation, customizable templates, and secure distribution features.

Highlights:
- Question bank management with categorization by subject, topic, and difficulty
- Intelligent question paper generation with customizable layouts
- Multiple question format support (MCQ, Short Answer, Essay, Numerical)
- Question randomization and automatic numbering
- PDF export with professional formatting
- Secure paper distribution and access control
- Clerk authentication with role-based access
- Responsive design optimized for educators
- Analytics dashboard for exam insights

<p><em>This is for education purposes only. I, the creator, am not earning a single rupee from this.</em></p>

---

## ✨ Features

- **Question Bank Management** – Store questions organized by subject, topic, chapter, and difficulty level with full-text search capabilities.
- **Intelligent Paper Generation** – Automatically generate balanced question papers by selecting questions by difficulty distribution, topic coverage, and marks allocation.
- **Multiple Question Formats** – Support for MCQ, short answer, long answer, numerical, fill-in-the-blank, true/false, and essay questions.
- **Customizable Templates** – Pre-designed templates or create custom layouts with custom headers, footers, marks, and time allocation.
- **Question Randomization** – Shuffle questions to prevent cheating, with option to maintain difficulty distribution.
- **Paper Preview** – WYSIWYG preview before exporting with live formatting adjustments.
- **PDF Export** – Generate professional PDF files with proper formatting, page breaks, and customizable styling.
- **Secure Distribution** – Share papers via secure links with view-only access, download restrictions, and expiration dates.
- **Version History** – Track all changes to question banks and generated papers with restore capability.
- **Authentication** – Clerk sign-in with role-based access (Admin, Teacher, Student).
- **Responsive UI** – Sidebar navigation, question editor, paper builder, and mobile-friendly interface.

---

## 🧠 Tech Stack

**Frontend**
- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Remix Icon / Lucide icons

**Question & Paper Management**
- TipTap or ProseMirror for rich question content editing
- jsPDF or react-pdf for PDF generation
- Markdown support with remark/rehype
- Dynamic form handling with React Hook Form

**Data / Auth**
- Firebase Realtime Database
- Clerk authentication
- Local storage for draft management

**Visualization / UI**
- React PDF Viewer for preview
- Framer Motion / Motion for animations
- DiceBear avatar URLs
- Custom question paper templates

---

## 🏗️ Architecture / Workflow

```text
Teacher → Question Bank → Question Selection → Paper Generation → PDF Export
             ↓                    ↓                      ↓
      Question Storage      Randomization         Formatting
             ↓                    ↓                      ↓
      Firebase DB         Template Engine        Secure Distribution
```

---

### Quick Start (Windows)

```bash
# Clone the repository
git clone https://github.com/DevRanbir/Paperly.git

# Navigate to project
cd Paperly

# Install dependencies
npm install

# Start development server
npm run dev
```

Open:

```text
http://localhost:3000
```

---

### Manual Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

Create `.env.local` in the project root.

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

**3. Run the app**

```bash
npm run dev
```

**4. Production build**

```bash
npm run build
npm start
```

**5. Lint**

```bash
npm run lint
```

---

## 🐳 Docker Support

This project does not include a dedicated root `docker-compose.yml` by default. It can be containerized as a standard Next.js app if needed.

Basic production flow:

```bash
npm install
npm run build
npm start
```

---

## 🔐 Environment Variables

Create `.env.local` in the project root.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

PDF_GENERATION_API_URL=http://localhost:3001
```

Notes:
- `CLERK_SECRET_KEY` is required for authentication and authorization.
- Firebase variables are needed for storing question banks and generated papers.
- `PDF_GENERATION_API_URL` is optional; without it, the app uses client-side PDF generation.
- Local fallback behavior is available for draft question storage.

---

## 🧪 Usage

- Step 1: Start the app with `npm run dev`
- Step 2: Open `http://localhost:3000`
- Step 3: Sign in with your teacher account
- Step 4: Create a new question bank or import existing questions
- Step 5: Organize questions by subject, topic, and difficulty
- Step 6: Use the paper generator to select and arrange questions
- Step 7: Preview and customize the paper layout
- Step 8: Export to PDF and distribute securely

Example workflows:

```text
Create Question Bank → Add Questions → Categorize by Topic → Generate Paper
Select by Difficulty → Randomize → Set Marks → Export PDF → Share Link
```

---

## 🖼️ Screenshots

<p align="center">
  <img alt="landing-page" src="screenshots/Landing_page.png" width="800" />
  <img alt="question-bank" src="screenshots/Question_Bank.png" width="800" />
  <br/>
  <img alt="paper-generator" src="screenshots/Paper_Generator.png" width="800" />
  <img alt="pdf-preview" src="screenshots/PDF_Preview.png" width="800" />
</p>

---

## 📂 Project Structure

```text
Paperly/
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
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── assets/
├── screenshots/
│   ├── Landing_page.png
│   ├── Question_Bank.png
│   ├── Paper_Generator.png
│   └── PDF_Preview.png
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   ├── questions/
    │   │   ├── papers/
    │   │   ├── pdf/
    │   │   ├── clerk/
    │   │   └── export/
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
    ├── contexts/
    │   ├── auth-context.tsx
    │   ├── question-context.tsx
    │   ├── paper-context.tsx
    │   ├── template-context.tsx
    │   ├── settings-context.tsx
    │   └── theme-context.tsx
    ├── hooks/
    │   ├── use-firebase-auth.ts
    │   ├── use-questions.ts
    │   ├── use-paper-generator.ts
    │   ├── use-pdf-export.ts
    │   └── use-mobile.ts
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

---

## 🚧 Future Improvements

- [ ] Add AI-powered question suggestion and difficulty analysis
- [ ] Add bulk question import from CSV/Excel files
- [ ] Add question paper analytics and statistics
- [ ] Add collaborative question bank for school teams
- [ ] Add answer key generation and student answer tracking
- [ ] Add OCR for scanned question papers
- [ ] Add examination schedule management
- [ ] Add student dashboard for viewing papers and answers
- [ ] Add marking and grading tools
- [ ] Add comprehensive test coverage and performance optimization

---

## 🛠️ Troubleshooting

**PDF export is not working**

```bash
# Check that PDF_GENERATION_API_URL is set or use client-side generation
PDF_GENERATION_API_URL=http://localhost:3001
```

Restart the dev server after editing `.env.local`.

**Firebase data is not syncing**

- Confirm `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is correct.
- Check Firebase Realtime Database rules.
- Ensure your questions are being saved before generating papers.

**Clerk sign-in redirects to the wrong route**

- The question bank route is `/question-bank`.
- Check app settings and local env redirect URLs.

**Questions are not appearing in the generator**

- Verify questions have been saved to Firebase.
- Ensure the question categories and metadata are properly set.
- Check browser console for any validation errors.

**PDF formatting looks incorrect**

- Verify the template is selected correctly.
- Check page size and margins in template settings.
- Ensure question content doesn't exceed available space.

---

## 👥 Team / Author

* **Name:** DevRanbir
* **GitHub:** [https://github.com/DevRanbir](https://github.com/DevRanbir)

---

## ⚠️ Disclaimer

Paperly is for educational use by authorized educators and school administrators. Question content and answer keys should be kept confidential and handled according to your institution's policies. Verify all exported papers for accuracy before distribution to students.

This is for education purposes only. I, the creator, am not earning a single rupee from this.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Clerk for secure authentication
- Firebase for reliable question storage
- Radix UI for accessible components
- TipTap/ProseMirror for rich text editing
- jsPDF/react-pdf for PDF generation
- React Hook Form for efficient form handling
- Next.js and React teams
- Open source community

---
