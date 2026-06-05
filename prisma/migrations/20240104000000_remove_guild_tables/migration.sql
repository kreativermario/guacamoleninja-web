-- Bot now owns Guild/GuildConfig in its own database.
-- The web app reads this data via the Bot API instead.
DROP TABLE IF EXISTS "GuildConfig";
DROP TABLE IF EXISTS "Guild";
