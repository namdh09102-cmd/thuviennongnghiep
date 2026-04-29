---
name: agrilib-project-skill
description: "Dùng skill này cho tất cả công việc liên quan đến dự án AgriLib (Thư Viện Nông Nghiệp). Trigger khi người dùng đề cập: AgriLib, thư viện nông nghiệp, tinhte nông nghiệp, agrilib, render srv-d7o3n5ugvqtc73b7cc3g, neon rapid-pine-97234480, supabase dfuzqfeltigwjilpvadd. Skill này cung cấp toàn bộ context kỹ thuật, architectural decisions, code conventions và trạng thái hiện tại của dự án."
---

# AgriLib Project Skill
## Full Context cho mọi cuộc trò chuyện về dự án

---

## 🏗️ INFRASTRUCTURE

| Service | ID / URL | Notes |
|---------|---------|-------|
| Frontend | https://thuviennongnghiepfe.vercel.app | Next.js 14, Vercel |
| Backend | Render: srv-d7o3n5ugvqtc73b7cc3g | Node.js/Express |
| Database | Neon: rapid-pine-97234480 | PostgreSQL serverless |
| Auth | Google Cloud: autopostyt-489200 | Google OAuth 2.0 |
| Storage | Supabase: dfuzqfeltigwjilpvadd | Storage + Realtime |

---

## 💻 TECH STACK CHUẨN

```
Frontend:   Next.js 14 (App Router) + TypeScript + Tailwind CSS
Icons:      lucide-react (KHÔNG dùng emoji làm icon)
Forms:      react-hook-form + zod
State:      TanStack Query v5 (server state)
Realtime:   Supabase Realtime (notifications, comments)
Editor:     Tiptap (rich text)
Images:     next/image + Supabase Storage Transform
Dates:      date-fns với vi locale
ORM:        Prisma (hoặc raw pg queries)

Backend:    Node.js + Express + TypeScript
DB Client:  node-postgres (pg) với connection pooling
Auth:       JWT + Google OAuth 2.0
Cache:      node-cache (in-memory) hoặc Redis
Storage:    Supabase Storage SDK
```

---

## 📐 API STANDARDS

### Response Format
```typescript
// Success
{ success: true, data: T, message?: string, pagination?: { page, limit, total, nextPage } }

// Error
{ success: false, error: { code: string, message: string } }
```

### Error Codes
```
AUTH_REQUIRED       - Chưa đăng nhập
AUTH_FORBIDDEN      - Không có quyền
NOT_FOUND           - Không tìm thấy
VALIDATION_ERROR    - Dữ liệu không hợp lệ
RATE_LIMITED        - Quá nhiều request
```

### Pagination
- Dùng cursor-based cho feed lớn
- Dùng offset cho admin tables
- Default limit: 10 (feed), 20 (admin)

---

## 🗄️ DATABASE SCHEMA

```sql
-- Core tables
users (
  id, name, email, avatar_url, cover_url,
  role ENUM('user','editor','expert','moderator','admin'),
  is_banned BOOLEAN,
  is_expert BOOLEAN, is_verified BOOLEAN,
  bio, location, specialty, website, facebook_url,
  points INTEGER DEFAULT 0,
  follower_count, following_count, post_count,
  created_at, updated_at
)

posts (
  id, title, slug, excerpt, content,
  author_id → users.id,
  category_id → categories.id,
  status ENUM('draft','pending','approved','rejected'),
  rejected_reason TEXT,
  thumbnail_url, view_count,
  like_count, comment_count, save_count,
  is_featured BOOLEAN DEFAULT false,
  created_at, updated_at
)

categories (
  id, name, slug, icon, description,
  parent_id → categories.id,
  order_index, post_count
)

comments (
  id, post_id → posts.id, user_id → users.id,
  parent_id → comments.id,  -- reply support
  content, is_edited, is_deleted, like_count,
  created_at, updated_at
)

tags (id, name, slug)
post_tags (post_id, tag_id)
likes (id, post_id, user_id, created_at)
saves (id, post_id, user_id, created_at)
follows (follower_id, following_id, created_at)

questions (
  id, title, content, user_id, expert_id,
  status ENUM('open','answered','closed'),
  created_at
)
answers (
  id, question_id, user_id, content,
  is_best_answer BOOLEAN, like_count,
  created_at
)

notifications (
  id, user_id, type, actor_id,
  post_id, comment_id,
  message, is_read, created_at
)

sponsors (
  id, name, logo_url, affiliate_url,
  description, is_active, click_count
)
```

---

## 📱 MOBILE-FIRST RULES (BẮT BUỘC)

```typescript
// ✅ ĐÚNG — Touch target đủ lớn
<button className="min-h-[44px] min-w-[44px] px-4">

// ✅ ĐÚNG — Main content tránh bottom nav
<main className="pb-20 md:pb-0">

// ✅ ĐÚNG — Font size đủ lớn
<p className="text-base">  // 16px
<span className="text-sm"> // 14px — min cho secondary

// ✅ ĐÚNG — Lucide icon thay vì emoji
import { Home, Search, Bell, Plus } from 'lucide-react'

// ✅ ĐÚNG — next/image với lazy load
<Image src={post.thumbnail} alt={post.title}
  width={400} height={225} loading="lazy"
  placeholder="blur" blurDataURL={post.blurHash} />

// ❌ SAI — Emoji làm icon
<span>🏠 Trang chủ</span>

// ❌ SAI — Thiếu padding cho bottom nav
<main className="p-4">
```

---

## 🔑 KEY COMPONENTS

### PostCard
```typescript
interface PostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url?: string;
  author: { id: number; name: string; avatar_url: string };
  category: { name: string; slug: string; color: string };
  tags: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  is_featured?: boolean;
}
```

### Post Status Workflow
```
DRAFT (user đang soạn)
  ↓ Submit
PENDING (chờ admin duyệt)
  ↓ Admin action
APPROVED (published) hoặc REJECTED (kèm lý do)
```

### User Roles & Permissions
```
user:       Đọc, comment, like, tạo bài (→ pending)
editor:     + Duyệt bài, edit bài
expert:     + Trả lời hỏi đáp (answer)
moderator:  + Xóa comment, ban user
admin:      Full access
```

---

## ⚠️ KNOWN ISSUES (Không fix lại những cái đã biết)

1. Post detail → 404: Đang implement /posts/[slug]/page.tsx
2. Admin CRUD: Đang build từng module
3. Render cold start: Setup cron ping mỗi 14 phút tại cron-job.org
4. Hoi-dap empty: Cần seed data + fix form submit
5. Expert data fake: Hardcode trong sidebar, cần connect DB

---

## 🎯 CURRENT SPRINT FOCUS

1. Fix /posts/[slug] routing (P0)
2. Build API endpoints chuẩn (P0)  
3. Admin CRUD posts + users (P1)
4. Mobile UX fixes (P1)

---

## 💰 MONETIZATION PLAN

1. **Affiliate links** — Quản lý qua admin, tracking click
2. **Sponsored posts** — Bài viết được tài trợ, label rõ ràng
3. **Expert consultation** — Paid Q&A với chuyên gia
4. **Premium** — Nội dung độc quyền, không quảng cáo
5. **Job board** — Tuyển dụng ngành nông nghiệp

---

## 🔧 QUICK COMMANDS

```bash
# Frontend dev
cd frontend && npm run dev    # localhost:3000
npm run build                  # Check build errors
npm run lint                   # ESLint check

# Backend dev  
cd backend && npm run dev      # localhost:3001 (nodemon)
npm run db:migrate             # Run migrations
npm run db:seed                # Seed test data

# Check Render logs
# → https://dashboard.render.com/web/srv-d7o3n5ugvqtc73b7cc3g/logs

# Check Neon DB
# → https://console.neon.tech/app/projects/rapid-pine-97234480
```
