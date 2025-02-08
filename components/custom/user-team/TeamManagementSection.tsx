import { Team } from "@/app/services/team";
import { UserInfo } from "@/app/services/user";
import { Suspense } from "react";
import SuspenseLoadingSpinner from "../SuspenseLoadingSpinner";
import AddMembers from "./AddMembers";
import EditTeamButtons from "./EditTeamButtons";
import NoTeamManagement from "./NoTeamManagement";
import TeamManagement from "./TeamManagement";

export default async function TeamManagementSection({
  user,
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
      <div className="space-y-4">
        <p className="text-neutral-500">
          <span className="font-medium">Team ID: </span>
          {userTeam.id}
        </p>
        <p className="text-neutral-500">
          <span className="font-medium">Team Name: </span>
          {userTeam.name}
        </p>
        <p className="text-neutral-500">
          <span className="font-medium">Number of Members: </span>
          {userTeam.users.length}/5
        </p>
        {userTeam.leaderId === user.id && <EditTeamButtons teamID={userTeam.id} />}
      </div>

      <div className="mt-2">
        <Suspense key={`management-${teamKey}`} fallback={<SuspenseLoadingSpinner />}>
          <TeamManagement currentUser={user} users={userTeam.users} teamId={userTeam.id} />
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
