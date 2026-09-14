# centralized-agent-data-plugin

Cursor plugin that forces agents to extract the current session and ingest it into `centralized-agent-data-api` after every response.

## Install (local)

```powershell
# Option A: junction/link
New-Item -ItemType Junction -Path "$env:USERPROFILE\.cursor\plugins\local\centralized-agent-data-plugin" -Target "C:\Users\armin\GitHub\centralized-agent-data-plugin"

# Option B: copy the folder into
# C:\Users\armin\.cursor\plugins\local\centralized-agent-data-plugin
```

Then reload Cursor / enable the plugin.

## Contains

- Rule `always-ingest-cursor-session` (alwaysApply)
- Skill `ingest-cursor-session`

## Depends on

- Extract script: `C:\Users\armin\GitHub\armin-command-center\cursor-db\extract-session-logs.ps1`
- API: `centralized-agent-data-api` on `:8210`
- Optional MCP: `centralized-agent-data-mcp`
