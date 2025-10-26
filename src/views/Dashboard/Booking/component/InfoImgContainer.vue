<script setup lang="ts">
import ImgPlaceholderIcon from '@/components/Icons/ImgPlaceholderIcon.vue'
import DownloadIcon from '@/components/Icons/table/DownloadIcon.vue'
import ZoomIcon from '@/components/Icons/ZoomIcon.vue'
// import ViewIcon from '@/components/Icons/ViewIcon.vue'
// import { handleDownload } from '@/utils/utils'

defineProps<{
  imgUrl?: string
  imgAlt?: string
}>()

const emits = defineEmits<{
  (e: 'onview', url: string, alt: string): void
}>()

// const handleDownload = (url?: string) => {
//   if (!url) return
//   const link = document.createElement('a')
//   link.href = url
//   link.download = url.split('/').pop() || 'download'
//   link.click()
// }

const handleView = (url: string, alt: string) => {
  // if (!url) return
  // window.open(url, '_blank')
  emits('onview', url, alt)
}
</script>

<template>
  <div class="card img-wrapper">
    <template v-if="imgUrl">
      <img :src="imgUrl" :alt="imgAlt" class="preview-img" />
    </template>
    <template v-else>
      <div class="img-placeholder mx-3 my-4">
        <ImgPlaceholderIcon />
        <span class="title fw-500">No Photo</span>
      </div>
    </template>

    <!-- Hover Overlay -->
    <div v-if="imgUrl" class="overlay">
      <div class="actions">
        <div class="action-btn" @click="handleView(imgUrl, imgAlt ?? 'img-alt')">
          <ZoomIcon />
        </div>
        <!-- <div class="action-btn" @click="handleDownload(imgUrl)">
          <DownloadIcon />
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-wrapper {
  position: relative;
  width: 10rem;
  height: 6.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%; /* Make image fill the container */
  object-fit: cover; /* Crop image to fill container while maintaining aspect ratio */
  display: block;
  border-radius: 0.5rem;
  transition: filter 0.25s ease-in-out;
}

.img-wrapper:hover .preview-img {
  filter: blur(4px);
}

.img-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Add vertical centering */
  height: 100%; /* Fill the container */
}

.title {
  color: #5c5e64;
}

/* Overlay layer */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(2px);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.25s ease-in-out;
}

/* Show overlay on hover */
.img-wrapper:hover .overlay {
  opacity: 1;
}

/* Actions inside overlay */
.actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
