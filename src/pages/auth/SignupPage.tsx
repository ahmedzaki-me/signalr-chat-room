import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-150">
        <p className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
          You can use a fake email to protect your privacy - but{" "}
          <span className="font-semibold">save your password carefully</span>,
          as account recovery is not available.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
