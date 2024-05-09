import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@applier/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist-Sans", ...fontFamily.sans],
        mono: ["Geist-Mono", ...fontFamily.mono],
      },
    },
  },
  corePlugins: {
    // This must be disabled to prevent the extension from messing with web pages.
    preflight: false,
  },
} satisfies Config;
