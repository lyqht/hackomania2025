import { UserInfo } from "@/app/services/user";
import AddMembers from "./AddMembers";
import NoTeamManagement from "./NoTeamManagement";
import TeamManagement from "./TeamManagement";
import { Team } from "@/app/services/team";

export default async function TeamManagementSection({
  userTeam,
}: {
  user: UserInfo;
  userTeam: Team | null;
}) {
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
        <TeamManagement users={userTeam.users} teamId={userTeam.id} />
      </div>

      <div className="mt-2">
        <AddMembers teamId={userTeam.id} numMembers={userTeam.users.length} />
      </div>
    </div>
  ) : (
    <div id="no-team" className="flex flex-col justify-center">
      <p>
        You have not joined a team. You may either create your own team, or join an existing team
        using it&apos;s Team ID.
      </p>
      <div className="mt-2">
        <NoTeamManagement />
      </div>
    </div>
  );
}
