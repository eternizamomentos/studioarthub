cd apps\executive-panel
rmdir /s /q .next
copy .safeguard\globals-stable.css app\globals.css
npm run dev -p 3001
pause