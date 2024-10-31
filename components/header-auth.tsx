import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Image from "next/image";
import { getUser } from "@/utils/supabase/user";

export default async function AuthButton() {
  if (!hasEnvVars) {
    return (
      <>
        <div className="flex items-center gap-4">
          <div>
            <Badge variant={"default"} className="pointer-events-none font-normal">
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="pointer-events-none cursor-none opacity-75"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="pointer-events-none cursor-none opacity-75"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const user = await getUser({ toRedirectToSignIn: false });
  return user ? (
    <div className="flex items-center gap-4 bg-white dark:bg-black">
      <div className="flex items-center gap-2 rounded px-2 py-0.5">
        <Image
          className="rounded-full"
          src={user.user_metadata.avatar_url}
          alt={""}
          width={32}
          height={32}
        />
        <span>{user.user_metadata.user_name}</span>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
