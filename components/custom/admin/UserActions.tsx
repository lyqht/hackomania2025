"use client";

import { getAvailableTeams } from "@/app/services/admin";
import { UserInfo, UserUpdateData } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserActionsProps {
  user: UserInfo;
  onSetTeamLeader: (userId: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onEditUser: (userId: string, data: UserUpdateData) => Promise<void>;
}

export function UserActions({ user, onSetTeamLeader, onRemoveUser, onEditUser }: UserActionsProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isLeaderDialogOpen, setIsLeaderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetTeamLeader = async () => {
    setIsLoading(true);
    try {
      await onSetTeamLeader(user.id);
    } finally {
      setIsLoading(false);
      setIsLeaderDialogOpen(false);
    }
  };

  const handleRemoveUser = async () => {
    setIsLoading(true);
    try {
      await onRemoveUser(user.id);
    } finally {
      setIsLoading(false);
      setIsRemoveDialogOpen(false);
    }
  };

  const handleEditUser = async (data: UserUpdateData) => {
    setIsLoading(true);
    try {
      await onEditUser(user.id, data);
      setIsEditDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="grid gap-1">
            {user.teamRole !== "leader" && (
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsLeaderDialogOpen(true);
                }}
                disabled={isLoading}
              >
                Set as team leader
              </Button>
            )}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsActionsOpen(false);
                setIsEditDialogOpen(true);
              }}
              disabled={isLoading}
            >
              Edit user
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-red-600"
              onClick={() => {
                setIsActionsOpen(false);
                setIsRemoveDialogOpen(true);
              }}
              disabled={isLoading}
            >
              Remove user
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <EditUserDialog
        user={user}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditUser}
        isLoading={isLoading}
      />

      <RemoveUserDialog
        user={user}
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        onConfirm={handleRemoveUser}
        isLoading={isLoading}
      />

      <SetTeamLeaderDialog
        user={user}
        open={isLeaderDialogOpen}
        onOpenChange={setIsLeaderDialogOpen}
        onConfirm={handleSetTeamLeader}
        isLoading={isLoading}
      />
    </>
  );
}

interface EditUserDialogProps {
  user: UserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserUpdateData) => Promise<void>;
  isLoading: boolean;
}

function EditUserDialog({ user, open, onOpenChange, onSave, isLoading }: EditUserDialogProps) {
  const [teamOption, setTeamOption] = useState<"existing" | "new">("existing");
  const [availableTeams, setAvailableTeams] = useState<
    Array<{ id: string; name: string; memberCount: number }>
  >([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  const form = useForm({
    defaultValues: {
      email: user.email,
      githubUsername: user.githubUsername,
      teamName: user.teamName || "",
      newTeamName: "",
    },
  });

  // Fetch available teams when dialog opens
  useEffect(() => {
    if (open) {
      const fetchTeams = async () => {
        setIsLoadingTeams(true);
        try {
          const teams = await getAvailableTeams();
          setAvailableTeams(teams);
        } catch {
          toast.error("Failed to load teams");
        }
        setIsLoadingTeams(false);
      };
      fetchTeams();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user information here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Team</FormLabel>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={teamOption === "existing" ? "default" : "outline"}
                  onClick={() => setTeamOption("existing")}
                  className="flex-1"
                >
                  Join Existing Team
                </Button>
                <Button
                  type="button"
                  variant={teamOption === "new" ? "default" : "outline"}
                  onClick={() => setTeamOption("new")}
                  className="flex-1"
                >
                  Create New Team
                </Button>
              </div>

              {teamOption === "existing" ? (
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={isLoadingTeams}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTeams ? (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Loading teams...</span>
                            </div>
                          ) : (
                            availableTeams.map((team) => (
                              <SelectItem
                                key={team.id}
                                value={team.name}
                                disabled={team.memberCount >= 5}
                              >
                                {team.name} ({team.memberCount}/5 members)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="newTeamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Enter new team name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading || isLoadingTeams}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface RemoveUserDialogProps {
  user: UserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

function RemoveUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: RemoveUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {user.githubUsername} from the system. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SetTeamLeaderDialogProps {
  user: UserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

function SetTeamLeaderDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: SetTeamLeaderDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Team Leader</AlertDialogTitle>
          <AlertDialogDescription>
            {user.teamName ? (
              <>
                This will set {user.githubUsername} as the leader of team {user.teamName}. If there
                is an existing leader, they will be changed to a regular participant.
              </>
            ) : (
              <>
                {user.githubUsername} is not part of any team. They need to be in a team before they
                can be set as a leader.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          {user.teamName && (
            <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
