import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GithubIcon } from "lucide-react";

export default function Login() {
  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 mt-8">
        <Button asChild className="w-full">
          <Link href="/auth/github">
            <GithubIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}
