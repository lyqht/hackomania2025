"use client";

import {
  editUser,
  removeUser,
  setTeamLeader,
  syncEventbrite,
  uploadFile,
  createUser,
  markUserAsMainEventRegistered,
  mergeAndRegisterUser,
  findDuplicateRegistrations,
} from "@/app/services/admin";
import { getAllUsersWithoutPagination, UserInfo, CreateUserData } from "@/app/services/user";
import { toast, Toaster } from "sonner";
import ChallengeManagement from "./ChallengeManagement";
import TeamManagement from "./TeamManagement";
import UserManagement from "./UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MergeUserData, SearchType } from "./UserManagement";
import SignOutButton from "@/components/custom/SignOutButton";
import { Button } from "@/components/ui/button";
import { Presentation } from "lucide-react";

export default function AdminClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(
    (searchParams.get("searchType") as SearchType) || "username",
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") || "");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "users");

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear search state
    setSearchQuery("");
    setSearchType("username");

    // Update URL with only the tab parameter
    const params = new URLSearchParams();
    params.set("tab", value);
    router.push(`/admin?${params.toString()}`);
  };

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
      params.set("searchType", searchType);
    } else {
      params.delete("searchQuery");
      params.delete("searchType");
    }
    router.push(`/admin?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchType]);

  // Add navigation functions
  const navigateToTeam = (teamName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "teams");
    params.set("searchQuery", teamName);
    router.push(`/admin?${params.toString()}`);
    setActiveTab("teams");
    setSearchQuery(teamName);
  };

  const navigateToUser = (username: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "users");
    params.set("searchType", "username");
    params.set("searchQuery", username);
    router.push(`/admin?${params.toString()}`);
    setActiveTab("users");
    setSearchType("username");
    setSearchQuery(username);
  };

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

  const handleUploadFile = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const result = await uploadFile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("CSV uploaded successfully");
        await fetchUsers(); // Refresh the user list after upload
      }
    } catch (error) {
      toast.error(`Failed to upload CSV: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSyncEventbrite = async () => {
    setIsSyncing(true);
    try {
      const result = await syncEventbrite();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Synced with Eventbrite successfully");
        await fetchUsers();
      }
    } catch (error) {
      toast.error(`Failed to sync with Eventbrite: ${error}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      const result = await createUser(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("User created successfully");
      await fetchUsers(); // Refresh the user list after creation
    } catch (error) {
      toast.error("Failed to create user", { description: error as string });
    }
  };

  const handleMarkAsRegistered = async (
    userId: string,
  ): Promise<{
    error?: string;
    duplicateData?: MergeUserData;
    success?: boolean;
  }> => {
    try {
      const result = await markUserAsMainEventRegistered(userId);
      if (result.error && !result.duplicateData) {
        toast.error(result.error);
        return result;
      }
      if (result.success) {
        toast.success("User marked as registered successfully");
        await fetchUsers(); // Refresh the user list
      }
      return result as {
        error?: string;
        duplicateData?: MergeUserData;
        success?: boolean;
      };
    } catch (error) {
      toast.error("Failed to mark user as registered", { description: error as string });
      return { error: "Failed to mark user as registered" };
    }
  };

  const handleMergeUser = async (
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      githubProfileUrl: string;
    },
  ) => {
    try {
      const result = await mergeAndRegisterUser(userId, data);
      if (result.error) {
        toast.error(result.error);
        return result;
      }
      toast.success("User registered successfully");
      await fetchUsers(); // Refresh the user list
      return result;
    } catch (error) {
      toast.error("Failed to merge user", { description: error as string });
      return { error: "Failed to merge user" };
    }
  };

  const handleFindDuplicates = async (): Promise<{
    error?: string;
    duplicates?: MergeUserData[];
  }> => {
    try {
      const result = await findDuplicateRegistrations();
      if (result.error) {
        toast.error(result.error);
      }
      return result as {
        error?: string;
        duplicates?: MergeUserData[];
      };
    } catch (error) {
      toast.error("Failed to find duplicates", { description: error as string });
      return { error: "Failed to find duplicates" };
    }
  };

  return (
    <div className="flex flex-col gap-8 p-5 md:p-20">
      <Toaster />
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-bold md:text-4xl">HackOMania 2025 Admin Portal</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/challenges")}>
              <Presentation className="mr-2 h-4 w-4" />
              Present
            </Button>
            <SignOutButton />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <ChallengeManagement />
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement
            onNavigateToUser={navigateToUser}
            searchQuery={activeTab === "teams" ? searchQuery : undefined}
            onSearchQueryChange={setSearchQuery}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={allUsers}
            isLoading={isLoading}
            isUploading={isUploading}
            isSyncing={isSyncing}
            searchType={searchType}
            searchQuery={searchQuery}
            onSearchTypeChange={handleSearchTypeChange}
            onSearchQueryChange={setSearchQuery}
            onUploadFile={handleUploadFile}
            onSyncEventbrite={handleSyncEventbrite}
            onSetTeamLeader={handleSetTeamLeader}
            onRemoveUser={handleRemoveUser}
            onEditUser={handleEditUser}
            onNavigateToTeam={navigateToTeam}
            onCreateUser={handleCreateUser}
            onMarkAsRegistered={handleMarkAsRegistered}
            onMergeUser={handleMergeUser}
            onFindDuplicates={handleFindDuplicates}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
