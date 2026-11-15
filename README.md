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

**Version:** 3.1.0

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
