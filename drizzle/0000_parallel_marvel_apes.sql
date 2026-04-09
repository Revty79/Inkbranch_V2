CREATE TYPE "public"."book_version_status" AS ENUM('draft', 'test', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."canon_visibility" AS ENUM('public', 'restricted', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."lifecycle_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "book_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"version_label" varchar(80) NOT NULL,
	"status" "book_version_status" DEFAULT 'draft' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"world_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(255) NOT NULL,
	"premise" text,
	"default_tone" varchar(80),
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canon_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"entry_type" varchar(80) NOT NULL,
	"subject_type" varchar(80) NOT NULL,
	"subject_id" uuid,
	"canonical_text" text NOT NULL,
	"importance" integer DEFAULT 0 NOT NULL,
	"visibility" "canon_visibility" DEFAULT 'public' NOT NULL,
	"tags_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" text,
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" text,
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" text,
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perspectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"character_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" text,
	"voice_guide" text,
	"knowledge_baseline_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"eligibility_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arc_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"arc_key" varchar(120) NOT NULL,
	"milestone_key" varchar(120) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"sequence_hint" integer,
	"eligibility_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completion_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ending_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"ending_key" varchar(120) NOT NULL,
	"title" varchar(255) NOT NULL,
	"ending_type" varchar(80) NOT NULL,
	"eligibility_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"priority_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"resolution_template_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pacing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"scope" varchar(80) NOT NULL,
	"rule_type" varchar(80) NOT NULL,
	"rule_config_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reveal_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"reveal_key" varchar(120) NOT NULL,
	"subject_type" varchar(80) NOT NULL,
	"subject_id" uuid,
	"gating_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"exposure_effects_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "worlds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "lifecycle_status" DEFAULT 'draft' NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_versions" ADD CONSTRAINT "book_versions_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canon_entries" ADD CONSTRAINT "canon_entries_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perspectives" ADD CONSTRAINT "perspectives_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perspectives" ADD CONSTRAINT "perspectives_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arc_milestones" ADD CONSTRAINT "arc_milestones_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ending_rules" ADD CONSTRAINT "ending_rules_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacing_rules" ADD CONSTRAINT "pacing_rules_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reveal_rules" ADD CONSTRAINT "reveal_rules_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "book_versions_book_label_unique_idx" ON "book_versions" USING btree ("book_id","version_label");--> statement-breakpoint
CREATE INDEX "book_versions_book_id_idx" ON "book_versions" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "book_versions_status_idx" ON "book_versions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "book_versions_is_active_idx" ON "book_versions" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "books_world_slug_unique_idx" ON "books" USING btree ("world_id","slug");--> statement-breakpoint
CREATE INDEX "books_world_id_idx" ON "books" USING btree ("world_id");--> statement-breakpoint
CREATE INDEX "books_status_idx" ON "books" USING btree ("status");--> statement-breakpoint
CREATE INDEX "canon_entries_book_version_id_idx" ON "canon_entries" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "canon_entries_entry_type_idx" ON "canon_entries" USING btree ("entry_type");--> statement-breakpoint
CREATE INDEX "canon_entries_subject_type_idx" ON "canon_entries" USING btree ("subject_type");--> statement-breakpoint
CREATE INDEX "canon_entries_importance_idx" ON "canon_entries" USING btree ("importance");--> statement-breakpoint
CREATE UNIQUE INDEX "canon_entries_version_entry_subject_unique_idx" ON "canon_entries" USING btree ("book_version_id","entry_type","subject_type","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "characters_version_slug_unique_idx" ON "characters" USING btree ("book_version_id","slug");--> statement-breakpoint
CREATE INDEX "characters_book_version_id_idx" ON "characters" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "characters_status_idx" ON "characters" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "factions_version_slug_unique_idx" ON "factions" USING btree ("book_version_id","slug");--> statement-breakpoint
CREATE INDEX "factions_book_version_id_idx" ON "factions" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "factions_status_idx" ON "factions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "locations_version_slug_unique_idx" ON "locations" USING btree ("book_version_id","slug");--> statement-breakpoint
CREATE INDEX "locations_book_version_id_idx" ON "locations" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "locations_status_idx" ON "locations" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "perspectives_version_slug_unique_idx" ON "perspectives" USING btree ("book_version_id","slug");--> statement-breakpoint
CREATE INDEX "perspectives_book_version_id_idx" ON "perspectives" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "perspectives_character_id_idx" ON "perspectives" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "perspectives_status_idx" ON "perspectives" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "arc_milestones_version_arc_milestone_unique_idx" ON "arc_milestones" USING btree ("book_version_id","arc_key","milestone_key");--> statement-breakpoint
CREATE INDEX "arc_milestones_book_version_id_idx" ON "arc_milestones" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "arc_milestones_arc_key_idx" ON "arc_milestones" USING btree ("arc_key");--> statement-breakpoint
CREATE INDEX "arc_milestones_milestone_key_idx" ON "arc_milestones" USING btree ("milestone_key");--> statement-breakpoint
CREATE UNIQUE INDEX "ending_rules_version_ending_key_unique_idx" ON "ending_rules" USING btree ("book_version_id","ending_key");--> statement-breakpoint
CREATE INDEX "ending_rules_book_version_id_idx" ON "ending_rules" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "ending_rules_ending_type_idx" ON "ending_rules" USING btree ("ending_type");--> statement-breakpoint
CREATE INDEX "pacing_rules_book_version_id_idx" ON "pacing_rules" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "pacing_rules_scope_idx" ON "pacing_rules" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "pacing_rules_rule_type_idx" ON "pacing_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE UNIQUE INDEX "reveal_rules_version_reveal_key_unique_idx" ON "reveal_rules" USING btree ("book_version_id","reveal_key");--> statement-breakpoint
CREATE INDEX "reveal_rules_book_version_id_idx" ON "reveal_rules" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "reveal_rules_reveal_key_idx" ON "reveal_rules" USING btree ("reveal_key");--> statement-breakpoint
CREATE INDEX "reveal_rules_subject_lookup_idx" ON "reveal_rules" USING btree ("subject_type","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "worlds_slug_unique_idx" ON "worlds" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "worlds_status_idx" ON "worlds" USING btree ("status");