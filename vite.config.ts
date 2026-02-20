import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	preview: {
		port: 5173,
		strictPort: true,
	},
	server: {
		port: 5173,
		strictPort: true,
		host: true,
		origin: "http://0.0.0.0:5173",
	},
});
