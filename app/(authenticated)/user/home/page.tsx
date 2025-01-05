import EditTeamButtons from "@/components/custom/user-team/EditTeamButtons";
import NoTeamManagement from "@/components/custom/user-team/NoTeamManagement";
import TeamManagement from "@/components/custom/user-team/TeamManagement";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import Link from "next/link";

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
  let userTeam;
  if (user.teamName) {
    const retrieveTeamResponse = await fetch(`http://${host!}/api/team?id=${user.teamId}`, {
      method: "GET",
    });

    if (retrieveTeamResponse.ok) {
      userTeam = await retrieveTeamResponse.json();
    }
  }

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
              <p className="text-xl font-medium">Applicant ID</p>
              <p>{user.id}</p>
            </div>
            <div>
              <p className="text-xl font-medium">Registration Status</p>
              <p>Not Registered</p>
            </div>
            <div>
              <p className="text-xl font-medium">GitHub Account</p>
              <Link href={`https://github.com/${user.githubUsername}`}>{user.githubUsername}</Link>
            </div>
          </div>
        </section>

        <div className="my-3 border border-neutral-400"></div>

        <section className="p-5">
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
            <h2 className="text-2xl font-semibold">
              Your Team {user.teamName && <span className="font-normal">: {user.teamName}</span>}
            </h2>
            {user.teamName && userTeam.leaderId === user.id && (
              <EditTeamButtons teamID={userTeam.id} />
            )}
          </div>
          <div id="no-team" className={`flex flex-col justify-center ${user.teamName && "hidden"}`}>
            <p>
              You have not joined a team. You may either create your own team, or join an existing
              team using it&apos;s Team ID.
            </p>
            <div className="mt-2">
              <NoTeamManagement />
            </div>
          </div>

          <div
            id="team-details"
            className={`flex flex-col justify-center ${!user.teamName && "hidden"}`}
          >
            <p className="text-neutral-500">
              <span className="font-medium">Number of Members: </span>
              {userTeam.users.length}/5
            </p>

            <div className="mt-2">
              <TeamManagement users={userTeam.users} teamId={userTeam.id} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
