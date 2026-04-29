# 📦 AgriLib — BỘ TÀI LIỆU CHUẨN
## Hướng Dẫn Sử Dụng

---

## 📁 CÁC FILE TRONG BỘ NÀY

| File | Mục đích | Khi nào dùng |
|------|---------|--------------|
| `PROJECT_CONTEXT.md` | Toàn bộ context dự án | Paste đầu conversation mới |
| `AUDIT_REPORT.md` | Phân tích 6 phần đầy đủ | Tham khảo khi cần hiểu vấn đề |
| `PROMPTS_ANTIGRAVITI.md` | 10 prompts cụ thể cho dev | Copy prompt → đưa cho dev/AI fix |
| `MCP_CONFIG.md` | Config MCP + env vars + cursorrules | Setup môi trường dev |
| `SKILL_AGRILIB.md` | Skill file cho Claude | Upload vào Claude Projects |

---

## 🚀 CÁCH SỬ DỤNG

### 1. Khi mở conversation mới với Claude
```
Copy toàn bộ nội dung PROJECT_CONTEXT.md
Paste vào đầu chat mới
→ Claude sẽ hiểu đầy đủ dự án
```

### 2. Khi muốn dev fix 1 phần cụ thể
```
Mở PROMPTS_ANTIGRAVITI.md
Tìm PROMPT [số] tương ứng với việc cần fix
Copy toàn bộ prompt block
Paste cho dev hoặc AI assistant
```

### 3. Khi setup môi trường dev mới
```
Làm theo hướng dẫn trong MCP_CONFIG.md:
1. Tạo CLAUDE.md ở root project
2. Config MCP servers
3. Setup .env.local và .env
4. Tạo .cursorrules
```

### 4. Khi tạo Claude Project (Anthropic Projects)
```
Upload SKILL_AGRILIB.md như một "Project Instruction"
→ Claude trong project đó sẽ luôn biết context
```

---

## ⚡ QUICK REFERENCE — THỨ TỰ FIX

```
TUẦN 1 — Critical Fixes
├── Prompt 2: Fix Post Detail 404 (P0 - ngày đầu tiên)
├── Prompt 5: Build API Layer đầy đủ (P0)
└── Prompt 4: Admin CRUD (P1)

TUẦN 2 — Core Features
├── Prompt 3: Mobile UX fixes
├── Prompt 7: Comment system
└── Prompt 10: SEO

TUẦN 3-4 — Community
├── Prompt 8: User Profile + Follow
├── Prompt 9: Notification
└── Prompt 1: Homepage polish

THÁNG 2+ — Scale
└── Prompt 6: Performance optimization
```

---

## 📊 HIỆN TRẠNG NHANH

```
Frontend URLs:
  ✅ Trang chủ — có, cần polish
  ❌ Post detail — 404 (critical)
  ✅ Hỏi đáp — có, trống rỗng
  ❓ Lịch mùa vụ — chưa implement
  ✅ Admin — có, chỉ là shell

Infrastructure:
  ✅ Vercel (frontend) — hoạt động
  ✅ MongoDB Atlas (Database) — hoạt động ổn định
  ✅ Google OAuth — configured
```

---

## 🔗 LINKS QUAN TRỌNG (Bookmark ngay)

- **Frontend:** https://thuviennongnghiepfe.vercel.app
- **Admin:** https://thuviennongnghiepfe.vercel.app/admin
- **Database MongoDB Atlas:** https://cloud.mongodb.com
- **Google Cloud:** https://console.cloud.google.com/auth/clients?project=autopostyt-489200
