<template>
    <div class="whatsapp-audio">
        <audio ref="audioPlayer" :src="props.audioUrl" @ended="onEnded" type="audio/mpeg"></audio>
        <i @click="togglePlay" :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" class="colorBtn"></i>
        <div class="audio-controls">
            <span class="current-time">{{ currentTime }}</span>
            <progress class="audio-progress" ref="audioProgress" :value="onTimeUpdate" max="100"></progress>
            <span class="duration">{{ duration }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from 'vue';

const props = defineProps({
    audioUrl: String,
    currentAudio: Object
})

const isPlaying = ref<boolean>(false);
const audioPlayer = ref();
const audioProgress = ref<HTMLProgressElement>();
const durationRaw = ref<number>(0);
const currentTimeRaw = ref<number>(0);

const togglePlay = () => {
    if (audioPlayer.value) {
        if (isPlaying.value) {
            audioPlayer.value.pause();
        } else {
            if (props.currentAudio && props.currentAudio !== audioPlayer.value) {
                props.currentAudio.pause();
            }
            audioPlayer.value.play();
        }
        isPlaying.value = !isPlaying.value;
        audioPlayer.value.classList.toggle('playing', isPlaying.value);
    }
};

const onTimeUpdate = computed(() => {
    if (!audioPlayer.value || isNaN(audioPlayer.value)) {
        return
    }
    const duration = audioPlayer.value.duration;
    const currentTime = audioPlayer.value.currentTime;
    if (!isFinite(duration) && !isFinite(currentTime)) {
        return 0;
    }
    return (currentTime / duration) * 100;
});


const onEnded = () => {
    isPlaying.value = false
    audioProgress.value!.value = 0;
}

const currentTime = computed(() => {

    if (!audioPlayer.value || isNaN(audioPlayer.value)) return;

    const currentTime = Math.floor(currentTimeRaw.value);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const duration = computed(() => {

    if (!audioPlayer.value) return '';

    const duration = Math.floor(durationRaw.value);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

onMounted(() => { //Executa essa função após o componente ser montado
    audioPlayer.value.addEventListener('timeupdate', () => {
        const duration = audioPlayer.value.duration;
        if (!isFinite(duration) || isNaN(duration)) {
            return;
        }
        const percent = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
        audioProgress.value!.value = percent;
    });
    audioPlayer.value.addEventListener('loadedmetadata', () => {
        const duration = audioPlayer.value?.duration;
        if (!isFinite(duration) || isNaN(duration)) {
            return;
        }
        durationRaw.value = audioPlayer.value.duration;
    });
    audioPlayer.value.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.value.currentTime;
        if (!isFinite(currentTime) || isNaN(currentTime)) {
            return;
        }
        currentTimeRaw.value = audioPlayer.value.currentTime;
    });
    audioPlayer.value.addEventListener('ended', () => {
        currentTimeRaw.value = 0;
        isPlaying.value = false;
    });
});
</script>

<style scoped>
.whatsapp-audio {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 4px;
    padding: 8px;
}

.whatsapp-audio i {
    background-color: #021a2e;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px;
    font-size: 16px;
    cursor: pointer;
}

.whatsapp-audio i:hover {
    background-color: #021a2e;
}

.whatsapp-audio i:focus {
    outline: none;
    box-shadow: 0 0 0 2px #021a2e;
}

.whatsapp-audio i:active {
    background-color: #021a2e;
}

.whatsapp-audio.playing {
    background-color: #e0f2f1;
}

.whatsapp-audio.playing i {
    background-color: #f44336;
}

.whatsapp-audio.playing i:hover {
    background-color: #d32f2f;
}

.whatsapp-audio.playing i:focus {
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.5);
}

.whatsapp-audio .audio-progress {
    width: 17.5vh;
    height: 5px;
    margin-top: 8px;
    background-color: #949393;
    border-radius: 5px;
    position: relative;
}

.whatsapp-audio .audio-progress:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: -4px;
    width: 0;
    height: 0;
    border-width: 0 4px 6px 4px;
    border-color: transparent transparent #eee transparent;
}

.whatsapp-audio .audio-progress::-webkit-progress-bar {
    background-color: transparent;
}

.whatsapp-audio .audio-progress::-webkit-progress-value {
    background-color: #021a2e;
    border-radius: 5px;
    -webkit-animation-name: progress-animation;
    -webkit-animation-duration: 1s;
    -webkit-animation-timing-function: ease-out;
    -webkit-animation-fill-mode: forwards;
}

.whatsapp-audio .audio-progress::-moz-progress-bar {
    background-color: #021a2e;
    border-radius: 5px;
    animation-name: progress-animation;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}

.current-time,
.duration {
    font-size: 14px;
    font-weight: bold;
    color: #021a2e;
}

.current-time {
    margin-right: 0.5rem;
}

.duration {
    margin-left: 0.5rem;
}

@-webkit-keyframes progress-animation {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

@keyframes progress-animation {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

@media (max-width: 1024px) {
    .whatsapp-audio .audio-progress {
        width: 71px;
    }
}
@media (max-width: 1366px) {
    .whatsapp-audio .audio-progress {
        width: 89px;
    }
}
</style>