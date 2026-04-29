# 🌾 AgriLib — Thư Viện Nông Nghiệp
## PROJECT CONTEXT — Dùng khi mở conversation mới

> Copy toàn bộ file này paste vào đầu conversation mới để Claude hiểu đầy đủ context dự án.

---

## 🏗️ TỔNG QUAN DỰ ÁN

**Tên:** Thư Viện Nông Nghiệp (AgriLib)  
**Mục tiêu:** Nền tảng cộng đồng nông nghiệp Việt Nam — giống mô hình Tinhte.vn nhưng cho nông dân  
**Đối tượng:** Nông dân, kỹ thuật viên nông nghiệp, chuyên gia, công ty nông nghiệp  
**Giai đoạn:** MVP đang chạy, cần scale thành cộng đồng thật

---

## 🔗 CÁC ĐƯỜNG DẪN QUAN TRỌNG

### Frontend / App
| Môi trường | URL |
|---|---|
| Frontend Production | https://thuviennongnghiepfe.vercel.app/ |
| Admin Panel | https://thuviennongnghiepfe.vercel.app/admin |
| Trang Hỏi Đáp | https://thuviennongnghiepfe.vercel.app/hoi-dap |
| Lịch Mùa Vụ | https://thuviennongnghiepfe.vercel.app/lich-mua-vu |

### Infrastructure (Production)
| Service | URL / ID | Mục đích |
|---|---|---|
| **Backend (Render)** | https://dashboard.render.com/web/srv-d7o3n5ugvqtc73b7cc3g/events | API Server — Node.js/Express |
| **Database (Neon)** | https://console.neon.tech/app/projects/rapid-pine-97234480 | PostgreSQL serverless |
| **Auth (Google OAuth)** | https://console.cloud.google.com/auth/clients?project=autopostyt-489200 | Google Login |
| **Supabase** | https://supabase.com/dashboard/project/dfuzqfeltigwjilpvadd | Storage / Realtime (nếu dùng) |
| **GitHub Tokens** | https://github.com/settings/tokens | Deploy tokens |

### Service IDs
- Render Service ID: `srv-d7o3n5ugvqtc73b7cc3g`
- Neon Project ID: `rapid-pine-97234480`
- Google Cloud Project: `autopostyt-489200`
- Supabase Project ID: `dfuzqfeltigwjilpvadd`

---

## 🧱 STACK KỸ THUẬT

```
Frontend:     Next.js (deployed trên Vercel)
Backend:      Node.js / Express (deployed trên Render)
Database:     PostgreSQL (Neon serverless)
Auth:         Google OAuth 2.0 (Google Cloud)
Storage:      Supabase Storage (media upload)
Realtime:     Supabase Realtime (notifications, comments)
Hosting FE:   Vercel
Hosting BE:   Render (free tier — cold start ~30s)
```

---

## 📱 TÍNH NĂNG ĐÃ CÓ (MVP)

### Frontend
- [x] Trang chủ với feed bài viết
- [x] Filter category: Tất cả / Trồng trọt / Chăn nuôi / Phân bón / Sâu bệnh / Nông nghiệp số
- [x] Sidebar: Nhật ký mùa vụ, Đang thảo luận, Chuyên gia online, Tài trợ/Affiliate
- [x] Navbar: Logo, Search, Viết bài, Thông báo, Đăng nhập
- [x] Hashtag hot: #Lúa #Sầu riêng #Phân bón #Rau sạch #Thủy sản
- [x] Trang Hỏi đáp chuyên gia
- [x] Lịch mùa vụ
- [x] Bottom nav mobile: Trang chủ / Bài viết / Tạo bài / Hỏi đáp / Cá nhân
- [x] Google OAuth login

### Admin Panel
- [x] Dashboard thống kê: Tổng thành viên (1,248), Bài đăng duyệt (3,412), Lượt hỏi (562)
- [x] Tab: Thống kê chung / Thành viên / Kiểm duyệt bài
- [x] Báo cáo hoạt động

---

## 🚨 VẤN ĐỀ BIẾT TRƯỚC

### Critical (Phải fix ngay)
1. **Post detail 404**: Link bài viết từ homepage bị 404 — routing chưa đúng
2. **Admin thiếu CRUD**: Không có trang tạo/sửa/xóa bài, danh mục, user thực sự
3. **Hỏi đáp trống**: Không có data thật, form chưa hoạt động
4. **Render cold start**: Backend free tier ngủ sau 15 phút → API chậm 30s lần đầu
5. **Comment system**: Chưa có hoặc chưa hoạt động đúng

### High Priority
6. SEO: Không có meta tags, OG tags cho từng bài viết
7. User profile: Trang /profile chưa có nội dung
8. Image upload: Chưa rõ flow upload ảnh khi viết bài
9. Notification: Bell icon có nhưng chưa có realtime

### Medium Priority  
10. Lịch mùa vụ: Tính năng chưa implemented
11. Chuyên gia online: Data fake, chưa có hệ thống expert thật
12. Affiliate/Sponsor: Hardcode, chưa quản lý được qua admin

---

## 🗄️ DATABASE SCHEMA (Expected)

```sql
-- Core tables (cần verify với Neon)
users (id, name, email, avatar, role, created_at, bio, location)
posts (id, title, slug, content, author_id, category_id, status, thumbnail, view_count, created_at)
categories (id, name, slug, icon, parent_id)
comments (id, post_id, user_id, content, parent_id, created_at)
likes (id, post_id, user_id, created_at)
saves (id, post_id, user_id, created_at)
tags (id, name, slug)
post_tags (post_id, tag_id)
questions (id, title, content, user_id, expert_id, status, created_at)
answers (id, question_id, user_id, content, is_accepted, created_at)
notifications (id, user_id, type, data, read, created_at)
```

---

## 👨‍💻 DEV WORKFLOW

### Frontend Dev (Next.js)
```bash
# Clone và chạy local
git clone [repo]
npm install
npm run dev

# Deploy
git push origin main  # Vercel auto-deploy
```

### Backend Dev (Render)
```bash
# Render auto-deploy từ GitHub
# Check logs: dashboard.render.com/web/srv-d7o3n5ugvqtc73b7cc3g
# ⚠️ Free tier: service ngủ sau 15 phút không dùng
```

### Database
```bash
# Neon Console: console.neon.tech/app/projects/rapid-pine-97234480
# Connection string ở Render environment variables
# Supabase SQL Editor: supabase.com/dashboard/project/dfuzqfeltigwjilpvadd/sql
```

---

## 🎯 ROADMAP

### Sprint 1 — Fix Critical (1-2 tuần)
- Fix post detail routing (404)
- Build admin CRUD đầy đủ
- Fix comment system
- Wake-up mechanism cho Render

### Sprint 2 — Community Core (2-4 tuần)  
- User profile hoàn chỉnh
- Notification realtime (Supabase)
- Search nâng cao
- SEO chuẩn

### Sprint 3 — Engagement (4-8 tuần)
- Hệ thống điểm/badge
- Expert verification
- Lịch mùa vụ thật
- Mobile app (PWA)

### Sprint 4 — Monetization
- Affiliate quản lý qua admin
- Sponsored post
- Premium expert consultation
- Job board nông nghiệp

---

## 📋 NAMING CONVENTIONS

```
API endpoints:   /api/v1/[resource]
Component:       PascalCase
File:            kebab-case
DB column:       snake_case
CSS class:       Tailwind utility
```

---

## ⚠️ LUẬT KHI LÀM VIỆC VỚI PROJECT NÀY

1. **Mobile-first** — Nông dân dùng điện thoại giá rẻ, không phải desktop
2. **Performance** — Image phải compress, lazy load. Render free tier → cache aggressively
3. **Đơn giản** — UI phải đơn giản hơn Tinhte, nông dân ít tech-savvy
4. **Tiếng Việt** — Mọi UI text phải tiếng Việt, không mixed
5. **Offline-first mindset** — Mạng nông thôn yếu, xem xét PWA + cache
