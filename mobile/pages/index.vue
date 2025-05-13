<template>
  <div
    class="mx-auto lg:max-w-sm flex flex-col items-center h-screen justify-center select-none"
  >
    <div class="w-full">
      <!-- 1) กล่องครอบ video + canvas -->
      <div class="h-[570px] relative overflow-hidden bg-slate-100">
        <!-- <video ref="videoRef" class="video" autoplay playsinline muted></video>
        <canvas ref="canvasRef" class="canvas"></canvas> -->

        <canvas id="WebARRocksFaceCanvasAR"></canvas>
        <canvas id="WebARRocksFaceCanvasVideo"></canvas>

        <!-- UI ปุ่มซ้ายบน -->
        <div class="absolute top-2 left-2 bg-opacity-80">
          <div class="flex gap-1">
            <div class="bg-white rounded-full p-1.5 text-sm">
              <Icon name="ic:outline-house" class="lg:text-xl" />
            </div>
            <div class="bg-white rounded-full p-1.5 text-sm">
              <Icon name="ic:twotone-question-mark" class="lg:text-xl" />
            </div>
          </div>
        </div>

        <!-- UI ปุ่มขวาบน -->
        <div class="absolute top-2 right-2 bg-opacity-80">
          <div class="flex gap-1">
            <div
              @click="resetValue()"
              class="bg-white rounded-full p-1.5 text-sm cursor-pointer"
            >
              <Icon name="ic:baseline-replay" class="lg:text-xl" />
            </div>
            <div class="bg-white rounded-full p-1.5 text-sm">
              <Icon name="ic:baseline-file-download" class="lg:text-xl" />
            </div>
            <div class="bg-white rounded-full p-1.5 text-sm">
              <Icon name="ic:baseline-close" class="lg:text-xl" />
            </div>
          </div>
        </div>

        <!-- แสดง Label Product -->
        <div
          class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 gap-2 bg-white bg-opacity-80 px-3 py-2 rounded-md shadow-md"
          v-if="state.label_data"
        >
          <h3 class="text-xs">
            {{ state.label_data.name_en }}
          </h3>
          <div class="grid grid-cols-2">
            <div class="text-xs flex items-center">
              <b class="mr-1">Price :</b>
              {{ state.label_data.price }} thb
            </div>
            <div class="flex gap-1 justify-end">
              <div
                class="bg-gray-200 hover:bg-gray-300 px-2 cursor-pointer"
                @click="resetLabel(), (state.label_data = null)"
              >
                <Icon name="ic:baseline-close" class="lg:text-base" />
              </div>
              <div
                class="bg-gray-200 px-2 text-xs flex items-center justify-center cursor-pointer"
              >
                Shop now
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- เลือกหมวดหมู่และสีของเมคอัพ -->
      <div
        class="w-full bg-white overflow-x-auto snap-x snap-mandatory scroll-smooth"
      >
        <div class="flex items-center h-full" v-if="!state.makup_main_product">
          <div class="grid grid-cols-3 text-gray-800 w-full">
            <div
              class="cursor-pointer hover:bg-slate-100 py-3"
              v-for="makup in makup_list"
              :key="makup.category_name_en"
              @click="state.makup_main_product = makup.category_name_en"
            >
              <div class="flex justify-center">
                <div
                  class="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center"
                >
                  <Icon
                    :name="makup.icon_name"
                    class="lg:text-3xl text-pink-600"
                  />
                </div>
              </div>
              <h3 class="uppercase text-center text-xs mt-2">
                {{ makup.category_name_en }}
              </h3>
            </div>
          </div>
        </div>

        <!-- เมื่อเลือกหมวดหมู่แล้ว -->
        <div v-else>
          <div v-for="makup in makup_list" :key="makup.category_name_en">
            <div v-if="!state.product_name">
              <div
                v-if="state.makup_main_product == makup.category_name_en"
                class="relative w-full flex items-center bg-slate-100"
              >
                <!-- ปุ่มย้อนกลับไปหน้าหมวดหมู่ -->
                <div
                  class="absolute left-0 z-10 cursor-pointer"
                  @click="state.makup_main_product = null"
                >
                  <div class="flex items-center">
                    <div>
                      <Icon
                        name="material-symbols:arrow-left"
                        class="lg:text-2xl"
                      />
                    </div>
                    <div>
                      <div class="flex justify-center">
                        <div
                          class="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center"
                        >
                          <Icon :name="makup.icon_name" class="lg:text-3xl" />
                        </div>
                      </div>
                      <h3 class="uppercase text-center text-xs mt-2">
                        {{ renameCategory(state.makup_main_product) }}
                      </h3>
                    </div>
                  </div>
                </div>

                <!-- รายการ product -->
                <div
                  class="ml-24 w-full h-full overflow-x-auto flex items-center snap-x snap-mandatory scroll-smooth bg-white"
                >
                  <div class="flex items-center space-x-4 px-4 py-3">
                    <div
                      v-for="product in makup.product_list"
                      :key="product.product_name_en"
                      class="snap-center shrink-0 cursor-pointer"
                      @click="
                        (state.product_name = product.product_name_en),
                          (productData = product)
                      "
                    >
                      <img
                        :src="product.product_image"
                        ref="image"
                        class="h-12 w-12"
                      />
                      <h3 class="text-xs">
                        {{ renameProduct(product.product_name_en) }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- เมื่อเลือก product แล้ว -->
            <div v-else>
              <div
                v-if="makup.category_name_en == state.makup_main_product"
                class="relative w-full flex items-center bg-slate-100"
              >
                <!-- ปุ่มย้อนกลับไปเลือกรายการ product -->
                <div
                  class="absolute left-0 z-10 cursor-pointer"
                  @click="(state.product_name = null), (label_data = null)"
                >
                  <div class="flex items-center">
                    <div>
                      <Icon
                        name="material-symbols:arrow-left"
                        class="lg:text-2xl"
                      />
                    </div>
                    <div>
                      <div class="flex justify-center">
                        <div
                          class="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center"
                        >
                          <img
                            :src="productData.product_image"
                            ref="image"
                            class="h-12 w-12"
                          />
                        </div>
                      </div>
                      <h3 class="text-center text-xs mt-2">
                        {{ renameProduct(productData.product_name_en) }}
                      </h3>
                    </div>
                  </div>
                </div>
                <!-- รายการสี -->
                <div
                  class="ml-24 w-full h-full overflow-x-auto flex items-center snap-x snap-mandatory scroll-smooth bg-white"
                >
                  <div class="flex items-center space-x-4 px-4 py-3">
                    <div
                      v-for="c in productData.color_list"
                      :key="c.code_color"
                      class="snap-center shrink-0 cursor-pointer"
                    >
                      <div
                        @click="selectColor(c.code_color, c, $event)"
                        v-html="
                          `<div class='w-16 h-16 rounded-full cursor-pointer ${
                            state.currentColor == c.code_color
                              ? 'border-4 border-gray-700'
                              : ''
                          }' style='background-color: ${c.code_color}'></div>`
                        "
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- จบ each makup -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { makup_list } from "../makup_list";

import { ref, reactive, onMounted, onUnmounted } from "vue";
import * as facemesh from "@tensorflow-models/facemesh";

// กล่องอ้างอิง video + canvas
const videoRef = ref(null);
const canvasRef = ref(null);

// state สำหรับเลือกสี/สินค้า ฯลฯ
const state = reactive({
  makup_main_product: null,
  product_name: null,
  productData: null,
  currentColor: "#000000",
  colorLipstick: "#000000",
  colorLipliner: "#000000",
  colorFoundation: "#000000",
  colorConsealer: "#000000",
  colorBlush: "#000000",
  opacity: 0.8,
  isRendering: false,
  label_data: null,
  isMobile: false, // <-- เพิ่มตรงนี้
});

function renameProduct(name) {
  if (name.length > 8) {
    name = name.slice(0, 8) + "...";
  }
  return name;
}

function renameCategory(name) {
  if (name.length > 8) {
    name = name.slice(0, 8) + "...";
  }
  return name;
}

function selectColor(color, data) {
  state.label_data = data;
  state.currentColor = color;

  if (state.makup_main_product == "lipstick") {
    state.colorLipstick = color;
  } else if (state.makup_main_product == "lipliner") {
    state.colorLipliner = color;
  } else if (state.makup_main_product == "foundation") {
    state.colorFoundation = color;
  } else if (state.makup_main_product == "Concealer") {
    state.colorConsealer = color;
  } else if (state.makup_main_product == "blush") {
    state.colorBlush = color;
  }

  // changeColor([0.0, 0.0, 1.0]);
  const rgb = hexToRgbArray(color);
  changeColor(rgb);
}

function resetLabel(color = "#000000") {
  if (state.makup_main_product == "lipstick") {
    state.colorLipstick = color;
    changeColor([0, 0, 0]);
  } else if (state.makup_main_product == "lipliner") {
    state.colorLipliner = color;
  } else if (state.makup_main_product == "foundation") {
    state.colorFoundation = color;
  } else if (state.makup_main_product == "Concealer") {
    state.colorConsealer = color;
  } else if (state.makup_main_product == "blush") {
    state.colorBlush = color;
  }
}

// Helper แปลง HEX เป็น RGB 0-1 array
function hexToRgbArray(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

/* โหลดสคริปต์ทั้งหมดแบบไดนามิกตอน component mount
   จะได้ไม่ชนกับ SSR ของ Nuxt */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

onMounted(async () => {
  // โหลด libs ตามลำดับที่ต้องการ
  const base = "/libs/webar/";
  await loadScript(base + "WebARRocksFace.js");
  await loadScript(base + "WebARRocksFaceShape2DHelper.js");
  await loadScript(base + "WebARRocksResizer.js");
  await loadScript(base + "WebARRocksLMStabilizer2.js");
  // main.js มีโค้ด init AR และฟังก์ชัน change_lipstickColor
  // ถ้าไม่อยากแก้โค้ดเดิม ให้โหลดทับลงมาง่ายๆ
  await loadScript(base + "main.js");
});

// เชื่อม method เปลี่ยนสีลิปสติกกับ global fn จาก main.js
function changeColor(rgb) {
  // ฟังก์ชันนี้ประกาศใน main.js
  if (window.change_lipstickColor) {
    window.change_lipstickColor(rgb);
  }
}
</script>

<style scoped>
body,
:host {
  margin: 0;
  overflow: hidden;
  background: #000;
}
#WebARRocksFaceCanvasAR,
#WebARRocksFaceCanvasVideo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* Mirror flip for selfie */
}

#WebARRocksFaceCanvasVideo {
  z-index: 0;
}

#WebARRocksFaceCanvasAR {
  z-index: 1;
  pointer-events: none;
}
</style>
