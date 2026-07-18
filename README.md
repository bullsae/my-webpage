# 내 웹페이지

VSCode에서 작성 → GitHub에 push → Cloudflare Pages가 자동 배포하는 정적 웹사이트입니다.

## 구조
- `index.html` — 페이지 구조
- `style.css` — 스타일
- `script.js` — 동작

## 배포 방법
파일을 수정하고 아래 명령을 실행하면 Cloudflare가 자동으로 새 버전을 배포합니다.

```bash
git add .
git commit -m "수정 내용"
git push
```
