<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  const canvas = ref(null)

  function resizeCanvas() {
    //grab the canvas
    const el = canvas.value;
    if (!el) return

    //grab the new window size
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight - 4;

    //do we have a header element?
    const header_element = document.getElementById("header");
    if (header_element) {
      //take this into account when calculating the new size
      const rect = header_element.getBoundingClientRect();
      const headerHeight = rect.height;
      newHeight -= headerHeight;
      //console.log("adjusting by header height: " + headerHeight,rect);
    }

    //maintain 4:3 dimensions by constraining width or height if necessary
    newHeight = Math.min(newHeight, 3 * newWidth / 4);
    newWidth = Math.min(newWidth, 4 * newHeight / 3);

    //apply new calculated size to canvas dimensions
    el.width = newWidth;
    el.height = newHeight;
    //console.log("resizeCanvas() " + el.width +  + "," + el.height);
    //console.log("resizeCanvas() " + window.innerWidth + "," + window.innerHeight);
    draw(el);
  }

  function draw(ctxCanvas) {
    const ctx = ctxCanvas.getContext('2d')
    if (!ctx) return
    // Example drawing: fill background gray
    ctx.fillStyle = '#ccc'
    ctx.fillRect(0, 0, ctxCanvas.width, ctxCanvas.height)
  }

  onMounted(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
  })
</script>

<template>
  <div id="gameCanvasWrapper">
    <canvas ref="canvas" id="gameCanvas"></canvas>
  </div>
</template>

<style scoped>
</style>
