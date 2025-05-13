// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // ✅ ปิด SSR เพื่อให้ TensorFlow.js โหลดถูกต้อง
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
      ],
      script: [
        // โหลด TensorFlow.js
        {
          src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest",
          defer: true,
        },
        // โหลด face-landmarks-detection
        {
          src:
            "https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@latest",
          defer: true,
        },
      ],
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "nuxt-aos",
    "nuxt-icon",
    "@pinia/nuxt",
    "@stefanobartoletti/nuxt-social-share",
    "nuxt-headlessui",
    "@nuxtjs/device",
    "@samk-dev/nuxt-vcalendar",
  ],

  socialShare: {
    // module options
  },

  headlessui: {
    prefix: "Headless",
  },

  compatibilityDate: "2024-07-24",
  vite: {
    server: {
      allowedHosts: ["894e-49-237-33-39.ngrok-free.app"], // ✅ หรือใช้ '.ngrok-free.app' สำหรับ wildcard
    },
  },
});
