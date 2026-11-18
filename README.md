# 4000 Essential English Words

App học từ vựng bộ **4000 Essential English Words** (hiện có Book 1 đến Book 6) — flashcard, quiz, story, **FSRS**, chạy offline (PWA).

## Deploy Netlify (nhanh nhất)

1. Vào https://app.netlify.com/drop
2. Kéo **cả thư mục này** thả vào
3. Nhận link `https://xxx.netlify.app`

Hoặc dùng Netlify CLI:
```bash
npx netlify deploy --dir=. --prod
```

## Deploy GitHub Pages

1. Tạo repo mới trên GitHub
2. Upload toàn bộ file trong thư mục này (root repo)
3. Settings → Pages → Source: Deploy from branch `main` / root
4. Mở `https://<user>.github.io/<repo>/`

## Cài trên điện thoại

- Mở link HTTPS trên Chrome/Safari
- Android: menu → **Install app** / Thêm vào màn hình chính
- iOS: Share → **Add to Home Screen**

## Tính năng

- FSRS-5 (Again / Hard / Good / Easy) + learning step 1 → 10 phút → 1 ngày; **mức nhớ mục tiêu chỉnh được** (85–95%), fuzz ±5% chống dồn lịch
- **Leech / từ yếu**, giới hạn từ mới/ngày, học thích ứng theo độ chính xác gần đây
- Dashboard tiến độ (Mới / Đang học / Ôn / Thuộc / Yếu) + dự báo 7 ngày
- **Nhắc học** (Notification API, khung giờ tùy chọn)
- IndexedDB lưu tiến độ + export/import JSON (1 hồ sơ hoặc tất cả)
- **Đồng bộ đám mây** (Firebase Auth + Firestore) — Google / ẩn danh, hiện giờ sync gần nhất
- **Phát âm**: audio người bản xứ (Free Dictionary API) + Web Speech neural fallback
- **Onboarding** lần đầu (giải thích FSRS + thói quen học)
- **Landscape** tối ưu (flashcard + rate buttons cạnh nhau trên màn ngang)
- **Cài app** (PWA install banner + hướng dẫn iOS)
- **Học nhanh 5 phút** (timer + ưu tiên due / từ yếu)
- PWA offline
- Nhiều sách trong một app: đổi sách ở trang chủ, hiện số từ thuộc từng Book
- Story mode, Unit Test, streak, XP, multi-profile
- **Kiểm thử app** trong Cài đặt (audit 6 sách + FSRS + hồ sơ)

**Version:** 3.5.1

### Thay đổi 3.5.1 (chuẩn bị nền: lỗi, đồng bộ, dữ liệu)
- **Nhật ký ghi thêm thông tin lỗi** (chỉ khi trả lời sai hoặc dùng gợi ý): loại lỗi (`wrong` nhầm sang từ khác, `form` sai dạng, `spell` sai 1 ký tự, `order` xếp sai câu, `use` dùng sai trong câu, `giveup`), từ bị chọn nhầm, đáp án đã gõ/chọn (cắt 30 ký tự) và số lần dùng gợi ý. Chỉ nằm trên thiết bị như phần nhật ký còn lại; file CSV xuất cho công cụ tối ưu **không đổi cột**.
- **Đáp án nhiễu theo cặp hay nhầm:** từ bạn từng chọn nhầm với một từ sẽ có xu hướng xuất hiện làm đáp án nhiễu của từ đó (tính theo từng hồ sơ và từng sách; nhầm ngược chiều tính một nửa).
- **Chặn kích thước đồng bộ cloud:** app ghi toàn bộ dữ liệu vào MỘT tài liệu Firestore (giới hạn 1 MiB). Nay đo kích thước (cảnh báo từ 700 KB, **ngừng ghi** từ 900 KB), hiện "Dữ liệu đồng bộ: x/900 KB" và lỗi gần nhất trong Cài đặt kể cả khi đồng bộ tự động. Dữ liệu vẫn an toàn trên máy. Đo thử: một hồ sơ học đủ 3.600 từ ≈ 649 KB, hai hồ sơ như vậy ≈ 1.299 KB (vượt giới hạn). *Đây là chặn và báo, chưa phải giải pháp chia nhỏ dữ liệu.*
- **Lược đồ dữ liệu v2 + công cụ kiểm tra** (`docs/DATA_SCHEMA.md`, `tools/validate-data.js`): các trường tùy chọn `collocations`, `syn`, `ant`, `family`, `patterns`, `senses`, `contrast`. App **chưa** đọc các trường này.

### Thay đổi 3.5.0
- **Nhật ký ôn tập:** mỗi lượt ôn thật được ghi lại (thời điểm, hồ sơ, từ, mức đánh giá, trạng thái trước đó, số ngày kể từ lần ôn trước, thời gian trả lời, dạng câu). Nhật ký **chỉ nằm trên thiết bị** (IndexedDB, chia chunk 500 dòng, giữ ~20.000 lượt gần nhất), không vào kho dữ liệu chính nên không làm nặng việc lưu hay đồng bộ cloud. Cài đặt → "Nhật ký ôn tập" cho phép xuất CSV (hồ sơ đang dùng) và xóa. Reset tiến độ / xóa hồ sơ cũng xóa phần nhật ký tương ứng.
- **Tham số FSRS tùy chỉnh:** Cài đặt → "Tham số FSRS" cho phép dán 19 số (FSRS-5) từ công cụ tối ưu bên ngoài; được kiểm tra hợp lệ (đúng 19 số hữu hạn, 4 số đầu > 0), đồng bộ cloud cùng cài đặt, chỉ ảnh hưởng các lượt ôn từ lúc lưu trở đi. Để trống = mặc định.
- CSV có cột: `card_id,review_time,review_rating,review_state,review_duration,elapsed_days,question_type` (`review_time` và `review_duration` tính bằng ms; `review_state`: 0 mới, 1 learning, 2 review, 3 relearning). **Đây là định dạng chung, chưa được thử với một công cụ tối ưu cụ thể** — có thể cần đổi tên cột/mã trạng thái cho khớp tài liệu công cụ bạn dùng. Nên có vài nghìn lượt ôn trước khi tối ưu.

### Thay đổi 3.4.0
- **Đo thời gian trả lời:** câu trắc nghiệm > 15 giây, câu gõ > 30 giây, câu xếp câu > 50 giây mà vẫn đúng được tính là *Hard* (nhớ chưa chắc) thay vì *Good*, và có ghi chú trong phản hồi. Không phạt khi dùng gợi ý, rời tab giữa câu, hoặc quá 150 giây (coi như bị gián đoạn). Câu "Viết câu" không bị tính giờ.
- **Biểu đồ "Tỷ lệ nhớ thực tế"** trên trang chủ: tỷ lệ nhớ đúng của các lượt ôn thật (chỉ từ đã học xong, không tính luyện tập thêm hay từ đang trong learning) trong 30 ngày, biểu đồ cột 8 tuần và đường mục tiêu. Cần ≥ 20 lượt ôn mới hiện số; có gợi ý chỉnh "Mức nhớ mục tiêu" hoặc số từ mới/ngày khi lệch mục tiêu. Lịch sử lưu theo ngày (120 ngày gần nhất), được đồng bộ cloud, gộp theo ngày và không nằm trong dữ liệu đã reset.

### Thay đổi 3.3.0
- **Nút "Học hôm nay"** (nút chính trên trang chủ): một phiên flashcard gộp từ đến hạn (tối đa 30, xếp theo mức ưu tiên) + từ mới trong hạn mức ngày (lấy lần lượt theo Unit), tối đa 40 thẻ/phiên, hiển thị số từ ôn/mới và thời gian ước tính. Hết việc thì nút chuyển sang "Hôm nay bạn đã xong ✓". "Review Today" và "Học nhanh 5 phút" vẫn còn dưới dạng nút phụ.
- **Màn hình Từ vựng** (mục mới ở thanh điều hướng): tìm theo từ / dạng từ / định nghĩa / nghĩa tiếng Việt (không phân biệt dấu, chỉ ở giao diện tiếng Việt), lọc theo Mới / Đang học / Ôn tập / Đã thuộc / Từ yếu / Đã biết, phân trang 40 từ, hiện trạng thái và lần ôn kế tiếp.
- **"Tôi đã biết từ này"** (cho từ chưa học): bỏ qua việc học từ mới nhưng KHÔNG tính là đã thuộc ngay — từ được kiểm tra lại sau 1–4 tuần (rải ngẫu nhiên để không dồn lịch) rồi mới tính là thuộc. Có "Hoàn tác" cho tới khi từ được ôn lần đầu. Từ đã biết không tính vào hạn mức từ mới/ngày và không làm app thoát chế độ "sách mới".

### Thay đổi 3.2.0 (nâng cấp "vận dụng")
- **Câu ví dụ xoay vòng:** `cloze` trước đây luôn dùng đúng một câu; nay mọi dạng điền/xếp câu xoay qua tất cả câu ví dụ của từ (mỗi lần ôn thật sang câu khác, không lặp câu vừa hiện) để nhớ từ trong nhiều ngữ cảnh chứ không nhớ vẹt một câu. Tự loại câu ví dụ trùng trong dữ liệu (4 từ bị lặp).
- **Dạng mới "Chọn đúng dạng từ"** (`form_choice`, mức Vận dụng): chọn dạng đúng của từ để hoàn thành câu. Chỉ áp dụng cho từ có ≥ 3 dạng khác nhau (~12% từ); từ khác tự rơi về `cloze`.
- **"Viết câu" nâng cấp:** thỉnh thoảng yêu cầu dùng *cả hai từ* cùng Unit; chặn chép lại câu mẫu; bảng kiểm tra nhanh không cần mạng (chữ hoa, dấu câu, độ dài, "I", lặp từ); tự chấm 3 mức (Dùng đúng / Chưa chắc / Cần sửa) — "chưa chắc" và "cần sửa" tính là Hard, không bị tính là quên từ.
- **Nhận xét bằng AI (tùy chọn, mặc định tắt):** dán khóa API Anthropic của bạn trong Cài đặt. Khóa chỉ lưu trong trình duyệt (localStorage), không đồng bộ cloud, không nằm trong file sao lưu. Câu bạn viết + từ mục tiêu + định nghĩa được gửi trực tiếp từ trình duyệt tới api.anthropic.com và tính phí vào tài khoản của bạn. Tên mô hình nằm ở hằng số `AI_MODEL` trong `app.js`.
- Sửa: dạng câu mới thiếu điểm XP (sẽ gây `NaN`) — đã thêm.

### Thay đổi 3.1.3
- **Lưu dữ liệu có hoãn:** gộp nhiều lần ghi mỗi câu trả lời thành một lần (sau 0,4 giây, tối đa chờ 2 giây); ghi ngay khi ẩn tab, rời trang, trước khi đồng bộ cloud và trước khi import/đổi kho dữ liệu. Giảm giật khi đã học nhiều.

### Thay đổi 3.1.2
- **Giao diện tiếng Anh 100%:** toàn bộ HTML tĩnh, thông báo (toast), hộp xác nhận, lỗi cloud, import/export, thẻ Unit, Unit hub, Review, Cài đặt, hồ sơ đều đổi theo ngôn ngữ. Nghĩa tiếng Việt của từ chỉ hiện ở giao diện tiếng Việt, **trừ** dạng câu hỏi "Gõ từ theo nghĩa tiếng Việt" (vẫn dùng nghĩa tiếng Việt làm đề bài).

### Thay đổi 3.1.1
- **Sửa đa ngôn ngữ:** toàn bộ Quiz (nhãn dạng câu hỏi, đề bài, gợi ý, phản hồi đúng/sai, nút), màn Kết quả, màn Truyện và popup từ giờ đổi theo ngôn ngữ giao diện (trước đây chuỗi tiếng Việt viết cứng trong code). Thêm `data-i18n-placeholder` / `data-i18n-title`.

### Thay đổi 3.1.0 (nâng cấp thuật toán)
- **FSRS-5 đúng chuẩn hơn:** độ khó có linear damping, hồi quy về D0(Easy); sau khi quên, stability không vượt giá trị cũ.
- **Mức nhớ mục tiêu** trong Cài đặt (85/90/93/95%) + **fuzz ±5%** cho khoảng ôn ≥ 3 ngày.
- **Nút đánh giá flashcard hiện khoảng ôn kế tiếp** (vd. `→ 10p`, `→ 3 ngày`).
- **Quiz không còn "đi tắt" qua learning step:** trả lời đúng khi từ chưa đến hạn chỉ là luyện tập (không đổi lịch, không tăng reps); sai khi đang chờ trong learning không tăng lapse.
- **Trắc nghiệm = bằng chứng yếu:** stability chỉ tăng một nửa so với tự gõ/flashcard. Đúng nhưng dùng gợi ý → Hard.
- **Gõ sai chính tả 1 ký tự / sai dạng từ → Hard** (không còn bị tính là quên → bớt leech oan). Chấp nhận biến thể Anh/Mỹ (colour/color…).
- **Đáp án gây nhiễu thông minh hơn:** cùng từ loại, chính tả/độ dài gần, cùng chữ cái đầu, ưu tiên từ đã gặp.
- **Import "Merge"** dùng cùng quy tắc với cloud (bản ôn gần nhất thắng).

## Đồng bộ đám mây (Firebase)

App vẫn chạy offline bình thường nếu chưa cấu hình Firebase.

### 1. Tạo project Firebase

1. Vào [Firebase Console](https://console.firebase.google.com) → **Add project**
2. Thêm app **Web** (`</>`) → copy object `firebaseConfig`
3. Dán vào file `firebase-config.js`:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "...",
  appId: "1:..."
};
```

### 2. Bật Authentication

- Authentication → Sign-in method
- Bật **Anonymous**
- (Tuỳ chọn) Bật **Google**

### 3. Tạo Firestore

- Build → Firestore Database → Create database
- Chọn production mode (hoặc test mode để thử nhanh)

**Rules khuyến nghị** (chỉ user đọc/ghi data của chính mình):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 4. Dùng trong app

1. Mở **Cài đặt**
2. Dùng nhiều thiết bị: chọn **Đăng nhập Google**. **Sao lưu ẩn danh** chỉ gắn với trình duyệt hiện tại, máy khác sẽ nhận UID khác nên không đồng bộ được
3. Dùng **Đẩy lên cloud** / **Tải về** khi cần
4. Sau khi đăng nhập, app tự đẩy tiến độ lên cloud (debounce ~2.5s) mỗi lần học

**Merge thông minh:** mỗi lần đồng bộ app kéo bản cloud về, merge rồi mới ghi lên (không ghi đè mù).
- Tiến độ từng từ: bản **được ôn gần nhất** thắng (từ vừa quên không bị bản cũ ghi đè).
- XP / streak lấy giá trị lớn hơn; điểm Unit Test lấy cao nhất.
- **Xóa tiến độ** và **xóa hồ sơ** được lan sang mọi thiết bị (không bị hồi sinh từ cloud).
- Thiết bị mới có hồ sơ "Learner" trắng sẽ tự chuyển sang hồ sơ có dữ liệu trên cloud.
- Trên iOS (PWA đã cài) đăng nhập Google dùng redirect thay vì popup.

> Lưu ý: tài khoản ẩn danh gắn với trình duyệt. Nếu xóa dữ liệu trình duyệt sẽ mất liên kết ẩn danh — nên dùng Google khi cần bền vững.


## Nhiều sách trong một app

- Một hồ sơ (XP, level, streak) dùng chung cho mọi sách; **tiến độ từng từ, Unit đã hoàn thành và điểm Unit Test được lưu riêng cho từng sách**.
- Đổi sách ở trang chủ (không đổi được khi đang giữa phiên học). Dữ liệu sách được nạp theo nhu cầu từ `data-book*.js` và service worker cache để dùng offline.
- Dữ liệu cũ của app Book 2 được giữ nguyên: hồ sơ cũ tự nhận là Book 2 (khóa lưu trữ không đổi).
- Cloud: vẫn dùng một document `users/{uid}/data/main`, trong đó mỗi hồ sơ chứa tiến độ của tất cả sách. Merge theo từng sách.
- File backup cũ: `word-ii-profile` được nhận là Book 2, `word-iii-profile` là Book 3 (import sẽ tự chuyển sang đúng sách).

### Thêm sách mới

1. Tạo `data-bookN.js` theo mẫu `data-book3.js`, đăng ký dưới `window.VOCAB_BOOKS.bookN` (id từ dạng `unit-số`, mỗi unit 20 từ).
2. Thêm `{ id: 'bookN', label: 'Book N', file: 'data-bookN.js' }` vào mảng `BOOKS` đầu mục "DỮ LIỆU" trong `app.js`.
3. Thêm `./data-bookN.js` vào `CORE` trong `sw.js` và tăng `CACHE_NAME`.

## Lưu ý

- Phải chạy qua **https://** (hoặc localhost). `file://` không bật được Service Worker / Firebase Auth.
- Tiến độ vẫn lưu local (IndexedDB). Cloud chỉ là lớp đồng bộ thêm.
- Nên **Xuất tiến độ** định kỳ để có bản backup file JSON độc lập.

## Công cụ dữ liệu

`node tools/validate-data.js [--strict]` (hoặc `npm run validate-data`) kiểm tra dữ liệu từ vựng; xem `docs/DATA_SCHEMA.md`.

## Kiểm thử

Thư mục `tests/` chứa bộ kiểm thử chạy bằng Node.js (không cần cài thư viện nào). App vẫn là static PWA, thư mục này chỉ để bạn kiểm tra trước khi triển khai.

```
node tests/run.js        # hoặc: npm test
```

| File | Kiểm tra |
|---|---|
| `sched.test.js` | Lịch ôn FSRS-5, mức nhớ mục tiêu, fuzz, quiz không "đi tắt" qua learning step, Hard/Easy, nhãn khoảng ôn |
| `save.test.js` | Lưu dữ liệu có hoãn: gộp lần ghi, giới hạn chờ, ghi ngay, dự phòng localStorage |
| `vandung.test.js` | Câu ví dụ xoay vòng, dạng "chọn đúng dạng từ" trên 3.600 từ thật, bảng kiểm tra và chặn chép câu mẫu, gọi AI (có giả lập `fetch`) |
| `today-words.test.js` | Kế hoạch "Học hôm nay", xen kẽ thẻ, tìm/lọc từ, "đã biết"/hoàn tác |
| `response-retention.test.js` | Ngưỡng trả lời chậm, lịch sử ôn, thống kê tỷ lệ nhớ, gộp/làm sạch dữ liệu |
| `i18n-config.test.js` | Khóa dịch Việt/Anh khớp nhau, id HTML duy nhất, mọi `data-action` có handler, bảng cấu hình theo dạng câu hỏi (XP, nhãn, fallback), phiên bản khớp README |
| `data.test.js` | Toàn vẹn dữ liệu 6 sách (30 unit × 20 từ), IPA, câu ví dụ, truyện |
| `revlog-fsrs.test.js` | Nhật ký ôn tập (chunk, xoay vòng, khởi động lại, ghi đồng thời, xuất CSV, xóa theo hồ sơ), kiểm tra tham số FSRS, ghi nhật ký từ `updateProgress` |
| `errors-cloud.test.js` | Thông tin lỗi trong nhật ký, cặp từ hay nhầm → đáp án nhiễu, loại lỗi khi gõ, chặn kích thước đồng bộ cloud |
| `data-schema.test.js` | Lược đồ dữ liệu v2 và `tools/validate-data.js` |
| `smoke.test.js` | `app.js` nạp được dưới DOM giả |

Lưu ý:
- Các test lịch ôn/lưu dữ liệu **tách trực tiếp đoạn code từ `app.js` theo mốc chú thích**. Nếu bạn đổi cấu trúc code và test báo "Không tìm thấy mốc…", chỉ cần cập nhật mốc trong test (đó là tín hiệu chứ không phải lỗi app).
- Bộ test đã được thử bằng cách cố tình phá code (xóa XP của một dạng câu, bỏ cổng "luyện tập thêm", gỡ giới hạn FSRS, đặt trùng id…) để chắc chắn chúng bắt được lỗi.
- **Chưa có kiểm thử giao diện trên trình duyệt thật**: sau khi sửa giao diện, hãy tự thử các màn hình chính (Học hôm nay, Quiz, Từ vựng, đổi EN/VI).
