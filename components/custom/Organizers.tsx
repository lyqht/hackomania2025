import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa6";
import { TeamMember, teamMembers } from "@/public/team/team";

export default async function Organizers() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {teamMembers.map((member: TeamMember) => (
        <Profile key={member.name} member={member} />
      ))}
    </div>
  );
}

function Profile({ member }: { member: TeamMember }) {
  return (
    <div className="group/team relative h-40 max-w-full overflow-hidden rounded-xl bg-white md:h-[265px]">
      <Image
        alt={member.name}
        src={`/team/images/${member.name.replace(" ", "").toLowerCase()}.jpg`}
        width={100}
        height={50}
        className="h-full w-full object-cover"
        unoptimized={true}
        aria-label={`Portrait of ${member.name}`}
      />
      <div
        id="details-overlay"
        className="absolute left-0 top-0 z-10 h-full w-full overflow-hidden rounded-xl bg-black bg-opacity-40 p-5 text-white opacity-0 transition-opacity group-hover/team:opacity-100 group-focus/team:opacity-100"
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex-grow"></div>
          <p className="text-2xl font-bold md:text-3xl">{member.name}</p>
          <p className="mb-3">
            {member.team} {member.role && `- ${member.role}`}
          </p>
          <div className="flex flex-row gap-3">
            {member.linkedin && (
              <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin
                  className="text-2xl md:text-3xl"
                  aria-label={`LinkedIn of ${member.name}`}
                />
              </Link>
            )}
            {member.github && (
              <Link href={member.github} target="_blank" rel="noopener noreferrer">
                <FaGithub
                  className="text-2xl md:text-3xl"
                  aria-label={`GitHub of ${member.name}`}
                />
              </Link>
            )}
            {member.twitter && (
              <Link href={member.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter
                  className="text-2xl md:text-3xl"
                  aria-label={`Twitter of ${member.name}`}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
