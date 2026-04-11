import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { canUseWritingDesk } from "@/lib/roles";
import WritingDeskClient from "./writing-desk-client";

type DeskStory = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  spineVersionCount: number;
};

export default async function WritingDeskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  if (!canUseWritingDesk(user.role)) {
    redirect("/dashboard");
  }

  const stories = await prisma.story.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      _count: {
        select: {
          spineVersions: true,
        },
      },
    },
  });

  const initialStories: DeskStory[] = stories.map((story) => ({
    id: story.id,
    title: story.title,
    slug: story.slug,
    status: story.status,
    updatedAt: story.updatedAt.toISOString(),
    spineVersionCount: story._count.spineVersions,
  }));

  return <WritingDeskClient initialStories={initialStories} />;
}
