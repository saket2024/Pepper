import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-100 text-black font-sans">
      <div className="neo-box p-8 max-w-md text-center space-y-4 bg-white border-4 shadow-neoLg">
        <h1 className="text-4xl font-black uppercase">404 - Page Not Found</h1>
        <p className="text-sm font-semibold text-zinc-700">
          The requested page or paper draft could not be found.
        </p>
        <Link
          href="/"
          className="inline-block neo-btn px-6 py-2.5 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm"
        >
          Return to Exam Builder
        </Link>
      </div>
    </div>
  );
}
