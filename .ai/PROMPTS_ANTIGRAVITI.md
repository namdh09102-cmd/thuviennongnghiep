# 🔥 10 PROMPTS CHO ANTIGRAVITI — AgriLib Fix Tasks
**Version:** 1.0 | **Project:** Thư Viện Nông Nghiệp  
**Cách dùng:** Copy từng PROMPT dưới đây, paste cho dev/AI thực hiện

---

## PROMPT 1 — FIX HOMEPAGE & FEED

```
Dự án: AgriLib — Thư Viện Nông Nghiệp
Frontend: Next.js (Vercel)
Backend: Node.js/Express (Render: srv-d7o3n5ugvqtc73b7cc3g)
DB: PostgreSQL (Neon: rapid-pine-97234480)

NHIỆM VỤ: Sửa và nâng cấp trang chủ (Homepage)

VẤN ĐỀ HIỆN TẠI:
1. Sidebar "Chuyên gia online" đang hardcode — cần connect API
2. Sidebar "Đang thảo luận" hardcode — cần lấy từ DB (top comment posts)
3. Card bài viết thiếu: author avatar, thời gian đăng, view count, like count
4. Filter category (Tất cả/Trồng trọt/...) chưa thay đổi URL → SEO kém
5. Không có skeleton loading → UX xấu khi API chậm
6. Affiliate sidebar hardcode — cần quản lý qua admin

YÊU CẦU CỤ THỂ:

A. Post Card Component — thêm vào mỗi card:
   - Avatar + tên tác giả (link đến /profile/[userId])
   - Thời gian đăng (format: "2 giờ trước", "3 ngày trước")
   - View count (icon 👁), like count (icon ❤️), comment count (icon 💬)
   - Category badge (màu theo category)
   - Thumbnail image (16:9 ratio, lazy load)

B. Category Filter:
   - Khi click category → URL thay đổi: /?category=trong-trot
   - URL shareable và SEO-friendly
   - Active state rõ ràng

C. Skeleton Loading:
   - Tạo PostCardSkeleton component (animated shimmer)
   - Show 6 skeleton khi đang fetch
   - Min loading time: 300ms để tránh flash

D. API cần có:
   - GET /api/v1/posts?category=[slug]&page=1&limit=10
   - Response: { posts: [], total, nextPage }
   - GET /api/v1/posts/trending?limit=5 (cho sidebar "Đang thảo luận")

E. Infinite scroll hoặc "Load more" button ở cuối feed

OUTPUT MONG MUỐN:
- Homepage load < 2s trên 4G
- Card hiển thị đầy đủ metadata
- Category filter hoạt động với URL đúng
- Skeleton loading smooth
```

---

## PROMPT 2 — FIX POST DETAIL (Critical Bug: 404)

```
Dự án: AgriLib — Thư Viện Nông Nghiệp
Frontend: Next.js

BUG CRITICAL: Tất cả link bài viết đang trả về 404.
Ví dụ: /posts/ky-thuat-trong-dua-luoi-nha-mang → 404

CHẨN ĐOÁN:
- Có thể file pages/posts/[slug].jsx hoặc app/posts/[slug]/page.tsx chưa tồn tại
- Có thể slug trong DB không match với slug trong URL
- Có thể API endpoint GET /api/v1/posts/[slug] chưa có

NHIỆM VỤ:

1. Tạo/sửa dynamic route: app/posts/[slug]/page.tsx
   - Fetch post data từ API theo slug
   - Xử lý 404 nếu không tìm thấy (notFound())
   - SEO: generateMetadata() với title, description, OG tags từ post data

2. Layout trang bài viết cần có:
   - Breadcrumb: Trang chủ > [Category] > [Tên bài]
   - Thumbnail header image (nếu có)
   - Author block: avatar, tên, follow button, ngày đăng
   - Content area: rich text render (support HTML/Markdown)
   - Tags: hiển thị tags liên quan, clickable
   - Like button (❤️ [count]) — cần auth
   - Save button (🔖) — cần auth
   - Share buttons: Facebook, Copy link
   - Comment section (xem Prompt 7)
   - Related posts: 3-4 bài cùng category
   - Table of contents (nếu bài dài — auto generate từ headings)

3. API cần:
   - GET /api/v1/posts/:slug → trả về full post + author + tags
   - POST /api/v1/posts/:id/like (auth required)
   - POST /api/v1/posts/:id/save (auth required)
   - GET /api/v1/posts/:id/related

4. SEO:
   - <title>: [Post Title] | Thư Viện Nông Nghiệp
   - <meta description>: excerpt 160 chars
   - <meta og:image>: thumbnail
   - Structured data: Article schema (JSON-LD)
   - Canonical URL

OUTPUT MONG MUỐN:
- Tất cả bài viết accessible qua /posts/[slug]
- Share lên Facebook hiển thị thumbnail đẹp
- Google index được bài viết
```

---

## PROMPT 3 — FIX MOBILE UX (Toàn Bộ App)

```
Dự án: AgriLib — Next.js
Đối tượng: Nông dân dùng smartphone giá rẻ (Android tầm trung, màn 5-6 inch)
Priority: MOBILE-FIRST — đây là platform chính

NHIỆM VỤ: Audit và fix toàn bộ mobile UX

CỤ THỂ:

1. Icon System — Thay toàn bộ emoji icon bằng SVG:
   - Dùng thư viện: lucide-react hoặc heroicons
   - Navbar icons: Search, Bell, Plus, User
   - Bottom nav icons: Home, Article, Plus, QuestionMark, Person
   - Không dùng emoji trong UI element

2. Bottom Navigation:
   - Fix padding: thêm `pb-[calc(env(safe-area-inset-bottom)+64px)]` cho main content
   - Active state rõ ràng (color + label)
   - Touch target: minimum 48x48px
   - Safe area inset cho iPhone có notch

3. Touch & Interaction:
   - Minimum touch target 44x44px cho tất cả button/link
   - Thêm `active:scale-95 transition` cho buttons
   - Thêm `tap-highlight-color: transparent` để remove default highlight
   
4. Header:
   - Implement hide-on-scroll-down, show-on-scroll-up (IntersectionObserver)
   - Sticky nhưng ẩn khi scroll xuống để tăng reading area

5. Images:
   - Tất cả <img> phải có: loading="lazy", sizes attribute
   - Dùng next/image với placeholder="blur"
   - Thumbnail trong card: aspect-ratio 16/9, object-fit cover

6. Viết bài (/posts/create) — Mobile optimize:
   - Full-screen textarea trên mobile
   - Image upload button lớn, rõ
   - Preview mode trước khi đăng
   - Auto-save draft vào localStorage

7. Loading States:
   - Skeleton cho feed (shimmer animation)
   - Skeleton cho post detail
   - Loading spinner nhỏ trong button khi submit
   - Page transition: fade hoặc slide

8. Typography:
   - Body text: minimum 16px
   - Secondary text: minimum 14px
   - Line height: 1.6 cho content, 1.4 cho UI

9. Floating Action Button (FAB):
   - Button "Viết bài" nổi ở góc dưới phải
   - Style: circular, 56px, màu primary, shadow
   - Ẩn khi scroll down, hiện khi scroll up
   - Position: bottom: 80px (trên bottom nav), right: 16px

10. Pull-to-Refresh:
    - Implement trên feed trang chủ
    - Visual indicator khi pull

OUTPUT MONG MUỐN:
- Lighthouse Mobile Score ≥ 80
- App dùng được 1 tay (thumb-friendly)
- Không có horizontal scroll vô tình
- Tất cả text readable không cần zoom
```

---

## PROMPT 4 — FIX ADMIN PANEL (Build Full CRUD)

```
Dự án: AgriLib — Admin Panel
URL: /admin
Stack: Next.js (same repo hoặc sub-path)
Auth: Chỉ user có role = 'admin' mới vào được

VẤN ĐỀ: Admin hiện tại chỉ có shell UI, không có chức năng thật

NHIỆM VỤ: Build toàn bộ Admin CRUD

A. ADMIN LAYOUT:
   - Sidebar navigation (desktop) / Bottom tabs (mobile)
   - Menu items: Dashboard / Bài viết / Thành viên / Danh mục / Comments / Media / Cài đặt
   - Header: logo, user info, logout

B. /admin/posts — Quản lý bài viết:
   - Table: ID, Tiêu đề, Tác giả, Danh mục, Trạng thái, Ngày tạo, Actions
   - Filter: status (all/pending/approved/rejected), category, date range
   - Search: tìm theo tiêu đề hoặc tác giả
   - Actions per row: Duyệt ✅ / Từ chối ❌ / Edit ✏️ / Xóa 🗑️
   - Bulk actions: chọn nhiều → duyệt/xóa hàng loạt
   - Post status workflow: DRAFT → PENDING → APPROVED / REJECTED
   - Khi click row → xem preview bài trước khi duyệt

C. /admin/users — Quản lý thành viên:
   - Table: Avatar, Tên, Email, Role, Ngày đăng ký, Trạng thái, Actions
   - Filter: role (user/editor/expert/admin), status (active/banned)
   - Actions: Xem profile / Đổi role / Ban / Unban
   - Thống kê: tổng posts, tổng comments của user

D. /admin/categories — Quản lý danh mục:
   - CRUD đầy đủ
   - Fields: name, slug (auto-gen), icon (emoji hoặc upload), description, parent_id
   - Drag-drop reorder (thứ tự hiển thị)
   - Hiển thị số bài viết theo category

E. /admin/comments — Kiểm duyệt bình luận:
   - Table: Nội dung, Tác giả, Bài viết, Ngày, Trạng thái
   - Filter: reported (bị báo cáo), all
   - Actions: Xóa / Giữ lại / Ban user

F. /admin/sponsors — Quản lý tài trợ/affiliate:
   - CRUD: Tên sponsor, Logo, URL affiliate, Mô tả, Active/Inactive
   - Tracking: click count (basic)

G. DATABASE cần update:
   - posts: thêm field `status` ENUM('draft','pending','approved','rejected')
   - posts: thêm field `rejected_reason` TEXT
   - users: thêm field `role` ENUM('user','editor','expert','moderator','admin')
   - users: thêm field `is_banned` BOOLEAN
   - categories: đảm bảo có `parent_id`, `order_index`, `icon`

H. APIs cần build:
   - PATCH /api/v1/admin/posts/:id/status { status, reason }
   - GET /api/v1/admin/posts?status=&page=&search=
   - PATCH /api/v1/admin/users/:id/role
   - POST /api/v1/admin/users/:id/ban
   - GET/POST/PUT/DELETE /api/v1/admin/categories
   - DELETE /api/v1/admin/comments/:id

OUTPUT MONG MUỐN:
- Admin có thể duyệt/từ chối bài trong < 3 clicks
- Không có action nào thiếu confirmation dialog
- Mobile-responsive (admin dùng được trên tablet)
```

---

## PROMPT 5 — FIX & BUILD API LAYER ĐẦY ĐỦ

```
Dự án: AgriLib Backend
Stack: Node.js/Express (Render: srv-d7o3n5ugvqtc73b7cc3g)
DB: PostgreSQL Neon (project: rapid-pine-97234480)
Auth: JWT + Google OAuth

NHIỆM VỤ: Audit và build đầy đủ API endpoints

A. AUTH ENDPOINTS:
   POST /api/v1/auth/google          — Google OAuth callback
   POST /api/v1/auth/logout          — Clear session
   GET  /api/v1/auth/me              — Get current user info

B. POSTS ENDPOINTS:
   GET  /api/v1/posts                — List (query: category, page, limit, sort)
   GET  /api/v1/posts/:slug          — Get by slug (full detail)
   POST /api/v1/posts                — Create (auth required)
   PUT  /api/v1/posts/:id            — Update (auth + owner/admin)
   DELETE /api/v1/posts/:id          — Delete (auth + owner/admin)
   GET  /api/v1/posts/trending       — Top posts by views/comments/likes
   GET  /api/v1/posts/:id/related    — Related posts same category
   POST /api/v1/posts/:id/like       — Toggle like (auth)
   POST /api/v1/posts/:id/save       — Toggle save (auth)
   POST /api/v1/posts/:id/view       — Increment view count (no auth)

C. COMMENTS ENDPOINTS:
   GET  /api/v1/posts/:postId/comments         — List comments (nested)
   POST /api/v1/posts/:postId/comments         — Create comment (auth)
   PUT  /api/v1/comments/:id                   — Edit comment (auth + owner)
   DELETE /api/v1/comments/:id                 — Delete (auth + owner/admin)
   POST /api/v1/comments/:id/like              — Like comment (auth)
   POST /api/v1/comments/:id/report            — Report comment (auth)

D. USERS ENDPOINTS:
   GET  /api/v1/users/:id            — Public profile
   PUT  /api/v1/users/me             — Update my profile (auth)
   GET  /api/v1/users/me/posts       — My posts
   GET  /api/v1/users/me/saves       — My saved posts
   POST /api/v1/users/:id/follow     — Follow user (auth)
   DELETE /api/v1/users/:id/follow   — Unfollow (auth)

E. CATEGORIES ENDPOINTS:
   GET  /api/v1/categories           — List all (with post count)
   GET  /api/v1/categories/:slug/posts — Posts in category

F. SEARCH ENDPOINT:
   GET  /api/v1/search?q=&type=posts|users|tags&page=

G. QUESTIONS ENDPOINTS:
   GET  /api/v1/questions            — List
   POST /api/v1/questions            — Create (auth)
   GET  /api/v1/questions/:id        — Detail + answers
   POST /api/v1/questions/:id/answers — Answer (auth + expert)
   POST /api/v1/answers/:id/accept   — Mark best answer (question owner)

H. NOTIFICATIONS ENDPOINTS:
   GET  /api/v1/notifications        — My notifications (auth)
   PATCH /api/v1/notifications/read  — Mark all read (auth)

I. PERFORMANCE REQUIREMENTS:
   - Tất cả list endpoint phải có pagination (cursor-based preferred)
   - Rate limiting: 100 req/min per IP
   - Response time < 200ms cho read operations
   - Sử dụng connection pooling với Neon

J. FIX RENDER COLD START:
   - Thêm health check endpoint: GET /health
   - Setup cron job (dùng cron-job.org free) ping /health mỗi 14 phút
   - Hoặc upgrade Render lên paid plan

OUTPUT MONG MUỐN:
- Postman collection đầy đủ cho tất cả endpoints
- Response format chuẩn: { success, data, message, pagination }
- Error handling chuẩn: { success: false, error: { code, message } }
```

---

## PROMPT 6 — TỐI ƯU PERFORMANCE

```
Dự án: AgriLib
Frontend: Next.js (Vercel)
Backend: Render (Node.js)
DB: Neon PostgreSQL

NHIỆM VỤ: Tối ưu performance cho scale 10k DAU

A. FRONTEND — Next.js Optimization:
   1. Image optimization:
      - Convert tất cả <img> sang next/image
      - Thêm sizes attribute đúng
      - Dùng WebP format
      - Blur placeholder (base64 thumbnail)
   
   2. Code splitting:
      - Lazy load sidebar components
      - Lazy load comment section (below fold)
      - Dynamic import editor khi viết bài
   
   3. API caching (Next.js):
      - Homepage feed: revalidate mỗi 60 giây (ISR)
      - Category pages: revalidate mỗi 300 giây
      - Post detail: revalidate khi có update (On-demand ISR)
   
   4. Bundle size:
      - Chạy `next build --analyze` để check bundle
      - Remove unused dependencies
      - Tree shaking đảm bảo

B. BACKEND — Express Optimization:
   1. Database queries:
      - Dùng SELECT specific columns, không SELECT *
      - Thêm indexes: posts(category_id), posts(created_at), comments(post_id)
      - Dùng EXPLAIN ANALYZE để debug slow queries
   
   2. Caching layer:
      - Dùng node-cache hoặc Redis (Render Redis add-on $3/tháng)
      - Cache: categories list (1h), trending posts (5m), user sessions (24h)
   
   3. Compression:
      - Thêm compression middleware: app.use(require('compression')())
      - Gzip response

C. SUPABASE STORAGE — Image Pipeline:
   - Resize ảnh trước khi upload (client-side với browser-image-compression)
   - Max size: 800KB sau compress
   - Dùng Supabase Transform: ?width=400&format=webp cho thumbnails

D. MONITORING:
   - Setup Vercel Analytics (free)
   - Setup Render metrics alert
   - Add Sentry cho error tracking (free tier)

E. DATABASE — Neon Optimization:
   - Enable connection pooling (PgBouncer trong Neon)
   - Tạo read replica nếu cần (Neon hỗ trợ)

OUTPUT MONG MUỐN:
- Lighthouse Performance Score ≥ 85 (mobile)
- API response < 200ms (cached), < 500ms (uncached)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

## PROMPT 7 — BUILD HỆ THỐNG COMMENT CHUẨN

```
Dự án: AgriLib
Stack: Next.js + Node.js + PostgreSQL (Neon) + Supabase Realtime

NHIỆM VỤ: Build hệ thống comment hoàn chỉnh giống Facebook/Tinhte

A. DATABASE SCHEMA:
   CREATE TABLE comments (
     id          SERIAL PRIMARY KEY,
     post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
     user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     parent_id   INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- reply support
     content     TEXT NOT NULL,
     is_edited   BOOLEAN DEFAULT false,
     is_deleted  BOOLEAN DEFAULT false, -- soft delete
     like_count  INTEGER DEFAULT 0,
     created_at  TIMESTAMP DEFAULT NOW(),
     updated_at  TIMESTAMP DEFAULT NOW()
   );
   CREATE INDEX idx_comments_post_id ON comments(post_id);
   CREATE INDEX idx_comments_parent_id ON comments(parent_id);

B. API ENDPOINTS:
   GET  /api/v1/posts/:postId/comments?page=1&limit=20
        Response: top-level comments + first 3 replies each
   POST /api/v1/posts/:postId/comments
        Body: { content, parent_id? }
   PUT  /api/v1/comments/:id
        Body: { content }
   DELETE /api/v1/comments/:id (soft delete → "Bình luận đã bị xóa")
   POST /api/v1/comments/:id/like
   POST /api/v1/comments/:id/report

C. FRONTEND COMPONENT — CommentSection:
   Cấu trúc:
   - CommentBox (textarea + submit)
   - CommentList (paginated, load more)
     - CommentItem
       - Avatar + tên + thời gian
       - Content (với @mention highlight)
       - Actions: ❤️ Like | 💬 Trả lời | ✏️ Sửa (nếu là của mình) | 🗑️ Xóa | 🚩 Báo cáo
       - ReplyList (collapsed mặc định, "Xem 5 trả lời")
         - ReplyItem (cấu trúc giống CommentItem)

D. REALTIME (Supabase):
   - Subscribe Supabase Realtime channel: `comments:post_id=${postId}`
   - Khi có comment mới → append vào list, không reload page
   - Hiện toast: "Có 3 bình luận mới" thay vì tự động scroll

E. UX REQUIREMENTS:
   - Optimistic UI: Comment xuất hiện ngay khi submit, pending state
   - Mention: gõ @ để tag user (basic autocomplete)
   - Emoji support trong comment
   - Paste ảnh vào comment → upload Supabase → hiện inline
   - Load more comments button (không infinite scroll để tránh mất vị trí)
   - Sort: Mới nhất / Cũ nhất / Nhiều like nhất

F. NOTIFICATION KHI CÓ COMMENT:
   - Chủ bài viết nhận notification khi có comment mới
   - User bị reply nhận notification
   - User bị like comment nhận notification

OUTPUT MONG MUỐN:
- Comment post và hiện ngay không reload page
- Nested reply 2 levels (comment → reply, không deep hơn)
- Admin có thể xóa bất kỳ comment nào
```

---

## PROMPT 8 — BUILD USER PROFILE SYSTEM

```
Dự án: AgriLib
Stack: Next.js + Node.js + PostgreSQL

NHIỆM VỤ: Build trang profile người dùng hoàn chỉnh

A. DATABASE — Update users table:
   ALTER TABLE users ADD COLUMN IF NOT EXISTS
     bio           TEXT,
     location      VARCHAR(100),
     specialty     VARCHAR(100), -- loại cây trồng chuyên sâu
     avatar_url    TEXT,
     cover_url     TEXT,
     website       TEXT,
     facebook_url  TEXT,
     points        INTEGER DEFAULT 0,
     is_expert     BOOLEAN DEFAULT false,
     is_verified   BOOLEAN DEFAULT false,
     follower_count INTEGER DEFAULT 0,
     following_count INTEGER DEFAULT 0,
     post_count    INTEGER DEFAULT 0;

   CREATE TABLE follows (
     follower_id   INTEGER REFERENCES users(id),
     following_id  INTEGER REFERENCES users(id),
     created_at    TIMESTAMP DEFAULT NOW(),
     PRIMARY KEY (follower_id, following_id)
   );

B. TRANG /profile/[userId] — Public Profile:
   Layout:
   - Cover image (1200x300)
   - Avatar (96px, overlapping cover)
   - Tên + verified badge (nếu có) + expert badge (nếu có)
   - Bio, Location, Specialty (cây trồng)
   - Stats: [X] Bài viết | [X] Follower | [X] Đang theo dõi
   - Follow/Unfollow button (nếu không phải mình)
   - Tabs: Bài viết | Câu hỏi | Đã lưu (chỉ hiện nếu là mình)

   Bài viết tab:
   - Grid hoặc list bài viết của user
   - Paginated

C. TRANG /settings/profile — Edit Profile:
   Form:
   - Upload avatar (crop 1:1)
   - Upload cover (crop 16:5)
   - Tên hiển thị
   - Bio (textarea, max 200 chars)
   - Tỉnh/thành (dropdown)
   - Cây trồng chuyên sâu (multi-select tags)
   - Website, Facebook URL
   
   Save → PATCH /api/v1/users/me

D. POINT SYSTEM (Điểm danh tiếng):
   Quy tắc cộng điểm:
   - Đăng bài được duyệt: +10 điểm
   - Bài được like: +1 điểm
   - Comment được like: +1 điểm
   - Trả lời được chọn là best answer: +15 điểm
   - Mỗi follower mới: +2 điểm
   
   Hiển thị: badge màu theo level
   - 0-99:    🌱 Nông dân mới
   - 100-499: 🌿 Nông dân kinh nghiệm
   - 500-999: 🌾 Chuyên gia làng
   - 1000+:   🏆 Master Nông nghiệp

E. APIs:
   GET  /api/v1/users/:id          — Public profile
   PUT  /api/v1/users/me           — Update profile (auth)
   POST /api/v1/users/:id/follow   — Follow (auth)
   GET  /api/v1/users/:id/posts    — User's posts
   GET  /api/v1/users/me/saves     — Saved posts (auth)
   GET  /api/v1/users/leaderboard  — Top users by points

OUTPUT MONG MUỐN:
- Profile page shareable (OG tags có avatar + name)
- Follow/Unfollow không reload page
- Point hiển thị trong mọi avatar/comment
```

---

## PROMPT 9 — BUILD NOTIFICATION SYSTEM

```
Dự án: AgriLib
Stack: Next.js + Node.js + Supabase Realtime
Supabase Project: dfuzqfeltigwjilpvadd

NHIỆM VỤ: Build hệ thống notification realtime

A. DATABASE SCHEMA:
   CREATE TABLE notifications (
     id          SERIAL PRIMARY KEY,
     user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     type        VARCHAR(50) NOT NULL,
     -- types: 'new_comment', 'new_reply', 'post_liked', 'comment_liked',
     --        'new_follower', 'post_approved', 'post_rejected', 'new_answer'
     actor_id    INTEGER REFERENCES users(id), -- người gây ra notification
     post_id     INTEGER REFERENCES posts(id),
     comment_id  INTEGER REFERENCES comments(id),
     message     TEXT NOT NULL,
     is_read     BOOLEAN DEFAULT false,
     created_at  TIMESTAMP DEFAULT NOW()
   );
   CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);

B. TRIGGER NOTIFICATIONS KHI:
   - User comment bài của tôi → notify tôi: "Nguyễn Văn A đã bình luận bài [tên bài]"
   - User reply comment của tôi → notify tôi: "Trần Thị B đã trả lời bình luận của bạn"
   - User like bài của tôi → notify tôi (batch: không notify từng like, notify mỗi 10 likes)
   - User follow tôi → notify tôi: "Lê Văn C đã bắt đầu theo dõi bạn"
   - Admin duyệt bài → notify tôi: "Bài [tên] đã được duyệt ✅"
   - Admin từ chối bài → notify tôi: "Bài [tên] bị từ chối: [lý do]"

C. REALTIME với Supabase:
   // Trong NotificationBell component:
   useEffect(() => {
     const channel = supabase
       .channel('notifications:user_id=' + userId)
       .on('postgres_changes', {
         event: 'INSERT',
         schema: 'public',
         table: 'notifications',
         filter: `user_id=eq.${userId}`
       }, (payload) => {
         // Thêm notification mới vào state
         // Tăng unread count
         // Hiện toast notification
       })
       .subscribe();
     return () => supabase.removeChannel(channel);
   }, [userId]);

D. UI COMPONENTS:
   NotificationBell (trong header):
   - Icon 🔔 với badge số unread (đỏ)
   - Click → dropdown hoặc drawer (mobile)
   - Max hiện 20 notification gần nhất
   - "Đánh dấu tất cả đã đọc" button
   - Link "Xem tất cả" → /notifications

   NotificationItem:
   - Avatar người gửi
   - Nội dung notification
   - Thời gian (relative: "5 phút trước")
   - Unread: nền xanh nhạt
   - Click → navigate đến bài/comment liên quan, mark as read

   /notifications page:
   - Full list, paginated
   - Filter: Tất cả / Chưa đọc / Theo loại

E. APIs:
   GET   /api/v1/notifications?page=1&unread=true
   PATCH /api/v1/notifications/read-all
   PATCH /api/v1/notifications/:id/read

F. Push Notification (tương lai):
   - Chuẩn bị PWA manifest + service worker
   - Web Push API khi user grant permission
   - Backend: web-push npm package

OUTPUT MONG MUỐN:
- Bell badge update realtime không reload
- Notification toast xuất hiện góc trên phải
- Click notification navigate đúng chỗ
```

---

## PROMPT 10 — CHUẨN HÓA SEO TOÀN SITE

```
Dự án: AgriLib — Next.js
Mục tiêu: Rank Google cho từ khóa nông nghiệp Việt Nam

NHIỆM VỤ: Implement SEO chuẩn toàn bộ site

A. METADATA GLOBAL (layout.tsx):
   export const metadata: Metadata = {
     metadataBase: new URL('https://thuviennongnghiepfe.vercel.app'),
     title: {
       default: 'Thư Viện Nông Nghiệp | Kiến thức nông nghiệp Việt Nam',
       template: '%s | Thư Viện Nông Nghiệp'
     },
     description: 'Nền tảng chia sẻ kiến thức nông nghiệp lớn nhất Việt Nam...',
     keywords: ['nông nghiệp', 'trồng trọt', 'chăn nuôi', 'kỹ thuật nông nghiệp'],
     openGraph: { ... },
     twitter: { ... },
     robots: { index: true, follow: true }
   }

B. METADATA MỖI POST (posts/[slug]/page.tsx):
   export async function generateMetadata({ params }): Promise<Metadata> {
     const post = await getPost(params.slug);
     return {
       title: post.title,
       description: post.excerpt || post.content.slice(0, 160),
       openGraph: {
         title: post.title,
         description: post.excerpt,
         images: [post.thumbnail_url],
         type: 'article',
         publishedTime: post.created_at,
         authors: [post.author.name],
         tags: post.tags
       },
       alternates: { canonical: `/posts/${post.slug}` }
     }
   }

C. STRUCTURED DATA (JSON-LD) cho bài viết:
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "[Tên bài]",
     "image": "[Thumbnail URL]",
     "author": { "@type": "Person", "name": "[Tên tác giả]" },
     "publisher": {
       "@type": "Organization",
       "name": "Thư Viện Nông Nghiệp",
       "logo": { "@type": "ImageObject", "url": "[Logo URL]" }
     },
     "datePublished": "[ISO Date]",
     "description": "[Excerpt]"
   }
   </script>

D. SITEMAP (app/sitemap.ts):
   - Static: /, /hoi-dap, /lich-mua-vu, /categories/*
   - Dynamic: /posts/* (tất cả bài approved)
   - Update tần suất: posts = 'weekly', homepage = 'daily'
   - Priority: homepage=1.0, posts=0.8, categories=0.7

E. ROBOTS.TXT:
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/
   Sitemap: https://thuviennongnghiepfe.vercel.app/sitemap.xml

F. CATEGORY PAGES SEO:
   - URL: /[category-slug] thay vì /?category=
   - H1 rõ ràng: "Bài viết về [Tên danh mục]"
   - Meta description theo category

G. PERFORMANCE (ảnh hưởng Core Web Vitals):
   - LCP < 2.5s: lazy load images, preload critical fonts
   - CLS < 0.1: đặt width/height cho images
   - FID < 100ms: code split, defer non-critical JS

H. INTERNAL LINKING:
   - Related posts cuối mỗi bài (3-4 bài cùng category)
   - Breadcrumb có Schema markup
   - Tag cloud link đến search

I. TIÊU ĐỀ BÀI VIẾT — GUIDELINES cho user:
   - Hiển thị character count khi nhập title (goal: 50-60 chars)
   - Gợi ý: "Tiêu đề tốt cho SEO nên từ 50-60 ký tự"

OUTPUT MONG MUỐN:
- Google Search Console: 0 crawl errors
- Tất cả bài viết indexed trong 7 ngày
- Share Facebook/Zalo hiển thị thumbnail đẹp
- Sitemap tự động update khi có bài mới
```

---

## PHỤ LỤC — THỨ TỰ ƯU TIÊN THỰC HIỆN

| Priority | Prompt | Lý do |
|----------|--------|-------|
| 🔴 P0 | Prompt 2 — Fix 404 | Người dùng click vào bài → trắng → bounce ngay |
| 🔴 P0 | Prompt 5 — API Layer | Không có API = không có data thật |
| 🟠 P1 | Prompt 4 — Admin CRUD | Không quản lý được content |
| 🟠 P1 | Prompt 3 — Mobile UX | 80% user dùng mobile |
| 🟡 P2 | Prompt 7 — Comment | Engagement cốt lõi của community |
| 🟡 P2 | Prompt 10 — SEO | Traffic organic từ Google |
| 🟢 P3 | Prompt 1 — Homepage | Sau khi có data thật mới fix UI |
| 🟢 P3 | Prompt 8 — Profile | Community feature |
| 🔵 P4 | Prompt 9 — Notification | Retention feature |
| 🔵 P4 | Prompt 6 — Performance | Sau khi có user thật mới optimize |
