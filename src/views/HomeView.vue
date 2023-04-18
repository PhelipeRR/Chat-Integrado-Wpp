<template>
    <div class="d-flex h-100">
        <div>
            <ModalAddImg />
        </div>
        <div>
            <PhraseModal />
        </div>
        <div class="">
            <SidebarNew />
        </div>
        <div class="d-flex flex-column w-100 h-100">
            <div class="">
                <CardContact />
            </div>
            <div class="flex-grow-1">
                <ComponentChatBot />
            </div>
        </div>
        <div>
            <ModalUVue />
        </div>
        <div>
            <PdfViewer />
        </div>
        <div>
            <ImgViewer />
        </div>
        <div>
            <OfficeViewer />
        </div>
        <div>
            <VideoViewer />
        </div>
    </div>
</template>
<script setup lang="ts">
import CardContact from "../components/CardContact.vue";
import ComponentChatBot from "../components/ComponentChatBot.vue";
import SidebarNew from "../components/SidebarNew.vue";
import ModalUVue from "../components/ModalU.vue";
import PdfViewer from "../components/PdfViewer.vue";
import ImgViewer from "../components/ImgViewer.vue";
import ModalAddImg from "../components/ModalAddImg.vue";
import OfficeViewer from "../components/OfficeViewer.vue";
import VideoViewer from "../components/VideoViewer.vue";
import PhraseModal from "../components/PhraseModal.vue";

</script>

<style scoped>
</style>