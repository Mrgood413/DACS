# DACS

Game web 2D xây dựng nhà máy + thủ thành (lấy cảm hứng từ Factorio). Thư mục này **chỉ chứa mã nguồn**.

## Dành cho AI viết code — đọc hết file này trước khi làm

Bạn là người **viết code**. Bạn không cần phân tích đồ án. Mọi thứ cần làm đã được mô tả sẵn thành từng task, mỗi task là **một function**.

### 1. Các file bạn cần

| File | Để làm gì |
|---|---|
| `../../Báo cáo đồ án/TASKS.md` | Danh sách task. Đọc để biết phải code function nào. Xong thì tick vào đây |
| `../../Báo cáo đồ án/BAO_CAO.md` | Ghi báo cáo ngắn sau mỗi task |
| `../../Báo cáo đồ án/SKILL.md` | Quy chuẩn viết code. Đọc trước khi code |

Đường dẫn đầy đủ của thư mục tài liệu: `C:\User workspace\Đồ án cơ sở\Báo cáo đồ án\`

Không đọc thư mục `Báo cáo đồ án/luu-tru/` — đó là tài liệu cũ, không còn dùng.

### 2. Cấu trúc thư mục

```
DACS/
├─ README.md     file này
├─ backend/      code server
└─ frontend/     code giao diện và game chạy trên trình duyệt
```

Không tạo thư mục tài liệu trong đây. Không tạo thư mục cấp cao nhất nào khác ngoài `backend/` và `frontend/`.

### 3. Cách làm việc (bắt buộc theo đúng thứ tự)

1. Mở `TASKS.md`. Tìm task **đầu tiên** còn `[ ]` (chưa tick), tính từ trên xuống.
2. Chỉ làm **đúng task đó**. Không làm task phía sau, không làm nhiều task một lúc, không bỏ qua task.
3. Đọc mô tả của task: file nào, function tên gì, nhận gì, trả gì, các bước, cách kiểm tra.
4. Viết function thật đơn giản, đúng như mô tả. Không thêm tính năng ngoài mô tả.
5. Chạy phần **"Kiểm tra"** của task. Function phải chạy được và cho kết quả đúng.
6. Chạy đúng → sửa `[ ]` thành `[x]` ở **đúng một dòng** của task đó trong `TASKS.md`. **Không sửa, không viết lại bất kỳ chỗ nào khác của file.**
7. Thêm một mục vào cuối `BAO_CAO.md` theo mẫu trong file đó.
8. Dừng lại. Chỉ làm task tiếp theo khi được yêu cầu.

### 4. Khi gặp khó

- Mô tả không rõ hoặc thiếu thông tin → **không đoán**. Không tick. Ghi câu hỏi vào `BAO_CAO.md` rồi dừng.
- Kiểm tra không chạy đúng sau khi đã cố sửa → không tick. Ghi lỗi vào `BAO_CAO.md` rồi dừng.
- Không bao giờ tick khi chưa tự chạy phần "Kiểm tra" và thấy đúng.
