<template>
    <div v-if="isOpen" class="image-viewer-modal">
        <div class="btnClose">
            <button @click="closePdfViewer">X</button>
        </div>
        <div class="button-container">
            <button class="btnZoom" @click="zoomIn"><i class="fas fa-magnifying-glass-plus"></i></button>
            <button class="btnZoom" @click="zoomOut"><i class="fas fa-magnifying-glass-minus"></i></button>
        </div>
        <div class="image-container">
            <img class="img-fluid" ref="imageRef" alt="" :src="`${imgUrl}`" @load="onImageLoad" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../stores/Store';

const pinia = useStore(); // declaração de uma constante "pinia" que armazena uma instância da store criada com o plugin Pinia.
const zoomLevel = ref(1);
const imageRef = ref<any>(null);
const isOpen = computed(() => { // declaração de uma constante "isOpen" que armazena um objeto reativo calculado (computed) que retorna o valor de "getIsOpenImg" da instância "pinia".
    return pinia.getIsOpenImg();
});

const imgUrl = computed(() => { // declaração de uma constante "imgUrl" que armazena um objeto reativo calculado (computed) que retorna o valor de "getImgUrl" da instância "pinia".
    return pinia.getImgUrl();
});

const closePdfViewer = () => { // declaração de uma função "closePdfViewer" que atualiza o valor de "IsOpenImg" da instância "pinia" para false.
    zoomLevel.value = 1;
    imageRef.value.style.transform = `scale(1)`;
    pinia.IsOpenImg(false);

}

const onImageLoad = () => {
    imageRef.value.style.transform = `scale(1)`;
};

const zoomIn = () => {
    zoomLevel.value += 0.1;
    imageRef.value.style.transform = `scale(${zoomLevel.value})`;
};

const zoomOut = () => {
    if (zoomLevel.value > 1) {
        zoomLevel.value -= 0.1;
        imageRef.value.style.transform = `scale(${zoomLevel.value})`;
    }
};

</script>

<style scoped>
.image-viewer-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.image-container {
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image-container::-webkit-scrollbar {
  width: 12px;
}

.image-container::-webkit-scrollbar-track {
  background-color: rgba(18, 24, 34, 0.26);
  border-radius: 12px;

}

.image-container::-webkit-scrollbar-thumb {
  background-color: #021a2e;
  ;
  border-radius: 20px;
  border: 0;
}

.image-container img {
    max-width: 100%;
    max-height: 100%;
    transform-origin: top left;
}

.button-container {
    margin-top: 1rem;
}

.btnClose {
    width: 36px;
    height: 36px;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    position: relative;
    left: 30%;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #F55555;
    color: #3b3b3b;
    transition: all 0.2s ease;
    cursor: pointer;

    
}

.btnZoom {
    color: #fff;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 2rem;
}
</style>