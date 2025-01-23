import { checkEventbriteRegistration } from "@/app/services/eventbrite";
import { getTeamById, Team } from "@/app/services/team";
import { getUserById, UserInfo } from "@/app/services/user";
import EventbriteCheckoutWidgetButton from "@/components/custom/EventbriteCheckoutWidgetButton";
import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";
import EditTeamButtons from "@/components/custom/user-team/EditTeamButtons";
import TeamManagementSection from "@/components/custom/user-team/TeamManagementSection";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Suspense } from "react";

async function EventbriteStatus({ user }: { user: UserInfo }) {
  const eventbriteData = await checkEventbriteRegistration(user.email);

  return (
    <div>
      <p className="text-xl font-medium">Pre-event</p>
      <Suspense fallback={<p className="text-neutral-600">Checking registration...</p>}>
        <p className={eventbriteData.registered ? "text-green-600" : "text-red-600"}>
          {eventbriteData.registered ? "Registered on Eventbrite ✓" : "You're not registerd yet."}
        </p>
        {!eventbriteData.registered && <EventbriteCheckoutWidgetButton />}
      </Suspense>
    </div>
  );
}

interface UserInfoSectionProps {
  user: UserInfo;
}

function UserInfoSection({ user }: UserInfoSectionProps) {
  return (
    <section className="p-5">
      <h2 className="mb-3 text-2xl font-semibold">Your Information</h2>
      <div className="flex flex-col justify-around gap-2 md:flex-row md:text-center">
        <EventbriteStatus user={user} />
        <div>
          <p className="text-xl font-medium">GitHub Account</p>
          <Link href={`https://github.com/${user.githubUsername}`}>{user.githubUsername}</Link>
        </div>
      </div>
    </section>
  );
}

interface TeamInfoSectionProps {
  user: UserInfo;
  userTeam: Team | null;
}

function TeamInfoSection({ user, userTeam }: TeamInfoSectionProps) {
  return (
    <section className="p-5" id="team-management">
      {userTeam && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold">
            Your Team {user.teamName && <span className="font-normal">: {user.teamName}</span>}
          </h2>
          {userTeam.leaderId === user.id && <EditTeamButtons teamID={userTeam.id} />}
        </div>
      )}
      <TeamManagementSection user={user} userTeam={userTeam} />
    </section>
  )
}


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
  // Generate a unique key based on team state and timestamp to force remount
  const teamKey = userTeam
    ? `team-${userTeam.id}-${userTeam.name}-${Date.now()}`
    : `no-team-${Date.now()}`;

  return (
    <div className="flex flex-col gap-5 p-5 md:p-20">
      <div>
        <h1 className="mb-1 text-2xl font-bold md:text-4xl">HackOMania 2025 User Portal</h1>
        <p className="text-xl text-neutral-600 md:text-2xl">
          <span className="font-medium">Hello 👋,</span> {user.githubUsername}
        </p>
      </div>

      <div className="rounded-lg border border-neutral-400">
        <Suspense fallback={<SuspenseLoadingSpinner />}>
          <UserInfoSection user={user} />
        </Suspense>

        <div className="my-3 border border-neutral-400"></div>

        <Suspense key={teamKey} fallback={<SuspenseLoadingSpinner />}>
          <TeamInfoSection key={teamKey} user={user} userTeam={userTeam} />
        </Suspense>
      </div>
    </div>
  );
}
