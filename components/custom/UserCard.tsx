import Image from "next/image";

interface UserCardProps {
  username: string;
  email: string;
  avatarUrl?: string;
  fullName?: string;
}

export default function UserCard({ username, email, avatarUrl, fullName }: UserCardProps) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-zinc-100 p-4 shadow-md">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={`${username}'s avatar`}
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span>
          <span className="sr-only">Name:</span>
          <span className="text-2xl font-bold text-gray-800">{fullName || username}</span>
        </span>
        <span>
          <span className="sr-only">Email:</span>
          <span className="text-gray-600">{email}</span>
        </span>
      </div>
    </div>
  );
}
