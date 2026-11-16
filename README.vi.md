<p align="center"><img src="assets/logo/tinilib-ngang.svg" alt="tinilib" height="64"></p>

<p align="center"><b>Thư viện repo & skill cho mọi AI.</b><br>
Lưu repo GitHub và skill bạn sưu tầm, để AI tóm tắt và chia nhánh, rồi xuất một file mà Claude, ChatGPT, Cursor, Codex đều đọc được.</p>

<p align="center"><a href="README.md">English</a> · <a href="https://tvtinhofficial.github.io/tini-library/">Dùng thử</a></p>

---

## Vì sao có tinilib

Dùng AI nhiều, bạn sẽ có hàng chục repo đã star, skill, prompt nằm rải rác. Bookmark thì lưu được, nhưng AI của bạn không hề biết chúng tồn tại. tinilib gom tất cả vào một file `library.json` và xuất thành `AGENTS.md` để AI đọc trước khi tự làm lại từ đầu.

## Tính năng

- **Dán link GitHub là xong.** App tự lấy README và số sao qua GitHub API.
- **AI tóm tắt bằng khoá của bạn.** Hỗ trợ OpenAI, Anthropic (Claude), Google Gemini, Ollama (chạy local, miễn phí) và mọi API tương thích OpenAI (OpenRouter, Groq, LM Studio). Không có khoá vẫn lưu được, kèm mô tả gốc từ GitHub.
- **Dạng thẻ hoặc dạng nhánh:** Thư viện → Lập trình web / Marketing / Khác → nhóm → công cụ.
- **Xuất cho mọi AI:** `AGENTS.md`, `llms.txt`, `library.json` — copy hoặc tải về.
- **Dữ liệu của bạn:** không máy chủ, không tài khoản. Dữ liệu và khoá API nằm trong trình duyệt; thư viện là file JSON, đưa lên git được.
- Giao diện **tiếng Việt và tiếng Anh**.

## Bắt đầu

**Cách 1 — dùng online:** mở trang dùng thử, thêm repo, xuất file.

**Cách 2 — chạy trên máy (nên dùng cho thư viện riêng):**

```bash
git clone https://github.com/tvtinhofficial/tini-library
cd tini-library
npx serve .        # hoặc: python3 -m http.server 8000
```

Mở địa chỉ hiện ra. Mở thẳng `index.html` cũng chạy, nhưng trình duyệt sẽ không tải được `library.json` có sẵn; khi đó dùng **Cài đặt → Nhập file**.

Bật AI tóm tắt: **Cài đặt → Nhà cung cấp AI**, dán khoá và chọn model. Với Ollama, chạy kèm `OLLAMA_ORIGINS=*` để trình duyệt gọi được.

## Dùng thư viện với các AI

| Công cụ | Cách dùng |
| --- | --- |
| Cursor, Claude Code, Codex, Gemini CLI, Copilot | Xuất `AGENTS.md`, đặt ở thư mục gốc dự án (Claude Code: copy thêm thành `CLAUDE.md`). |
| ChatGPT, Claude (web/app), Gemini | Dán nội dung `AGENTS.md` vào chat, hoặc thêm làm file trong Project / GPT riêng. |
| AI khác | `llms.txt` là bản ngắn; `library.json` có đầy đủ trường. |
| **Tra cứu trực tiếp (MCP)** | Chạy [MCP server](mcp/) để Claude Desktop, Claude Code, Cursor hoặc ChatGPT tìm trong thư viện mà không cần dán file. |

Tạo lại file từ dòng lệnh sau khi sửa `library.json`:

```bash
node scripts/build-agents.mjs            # tạo AGENTS.md và llms.txt
node scripts/scan-skills.mjs             # thêm skill trong ~/.claude/skills vào thư viện
```

## Quyền riêng tư

Khoá API lưu trong localStorage của trình duyệt và chỉ gửi tới nhà cung cấp bạn chọn. Dùng máy chung thì xoá khoá trong Cài đặt sau khi dùng.

## Giấy phép

MIT · sản phẩm của [tinihub](https://tinifb.net)
