import Image from "next/image";

interface UserCardProps {
  username: string;
  email: string;
  avatarUrl?: string;
  fullName?: string;
}

export default function UserCard({ username, email, avatarUrl, fullName }: UserCardProps) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-white p-4 shadow-md">
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
        <h2 className="text-2xl font-bold">{fullName || username}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
}
