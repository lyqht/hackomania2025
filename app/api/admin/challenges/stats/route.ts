import { getChallengeStats } from "@/app/services/challenge";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const stats = await getChallengeStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching challenge stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch challenge statistics" },
            {
                status: 500,
            },
        );
    }
}
