import Section from "@/components/custom/Section";
import getColor from "@/tailwind-config";
import UserCard from "@/components/custom/UserCard";
import { InfoIcon } from "lucide-react";
import { getUser } from "@/utils/supabase/user";
import FutureTeammateCard from "@/components/custom/FutureTeammateCard";
import { User } from "@supabase/supabase-js";

export default async function ProtectedPage() {
  const user = (await getUser()) as User;
  const {
    user_metadata: { avatar_url, full_name, user_name },
  } = user;
  const email = user.email as string;

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
            <UserCard
              username={user_name}
              email={email}
              avatarUrl={avatar_url}
              fullName={full_name}
            />
            <FutureTeammateCard />
          </div>
        </Section>
      </div>
    </div>
  );
}
