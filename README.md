# 박창수 사진 블로그

개인 사진을 올리는 정적 블로그입니다. VSCode에서 수정 → GitHub push → Cloudflare Pages 자동 배포.

## 사진 추가하는 법
1. 사진 파일을 `images/` 폴더에 넣기
2. `script.js` 위쪽 `posts` 목록에 블록 하나 복사해서 `photo / title / date / text` 수정
3. 아래 실행하면 몇 분 뒤 자동 반영:
   ```bash
   git add .
   git commit -m "사진 추가"
   git push
   ```

## 파일 구조
- `index.html` — 블로그 뼈대
- `style.css` — 디자인
- `script.js` — 사진 목록(여기서 사진 추가) + 크게보기 기능
- `images/` — 사진 파일들
