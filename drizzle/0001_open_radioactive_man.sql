CREATE TYPE "public"."canon_commit_type" AS ENUM('truth', 'retcon', 'reversal');--> statement-breakpoint
CREATE TYPE "public"."chronicle_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."knowledge_status" AS ENUM('hidden', 'discovered', 'confirmed', 'invalidated');--> statement-breakpoint
CREATE TYPE "public"."perspective_run_status" AS ENUM('active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."resolution_type" AS ENUM('selected', 'skipped', 'auto_selected', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."scene_instance_status" AS ENUM('planned', 'rendered', 'resolved', 'superseded');--> statement-breakpoint
CREATE TABLE "chronicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_version_id" uuid NOT NULL,
	"reader_id" text,
	"status" "chronicle_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perspective_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"perspective_id" uuid NOT NULL,
	"status" "perspective_run_status" DEFAULT 'active' NOT NULL,
	"entry_count" integer DEFAULT 0 NOT NULL,
	"knowledge_score" integer DEFAULT 0 NOT NULL,
	"last_scene_instance_id" uuid,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"event_type" varchar(120) NOT NULL,
	"event_ts" timestamp with time zone DEFAULT now() NOT NULL,
	"caused_by_type" varchar(80),
	"caused_by_id" text,
	"payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "choice_resolutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_choice_id" uuid NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"resolution_type" "resolution_type" DEFAULT 'selected' NOT NULL,
	"resolution_payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scene_choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_instance_id" uuid NOT NULL,
	"choice_key" varchar(120) NOT NULL,
	"label" varchar(255) NOT NULL,
	"intent" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"planner_effects_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scene_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"perspective_run_id" uuid NOT NULL,
	"planner_cycle" integer NOT NULL,
	"scene_kind" varchar(80) NOT NULL,
	"scene_goal" varchar(120) NOT NULL,
	"planner_payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"generator_payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rendered_prose" text,
	"status" "scene_instance_status" DEFAULT 'planned' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canon_commits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"canon_entry_id" uuid,
	"commit_type" "canon_commit_type" DEFAULT 'truth' NOT NULL,
	"commit_key" varchar(120) NOT NULL,
	"commit_value_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_event_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chronicle_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"current_perspective_id" uuid,
	"current_scene_instance_id" uuid,
	"progress_index" integer DEFAULT 0 NOT NULL,
	"ending_locked" boolean DEFAULT false NOT NULL,
	"summary_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chronicle_id" uuid NOT NULL,
	"perspective_id" uuid,
	"knowledge_key" varchar(120) NOT NULL,
	"knowledge_status" "knowledge_status" DEFAULT 'discovered' NOT NULL,
	"source_scene_instance_id" uuid,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chronicles" ADD CONSTRAINT "chronicles_book_version_id_book_versions_id_fk" FOREIGN KEY ("book_version_id") REFERENCES "public"."book_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perspective_runs" ADD CONSTRAINT "perspective_runs_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perspective_runs" ADD CONSTRAINT "perspective_runs_perspective_id_perspectives_id_fk" FOREIGN KEY ("perspective_id") REFERENCES "public"."perspectives"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_log" ADD CONSTRAINT "event_log_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choice_resolutions" ADD CONSTRAINT "choice_resolutions_scene_choice_id_scene_choices_id_fk" FOREIGN KEY ("scene_choice_id") REFERENCES "public"."scene_choices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choice_resolutions" ADD CONSTRAINT "choice_resolutions_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_choices" ADD CONSTRAINT "scene_choices_scene_instance_id_scene_instances_id_fk" FOREIGN KEY ("scene_instance_id") REFERENCES "public"."scene_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_instances" ADD CONSTRAINT "scene_instances_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_instances" ADD CONSTRAINT "scene_instances_perspective_run_id_perspective_runs_id_fk" FOREIGN KEY ("perspective_run_id") REFERENCES "public"."perspective_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canon_commits" ADD CONSTRAINT "canon_commits_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canon_commits" ADD CONSTRAINT "canon_commits_canon_entry_id_canon_entries_id_fk" FOREIGN KEY ("canon_entry_id") REFERENCES "public"."canon_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canon_commits" ADD CONSTRAINT "canon_commits_source_event_id_event_log_id_fk" FOREIGN KEY ("source_event_id") REFERENCES "public"."event_log"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chronicle_states" ADD CONSTRAINT "chronicle_states_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chronicle_states" ADD CONSTRAINT "chronicle_states_current_perspective_id_perspectives_id_fk" FOREIGN KEY ("current_perspective_id") REFERENCES "public"."perspectives"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chronicle_states" ADD CONSTRAINT "chronicle_states_current_scene_instance_id_scene_instances_id_fk" FOREIGN KEY ("current_scene_instance_id") REFERENCES "public"."scene_instances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_state" ADD CONSTRAINT "knowledge_state_chronicle_id_chronicles_id_fk" FOREIGN KEY ("chronicle_id") REFERENCES "public"."chronicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_state" ADD CONSTRAINT "knowledge_state_perspective_id_perspectives_id_fk" FOREIGN KEY ("perspective_id") REFERENCES "public"."perspectives"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_state" ADD CONSTRAINT "knowledge_state_source_scene_instance_id_scene_instances_id_fk" FOREIGN KEY ("source_scene_instance_id") REFERENCES "public"."scene_instances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chronicles_book_version_id_idx" ON "chronicles" USING btree ("book_version_id");--> statement-breakpoint
CREATE INDEX "chronicles_reader_id_idx" ON "chronicles" USING btree ("reader_id");--> statement-breakpoint
CREATE INDEX "chronicles_status_idx" ON "chronicles" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "perspective_runs_chronicle_perspective_unique_idx" ON "perspective_runs" USING btree ("chronicle_id","perspective_id");--> statement-breakpoint
CREATE INDEX "perspective_runs_chronicle_id_idx" ON "perspective_runs" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "perspective_runs_perspective_id_idx" ON "perspective_runs" USING btree ("perspective_id");--> statement-breakpoint
CREATE INDEX "perspective_runs_status_idx" ON "perspective_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_log_chronicle_id_idx" ON "event_log" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "event_log_event_type_idx" ON "event_log" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "event_log_event_ts_idx" ON "event_log" USING btree ("event_ts");--> statement-breakpoint
CREATE UNIQUE INDEX "choice_resolutions_scene_choice_unique_idx" ON "choice_resolutions" USING btree ("scene_choice_id");--> statement-breakpoint
CREATE INDEX "choice_resolutions_chronicle_id_idx" ON "choice_resolutions" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "choice_resolutions_resolution_type_idx" ON "choice_resolutions" USING btree ("resolution_type");--> statement-breakpoint
CREATE INDEX "choice_resolutions_resolved_at_idx" ON "choice_resolutions" USING btree ("resolved_at");--> statement-breakpoint
CREATE UNIQUE INDEX "scene_choices_scene_choice_key_unique_idx" ON "scene_choices" USING btree ("scene_instance_id","choice_key");--> statement-breakpoint
CREATE INDEX "scene_choices_scene_instance_id_idx" ON "scene_choices" USING btree ("scene_instance_id");--> statement-breakpoint
CREATE INDEX "scene_choices_sort_order_idx" ON "scene_choices" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "scene_instances_chronicle_cycle_unique_idx" ON "scene_instances" USING btree ("chronicle_id","planner_cycle");--> statement-breakpoint
CREATE INDEX "scene_instances_chronicle_id_idx" ON "scene_instances" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "scene_instances_perspective_run_id_idx" ON "scene_instances" USING btree ("perspective_run_id");--> statement-breakpoint
CREATE INDEX "scene_instances_status_idx" ON "scene_instances" USING btree ("status");--> statement-breakpoint
CREATE INDEX "canon_commits_chronicle_id_idx" ON "canon_commits" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "canon_commits_commit_lookup_idx" ON "canon_commits" USING btree ("commit_type","commit_key");--> statement-breakpoint
CREATE INDEX "canon_commits_source_event_id_idx" ON "canon_commits" USING btree ("source_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "chronicle_states_chronicle_unique_idx" ON "chronicle_states" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "chronicle_states_current_perspective_idx" ON "chronicle_states" USING btree ("current_perspective_id");--> statement-breakpoint
CREATE INDEX "chronicle_states_current_scene_idx" ON "chronicle_states" USING btree ("current_scene_instance_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_state_chronicle_perspective_key_unique_idx" ON "knowledge_state" USING btree ("chronicle_id","perspective_id","knowledge_key");--> statement-breakpoint
CREATE INDEX "knowledge_state_chronicle_id_idx" ON "knowledge_state" USING btree ("chronicle_id");--> statement-breakpoint
CREATE INDEX "knowledge_state_perspective_id_idx" ON "knowledge_state" USING btree ("perspective_id");--> statement-breakpoint
CREATE INDEX "knowledge_state_status_idx" ON "knowledge_state" USING btree ("knowledge_status");