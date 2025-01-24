import { checkMainEventRegistration, checkPreEventRegistration } from "@/app/services/eventbrite";
import { getTeamById, Team } from "@/app/services/team";
import { getUserById, UserInfo } from "@/app/services/user";
import EventbriteCheckoutWidgetButton from "@/components/custom/EventbriteCheckoutWidgetButton";
import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";
import EditTeamButtons from "@/components/custom/user-team/EditTeamButtons";
import TeamManagementSection from "@/components/custom/user-team/TeamManagementSection";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";

async function EventRegistrationStatus({ user }: { user: UserInfo }) {
  const [preEventData, mainEventData] = await Promise.all([
    checkPreEventRegistration(user.email),
    checkMainEventRegistration(user.email),
  ]);

  return (
    <div className="grid grow grid-cols-2 items-start justify-center p-8 text-center">
      <div>
        <p className="text-xl font-medium">Pre-event</p>
        <p className="mb-8 italic">8 February 2025, Saturday</p>
        <Suspense fallback={<p className="text-neutral-600">Checking registration...</p>}>
          <p className={preEventData.registered ? "text-green-600" : "text-red-600"}>
            {preEventData.registered ? "Registered ✓" : "Not registered"}
          </p>
          {!preEventData.registered && <EventbriteCheckoutWidgetButton />}
          {!preEventData.registered && (
            <p className="text-sm">
              ⚠️ You will not be allowed to join the event without registration.
            </p>
          )}
        </Suspense>
      </div>

      <div>
        <p className="text-xl font-medium">Main Event</p>
        <p className="mb-8 italic">15-16 February 2025, Saturday-Sunday</p>
        <Suspense fallback={<p className="text-neutral-600">Checking registration...</p>}>
          <p className={mainEventData.registered ? "text-green-600" : "text-red-600"}>
            {mainEventData.registered ? "Approved ✓" : "You're not registered yet."}
          </p>
          {!mainEventData.registered && (
            <p className="text-sm">
              ⚠️ You will not be allowed to join the event without registration.
            </p>
          )}
        </Suspense>
      </div>
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
      <EventRegistrationStatus user={user} />
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
  );
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
          {<TeamInfoSection key={teamKey} user={user} userTeam={userTeam} />}
        </Suspense>
      </div>
    </div>
  );
}
