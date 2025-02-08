"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { UserInfo } from "@/app/services/user";

interface ExportUsersAsExcelButtonProps {
  users: UserInfo[];
}

export function ExportUsersAsExcelButton({ users }: ExportUsersAsExcelButtonProps) {
  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = users.map((user) => ({
        "Full Name":
          user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Not provided",
        "GitHub Username": user.githubUsername,
        Email: user.email,
        Team: user.teamName || "No team",
        "Team Role": user.teamRole || "N/A",
        "Pre-event Registration": user.preEventRegistered ? "Yes" : "No",
        "Main Event Registration": user.mainEventRegistered ? "Yes" : "No",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add autofilter
      ws["!autofilter"] = {
        ref: ws["!ref"] || "A1",
      };

      // Set column widths
      const colWidths = [
        { wch: 30 }, // Full Name
        { wch: 20 }, // GitHub Username
        { wch: 30 }, // Email
        { wch: 30 }, // Team
        { wch: 15 }, // Team Role
        { wch: 15 }, // Pre-event Registration
        { wch: 15 }, // Main Event Registration
      ];
      ws["!cols"] = colWidths;

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `users_export_${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      toast.success("Users exported successfully!");
    } catch (error) {
      console.error("Error exporting users:", error);
      toast.error("Failed to export users");
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
