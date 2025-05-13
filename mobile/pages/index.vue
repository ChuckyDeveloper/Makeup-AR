<template>
  <div>
    <!-- 2 canvas ตามเดโม -->
    <canvas id="WebARRocksFaceCanvasAR" width="600" height="600"></canvas>
    <canvas id="WebARRocksFaceCanvasVideo" width="600" height="600"></canvas>

    <!-- ปุ่มเลือกสีลิปสติก -->
    <div class="controls">
      <a
        id="colorRed"
        class="controlButton controlButtonSelected"
        @click="changeColor([1.0, 0.0, 0.3], $event)"
      />
      <a
        id="colorBlue"
        class="controlButton"
        @click="changeColor([0.0, 0.0, 1.0], $event)"
      />
      <a
        id="colorYellow"
        class="controlButton"
        @click="changeColor([0.0, 0.0, 0.0], $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

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
function changeColor(rgb, ev) {
  // เอา class controlButtonSelected ไปใส่ปุ่มที่คลิก
  document
    .querySelectorAll(".controlButton")
    .forEach((btn) => btn.classList.remove("controlButtonSelected"));
  ev.target.classList.add("controlButtonSelected");

  // ฟังก์ชันนี้ประกาศใน main.js
  if (window.change_lipstickColor) {
    window.change_lipstickColor(rgb, ev);
  }
}
</script>

<style scoped>
/* สไตล์ทั้งหมดยกมาจากไฟล์ต้นฉบับ */
body,
:host {
  margin: 0;
  overflow: hidden;
}
#WebARRocksFaceCanvasAR,
#WebARRocksFaceCanvasVideo {
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  transform: rotateY(180deg); /* mirror */
}
#WebARRocksFaceCanvasVideo {
  z-index: 0;
}
#WebARRocksFaceCanvasAR {
  z-index: 1;
}

.controls {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 100vw;
  min-height: 96px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.controlButton {
  margin: 0 16px;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition-duration: 500ms;
  user-select: none;
}
#colorRed {
  background: #ff0000;
}
#colorBlue {
  background: #5555ff;
}
#colorYellow {
  background: #333333;
}
.controlButtonSelected {
  transform: scale(1.2);
}
</style>
