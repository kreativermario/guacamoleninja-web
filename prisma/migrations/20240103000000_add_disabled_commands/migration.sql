ALTER TABLE "GuildConfig" ADD COLUMN IF NOT EXISTS "disabledCommands" text[] NOT NULL DEFAULT '{}';
