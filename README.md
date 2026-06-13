# Lake Area Rentals

Static marketing site for Lake Area Rentals LLC, built with React + Vite and deployed to GitHub Pages at <https://www.lakearearentalsllc.com>.

## Agent skills

This repo uses [agent skills](https://github.com/supabase/agent-skills) to give Claude Code project-specific guidance (e.g. Supabase migration and RLS best practices). The installed skills live under `.claude/` and `.agents/`, which are **gitignored**, so each developer installs them locally:

```bash
npx skills add supabase/agent-skills
```

Once installed, the skills load automatically when you work on a matching task in Claude Code — for example, anything touching the Supabase database, RLS, or migrations triggers the `supabase` skill. No manual step is needed; you can also invoke one explicitly with its slash command (e.g. `/supabase`).

Database access from Claude Code goes through the project-scoped Supabase MCP server defined in `.mcp.json` (also gitignored). To set it up:

```bash
claude mcp add --scope project --transport http supabase \
  "https://mcp.supabase.com/mcp?project_ref=<your-project-ref>"
```

Then run `/mcp` in a terminal, select **supabase**, and authenticate via the browser (OAuth).
