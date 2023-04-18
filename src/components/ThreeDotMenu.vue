<template>
    <div class="d-flex ">
        <div class="p-2">
            <button v-if="startServicesDisabled" class="btn btn-success" id="btnIni" @click="startServices()">
                Iniciar Atendimento
            </button>
        </div>
        <div class="p-2">
            <button v-if="!startServicesDisabled" class="btn btn-primary" @click="openModal()">
                Transferir
            </button>
        </div>
        <div class="p-2">
            <button v-if="!startServicesDisabled" class="btn btn-danger" @click="finishService()">
                Finalizar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from '../stores/Store'
import { apiPost } from "../services/apiServices";
import swal from '../util/swal'

const pinia = useStore();
let codUser = localStorage.getItem("codUsuario");

const startServices = computed(() => async () => {
    const response = ref();
    let usuarioAtendente = `${pinia.usuarioAtendente}`;
    if (usuarioAtendente == "0" || usuarioAtendente !== codUser) {
        const atendimento = {
            CodAtendimento: pinia.codAtendimento,
            DataHoraAtendimento: new Date(),
            usuarioAtendente: codUser,
            status: '-1'
        };
        response.value = await apiPost("/Home/updateCodUsuario", atendimento);
        if (
            response.value == 0 ||
            response.value == "" ||
            response.value == undefined
        ) {
            console.log("Bad Request updateCodUsuario");
            return;
        }
        else {
            // Remove todas as mensagens recebidas anteriormente 
            // pinia.messagesReceive.splice(0, pinia.messagesReceive.length);
            // // Chama a função que recupera as mensagens do atendimento atualizado
            // await MensegeRetril();
            pinia.setClicked(true);
        }
    }

});

const openModal = computed(() => async () => {
    pinia.openModal(true);
});

const startServicesDisabled = computed(() => {
    return pinia.getIsStartServicesDisabled();
});

const finishService = async () => {
    const response = ref();

    const atendimento = {
        CodAtendimento: pinia.codAtendimento,
        DataHoraAtendimento: new Date(),
        usuarioAtendente: codUser,
        status: '1'
    };
    response.value = await apiPost("/Home/updateCodUsuario", atendimento);
    if (response.value.length <= 0) {
        console.log("Bad Request updateCodUsuario");
        swal.error('<p>Erro ao Finalizar<p>');
    }
    // await MensegeRetril();
    pinia.messagesReceive.splice(0, pinia.messagesReceive.length);
    pinia.author = '';
    pinia.codAtendimento = '';
    pinia.isSendMsgDisabled = true;
    swal.success('<p>Atendimento Finalizado<p>');
};

</script>

<style scoped>
.disabled {
    pointer-events: none;
    opacity: 0.5;
}
</style>
