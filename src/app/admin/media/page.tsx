import { prisma } from "@/lib/prisma";
import MediaLibraryClient from "./MediaLibraryClient";

export default async function MediaPage() {
  const files = await prisma.mediaFile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MediaLibraryClient files={files} />;
}
