"use client";

import {
  editUser,
  removeUser,
  setTeamLeader,
  syncEventbrite,
  uploadFile,
} from "@/app/services/admin";
import { getAllUsersWithoutPagination, UserInfo } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UserActions } from "./UserActions";
import { toast, Toaster } from "sonner";

const ITEMS_PER_PAGE = 10;

interface UserTableProps {
  users: UserInfo[];
  onSetTeamLeader: (userId: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onEditUser: (userId: string, data: Partial<UserInfo>) => Promise<void>;
}

function UserTable({ users, onSetTeamLeader, onRemoveUser, onEditUser }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GitHub Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Team Role</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Pre-event</TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.githubUsername}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.teamName || "No team"}</TableCell>
            <TableCell>
              {user.teamRole ? (
                <span className={user.teamRole === "leader" ? "font-medium text-blue-600" : ""}>
                  {user.teamRole.charAt(0).toUpperCase() + user.teamRole.slice(1)}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className={user.preEventRegistered ? "text-green-600" : "text-red-600"}>
              {user.preEventRegistered ? "✓" : "✗"}
            </TableCell>
            <TableCell>
              <UserActions
                user={user}
                onSetTeamLeader={onSetTeamLeader}
                onRemoveUser={onRemoveUser}
                onEditUser={onEditUser}
              />
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

type SearchType = "username" | "email" | "team";
const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  username: "GitHub Username",
  email: "Email",
  team: "Team",
};

export default function AdminClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<SearchType>("username");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getAllUsersWithoutPagination();
      setAllUsers(result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
      toast.error("Failed to fetch users");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const uniqueTeams = useMemo(() => {
    if (!allUsers?.length) return [];

    const teams = new Set<string>();
    allUsers.forEach((user) => {
      if (user.teamName) teams.add(user.teamName);
    });
    return Array.from(teams).sort();
  }, [allUsers]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;

    return allUsers.filter((user) => {
      const query = searchQuery.toLowerCase();
      switch (searchType) {
        case "username":
          return user.githubUsername.toLowerCase().includes(query);
        case "email":
          return user.email.toLowerCase().includes(query);
        case "team":
          return user.teamName?.toLowerCase().includes(query);
        default:
          return true;
      }
    });
  }, [allUsers, searchQuery, searchType]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSetTeamLeader = async (userId: string) => {
    try {
      const result = await setTeamLeader(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Update the user in the state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, teamRole: "leader" };
          }
          if (user.teamId === user.teamId) {
            // Reset other users in the same team to member
            return user.teamRole === "leader" ? { ...user, teamRole: "member" } : user;
          }
          return user;
        }),
      );
    } catch {
      toast.error("Failed to update team leader");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const result = await removeUser(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Remove user from the state
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleEditUser = async (userId: string, data: Partial<UserInfo>) => {
    try {
      const result = await editUser(userId, data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Update user in the state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, ...data } : user)),
      );
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-5 md:p-20">
      <Toaster />
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
        <div className="mb-4">
          <h2 className="mb-4 text-xl font-semibold">Users</h2>
          {!isLoading && (
            <div className="flex items-center gap-2">
              <label htmlFor="search-type">Search by:</label>
              {/* Search type dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-between">
                    {SEARCH_TYPE_LABELS[searchType]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(SEARCH_TYPE_LABELS).map(([type, label]) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => {
                        setSearchType(type as SearchType);
                        setSearchQuery("");
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          type === searchType ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search input */}
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={searchOpen}
                    className="w-[300px] justify-between"
                  >
                    {searchQuery || `Search by ${SEARCH_TYPE_LABELS[searchType].toLowerCase()}...`}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search by ${SEARCH_TYPE_LABELS[searchType].toLowerCase()}...`}
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {searchType === "team" &&
                          uniqueTeams.map((team) => (
                            <CommandItem
                              key={`team-${team}`}
                              value={team}
                              onSelect={(value) => {
                                setSearchQuery(value);
                                setSearchOpen(false);
                              }}
                            >
                              {team}
                            </CommandItem>
                          ))}
                        {searchType === "username" &&
                          allUsers.map((user) => (
                            <CommandItem
                              key={`username-${user.id}`}
                              value={user.githubUsername}
                              onSelect={(value) => {
                                setSearchQuery(value);
                                setSearchOpen(false);
                              }}
                            >
                              {user.githubUsername}
                            </CommandItem>
                          ))}
                        {searchType === "email" &&
                          allUsers.map((user) => (
                            <CommandItem
                              key={`email-${user.id}`}
                              value={user.email}
                              onSelect={(value) => {
                                setSearchQuery(value);
                                setSearchOpen(false);
                              }}
                            >
                              {user.email}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {isLoading ? (
          <div>Loading users...</div>
        ) : (
          <>
            <UserTable
              users={displayedUsers}
              onSetTeamLeader={handleSetTeamLeader}
              onRemoveUser={handleRemoveUser}
              onEditUser={handleEditUser}
            />
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
