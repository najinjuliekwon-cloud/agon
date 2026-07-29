import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages(project site)에 올릴 때는 base를 저장소 이름으로 맞춰야 합니다.
// 예: https://<user>.github.io/agon/  →  base: "/agon/"
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "true" ? "/agon/" : "/",
});
