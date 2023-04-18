<template>
  <div v-if="isOpen" class="modal">
    <div>
      <button @click="closeDocumentViewer">X</button>
    </div>
    <iframe ref="officeFrame" title=""
      :src="`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`" width="100%"
      height="800"></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../stores/Store';

// Importação do objeto "store" da biblioteca "Pinia"
const pinia = useStore();
const officeFrame = ref();

// Definição de uma variável computada que retorna se o PDF está aberto ou não
const isOpen = computed(() => {
  return pinia.getIsOpenDocument();
});

// Definição de uma variável computada que retorna a URL do PDF
const documentUrl = computed(() => {
  console.log(pinia.getDocumentUrl());
  return pinia.getDocumentUrl();
});

// Função para fechar o visualizador de PDF, definindo a propriedade "isOpenPdf" como false na store
const closeDocumentViewer = () => {
  pinia.IsOpenDocument(false);
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
</style>