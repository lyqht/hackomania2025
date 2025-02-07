import { checkMainEventRegistration, checkPreEventRegistration } from "@/app/services/eventbrite";
import { getTeamById, Team } from "@/app/services/team";
import { getUserById, UserInfo } from "@/app/services/user";
import EventbriteCheckoutWidgetButton from "@/components/custom/EventbriteCheckoutWidgetButton";
import SignOutButton from "@/components/custom/SignOutButton";
import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";
import ChallengeSelection from "@/components/custom/user-team/ChallengeSelection";
import TeamManagementSection from "@/components/custom/user-team/TeamManagementSection";
import TeamSubmissionForm from "@/components/custom/user-team/TeamSubmissionForm";
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
    <section className="p-8">
      <h2 className="mb-3 text-2xl font-semibold">Eventbrite</h2>
      <EventRegistrationStatus user={user} />
    </section>
  );
}

interface ChallengeAndTeamInfoSectionsProps {
  user: UserInfo;
  userTeam: Team | null;
}

function ChallengeAndTeamInfoSections({ user, userTeam }: ChallengeAndTeamInfoSectionsProps) {
  if (!user.mainEventRegistered && user.role != "admin") {
    return (
      <>
        <div className="my-3 border border-neutral-400"></div>
        <div className="space-y-4 p-8 text-center text-neutral-600">
          <p>
            Team management is only available after receiving an invitation for the main event.
            Please check your spam folder if you expected to receive an invitation but haven&apos;t
            received one yet.
          </p>
          <p>
            Otherwise, please contact us for help at{" "}
            <a className="underline" href="mailto:contact@geekshacking.com">
              contact@geekshacking.com
            </a>
            .
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="p-8">
      {userTeam ? (
        <>
          <div className="space-y-8">
            {/* Challenge Selection Section */}
            {process.env.NEXT_PUBLIC_CHALLENGE_SELECTION_ENABLED === "true" && (
              <div>
                <div className="-mx-8 my-3 border border-neutral-400"></div>
                <ChallengeSelection
                  teamId={userTeam.id}
                  currentChallengeId={userTeam.challengeId}
                />
              </div>
            )}

            {/* Project Submission Section - Only visible if team has a challenge */}
            {process.env.NEXT_PUBLIC_PROJECT_SUBMISSION_ENABLED === "true" &&
              userTeam.challengeId && (
                <div>
                  <div className="-mx-8 my-3 border border-neutral-400"></div>
                  <h3 className="mb-4 text-xl font-semibold">Project Submission</h3>
                  <TeamSubmissionForm
                    teamId={userTeam.id}
                    initialSubmission={userTeam.submission ?? undefined}
                  />
                </div>
              )}

            {/* Team Details Section */}
            <div className="-mx-8 my-3 border border-neutral-400"></div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Team Details</h3>
              <TeamManagementSection user={user} userTeam={userTeam} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="-mx-8 my-3 border border-neutral-400"></div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Team Details</h3>
            <TeamManagementSection user={user} userTeam={userTeam} />
          </div>
        </>
      )}
    </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold md:text-4xl">HackOMania 2025 User Portal</h1>
            <p className="text-xl text-neutral-600 md:text-2xl">
              <span className="font-medium">Hello 👋,</span> {user.githubUsername}
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>

      <div className="rounded-lg border border-neutral-400">
        <Suspense fallback={<SuspenseLoadingSpinner />}>
          <UserInfoSection user={user} />
        </Suspense>

        <Suspense key={teamKey} fallback={<SuspenseLoadingSpinner />}>
          {<ChallengeAndTeamInfoSections key={teamKey} user={user} userTeam={userTeam} />}
        </Suspense>
      </div>
    </div>
  );
}
