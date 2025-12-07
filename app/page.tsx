import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">FinApp</h1>
          <p className="text-secondary text-lg">
            Track your savings, investments, and financial goals
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full py-3 px-6 bg-accent-green text-background font-semibold rounded-2xl hover:bg-accent-bright-green transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full py-3 px-6 bg-card text-primary font-semibold rounded-2xl hover:bg-card-hover transition-colors border border-secondary/20"
          >
            Create Account
          </Link>
        </div>

        <p className="text-secondary text-sm">
          Your personal finance dashboard
        </p>
      </div>
    </main>
  );
}
