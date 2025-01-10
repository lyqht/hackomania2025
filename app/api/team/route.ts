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
  const filePath = "public/team/teamlist.csv";
  const fileHeader = ["team", "name", "role", "linkedin", "github", "twitter"];

  try {
    const fileContent = await fs.promises.readFile(filePath, { encoding: "utf-8" });

    return new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: fileHeader,
          delimiter: ",",
          skip_empty_lines: true,
        },
        (error, data: TeamMember[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        },
      );
    });
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
}

export async function GET() {
  try {
    const teamList: TeamMember[] = await parseTeamList();
    console.log(teamList);
    return NextResponse.json(teamList);
  } catch (err) {
    if (err instanceof CsvError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An error occurred while parsing the team list" },
        { status: 500 },
      );
    }
  }
}
