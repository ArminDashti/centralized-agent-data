---
name: ingest-cursor-session
description: >-
  Extracts the current Cursor composer session from state.vscdb and ingests
  context %, tokens, thinking, and useful turn metadata into
  centralized-agent-data-api.
disable-model-invocation: false
metadata:
  version: "1.0.0"
  author: Armin Dashti
  category: logging
  tags: [cursor, sessions, tokens, thinking, ingest]
  last_updated: "2026-09-14 15:10:00"
  uuid: 7e4b9c21-5a83-4f0d-9e2c-1b6d8a0f3c55
---

# Ingest Cursor Session

## Objective

Persist the current Cursor session extract into PostgreSQL via `centralized-agent-data-api`, prioritizing **context**, **token counts**, **thinking**, and useful turn metadata.

## When

- After every agent response (required by alwaysApply rule)
- When the user asks to sync/ingest the current session

## How

1. **Resolve UUID**
   - Prefer the active composer/chat UUID from the conversation or agent-transcripts folder name.
   - If unknown, stop with a one-line fail: `cad-ingest: missing session uuid`.

2. **Extract**
   - Run (PowerShell):

```powershell
& "C:\Users\armin\GitHub\armin-command-center\cursor-db\extract-session-logs.ps1" -Uuid <UUID> -Format json
```

   - Output file: `C:\Users\armin\GitHub\armin-command-center\cursor-db\sessions\<uuid>.json`
   - Override extract script path with env `CAD_EXTRACT_SCRIPT` when set.

3. **Ingest (prefer MCP)**
   - If MCP `centralized-agent-data` / `ingest_session` is available:

```text
ingest_session(file_path="<absolute path to json>")
```

   - Else HTTP:

```powershell
$base = $env:CAD_API_URL; if (-not $base) { $base = "http://127.0.0.1:8210" }
$user = if ($env:CAD_USERNAME) { $env:CAD_USERNAME } else { "armin" }
$pass = if ($env:CAD_PASSWORD) { $env:CAD_PASSWORD } else { "dopadopa123" }
$login = Invoke-RestMethod -Method Post -Uri "$base/api/v1/auth/login" -ContentType "application/json" -Body (@{ username = $user; password = $pass } | ConvertTo-Json)
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod -Method Post -Uri "$base/api/v1/sessions/ingest" -Headers $headers -ContentType "application/json" -InFile "<json-path>"
```

4. **Report**
   - Success: `cad-ingest: ok <uuid> context=<pct> in=<n> out=<n>`
   - Failure: `cad-ingest: fail <reason>` (one line). Continue the turn; do not invent data.

## Always

1. **Always** ingest after the agent response when this skill/rule is loaded.
2. **Always** prefer MCP `ingest_session` when configured.
3. **Always** keep secrets out of chat (use env defaults).

## Never

1. **Never** skip ingest because the turn “looks small”.
2. **Never** commit `.env` or paste passwords into the chat.
3. **Never** rewrite `state.vscdb` — read-only extract only.
