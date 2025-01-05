import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { headers } from "next/headers";

export default async function UserHome() {
  const host = headers().get("host");
  const supabaseUser = (await getUser()) as User;
  const retrieveUserResponse = await fetch(`http://${host!}/api/user?id=${supabaseUser.id}`);

  if (!retrieveUserResponse.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-gray-500 p-5">
          <p>Error: Failed to retrieve User Data</p>
          <p>If this issue persists, please reach out to us!</p>
        </div>
      </div>
    );
  }

  const { user } = await retrieveUserResponse.json();

  return (
    <div className="flex flex-col gap-5 p-5 md:p-20">
      <div>
        <h1 className="mb-1 text-4xl font-bold">HackOMania 2025 User Portal</h1>
        <p className="text-2xl text-neutral-600">Hello 👋, {user.githubUsername}</p>
      </div>

      <div className="rounded-lg border border-neutral-400 p-5">
        <section>
          <h2 className="text-xl font-semibold">Your Team</h2>
        </section>
      </div>
    </div>
  );
}
