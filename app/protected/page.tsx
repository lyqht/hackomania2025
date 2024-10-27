import Section from "@/components/custom/Section";
import getColor from "@/tailwind-config";
import UserCard from "@/components/custom/UserCard";
import { InfoIcon } from "lucide-react";
import { getUser } from "@/utils/supabase/user";
import FutureTeammateCard from "@/components/custom/FutureTeammateCard";

export default async function ProtectedPage() {
  const user = await getUser();
  const username = user?.user_metadata.user_name || user?.user_metadata.name;
  const email = user?.email;
  const avatarUrl = user?.user_metadata.avatar_url;
  const fullName = user?.user_metadata.full_name;

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <Section title={`Events`} sectionBackgroundColor={getColor("hackomania-yellow")}>
          <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
            <InfoIcon size="16" strokeWidth={2} />
            Insert eventbrite checkout here
          </div>
        </Section>
        <Section
          title="Team"
          sectionBackgroundColor={getColor("hackomania-blue")}
          sectionDividerBackgroundColor={getColor("hackomania-yellow")}
          dividerType="wave"
        >
          <div className="flex flex-wrap gap-4">
            <UserCard username={username} email={email} avatarUrl={avatarUrl} fullName={fullName} />
            <FutureTeammateCard />
          </div>
        </Section>
      </div>
    </div>
  );
}
