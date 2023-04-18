<template>
  <div>
    <div class="thumbnail" :style="{ backgroundImage: `url(${thumbnailUrl})` }">
      <button class="play-button" @click="openVideoViewer(props.videoUrl)">
        <i class="fas fa-play"></i>
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { useStore } from '../stores/Store';

const props = defineProps({
  videoUrl: String,
});

const thumbnailUrl = ref('');
const pinia = useStore();

const getVideoThumbnail = async (url: string) => {
  const video = document.createElement('video');
  video.src = url;
  video.currentTime = 1;
  video.muted = true;
  video.setAttribute('crossorigin', 'anonymous');

  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 320;

  const onVideoLoaded = () => {
    video.removeEventListener('canplay', onVideoLoaded);
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    thumbnailUrl.value = canvas.toDataURL();
  };

  video.addEventListener('canplay', onVideoLoaded);
  video.play();
};

const openVideoViewer = (url: any): void => {
  pinia.VideoUrl(url);
  pinia.IsOpenVideo(true);
};

onMounted(async () => {
  if (!props.videoUrl) return;
  await getVideoThumbnail(props.videoUrl);
});
</script>
  
<style scoped>
.thumbnail {
  width: 18.5vw;
  height: 22vw;
  background-size: cover;
  background-position: center;
  position: relative;

}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #fff;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

@media (max-width: 1024px) {
  .thumbnail {
    width: 17.5vw;

  }
}
</style>
  