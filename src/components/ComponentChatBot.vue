<template>
  <div class="p-2">
    <section class="chat-area" ref="myContainer" @scroll="handleScroll">
      <div v-for="date in uniqueDates" :key="date">
        <div class="date-divider">{{ formatDate(new Date(date)) }}</div>
        <div v-for="(message, index) in messagesReceive" :key="index">
          <div v-if="message.data == date"
            :class="{ 'message-out': message.author == message.nomeUsuarioEnvio, 'message-in': message.author !== message.nomeUsuarioEnvio && message.body !== '' }">
            <div class="mb-3 d-flex align-items-end"
              :class="{ 'my-mouth': message.author == message.nomeUsuarioEnvio, 'your-mouth': message.author !== message.nomeUsuarioEnvio && message.body !== '' }">
            </div>
            <span class="">{{ message.nomeUsuarioEnvio ?? message.author }}</span>
            <p></p>
            <!-- check if message is a text message -->
            <div v-if="message.contentType === 'text' || message.contentType === 'Text'" class="textoMensagem">
              <p v-if="!message.body.match(urlRegex)">{{ message.body }}</p>
              <div v-if="message.body.match(urlRegex)">
                <a :href="message.body" :src="message.body" target="_blank">{{ message.body }}</a>
              </div>
            </div>
            <!-- check if message is an image -->
            <img class="img-fluid" v-if="message.contentType == 'image' || message.contentType == 'Image'"
              style="height: 200px; width: auto; cursor: pointer;"
              :src="`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`" alt="imagem"
              @click="openModalImg(`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`)">
            <!-- check if message is a video -->
            <div v-if="message.contentType === 'video' || message.contentType === 'Video'" style="max-width: 3px;">
              <VideoPlay
                :videoUrl="`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`"
                alt="Video thumbnail" />
            </div>
            <!-- check if message is a Document -->
            <div v-if="message.contentType === 'document' || message.contentType === 'Document'">
              <img src="../../public/pdf.png" style="height: 80px; width: auto; cursor: pointer;" alt=""
                @click="openModalPdf(`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`)" />
            </div>
            <div v-if="message.contentType === 'Word' || message.contentType === 'word'">
              <img src="../../public/word-logo-0.png" style="height: 80px; width: auto; cursor: pointer;" alt=""
                @click="openModalOffice(`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`)" />
            </div>
            <div v-if="message.contentType === 'Excel' || message.contentType === 'excel'">
              <img src="../../public/excel-logo-0.png" style="height: 80px; width: auto; cursor: pointer;" alt=""
                @click="openModalOffice(`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`)" />
            </div>
            <div v-if="message.contentType === 'PowerPoint' || message.contentType === 'powerpoint'">
              <img src="../../public/microsoft-powerpoint-logo-0.png" style="height: 80px; width: auto; cursor: pointer;"
                alt=""
                @click="openModalOffice(`${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}`)" />
            </div>
            <!-- check if message is a Audio -->
            <div v-if="message.contentType === 'audio' || message.contentType === 'Audio'">
              <AudioPlayer
                :audio-url="message.body ? `${urlMedia}/Arquivos/A${('000000' + message.codAtendimento).slice(-6)}/${message.body}` : ''"
                :current-audio="currentAudio" />
            </div>
            <!-- check if message is a Location -->
            <div v-if="message.contentType === 'Location' || message.contentType === 'location'">
              <div style="cursor: pointer;">
                <Mapa :location="message.body"/>                
              </div>
            </div>
            <span class="metadata">
              <span :class="`${message.contentType !== 'Image' ? 'time' : 'timeToImage'}`">{{
                message.hora }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
    <button class="btn-down" v-if="!hiddeButton" @click="scrollToBottom"><i class="fas fa-chevron-down"></i></button>
    <div :class="{ 'disabled': isSendMsgDisabled || startServicesDisabled }">
      <div class="d-flex">
        <div class="p-2 align-self-center dropdownMedia">
          <DropDownLits />
        </div>
        <div class="p-2 flex-fill">
          <form @submit.prevent="sendMessage('out')" id="person1-form">
            <div class="input-group mb-3 pt-2">
              <input v-model="serverMessage" type="text" class="form-control" placeholder="Mensagem" />
              <button class="btn btn-outline-light" type="submit">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from "vue";
import { apiPost } from "../services/apiServices";
import moment from "moment";
import { useStore } from "../stores/Store";
import AudioPlayer from "./AudioPlayer.vue";
import VideoPlay from "./VideoPlay.vue";
import DropDownLits from "./DropDownLits.vue";
import Mapa from './MapsMsgViewer.vue';

type CodUsuario = number;
interface IMessagesReceive {
  body: string;
  author: string;
  to: string;
  hora: string;
  data: string;
  telefone: string;
  codAtendimento: string;
  codMensagem: string;
  usuarioEnvio: any;
  nomeUsuarioEnvio: any;
  usuarioAtendente: any;
  status: string;
  contentType: string;
};

const urlMedia = `https://${location.hostname}`; //`https://f856c08fd11e5470a3d7b13458906e70.loophole.site`;
const store = useStore();
const hiddeButton = ref<boolean>(false)
const serverMessage = ref<any>("");
let nomeUser = localStorage.getItem("NomeUsuario");
const codUser: CodUsuario = localStorage.getItem(
  "codUsuario"
) as unknown as CodUsuario;
const myContainer = ref<HTMLElement>();
const hideButton = reactive({ value: true });
const currentAudio = ref();
const urlRegex = /(https?:\/\/[^\s]+)/g;

/**
 * @summary Define uma variável reativa que armazena as mensagens recebidas
 *
 * @returns {IMessagesReceive[]} Array contendo informações da mensagem
 */
const messagesReceive = computed<IMessagesReceive[]>(() => {
  const messages = ref();
  // Obtém todas as mensagens do armazenamento de dados
  messages.value = store.getMessages();
  const messageUser = ref();
  // Cria um array para armazenar as mensagens filtradas
  messageUser.value = messages.value.filter((m: any) => {
    // Filtra as mensagens que atendem aos seguintes critérios:
    return (m.body !== "" && m.codAtendimento == store.codAtendimento && (m.usuarioAtendente == 0 || m.usuarioAtendente == codUser));
  });
  // Retorna o array de mensagens filtradas
  return messageUser.value;
});

const uniqueDates = computed(() => {
  let data = [...new Set(messagesReceive.value.map(message => message.data))];
  return data
});

/**
 * @summary Foramta a data
 * 
 * @param String recebe uma string no formado MM/DD/YYYY 
 *
 * @returns {String} Retorna a data no formato DD/MM/YYYY
 */
const formatDate = (date: any) => {
  moment.locale('pt-br');
  return moment(date).format("DD/MM/YYYY");
}

// Define uma variável reativa que indica se a opção de enviar mensagem está desabilitada
const isSendMsgDisabled = computed(() => {
  return store.getIsSendMsgDisabled();
});

const startServicesDisabled = computed(() => {
  return store.getIsStartServicesDisabled();
});

// Abre o modal para visualizar PDF
const openModalPdf = (body: string) => {
  store.IsOpenPdf(true);
  store.PdfUrl(body);
};
const openModalOffice = (body: string) => {
  store.IsOpenDocument(true);
  store.DocumentUrl(body);
};
// Abre o modal para visualizar imagem
const openModalImg = (body: string) => {
  store.IsOpenImg(true);
  store.ImgUrl(body);
};

/**
 * @summary Envia uma mensagem de texto via API do WhatsApp.
 * 
 * @async
 * @param {string} direction - A direção da mensagem, "in" ou "out".
 * @returns {Promise<void>} - Retorna uma promise vazia.
 */
 const sendMessage = async (direction:string) => {
  // Cria um objeto com as informações da mensagem
  const msg = {
    RecipientPhoneNumber: "55" + store.tel,
    Mensagem: serverMessage.value,
    codAtendimento: store.codAtendimento,
    DataHoraMensagem: moment(new Date()),
    usuarioEnvio: codUser,
    tipo: "Text",
  };
  
  // Envia a mensagem via API
  const returno = await apiPost("/Home/SendWhatsAppTextMessage", msg);
  
  // Verifica se a mensagem foi enviada com sucesso
  if (returno !== 0) {
    // Se a mensagem foi enviada com sucesso, adiciona-a ao array de mensagens
    if (direction === "out") {
      store.addMessage({
        body: serverMessage.value,
        author: nomeUser,
        to: store.author,
        hora: moment(new Date()).format("HH:mm"),
        data: moment(new Date()).format('L'),
        telefone: store.tel,
        codMensagem: returno.codMsg,
        codAtendimento: store.codAtendimento,
        usuarioEnvio: codUser,
        nomeUsuarioEnvio: nomeUser,
        usuarioAtendente: codUser,
        status: "-1",
        contentType: "Text",
      } as IMessagesReceive);
    }
    
    // Limpa o campo de mensagem e a seleção de texto
    store.selectedText = "";
    serverMessage.value = "";
  }
};


const handleScroll = () => {
  if (!myContainer.value) {
    return;
  }

  // Verifique se o contêiner tem rolagem
  const hasScroll = myContainer.value.scrollHeight > myContainer.value.clientHeight;

  if (hasScroll) {
    // Verifique se o usuário chegou ao final do scroll
    if (myContainer.value.scrollTop + myContainer.value.clientHeight >= myContainer.value.scrollHeight) {
      hideButton.value = true;
      return;
    }

    hideButton.value = false;
  } else {
    hideButton.value = true;
  }
};

watch(store, () => {
  if (store.selectedText !== '') {
    serverMessage.value = '';
    serverMessage.value = store.selectedText;
  }
});

const scrollToBottom = () => {
  if (!myContainer.value) {
    return;
  }
  myContainer.value.scrollTop = myContainer.value.scrollHeight;
};

onMounted(() => {
  myContainer.value?.addEventListener('scroll', handleScroll)
})

onMounted(async () => {
});
</script>

<style scoped>
.hidden {
  opacity: 0;
}

.img-fluid {
  height: auto !important;
  width: 18.5vw !important;
  cursor: pointer !important;
}

.date-divider {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #999;
  margin: 10px 0;
  margin: 3rem;
}

.btn-down {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 1.875rem;
  height: 1.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  right: 1%;
  bottom: 12%;
  opacity: 0.4;
}

.btn-down i {
  font-size: 12px;
}

.btn-down:hover {
  background-color: var(--primary);
  color: #fff;
  transform: translateY(0.5rem);
  cursor: pointer;
}

.btn-down i:hover {
  color: #fff;
}

.semSelecao {
  -webkit-user-select: none;
  /* webkit (safari, chrome) browsers */
  -moz-user-select: none;
  /* mozilla browsers */
  -ms-user-select: none;
  /* IE10+ */
  user-select: none;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dropdownMedia {
  position: relative;
  display: inline-block;
  right: 0.4em;
}

.dropdownMedia a:hover {
  background-color: #2d76b4;
  border-color: transparent transparent #fff !important;
  color: #fff;
  isolation: isolate;
}


.attach {
  color: white;
  font-size: 1.3rem;
  transition: 0.2s ease-out;
}

.attach:hover {
  color: var(--primary);
  transform: translateY(0.5rem);
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.modal iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.chat-area::-webkit-scrollbar {
  width: 12px;
}

.chat-area::-webkit-scrollbar-track {
  background-color: rgba(18, 24, 34, 0.26);
  border-radius: 12px;
}

.chat-area::-webkit-scrollbar-thumb {
  background-color: var(--dark);
  ;
  border-radius: 20px;
  border: 3px solid #021a2e;
}

.headline {
  text-align: center;
  font-weight: 100;
  color: white;
}

.chat-area {
  backdrop-filter: blur(25px) saturate(82%);
  -webkit-backdrop-filter: blur(25px) saturate(82%);
  background-color: rgba(17, 25, 40, 0.26);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  height: 80vh;
  padding-top: 1em;
  padding-left: 1em;
  padding-right: 1em;
  overflow-x: hidden;
  overflow-y: auto;
  max-width: auto;
  margin: 0 auto 0 auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}

.message {
  width: 45%;
  border-radius: 10px;
  padding: 0.5em;
  /*   margin-bottom: .5em; */
  font-size: 0.8em;
}

.message-in {
  background: #2d76b4;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top-left-radius: 6px;
  margin-right: auto;
  margin-left: 0;
  margin-top: 2rem;
  margin-bottom: 2rem;
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  word-wrap: break-word;
  max-width: 20vw;
  position: relative;
}

.your-mouth {
  width: 0;
  height: 0;
  border-bottom: 10px solid #2d76b4;
  border-left: 10px solid transparent;
  position: absolute;
  bottom: -16px;
  left: -10px !important;
}

.message-out {
  background-color: #194162;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  border-top-right-radius: 6px;
  color: white;
  margin-right: 0;
  margin-left: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
  width: auto;
  max-width: 30vw;
  word-wrap: break-word;
  position: relative;

}

.my-mouth {
  width: 0;
  height: 0;
  border-bottom: 10px solid #194162;
  border-right: 10px solid transparent;
  position: absolute;
  bottom: -16px;
  right: -10px !important;
}

.chat-inputs {
  display: flex;
  justify-content: space-between;
}

#person1-form {
  max-width: 95vw;
  height: auto;
  margin: 0.3rem auto 0 auto;
}

#mySidebar {
  display: none;
}

.metadata .time {
  color: rgba(255, 255, 255, 0.692);
  font-size: 11px;
  display: inline-block;
}

.metadata .timeToImage {
  color: rgba(255, 255, 255, 0.692);
  font-size: 11px;
  display: inline-block;
  position: relative;
  padding-left: 1rem;
}

.pdf-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.pdf-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 2em;
  color: #ccc;
}

.pdf-placeholder i {
  display: block;
  font-size: 3em;
  margin-bottom: 0.5em;
}

@media (max-height: 800px) {
  .chat-area {
    height: 75vh;
  }

  .btn-down {
    bottom: 15%;
  }

}

input[type="text"],
textarea {
  outline: none;
  box-shadow: none !important;
  border: 1px solid #ccc !important;
}
</style>