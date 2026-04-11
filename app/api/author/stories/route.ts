import { randomUUID } from "crypto";
import { StoryStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { canUseWritingDesk } from "@/lib/roles";

const createStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or less."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(80, "Slug must be 80 characters or less.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens.")
    .optional()
    .or(z.literal("")),
  synopsis: z
    .string()
    .trim()
    .max(3000, "Synopsis must be 3000 characters or less.")
    .optional()
    .or(z.literal("")),
  arcStatement: z
    .string()
    .trim()
    .max(3000, "Arc statement must be 3000 characters or less.")
    .optional()
    .or(z.literal("")),
  toneGuide: z
    .string()
    .trim()
    .max(3000, "Tone guide must be 3000 characters or less.")
    .optional()
    .or(z.literal("")),
  narrativeBoundaries: z
    .string()
    .trim()
    .max(3000, "Narrative boundaries must be 3000 characters or less.")
    .optional()
    .or(z.literal("")),
  guardrailInstruction: z
    .string()
    .trim()
    .max(3000, "Guardrail instruction must be 3000 characters or less.")
    .optional()
    .or(z.literal("")),
});

type CreateStoryInput = z.infer<typeof createStorySchema>;

function toNullableText(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function resolveUniqueSlug(input: CreateStoryInput): Promise<string> {
  const seed = toNullableText(input.slug) ?? slugify(input.title);
  const baseSlug = seed.length > 0 ? seed : `story-${randomUUID().slice(0, 8)}`;

  for (let i = 0; i < 200; i += 1) {
    const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
    const existing = await prisma.story.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  return `${baseSlug}-${randomUUID().slice(0, 8)}`;
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!canUseWritingDesk(user.role)) {
    return NextResponse.json({ error: "Author role required." }, { status: 403 });
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
      slug: true,
      title: true,
      status: true,
      updatedAt: true,
      _count: {
        select: {
          spineVersions: true,
        },
      },
    },
  });

  return NextResponse.json({
    stories: stories.map((story) => ({
      id: story.id,
      slug: story.slug,
      title: story.title,
      status: story.status,
      updatedAt: story.updatedAt.toISOString(),
      spineVersionCount: story._count.spineVersions,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!canUseWritingDesk(user.role)) {
    return NextResponse.json({ error: "Author role required." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createStorySchema.safeParse(body);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid story data." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const slug = await resolveUniqueSlug(input);

  const story = await prisma.$transaction(async (tx) => {
    const createdStory = await tx.story.create({
      data: {
        title: input.title.trim(),
        slug,
        synopsis: toNullableText(input.synopsis),
        status: StoryStatus.DRAFT,
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
      },
    });

    await tx.storySpineVersion.create({
      data: {
        storyId: createdStory.id,
        version: 1,
        isActive: true,
        createdById: user.id,
        arcStatement: toNullableText(input.arcStatement),
        toneGuide: toNullableText(input.toneGuide),
        narrativeBoundaries: toNullableText(input.narrativeBoundaries),
        guardrailInstruction: toNullableText(input.guardrailInstruction),
      },
    });

    await tx.storyAccessGrant.create({
      data: {
        storyId: createdStory.id,
        userId: user.id,
        source: "AUTHOR",
        grantedById: user.id,
      },
    });

    return createdStory;
  });

  return NextResponse.json(
    {
      story: {
        id: story.id,
        title: story.title,
        slug: story.slug,
        status: story.status,
        updatedAt: story.updatedAt.toISOString(),
        spineVersionCount: 1,
      },
    },
    { status: 201 },
  );
}
