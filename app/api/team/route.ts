"use server";
import * as fs from "fs";
import { CsvError, parse } from "csv-parse";
import { NextResponse } from "next/server";

export type TeamMember = {
  team: string;
  name: string;
  role: string;
  linkedin: string;
  twitter: string;
  github: string;
};

async function parseTeamList(): Promise<TeamMember[]> {
  return new Promise((resolve, reject) => {
    const filePath = "public/team/teamlist.csv";
    const fileHeader = ["team", "name", "role", "linkedin", "github", "twitter"];

    // Read file content
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

    // Parse the CSV data
    parse(
      fileContent,
      {
        columns: fileHeader,
        delimiter: ",",
        skip_empty_lines: true,
      },
      (error, data: TeamMember[]) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(data);
        }
      },
    );
  });
}

export async function GET() {
  try {
    const teamList: TeamMember[] = await parseTeamList();
    return NextResponse.json(teamList);
  } catch (err) {
    if (err instanceof CsvError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      return NextResponse.error();
    }
  }
}
