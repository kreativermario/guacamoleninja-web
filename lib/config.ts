export const APP_URL =
  (process.env.APP_URL ?? "https://app.guacamoleninja.com").replace(/\/$/, "")

export const DOCS_URL =
  process.env.DOCS_URL ?? "https://docs.guacamoleninja.com"

export const GITHUB_URL =
  "https://github.com/kreativermario/guacamoleninja-bot"

export const BOT_INVITE_BASE =
  `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID ?? ""}&permissions=66448710&scope=bot+applications.commands`
