<template>
    <div v-if="isOpen" class="modal">
        <div>
            <button @click="closeVideoViewer">X</button>
        </div>
        <video :src="videoSrc" controls autoplay></video>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../stores/Store';

const pinia = useStore();

const isOpen = computed(() => {
    return pinia.getIsOpenVideo();
});

const videoSrc = computed(() => {
    const url = pinia.getVideoUrl();
    if (!url) return;
    console.log(url);
    return url;
});

const closeVideoViewer = () => {
    pinia.IsOpenVideo(false);
}

</script>
<style scoped>
.modal {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: table;
    transition: opacity .3s ease;
    padding: 5rem;
}

button {
    width: 36px;
    height: 36px;
    font-size: 36px;
    line-height: 24px;
    text-align: center;
    position: relative;
    float: right;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #F55555;
    color: #313131;
    transition: all 0.2s ease;
    cursor: pointer;
}

.modal video {
    width: 100%;
    height: 800px;
    max-width: 100%;
    max-height: 90vh;
    outline: none;
}

@media (max-width: 1366px) {
    .modal video {
        height: 77vh;
    }
}
</style>