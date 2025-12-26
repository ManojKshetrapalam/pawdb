import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ensure the generated Supabase client always gets URL + publishable key.
  // In Lovable Cloud builds, these may be present as SUPABASE_* env vars.
  const env = loadEnv(mode, process.cwd(), "");

  const projectId = env.VITE_SUPABASE_PROJECT_ID || env.SUPABASE_PROJECT_ID;
  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    (projectId ? `https://${projectId}.supabase.co` : "");
  const supabasePublishableKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || "";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Provide a safe fallback when VITE_* is not injected at runtime.
    // Only publishable values are exposed.
    define: {
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(projectId ?? ""),
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
    },
  };
});
