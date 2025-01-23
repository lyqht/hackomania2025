import { getTeamById } from "@/app/services/team";
import { getUserById } from "@/app/services/user";
import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";
import EditTeamButtons from "@/components/custom/user-team/EditTeamButtons";
import TeamManagementSection from "@/components/custom/user-team/TeamManagementSection";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Suspense } from "react";

export default async function UserHome() {
  const supabaseUser = (await getUser()) as User;
  const user = await getUserById(supabaseUser.id);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-gray-500 p-5">
          <p>Error: Failed to retrieve User Data</p>
          <p>If this issue persists, please reach out to us!</p>
        </div>
      </div>
    );
  }

  const userTeam = user.teamId ? await getTeamById(user.teamId) : null;

  return (
    <div className="flex flex-col gap-5 p-5 md:p-20">
      <div>
        <h1 className="mb-1 text-2xl font-bold md:text-4xl">HackOMania 2025 User Portal</h1>
        <p className="text-xl text-neutral-600 md:text-2xl">
          <span className="font-medium">Hello 👋,</span> {user.githubUsername}
        </p>
      </div>

      <div className="rounded-lg border border-neutral-400">
        <section className="p-5">
          <h2 className="mb-3 text-2xl font-semibold">Your Information</h2>
          <div className="flex flex-col justify-around gap-2 md:flex-row md:text-center">
            <div>
              <p className="text-xl font-medium">Pre-event</p>
              <p>Not registered</p>
            </div>
            <div>
              <p className="text-xl font-medium">GitHub Account</p>
              <Link href={`https://github.com/${user.githubUsername}`}>{user.githubUsername}</Link>
            </div>
          </div>
        </section>

        <div className="my-3 border border-neutral-400"></div>

        <Suspense fallback={<SuspenseLoadingSpinner />}>
          <section className="p-5" id="team-management">
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <SuspenseLoadingSpinner />
                </div>
              }
            >
              {userTeam && (
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <h2 className="text-2xl font-semibold">
                    Your Team{" "}
                    {user.teamName && <span className="font-normal">: {user.teamName}</span>}
                  </h2>
                  {userTeam.leaderId === user.id && <EditTeamButtons teamID={userTeam.id} />}
                </div>
              )}
            </Suspense>

            <Suspense
              fallback={
                <div className="mt-4 flex justify-center">
                  <SuspenseLoadingSpinner />
                </div>
              }
            >
              <TeamManagementSection user={user} userTeam={userTeam} />
            </Suspense>
          </section>
        </Suspense>
      </div>
    </div>
  );
}
