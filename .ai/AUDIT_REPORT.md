# 🔍 AUDIT REPORT — AgriLib (Thư Viện Nông Nghiệp)
**Ngày audit:** 29/04/2026  
**Auditor:** Claude (Senior System Architect + PM + UX Expert)  
**Version:** 1.0

---

## PHẦN 1 — PHÂN TÍCH FRONTEND

| Page | Hiện trạng | Vấn đề | Thiếu | Mức độ | Giải pháp |
|------|-----------|--------|-------|--------|-----------|
| **Trang chủ** | Feed bài có category filter, sidebar đầy đủ (mùa vụ, chuyên gia, affiliate), hashtag hot | Data sidebar fake (chuyên gia hardcode), affiliate hardcode | Like/save count trên card, author avatar, thời gian đăng, view count, skeleton loading | High | Kết nối API thật, thêm metadata card, lazy load |
| **Trang danh mục** | Filter tab top: Tất cả/Trồng trọt/Chăn nuôi... | Filter chỉ là UI, không biết có thật sự query DB không | URL không thay đổi khi filter (SEO mất), không có sub-category | High | Filter phải thay đổi URL (/category/trong-trot), infinite scroll |
| **Trang bài viết** | Link từ homepage → **404** (đây là critical bug) | Slug routing sai hoặc chưa implement dynamic route | Toàn bộ: related posts, breadcrumb, social share, table of contents, print | Critical | Fix Next.js dynamic route /posts/[slug] |
| **Trang tìm kiếm** | Search icon có nhưng UX không rõ | Không biết có search page /search không, kết quả thế nào | Filter kết quả, highlight từ khóa, search history, gợi ý | High | Build /search page với debounce, highlight |
| **Trang hỏi đáp** | Page có nhưng hoàn toàn trống ("Chưa có câu hỏi nào") | Form "Đăng câu hỏi" có nhưng chưa chắc hoạt động | Category câu hỏi, filter chuyên gia, voting answer, best answer | High | Seed data, fix form submit, build answer UI |
| **UX Mobile** | Bottom nav 5 item có | Icon emoji thay vì SVG proper, bottom nav che content | Touch target nhỏ, không có haptic feedback hint, form viết bài chưa mobile-optimized | Critical | Xem Phần 4 — Mobile Audit |

---

## PHẦN 2 — PHÂN TÍCH ADMIN

| Module | Có gì | Thiếu gì | Ảnh hưởng | Cần bổ sung |
|--------|-------|----------|-----------|-------------|
| **Dashboard** | 3 stat cards (members, posts, questions), báo cáo | Stats hardcode không rõ có từ DB thật không, không có chart/trend | Không biết thực trạng hệ thống | Connect API thật, thêm chart 30 ngày |
| **Quản lý bài viết** | Tab "Kiểm duyệt bài" có | Không có danh sách bài, không có filter (pending/approved/rejected), không có edit/delete | Admin không kiểm soát được content | Build post list table với status, bulk action |
| **Quản lý user** | Tab "Thành viên" có | Không có danh sách user thật, không thể ban/unban, không xem profile | Không kiểm soát được community | User table với search, role management, ban |
| **Quản lý danh mục** | Không có | Không có CRUD category | Frontend category cứng, không mềm dẻo | Build /admin/categories CRUD |
| **Comment moderation** | Không có | Không có trang duyệt/xóa comment | Spam comment không kiểm soát | /admin/comments với flag system |
| **Media/Upload** | Không có | Không có media library | Bài viết không quản lý được ảnh | Integrate Supabase Storage browser |
| **Phân quyền** | Không có role system rõ ràng | Admin = tất cả, không có Editor/Moderator/Expert role | Không scale được team | RBAC: Admin/Editor/Moderator/Expert/User |
| **SEO Control** | Không có | Không set meta title/desc/OG per post | SEO yếu toàn bộ | Thêm SEO fields vào post editor |
| **Affiliate/Sponsor** | Hardcode trong frontend | Không quản lý được qua admin | Không kiếm tiền được | /admin/sponsors CRUD |
| **Notification** | Không có | Không broadcast được thông báo | Không engage user | /admin/notifications push |

**Kết luận:** Admin hiện tại chỉ là **shell UI** — không có chức năng thật nào hoạt động đầy đủ. Cần rebuild toàn bộ admin functionality.

---

## PHẦN 3 — MAPPING ADMIN ↔ FRONTEND

| Feature | Frontend | Admin | Trạng thái | Vấn đề | Giải pháp |
|---------|----------|-------|-----------|--------|-----------|
| **Feed bài viết** | Hiển thị card bài, filter category | Không có list/manage posts | ❌ Không sync | Admin không duyệt được → bài lên thẳng? Hay không lên được? | Thêm post management + approval workflow |
| **Bài nổi bật** | Không có section "nổi bật" riêng | Không có featured flag | ❌ Thiếu cả 2 | Không pin/feature bài được | Thêm `is_featured` field, admin toggle, frontend section |
| **Category** | Có tab filter | Không có admin CRUD | ⚠️ Cứng | Category cứng trong code | Tạo categories table, admin CRUD, dynamic frontend |
| **Comment** | Có mention "12 bình luận" trong sidebar | Không có comment management | ❌ Không kiểm soát | Không mod được comment | Build comment system + admin moderation |
| **Like / Save** | Không thấy trên card feed | Không có | ❌ Thiếu cả 2 | Không engagement | Thêm likes/saves vào DB + API + UI |
| **Profile user** | Menu "Cá nhân" có, /profile route có | Không có user management thật | ❌ Chưa build | Profile trống | Build profile page với posts, bio, stats |
| **Hashtag/Tag** | #Lúa #Sầu riêng hardcode trong sidebar | Không có tag management | ❌ Cứng | Tag không dynamic | Tags table, post_tags, admin manage, dynamic sidebar |
| **Expert system** | Sidebar "Chuyên gia online" hardcode | Không có | ❌ Fake | Fake data | Expert role + availability + admin manage |
| **Lịch mùa vụ** | Menu có, page chưa build | Không có | ❌ Chưa có | Tính năng chết | Build season calendar với crop data |
| **Notification** | Bell icon có | Không có | ❌ Shell | Click vào không có gì | Notifications table + Supabase Realtime |

---

## PHẦN 4 — MOBILE-FIRST AUDIT

### Top 10 Lỗi Mobile UX
1. **Post link 404** — User mobile click bài → trắng trang. Deal breaker #1
2. **Emoji icon trong nav** — 🏠❓📅 là emoji, không phải SVG icon → blur trên màn hình thấp, trông amateur
3. **Bottom nav che content** — Fixed bottom nav không có padding-bottom trên content → content bị che
4. **Touch target nhỏ** — Hashtag links (#Lúa) quá nhỏ, ngón tay thô chạm nhầm
5. **Sidebar trên mobile** — Sidebar 3 cột trên desktop → không rõ trên mobile có collapse không, nếu không sẽ bị dài vô tận
6. **Form viết bài** — /posts/create chưa kiểm tra UX mobile, textarea, image upload trên mobile thường khó
7. **Search UX** — Search icon nhỏ, không có search overlay/modal mobile-friendly
8. **Không có skeleton loading** — Khi API Render cold start 30s, user thấy trang trắng, không biết đang load
9. **Không có pull-to-refresh** — Tiêu chuẩn mobile app, không có
10. **Font size** — Chưa verify font size đủ lớn cho nông dân (nên ≥16px body, ≥14px secondary)

### Top 10 Cải Tiến Cần Làm Ngay
1. **Fix post routing 404** — Ưu tiên tuyệt đối
2. **Thay emoji bằng SVG icon** (Heroicons/Lucide) — 30 phút fix, impact lớn
3. **Thêm `pb-20` cho main content** — Tránh bottom nav che, 5 phút fix
4. **Skeleton loading** cho feed cards — Trông professional, che được Render cold start
5. **Tăng touch target** — Minimum 44x44px cho tất cả clickable elements
6. **Search modal full-screen** trên mobile — Giống Google/Facebook search
7. **Sticky header ẩn khi scroll down, hiện khi scroll up** — Tiết kiệm screen real estate
8. **Image lazy loading + blur placeholder** — Tốc độ load trên 3G/4G yếu
9. **"Viết bài" button nổi (FAB)** — Floating Action Button góc dưới phải, dễ reach thumb
10. **Haptic feedback** (nếu PWA) hoặc visual feedback rõ hơn khi tap

---

## PHẦN 5 — ĐIỂM NGHẼN HỆ THỐNG

| Bottleneck | Kịch bản | Mức độ | Cách fix |
|-----------|---------|--------|----------|
| **Render Free Tier Cold Start** | 1 user truy cập sau 15p không dùng → đợi 30s | Critical | Upgrade Render paid ($7/tháng) HOẶC dùng cron job ping mỗi 14 phút |
| **N+1 Query** | Feed 20 bài → 20 query riêng lấy author, category | High | JOIN query hoặc DataLoader pattern |
| **Không có pagination chuẩn** | 100k bài → load all → browser crash | Critical | Cursor-based pagination (không dùng offset ở scale lớn) |
| **Không có caching** | Mỗi request đều hit Neon DB | High | Redis cache (Render Redis add-on) cho hot data: homepage feed, categories |
| **Neon free tier** | Neon free: 0.5GB storage, 190 compute hours/tháng | Medium | Monitor usage, upgrade khi cần ($19/tháng) |
| **Image storage không tối ưu** | Upload ảnh gốc 5MB lên Supabase | High | Resize + WebP convert trước khi upload, Supabase transform |
| **SEO không có SSR data** | Nếu bài viết load client-side → Googlebot không index | Critical | Đảm bảo Next.js dùng `getServerSideProps` hoặc `generateStaticParams` cho post pages |
| **Không có CDN cho static** | JS/CSS/Image từ Vercel (có CDN) nhưng API response không cache | Medium | Cache API response với Vercel Edge Cache hoặc CDN headers |
| **Comment realtime** | 1000 user cùng comment 1 bài → WebSocket connection nhiều | Medium | Supabase Realtime channel per post, giới hạn subscribers |
| **Search full-text** | 100k bài tìm kiếm → slow nếu dùng LIKE | High | PostgreSQL full-text search (`tsvector`) hoặc Algolia |

---

## PHẦN 6 — THIẾU GÌ SO VỚI TINHTE MODEL

### Thiếu để thành cộng đồng thật
| Feature | Tinhte có | AgriLib có | Priority |
|---------|-----------|-----------|----------|
| User reputation/point | ✅ | ❌ | High |
| Badge/Achievement | ✅ | ❌ | Medium |
| Follow user | ✅ | ❌ | High |
| Nested comment (reply) | ✅ | ❌ | High |
| Comment like | ✅ | ❌ | Medium |
| Post series | ✅ | ❌ | Low |
| Rich text editor | ✅ | ❓ | High |
| Image gallery in post | ✅ | ❓ | High |
| Embed video/YouTube | ✅ | ❌ | Medium |
| Dark mode | ✅ | ❌ | Low |
| Notification đầy đủ | ✅ | ❌ | High |
| Direct message | ✅ | ❌ | Medium |
| Report/Flag system | ✅ | ❌ | High |
| Trending algorithm | ✅ | ❌ | Medium |

### Thiếu để giữ user
- **Email digest** tuần: "Bài hay tuần này" → notification ngoài app
- **Personalized feed** dựa trên cây trồng user quan tâm
- **Lịch mùa vụ** thật — feature unique, không ai có
- **Streak/daily active** gamification
- **Expert badge** và verified mark — tăng trust

### Thiếu để kiếm tiền
- **Sponsored post** system (quản lý qua admin)
- **Expert consultation** có phí (Shopee Pay / MoMo / VNPAY)
- **Job board** — tuyển dụng nông nghiệp
- **Marketplace** nhẹ (giống Chợ Tốt nhỏ) — mua bán giống, phân bón
- **Affiliate link manager** — tracking click/conversion
- **Premium membership** — nông dân tiên tiến muốn học sâu hơn
