"use client";

import { syncEventbrite, uploadFile } from "@/app/services/admin";
import { getAllUsersWithoutPagination, UserInfo } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

interface UserTableProps {
  users: UserInfo[];
}

function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GitHub Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Pre-event</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.githubUsername}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.teamName || "No team"}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className={user.preEventRegistered ? "text-green-600" : "text-red-600"}>
              {user.preEventRegistered ? "✓" : "✗"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default function AdminClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const result = await getAllUsersWithoutPagination();
        setAllUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setIsLoading(false);
    }

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = allUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col gap-8 p-5 md:p-20">
      <div>
        <h1 className="mb-4 text-2xl font-bold md:text-4xl">HackOMania 2025 Admin Portal</h1>
        <div className="flex flex-col gap-4">
          <form action={uploadFile}>
            <div className="flex items-center gap-2">
              <span>Main Event Registrations</span>
              <Input type="file" name="file" accept=".xlsx,.xls,.csv" className="max-w-xs" />
              <Button type="submit" variant="outline">
                Upload CSV
              </Button>
            </div>
          </form>
          <form action={syncEventbrite}>
            <div className="flex items-center gap-2">
              <span>Pre-event Registrations</span>
              <Button type="submit" variant="outline">
                Sync from Eventbrite
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-400 p-4">
        <h2 className="mb-4 text-xl font-semibold">Users ({allUsers.length} total)</h2>
        {isLoading ? (
          <div>Loading users...</div>
        ) : (
          <>
            <UserTable users={displayedUsers} />
            <div className="mt-4">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
