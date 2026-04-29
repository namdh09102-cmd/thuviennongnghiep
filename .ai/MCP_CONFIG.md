# ⚙️ MCP CONFIG — AgriLib Project
## Model Context Protocol Settings

> File này dùng để setup MCP khi làm việc với project AgriLib.
> Copy section phù hợp vào MCP config của Claude/Cursor.

---

## 1. CLAUDE.md — Project Context cho Cursor/Windsurf/Continue

Tạo file `CLAUDE.md` ở root project với nội dung:

```markdown
# AgriLib — Thư Viện Nông Nghiệp

## Project Overview
Nền tảng cộng đồng nông nghiệp Việt Nam (như Tinhte.vn nhưng cho nông dân)

## Stack
- Frontend: Next.js 14 (App Router) — deployed Vercel
- Backend: Node.js/Express — deployed Render (srv-d7o3n5ugvqtc73b7cc3g)  
- Database: PostgreSQL — Neon (project: rapid-pine-97234480)
- Auth: Google OAuth 2.0 (project: autopostyt-489200)
- Storage: Supabase (project: dfuzqfeltigwjilpvadd)

## Key Rules
1. MOBILE-FIRST — nông dân dùng điện thoại rẻ
2. Minimum touch target: 44px
3. Font size body: minimum 16px
4. API response: { success, data, message, pagination }
5. Error format: { success: false, error: { code, message } }
6. Tất cả UI text phải tiếng Việt
7. Post status: draft → pending → approved/rejected
8. User roles: user, editor, expert, moderator, admin

## Naming Conventions
- API endpoints: /api/v1/[resource]
- React components: PascalCase
- Files: kebab-case
- DB columns: snake_case
- CSS: Tailwind utilities

## Important URLs
- Frontend: https://thuviennongnghiepfe.vercel.app
- Admin: https://thuviennongnghiepfe.vercel.app/admin

## Current Critical Bugs
- Post detail pages return 404 (routing not implemented)
- Admin panel is UI shell without real functionality
- Hoi-dap page has no data

## Do NOT
- Use SELECT * in queries
- Skip pagination on list endpoints
- Hardcode category/expert data
- Deploy without testing mobile view
```

---

## 2. MCP SERVERS CONFIG (cho Claude Desktop)

File: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "agrilib-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://[NEON_CONNECTION_STRING]"
      ],
      "description": "AgriLib PostgreSQL database (Neon)"
    },
    "agrilib-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/agrilib/frontend",
        "/path/to/agrilib/backend"
      ],
      "description": "AgriLib source code access"
    },
    "agrilib-github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "[TOKEN_FROM_github.com/settings/tokens]"
      },
      "description": "GitHub repo access for AgriLib"
    }
  }
}
```

> ⚠️ Thay [NEON_CONNECTION_STRING] bằng connection string từ:
> https://console.neon.tech/app/projects/rapid-pine-97234480
> 
> Thay [TOKEN_FROM_...] bằng token từ:
> https://github.com/settings/tokens

---

## 3. ENVIRONMENT VARIABLES

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=https://[render-service-name].onrender.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dfuzqfeltigwjilpvadd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key_from_supabase]

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[client_id_from_google_cloud]
```

### Backend (.env)
```bash
# Database
DATABASE_URL=[neon_connection_string]
DATABASE_URL_UNPOOLED=[neon_direct_connection]

# Auth
JWT_SECRET=[random_32_char_string]
GOOGLE_CLIENT_ID=[from_google_cloud_autopostyt-489200]
GOOGLE_CLIENT_SECRET=[from_google_cloud]

# Supabase (for storage)
SUPABASE_URL=https://dfuzqfeltigwjilpvadd.supabase.co
SUPABASE_SERVICE_KEY=[service_role_key]

# App
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://thuviennongnghiepfe.vercel.app
```

---

## 4. SYSTEM PROMPT CHO CLAUDE (copy khi mở conversation mới)

```
Bạn đang làm việc với dự án AgriLib — Thư Viện Nông Nghiệp Việt Nam.

CONTEXT:
- Frontend: Next.js 14 App Router, deployed Vercel
- Backend: Node.js/Express, deployed Render (srv-d7o3n5ugvqtc73b7cc3g)
- DB: PostgreSQL Neon (rapid-pine-97234480) 
- Auth: Google OAuth (project autopostyt-489200)
- Storage/Realtime: Supabase (dfuzqveltigwjilpvadd)

NGUYÊN TẮC CODE:
1. Mobile-first, touch target ≥ 44px, font-size ≥ 16px
2. API format: { success, data, message, pagination }
3. Luôn có pagination cho list endpoints
4. Post workflow: draft → pending → approved/rejected
5. Roles: user/editor/expert/moderator/admin
6. UI text: 100% tiếng Việt

TECH STACK CHI TIẾT:
- CSS: Tailwind CSS
- Icons: lucide-react
- Forms: react-hook-form + zod validation
- State: React Query (TanStack Query) cho server state
- Realtime: Supabase Realtime (cho notifications, comments)
- Rich editor: Tiptap hoặc Quill
- Image upload: Supabase Storage
- Date: date-fns (với vi locale)

CRITICAL BUGS CẦN FIX TRƯỚC:
1. Post detail 404 — implement app/posts/[slug]/page.tsx
2. Admin panel cần CRUD thật — không chỉ UI
3. Render cold start — setup cron ping mỗi 14 phút

Hãy code theo standard này và luôn ưu tiên mobile experience.
```

---

## 5. CURSOR RULES (.cursorrules)

Tạo file `.cursorrules` ở root:

```
# AgriLib Cursor Rules

## Tech Stack
- Next.js 14 App Router
- TypeScript (strict mode)
- Tailwind CSS
- Prisma ORM (với Neon PostgreSQL)
- Supabase (storage + realtime)
- React Query (TanStack Query v5)
- lucide-react cho icons

## Code Style
- Prefer Server Components khi không cần client state
- Dùng 'use client' chỉ khi cần (hooks, events, browser API)
- API calls phải dùng React Query (không fetch trực tiếp trong component)
- Luôn handle loading + error state
- Dùng Zod cho form validation

## File Structure
/app
  /(routes)
    /[category-slug]/page.tsx  -- Category page
    /posts/[slug]/page.tsx     -- Post detail
    /profile/[id]/page.tsx     -- User profile
    /admin/                    -- Admin pages
  /api/                        -- API routes (nếu dùng Next.js API)
/components
  /ui/                         -- Base UI components
  /features/                   -- Feature components (PostCard, CommentBox...)
  /layouts/                    -- Layout components
/lib
  /api/                        -- API client functions
  /db/                         -- Database queries
  /utils/                      -- Utility functions

## Naming
- Components: PascalCase (PostCard.tsx)
- Hooks: camelCase với 'use' prefix (useInfiniteScroll.ts)
- API functions: camelCase verb-noun (fetchPosts, createComment)
- DB functions: camelCase (getUserById, getPostsByCategory)

## Mobile Rules
- NEVER forget padding-bottom for fixed bottom nav: pb-20
- ALWAYS use min-h-[44px] min-w-[44px] for clickable elements
- PREFER relative time display ('2 giờ trước') over absolute
- ALWAYS add loading skeleton before data loads

## Do Not
- SELECT * from database
- Fetch without error handling  
- Use hardcoded data (categories, experts, sponsors)
- Skip TypeScript types
- Use any type
```
