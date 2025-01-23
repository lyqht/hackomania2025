import { UserInfo } from "@/app/services/user";
import AddMembers from "./AddMembers";
import NoTeamManagement from "./NoTeamManagement";
import TeamManagement from "./TeamManagement";
import { Team } from "@/app/services/team";
import { Suspense } from "react";
import SuspenseLoadingSpinner from "../SuspenseLoadingSpinner";

export default async function TeamManagementSection({
  userTeam,
}: {
  user: UserInfo;
  userTeam: Team | null;
}) {
  // Generate a unique key based on team state
  const teamKey = userTeam
    ? `team-${userTeam.id}-${userTeam.users.length}-${userTeam.users.map((u) => u.id).join("-")}`
    : "no-team";

  return userTeam ? (
    <div id="team-details" className="flex flex-col justify-center gap-2">
      <div>
        <p className="text-neutral-500">
          <span className="font-medium">Team ID: </span>
          {userTeam.id}
        </p>
        <p className="text-neutral-500">
          <span className="font-medium">Number of Members: </span>
          {userTeam.users.length}/5
        </p>
      </div>

      <div className="mt-2">
        <Suspense key={`management-${teamKey}`} fallback={<SuspenseLoadingSpinner />}>
          <TeamManagement users={userTeam.users} teamId={userTeam.id} />
        </Suspense>
      </div>

      <div className="mt-2">
        <Suspense key={`members-${teamKey}`} fallback={<SuspenseLoadingSpinner />}>
          <AddMembers teamId={userTeam.id} numMembers={userTeam.users.length} />
        </Suspense>
      </div>
    </div>
  ) : (
    <div id="no-team" className="flex flex-col justify-center">
      <p>
        You have not joined a team. You may either create your own team, or join an existing team
        using it&apos;s Team ID.
      </p>
      <div className="mt-2">
        <Suspense fallback={<SuspenseLoadingSpinner />}>
          <NoTeamManagement />
        </Suspense>
      </div>
    </div>
  );
}
