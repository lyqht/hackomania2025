import { checkMainEventRegistration } from "@/app/services/eventbrite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ registered: false });
  }

  try {
    const registrationStatus = await checkMainEventRegistration(email);
    return Response.json({
      registered: registrationStatus.registered,
      data: registrationStatus.data,
    });
  } catch (error) {
    console.error("Error checking registration:", error);
    return Response.json({ registered: false });
  }
}
