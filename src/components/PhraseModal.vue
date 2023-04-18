<template>
    <div>
        <div class="modal" v-if="isOpen">
            <div class="modal__overlay" @click="hideModal"></div>
            <div class="modal__content">
                <button class="modal__close" @click="hideModal">×</button>
                <div class="modal__header">
                    <h2 class="modal__title">Adicionar Frase</h2>
                    <i class="fas fa-question questioMark" title="Assistente"></i>
                </div>
                <div class="modal__body">
                    <div class="form-group">
                        <label for="phrase" class="labelPhModal">Frase:</label>
                        <textarea type="text" id="phrase" v-model="phrase"></textarea>>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-success" @click="addPhrase">Salvar</button>
                    </div>
                    <div class="form-group" v-if="isBtnShow">
                        <button class="btn btn-primary" @click="clearAdd">Novo</button>
                    </div>
                    <div class="form-group" v-if="isBtnShow">
                        <button class="btn btn-danger" @click="deletPhrase">Deletar</button>
                    </div>
                    <div>
                        <TabelaFrasePadraoVue />
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { apiPost, apiGet } from "../services/apiServices";
import SignalRReceiver from "../services/signalr-receiver";
import { useStore } from "../stores/Store";
import TabelaFrasePadraoVue from './TabelaFrasesPadrao.vue';

type CodUsuario = number;
const store = useStore();
const signalRReceiver = new SignalRReceiver();
const phrase = ref<string>('');
const codFrase = ref<number>(0);
const codUser: CodUsuario = localStorage.getItem("codUsuario") as unknown as CodUsuario;

const addPhrase = async () => {
    const msg = {
        texto: phrase.value,
        codTexto: codFrase.value,
        codUsuario: codUser
    };
    const returno = await apiPost("/Home/AddTextStandard", msg);
    if (returno > 0) {
        phrase.value = '';
        store.frase = '';
        store.codFrase = 0;
    }
};

const deletPhrase = async () => {
    const msg = {
        codTexto: codFrase.value,
    };
    const returno = await apiPost("/Home/DeletTextStandard", msg);
    if (returno > 0) {
        phrase.value = '';
        store.frase = '';
        store.codFrase = 0;
    }
};

const clearAdd = () => {
    phrase.value = '';
    store.frase = '';
    store.codFrase = 0;
};

const phrasesPush = async () => {
    const result = await apiGet("/Home/TextStandardRetrieve");
    result.forEach((e: any) => {
        store.addTextoPadrao({
            texto: e.texto, // texto padrão
            codTexto: e.codTexto, // codigo do texto
            codUsuario: e.codUsuario, // codUsuario criador/modificador
            dthrultmodificacao: e.dthrultmodificacao, // data e hora da criaçao/modificação
        });
    });
}

const ReceiveTextoPadraoSignalR = () => {
    signalRReceiver.loadTextoPadrao((loadTextoPadrao: any) => {
        store.textStandardReceive.splice(0, store.textStandardReceive.length);
        loadTextoPadrao.forEach((a: any) => {
            store.addTextoPadrao({
                texto: a.texto, // texto padrão
                codTexto: a.codTexto, // codigo do texto
                codUsuario: a.codUsuario, // codUsuario criador/modificador
                dthrultmodificacao: a.dthrultmodificacao, // data e hora da criaçao/modificação
            });
        });
    });
};

const isOpen = computed(() => {
    return store.getIsOpenPhrase();
});

const isBtnShow = computed(() => {
    if (store.codFrase !== 0) {
        return true;
    }
    else {
        return false;
    }
});

const hideModal = () => {
    store.frase = '';
    store.codFrase = 0;
    store.IsOpenPhrase(false);
}
watch(store, () => {
    phrase.value = store.frase;
    codFrase.value = store.codFrase;
});

onMounted(() => {
    ReceiveTextoPadraoSignalR();
    phrasesPush();
});
</script>
  
  
<style scoped>
.questioMark {
    color: #fff;
    margin-left: 90%;
    border: 1px solid #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
}

.questioMark:hover {
    color: var(--primary);
    border: 1px solid var(--primary);
    transform: translateY(0.5rem);
    cursor: pointer;
}

.labelPhModal {
    color: #fff;
    padding-right: 1rem;
}

#phrase {
    width: 18rem;
    max-width: 22rem;
}

.modal {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

}

.btnrevove {
    padding-bottom: 30px;
}

.modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.modal__content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 43.75rem;
    min-height: 25rem;
    background-color: var(--dark);
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.modal__header {
    /* display: flex; */
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
}

.modal__title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    padding-left: 35%;
}

.modal__remove {
    width: 23px;
    height: 23px;
    font-size: 23px;
    line-height: 20px;
    text-align: center;
    position: absolute;
    left: 91%;
    top: 1%;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #F55555;
    color: #313131;
    transition: all 0.2s ease;
    cursor: pointer;
    z-index: 1;
}

.modal__close {
    width: 36px;
    height: 36px;
    font-size: 36px;
    line-height: 24px;
    text-align: center;
    position: relative;
    left: 97%;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #F55555;
    color: #313131;
    transition: all 0.2s ease;
    cursor: pointer;
}

.modal_footer {
    padding-top: 5rem;
}

.modal__close:hover {
    color: white;
}

.modal__body {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    padding: 20px;
}

.modal__body::-webkit-scrollbar {
    width: 12px;
}

.modal__body::-webkit-scrollbar-track {
    background-color: rgba(18, 24, 34, 0.26);
    border-radius: 12px;
}

.modal__body::-webkit-scrollbar-thumb {
    background-color: #021a2e;
    ;
    border-radius: 20px;
    border: 0;
}

.modal__image {
    position: relative;
    width: 250px;
    height: 344px;
    margin: 10px;
    border: 2px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    background-color: #f9f9f9;
    box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 30%);
    overflow: hidden;
}

.modal__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.form-group {
    display: flex;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    align-items: center;
}
</style>
