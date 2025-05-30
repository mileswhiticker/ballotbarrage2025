<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  const canvas = ref(null)

  function resizeCanvas() {
    //grab the canvas
    const el = canvas.value;
    if (!el) return

    //grab the new window size
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    //do we have a header element?
    const header_element = document.getElementById("header");
    if (header_element) {
      //take this into account when calculating the new size
      const style = getComputedStyle(header_element);
      newHeight -= header_element.style.height;
    }

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
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
</style>
