import { checkRegistrationStatus } from "@/app/services/eventbrite";
import { getTeamById, Team } from "@/app/services/team";
import { getUserById, UserInfo } from "@/app/services/user";
// import EventbriteCheckoutWidgetButton from "@/components/custom/EventbriteCheckoutWidgetButton";
import SignOutButton from "@/components/custom/SignOutButton";
import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";
import ChallengeSelection from "@/components/custom/user-team/ChallengeSelection";
import TeamManagementSection from "@/components/custom/user-team/TeamManagementSection";
import TeamSubmissionForm from "@/components/custom/user-team/TeamSubmissionForm";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

async function EventRegistrationStatus({ user }: { user: UserInfo }) {
  const registrationStatus = await checkRegistrationStatus(user);

  return (
    <div className="grid grow grid-cols-2 items-start justify-center p-8 text-center">
      <div>
        <p className="text-xl font-medium">Pre-event</p>
        <p className="mb-8 italic">8 February 2025, Saturday</p>
        <Suspense fallback={<p className="text-neutral-600">Checking registration...</p>}>
          <p className={registrationStatus.preEventRegistered ? "text-green-600" : "text-red-600"}>
            {registrationStatus.preEventRegistered ? "Registered ✓" : "Not registered"}
          </p>
          {/* {!registrationStatus.preEventRegistered && <EventbriteCheckoutWidgetButton />}
          {!registrationStatus.preEventRegistered && (
            <p className="text-sm">
              ⚠️ You will not be allowed to join the event without registration.
            </p>
          )} */}
        </Suspense>
      </div>

      <div>
        <p className="text-xl font-medium">Main Event</p>
        <p className="mb-8 italic">15-16 February 2025, Saturday-Sunday</p>
        <Suspense fallback={<p className="text-neutral-600">Checking registration...</p>}>
          <p className={registrationStatus.mainEventRegistered ? "text-green-600" : "text-red-600"}>
            {registrationStatus.mainEventRegistered ? "Approved ✓" : "You're not registered yet."}
          </p>
          {!registrationStatus.mainEventRegistered && (
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
  const currentUnixMs = Date.now();

  // Retrieve Challenge and Submission Cutoff times (add an offset of 2 minutes in MS)
  const challengeCutoff =
    parseInt(process.env.NEXT_PUBLIC_CHALLENGE_SUBMISSION_CUTOFF_UNIX!) || currentUnixMs;
  const submissionCutoff =
    parseInt(process.env.NEXT_PUBLIC_HACKATHON_SUBMISSION_CUTOFF_UNIX!) || currentUnixMs;
  const pastChallengeSubmission = challengeCutoff + 120000 >= currentUnixMs;
  const pastHackathonSubmission = submissionCutoff + 120000 >= currentUnixMs;

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
            {/* Challenge Selection Section - Only visible if it is before the cutoff.*/}
            {process.env.NEXT_PUBLIC_CHALLENGE_SELECTION_ENABLED === "true" &&
              (pastChallengeSubmission ? (
                <div>
                  <div className="-mx-8 my-3 border border-neutral-400"></div>
                  <h3 className="mb-4 text-xl font-semibold">Challenge Statement Selection</h3>
                  <p>
                    Challenge Statement Selection has closed! Please contact an Organiser if you
                    have any questions.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="-mx-8 my-3 border border-neutral-400"></div>
                  <ChallengeSelection
                    teamId={userTeam.id}
                    currentChallengeId={userTeam.challengeId}
                  />
                </div>
              ))}

            {/* Project Submission Section - Only visible if team has a challenge, AND before the cutoff */}
            {process.env.NEXT_PUBLIC_PROJECT_SUBMISSION_ENABLED === "true" &&
              userTeam.challengeId &&
              (pastHackathonSubmission ? (
                <div>
                  <div className="-mx-8 my-3 border border-neutral-400"></div>
                  <h3 className="mb-4 text-xl font-semibold">Project Submission</h3>
                  <p>
                    Project Submission has closed! Please contact an Organiser if you have any
                    questions.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="-mx-8 my-3 border border-neutral-400"></div>
                  <h3 className="mb-4 text-xl font-semibold">Project Submission</h3>
                  <TeamSubmissionForm
                    teamId={userTeam.id}
                    initialSubmission={userTeam.submission ?? undefined}
                  />
                </div>
              ))}

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
  const supabase = await createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-xl border border-gray-500 p-5">
            <p>Error: Not authenticated</p>
            <p>
              Please sign in again from the <a href="/">landing page</a>. Otherwise, please contact
              us at <a href="mailto:contact@geekshacking.com">contact@geekshacking.com</a>.
            </p>
          </div>
        </div>
      );
    }

    const user = await getUserById(session.user.id);
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
  } catch (error) {
    console.error("Error in UserHome:", error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-gray-500 p-5">
          <p>Error: Something went wrong</p>
          <p>If this issue persists, please reach out to us!</p>
        </div>
      </div>
    );
  }
}
