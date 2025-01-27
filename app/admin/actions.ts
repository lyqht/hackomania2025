"use server";

import { uploadMainEventRegistrations } from "@/app/services/eventbrite";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error("No file provided");
    }

    await uploadMainEventRegistrations(file);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Failed to upload file" };
  }
}
