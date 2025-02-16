"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Team } from "@/app/services/team";
import { Challenge } from "@/types/challenge";

interface ExportTeamsAsExcelButtonProps {
  teams: (Team & { challenge?: Challenge })[];
}

export function ExportTeamsAsExcelButton({ teams }: ExportTeamsAsExcelButtonProps) {
  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = teams.map((team) => ({
        "Team Name": team.name,
        "Team Size": `${team.users.length}/5`,
        Challenge: team.challenge?.name || "No Challenge",
        Members: team.users
          .map(
            (user) =>
              `${
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName} (${user.githubUsername})`
                  : user.githubUsername
              }${user.role === "admin" ? " (Admin)" : ""} - ${user.teamRole}`,
          )
          .join(", "),
        "All Members Registered": team.users.every((user) => user.mainEventRegistered)
          ? "Yes"
          : "No",
        "Project Description": team.submission?.projectDescription || "",
        "Slides URL": team.submission?.slidesUrl || "",
        "Repository URL": team.submission?.repoUrl || "",
        "Tech Stack": team.submission?.techStack || "",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add autofilter
      ws["!autofilter"] = {
        ref: ws["!ref"] || "A1",
      };

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Team Name
        { wch: 10 }, // Team Size
        { wch: 25 }, // Challenge
        { wch: 100 }, // Members
        { wch: 15 }, // All Members Registered
        { wch: 100 }, // Project Description
        { wch: 50 }, // Slides URL
        { wch: 50 }, // Repository URL
      ];
      ws["!cols"] = colWidths;

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Teams");

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `teams_export_${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      toast.success("Teams exported successfully!");
    } catch (error) {
      console.error("Error exporting teams:", error);
      toast.error("Failed to export teams");
    }
  };

  return (
    <Button
      onClick={handleExportToExcel}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}
