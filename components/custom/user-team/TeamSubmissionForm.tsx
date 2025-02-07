"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TeamSubmission } from "@/utils/db/schema/team";
import { useState } from "react";
import { toast } from "sonner";

interface TeamSubmissionFormProps {
  teamId: string;
  initialSubmission?: TeamSubmission;
}

export default function TeamSubmissionForm({ teamId, initialSubmission }: TeamSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<TeamSubmission>(
    initialSubmission || {
      projectDescription: "",
      slidesUrl: "",
      repoUrl: "",
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/teams/${teamId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) throw new Error("Failed to submit project");

      toast.success("Project submitted successfully!");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          id="projectDescription"
          placeholder="Describe your project..."
          value={submission.projectDescription}
          onChange={(e) =>
            setSubmission((prev) => ({ ...prev, projectDescription: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slidesUrl">Slides URL</Label>
        <Input
          id="slidesUrl"
          type="url"
          placeholder="https://..."
          value={submission.slidesUrl}
          onChange={(e) => setSubmission((prev) => ({ ...prev, slidesUrl: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="repoUrl">Repository URL</Label>
        <Input
          id="repoUrl"
          type="url"
          placeholder="https://github.com/..."
          value={submission.repoUrl}
          onChange={(e) => setSubmission((prev) => ({ ...prev, repoUrl: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner" />
            {initialSubmission ? "Re-submitting..." : "Submitting..."}
          </>
        ) : initialSubmission ? (
          "Re-submit"
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
