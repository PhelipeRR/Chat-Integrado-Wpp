<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div>
      <aside :class="{ 'is-expanded': is_expanded, 'isLight': !isDark }">
        <div class="logo">
          <img id="imgLogo" :src="!isDark ? '../../public/logoLogin.png': '../../public/logo.png'" alt="Vue" />
        </div>
        <h3>Atendimentos</h3>
        <div v-show="!mostrarContatos">
          <section class="discussions">
            <div class="d-flex flex-column mb-3">
              <div class="chatlist">
                <div class="modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="chat-header">
                      <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                          <button class="nav-link active" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open"
                            type="button" role="tab" aria-controls="Open" aria-selected="true">
                            Aguardando ({{
                              messagesReceiveNewAtendimento.filter(
                                (x) => x.author !== nomeUser
                              ).length
                            }})
                          </button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button ref="myButtonTab" class="nav-link" id="Closed-tab" data-bs-toggle="tab"
                            data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed"
                            aria-selected="false">
                            Em Atendimento ({{
                              messagesReceiveOldAtendimento.filter((x) => x.author !== nomeUser && x.author !==
                                x.nomeUsuarioEnvio &&
                                x.status == '-1' && x.usuarioAtendente == codUser).length
                            }})
                          </button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button class="nav-link" id="finish-tab" data-bs-toggle="tab" data-bs-target="#finish"
                            type="button" role="tab" aria-controls="finish" aria-selected="false">
                            Finalizados ({{ numArrays }})
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div ref="" class="modal-body">
                      <!-- chat-list -->
                      <div class="chat-lists">
                        <div class="tab-content" id="myTabContent">
                          <div class="tab-pane fade show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                            <div class="discussion search"></div>
                            <!-- chat-list New -->
                            <div ref="carMsg" class="cardMsg" v-for="( messages, index) in messagesReceiveNewAtendimento"
                              :key="index" @click.prevent="selectedContact(messages)">
                              <div v-if="
                                index === 0 ||
                                (messages.author !==
                                  messagesReceiveNewAtendimento[index - 1]
                                    .author &&
                                  messages.author !== nomeUser &&
                                  messages.status == '0')
                              " @click="isSendMsgDisabledFalse()">
                                <div v-if="messages.body != ''">
                                  <div class="discussion message-active">
                                    <div>
                                      <img class="photo" src="../../public/blank-profile.png" />
                                    </div>
                                    <div class="desc-contact">
                                      <p class="name">{{ messages.author }}</p>
                                      <p class="message">
                                        {{ messages.contentType == "Image" ? "Imagem" : messages.contentType == "Video" ? "Video" : messages.contentType == "Document" ? "Documento" : messages.contentType == "Audio" ? "Áudio" : messages.contentType == "Excel" ? "Documento" : messages.contentType == "PowerPoint" ? "Documento" : messages.contentType == "Word" ? "Documento" : messages.contentType == "Location" ? "Localização" : messages.body }}
                                      </p>
                                      <p> {{ messages.codAtendimento }}</p>
                                    </div>
                                    <div class="timer">
                                      {{ formatDate(new Date(messages.data + ' ' + messages.hora)) }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- chat-list New-->
                          </div>
                          <div class="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">
                            <div class="discussion search"></div>
                            <!-- chat-list Old -->
                            <div ref="carMsg" class="cardMsg" v-for="(messages, index) in messagesReceiveOldAtendimento"
                              :key="index" @click.prevent="selectedContact(messages)">
                              <div v-if="
                                index === 0 ||
                                (messages.author !== nomeUser && messages.author !== messages.nomeUsuarioEnvio)
                              " @click="isSendMsgDisabledFalse()">
                                <div v-if="messages.body != ''">
                                  <div class="discussion message-active">
                                    <div>
                                      <img class="photo" src="../../public/blank-profile.png" />
                                    </div>
                                    <div class="desc-contact">
                                      <p class="name">{{ messages.author }}</p>
                                      <p class="message">
                                        {{ messages.contentType == "Image" ? "Imagem" : messages.contentType == "Video" ? "Video" : messages.contentType == "Document" ? "Documento" : messages.contentType == "Audio" ? "Áudio" : messages.contentType == "Excel" ? "Documento" : messages.contentType == "PowerPoint" ? "Documento" : messages.contentType == "Word" ? "Documento" : messages.contentType == "Location" ? "Localização" : messages.body }}
                                      </p>
                                    </div>
                                    <div class="timer">
                                      {{ formatDate(new Date(messages.data + ' ' + messages.hora)) }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- chat-list Old -->
                          </div>
                          <div class="tab-pane fade" id="finish" role="tabpanel" aria-labelledby="finish-tab">
                            <div class="discussion search"></div>
                            <!-- chat-list finalizado -->
                            <div v-for="(messages, index ) in messagesReceiveFinishAtendimento" :key="index">
                              <div ref="carMsg" v-for="(message, indice ) in messages" :key="indice" class="cardMsg"
                                @click.prevent="selectedContact(message)">
                                <div
                                  v-if="(indice === messages.length - 1 && message.author !== nomeUser) || (Array.isArray(messages[message.codAtendimento]))"
                                  @click="isSendMsgDisabled()">
                                  <div v-if="message.body != ''">
                                    <div class="discussion message-active">
                                      <div>
                                        <img class="photo" alt="" src="../../public/blank-profile.png" />
                                      </div>
                                      <div class="desc-contact">
                                        <p class="name">{{ message.author }}</p>
                                        <p class="message">
                                          {{ message.contentType == "Image" ? "Imagem" : message.contentType == "Video" ? "Video" : message.contentType == "Document" ? "Documento" : message.contentType == "Audio" ? "Áudio" : message.contentType == "Excel" ? "Documento" : message.contentType == "PowerPoint" ? "Documento" : message.contentType == "Word" ? "Documento" : message.contentType == "Location" ? "Localização" : message.body }}
                                        </p>
                                        <p> {{ messages.codAtendimento }}</p>
                                      </div>
                                      <div class="timer">
                                        {{ formatDate(new Date(message.data + ' ' + message.hora)) }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- chat-list finalizado -->
                          </div>
                        </div>
                      </div>
                      <!-- chat-list -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import SignalRReceiver from "../services/signalr-receiver";
import moment from "moment";
import { useStore } from "../stores/Store";
import { apiPost } from "../services/apiServices";
import useNotification from '../util/useNotification'

moment.locale();
let numArrays = 0;
let nomeUser = localStorage.getItem("NomeUsuario");
let codUser = localStorage.getItem("codUsuario");
const signalRReceiver = new SignalRReceiver();
const is_expanded = ref(localStorage.getItem("is_expanded") === "true");
const mostrarContatos = ref<boolean>(false);
const store = useStore();
const messagesReceiveNewAtendimento = ref<Array<any>>([]);
const messagesReceiveOldAtendimento = ref<Array<any>>([]);
const messagesReceiveFinishAtendimento = ref<any>();
const myButtonTab = ref<any>(null);
const { showNotification } = useNotification()
// Função que desativa o botão de enviar mensagem
const isSendMsgDisabled = (): void => {
  store.IsSendMsgDisabled(true);
};

// Função que ativa o botão de enviar mensagem
const isSendMsgDisabledFalse = (): void => {
  store.IsSendMsgDisabled(false);
};

const formatDate = (date: any) => {
  const messageDate = moment(date);
  const today = moment();
  const yesterday = moment().subtract(1, 'day');

  if (messageDate.isSame(today, 'day')) {
    return messageDate.format('HH:mm');
  } else if (messageDate.isSame(yesterday, 'day')) {
    return 'Ontem';
  } else {
    return messageDate.format('DD/MM/YYYY');
  }
}


// Função que seleciona um contato
const selectedContact = computed(() => async (author: any) => {
  // Define o nome do autor da mensagem selecionado
  store.author = author.author;
  // Define o telefone do autor da mensagem selecionado
  store.tel = author.telefone;
  // Define o código do atendimento do autor da mensagem selecionado
  store.codAtendimento = author.codAtendimento;
  // Verifica se o usuário do atendente do autor da mensagem selecionado é igual a zero
  if (author.usuarioAtendente == "0") {
    // Desativa o botão para iniciar serviços
    store.IsStartServicesDisabled(true);
  } else {
    // Ativa o botão para iniciar serviços
    store.IsStartServicesDisabled(false);
  }
});


const PushNewMessage = () => {
  // Obtém todas as mensagens da loja (store) e mapeia para um novo array com objetos vazios para cada propriedade.
  const storeMap = store.getMessages().map((a: any) => {
    let obj = {
      body: "",
      author: "",
      to: "",
      hora: "",
      data: "",
      telefone: "",
      codAtendimento: "",
      codMensagem: "",
      usuarioEnvio: "",
      nomeUsuarioEnvio: "",
      usuarioAtendente: "",
      status: "",
      contentType: "",
    };
    // Se a mensagem não estiver vazia e não tiver sido enviada pelo usuário, atualiza o objeto com as propriedades da mensagem.
    if (a.author != "" && a.status == "0") {
      obj = { ...a };
    }
    return obj;
  });

  // Cria um novo array vazio para armazenar as mensagens do atendimento.
  const storeArray: any[] = [];
  // Percorre cada mensagem no array mapeado anteriormente.
  storeMap.forEach((a: any) => {
    // Se a mensagem tiver um autor, status "0" e não estiver vazia...
    if (a.author !== "" && a.status == "0") {
      // Se o array de armazenamento estiver vazio, adiciona a mensagem.
      if (storeArray.length === 0) {
        storeArray.push(a);
        // Caso contrário, verifica se já há uma mensagem do mesmo autor no array de armazenamento.
      } else if (storeArray.some((b) => b.author === a.author)) {
        // Se já houver, atualiza as propriedades da mensagem no array de armazenamento.
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].hora = a.hora;
        storeArray[storeArray.findIndex((c) => c.author === a.author)].body =
          a.body;
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].usuarioAtendente = a.usuarioAtendente;
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].usuarioEnvio = a.usuarioEnvio;
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].codMensagem = a.codMensagem;
        storeArray[storeArray.findIndex((c) => c.author === a.author)].status =
          a.status;
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].contentType = a.contentType;
        storeArray[
          storeArray.findIndex((c) => c.author === a.author)
        ].data = a.data;
        // Se não houver mensagem do mesmo autor no array de armazenamento, adiciona a mensagem.
      } else {
        storeArray.push(a);
      }
    }
  });

  // Atualiza o array de mensagens novas do atendimento.
  messagesReceiveNewAtendimento.value = storeArray;
};

const PushOldMessege = () => {
  // Obtém todas as mensagens da loja (store) e mapeia para um novo array com objetos vazios para cada propriedade.
  const storeMapOld = store.getMessages().map((a: any) => {
    let obj = {
      body: "",
      author: "",
      to: "",
      hora: "",
      data: "",
      telefone: "",
      codAtendimento: "",
      codMensagem: "",
      usuarioEnvio: "",
      nomeUsuarioEnvio: "",
      usuarioAtendente: "",
      status: "",
      contentType: "",
    };
    // Se a mensagem não estiver vazia e não tiver sido enviada pelo usuário, atualiza o objeto com as propriedades da mensagem.
    if (a.author != "" && a.status == "-1") {
      obj = { ...a };
    }
    return obj;
  });
  // Cria um novo array vazio para armazenar as mensagens do atendimento.
  const storeArrayOld: any[] = [];
  // Percorre cada mensagem no array mapeado anteriormente.
  storeMapOld.forEach((a: any) => {
    if (a.usuarioAtendente == codUser && a.status == "-1" && a.body !== "") {
      // Se o array de armazenamento estiver vazio, adiciona a mensagem.
      if (storeArrayOld.length === 0) {
        storeArrayOld.push(a);
        // Caso contrário, verifica se já há uma mensagem do mesmo autor no array de armazenamento.
      } else if (storeArrayOld.some((b) => b.author === a.author)) {
        // Se já houver, atualiza as propriedades da mensagem no array de armazenamento.
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].hora = a.hora;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].body = a.body;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].usuarioAtendente = a.usuarioAtendente;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].usuarioEnvio = a.usuarioEnvio;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].codMensagem = a.codMensagem;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].status = a.status;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].contentType = a.contentType;
        storeArrayOld[
          storeArrayOld.findIndex((c) => c.author === a.author)
        ].data = a.data;
        // Se não houver mensagem do mesmo autor no array de armazenamento, adiciona a mensagem.
      } else {
        storeArrayOld.push(a);
      }
    }
  });
  // Atualiza o array de mensagens novas do atendimento.
  messagesReceiveOldAtendimento.value = storeArrayOld;
};

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
interface MessageMap {
  [key: string]: IMessagesReceive[];
}
const isDark = computed(() => {
  return store.getIsDark();
})
const PushFinishMessege = () => {
  const storeMapFinish = store.getMessages();
  const messageMap: MessageMap = storeMapFinish.reduce(
    (acc: MessageMap, current: IMessagesReceive) => {
      if (current.status == "1" && current.usuarioAtendente == codUser && current.author !== nomeUser) {
        if (!acc[current.codAtendimento]) {
          acc[current.codAtendimento] = [];
        }
        acc[current.codAtendimento].push(current);
      }
      return acc;
    },
    {}
  );
  // Atualiza o array de mensagens novas do atendimento.
  messagesReceiveFinishAtendimento.value = messageMap;
  numArrays = 0;
  for (const key in messagesReceiveFinishAtendimento.value) {
    if (Array.isArray(messagesReceiveFinishAtendimento.value[key])) {
      numArrays++;
    }
  }
};

const ReceiveMsgSignalR = () => {
  // Define a função que será chamada sempre que uma nova mensagem for recebida via SignalR
  signalRReceiver.onMessageReceived((receiveMessage: any) => {
    store.messagesReceive.splice(0, store.messagesReceive.length);
    receiveMessage.forEach((a: any) => {
      // Adiciona a mensagem recebida à store de mensagens
      store.addMessage({ //Adiciona uma nova mensagem à store usando o método "addMessage"
        body: a.mensagem, //Corpo da mensagem
        author: //Autor da mensagem, dependendo do usuário que enviou
          a.usuarioEnvio !== 0 ? a.nomeUsuarioEnvio : `${a.ddd + a.telefone} ~ ${a.nome}`,
        to: //Destinatário da mensagem, dependendo do usuário que enviou
          a.nomeUsuarioEnvio !== null ? `${a.ddd + a.telefone} ~ ${a.nome}` : nomeUser,
        hora: moment(a.dataHoraMensagem).format("HH:mm"), //Data e hora da mensagem no formato "HH:mm"
        data: moment(a.dataHoraMensagem).format('L'),
        telefone: a.ddd + a.telefone, //Telefone do remetente da mensagem
        codAtendimento: a.codAtendimento, //Código do atendimento relacionado à mensagem
        codMensagem: a.codMensagem, //Código da mensagem
        usuarioEnvio: a.usuarioEnvio, //Código do usuário que enviou a mensagem
        nomeUsuarioEnvio: a.nomeUsuarioEnvio, //Nome do usuário que enviou a mensagem, se for o cliente, será null
        usuarioAtendente: a.usuarioAtendente, //Código do usuário atendente do atendimento
        status: a.status, //Status da mensagem
        contentType: a.tipo, //Tipo de conteúdo da mensagem
      });
    });
  });
  // Define a quantidade de mensagens em atendimento
  store.quantidadeEmAtendimento = messagesReceiveNewAtendimento.value.filter(
    (x) => x.author !== nomeUser
  ).length;
};

const ReceiveUpdadeUsersSignalR = () => {
  // Define a função que será chamada sempre que houver atualização nos usuários via SignalR
  signalRReceiver.loadUpdateUsers((receiveMessage: any) => {
    // Remove todas as mensagens da store de mensagens
    store.messagesReceive.splice(0, store.messagesReceive.length);
    // Adiciona as mensagens recebidas à store de mensagens
    receiveMessage.forEach((a: any) => {
      store.addMessage({ //Adiciona uma nova mensagem à store usando o método "addMessage"
        body: a.mensagem, //Corpo da mensagem
        author: //Autor da mensagem, dependendo do usuário que enviou
          a.usuarioEnvio !== 0 ? a.nomeUsuarioEnvio : `${a.ddd + a.telefone} ~ ${a.nome}`,
        to: //Destinatário da mensagem, dependendo do usuário que enviou
          a.nomeUsuarioEnvio !== null ? `${a.ddd + a.telefone} ~ ${a.nome}` : nomeUser,
        hora: moment(a.dataHoraMensagem).format("HH:mm"), //Data e hora da mensagem no formato "HH:mm"
        data: moment(a.dataHoraMensagem).format('L'),
        telefone: a.ddd + a.telefone, //Telefone do remetente da mensagem
        codAtendimento: a.codAtendimento, //Código do atendimento relacionado à mensagem
        codMensagem: a.codMensagem, //Código da mensagem
        usuarioEnvio: a.usuarioEnvio, //Código do usuário que enviou a mensagem
        nomeUsuarioEnvio: a.nomeUsuarioEnvio, //Nome do usuário que enviou a mensagem, se for o cliente, será null
        usuarioAtendente: a.usuarioAtendente, //Código do usuário atendente do atendimento
        status: a.status, //Status da mensagem
        contentType: a.tipo, //Tipo de conteúdo da mensagem
      });
    });
  });
  // Define a quantidade de mensagens em atendimento
  store.quantidadeEmAtendimento = messagesReceiveNewAtendimento.value.filter(
    (x) => x.author !== nomeUser
  ).length;
};

watch(store, () => {  //Observa as alterações na store e executa a função de callback
  if (store.clicked) { //Verifica se a propriedade "clicked" é verdadeira
    myButtonTab.value?.click(); //Clica no botão "myButtonTab" se ele existir
    store.setClicked(false); //Define a propriedade "clicked" como falsa usando o método "setClicked" da store
    store.IsStartServicesDisabled(false); //Define a propriedade "IsStartServicesDisabled" como falsa usando a store
  }
  PushNewMessage(); //Adiciona novas mensagens na interface
  PushOldMessege(); //Adiciona mensagens antigas na interface
  PushFinishMessege(); //Adiciona mensagens finalizadas na interface
});

const MensegeRetril = async () => { //Define uma função assíncrona chamada "MensegeRetril"
  const resposta: any = await apiPost("/Home/MessageRetrieve", { codUser }); //Envia uma requisição POST para a API e aguarda a resposta
  resposta.forEach((a: any) => { //Itera sobre cada item da resposta
    store.addMessage({ //Adiciona uma nova mensagem à store usando o método "addMessage"
      body: a.mensagem, //Corpo da mensagem
      author: //Autor da mensagem, dependendo do usuário que enviou
        a.usuarioEnvio !== 0 ? a.nomeUsuarioEnvio : `${a.ddd + a.telefone} ~ ${a.nome}`,
      to: //Destinatário da mensagem, dependendo do usuário que enviou
        a.nomeUsuarioEnvio !== null ? `${a.ddd + a.telefone} ~ ${a.nome}` : nomeUser,
      hora: moment(a.dataHoraMensagem).format("HH:mm"), //Data e hora da mensagem no formato "HH:mm"
      data: moment(a.dataHoraMensagem).format('L'),
      telefone: a.ddd + a.telefone, //Telefone do remetente da mensagem
      codAtendimento: a.codAtendimento, //Código do atendimento relacionado à mensagem
      codMensagem: a.codMensagem, //Código da mensagem
      usuarioEnvio: a.usuarioEnvio, //Código do usuário que enviou a mensagem
      nomeUsuarioEnvio: a.nomeUsuarioEnvio, //Nome do usuário que enviou a mensagem, se for o cliente, será null
      usuarioAtendente: a.usuarioAtendente, //Código do usuário atendente do atendimento
      status: a.status, //Status da mensagem
      contentType: a.tipo, //Tipo de conteúdo da mensagem
    });
  });
  store.quantidadeEmAtendimento = messagesReceiveNewAtendimento.value.filter( //Atualiza a propriedade "quantidadeEmAtendimento" da store
    (x) => x.author !== nomeUser //Filtrando as mensagens recebidas pelo usuário
  ).length;
};

onMounted(() => { //Executa essa função após o componente ser montado
  localStorage.setItem("is_expanded", "true"); //Define um valor no localStorage
  MensegeRetril(); //Chama a função "MensegeRetril"
  ReceiveMsgSignalR(); //Configura a conexão SignalR para receber mensagens
  ReceiveUpdadeUsersSignalR(); //Configura a conexão SignalR para atualizar os usuarios
});
</script>

<style lang="scss" scoped>
.modal-body {
  max-height: 47rem;
  overflow: auto;
}

.modal-body::-webkit-scrollbar {
  width: 12px;
}

.modal-body::-webkit-scrollbar-track {
  background-color: rgba(18, 24, 34, 0.26);
  border-radius: 12px;

}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #021a2e;
  ;
  border-radius: 20px;
  border: 0;
}

.nav-tabs {
  border-bottom: 0;
  font-size: 0.7rem;
  width: 30rem;
}

.nav-link {
  padding: 0.3rem !important;
}

.chatlist {
  outline: 0;
  height: 100%;
  overflow: hidden;
  width: 300px;
  float: left;
}

.chat-area .modal-content {
  border: none;
  border-radius: 0;
  outline: 0;
  height: 100%;
}

.chat-area .modal-dialog-scrollable {
  height: 100% !important;
}

.chatbox {
  width: auto;
  overflow: hidden;
  height: 100%;
  border-left: 1px solid #ccc;
}

.chat-header {
  padding-bottom: 0.8rem;
}

.chatbox .modal-dialog,
.chatlist .modal-dialog {
  max-width: 100%;
  margin: 0;
}

.msg-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-area .form-control {
  display: block;
  width: 80%;
  padding: 0.375rem 0.75rem;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #222;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.chat-area .form-control:focus {
  outline: 0;
  box-shadow: inherit;
}

a.add img {
  height: 36px;
}

.chat-area .nav-tabs {
  border-bottom: 1px solid #dee2e6;
  align-items: center;
  justify-content: space-between;
  flex-wrap: inherit;
}

.chat-area .nav-tabs .nav-item {
  width: 100%;
}

.nav-link:not(.active) {
  color: #fff !important;
}

.chat-area .nav-tabs .nav-link {
  width: 100%;
  color: #111111 !important;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-transform: capitalize;
  margin-top: 5px;
  margin-bottom: -1px;
  background: 0 0;
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.chat-area .nav-tabs .nav-item.show .nav-link,
.chat-area .nav-tabs .nav-link.active {
  color: #000 !important;
  background-color: #fff !important;
  border-color: transparent transparent #000 !important;
}

.chat-area .nav-tabs .nav-link:focus,
.chat-area .nav-tabs .nav-link:hover {
  border-color: transparent transparent #000;
  isolation: isolate;
}

.chat-list h3 {
  color: #222;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  text-transform: capitalize;
  margin-bottom: 0;
}

.chat-list p {
  color: #343434;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-transform: capitalize;
  margin-bottom: 0;
}

.chat-list a.d-flex {
  margin-bottom: 15px;
  position: relative;
  text-decoration: none;
  padding-top: 1.5rem;
}

.chat-list .active {
  display: block;
  content: "";
  clear: both;
  position: absolute;
  bottom: 3px;
  left: 34px;
  height: 12px;
  width: 12px;
  background: #00db75;
  border-radius: 50%;
  border: 2px solid #fff;
}

#upload {
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

@media (max-width: 767px) {
  .chat-icon {
    display: block;
    margin-right: 5px;
  }

  .chatlist {
    width: 100%;
  }

  .chatbox {
    width: 100%;
    position: absolute;
    left: 1000px;
    right: 0;
    background: #fff;
    transition: all 0.5s ease;
    border-left: none;
  }

  .showbox {
    left: 0 !important;
    transition: all 0.5s ease;
  }

  .msg-head h3 {
    font-size: 14px;
  }

  .msg-head p {
    font-size: 12px;
  }

  .msg-head .flex-shrink-0 img {
    height: 30px;
  }

  .send-box button {
    width: 28%;
  }

  .send-box .form-control {
    width: 70%;
  }

  .chat-list h3 {
    font-size: 14px;
  }

  .chat-list p {
    font-size: 12px;
  }

  .msg-body ul li.sender p {
    font-size: 13px;
    padding: 8px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .msg-body ul li.repaly p {
    font-size: 13px;
    padding: 8px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }
}

aside {
  display: flex;
  flex-direction: column;
  background-color: var(--dark);
  color: var(--light);
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;

  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  aside .discussions .discussion .name {}

  .discussions {
    height: 100vh;
    overflow: hidden;
    display: inline-block;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    max-width: 30rem;
  }

  .discussions .discussion {
    width: 100%;
    height: 20px;
    border-bottom: solid 1px #e0e0e0;
    display: flex;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .discussions .search {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e0e0e0;
    transition: opacity 0.3s ease-in-out;
  }

  .discussions .search .searchbar {
    height: 40px;
    background-color: #fff;
    width: 70%;
    padding: 0 20px;
    border-radius: 50px;
    border: 1px solid #eeeeee;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .discussions .search .searchbar input {
    margin-left: 15px;
    height: 38px;
    width: 100%;
    border: none;
    font-family: "Montserrat", sans-serif;
  }

  .discussions .search .searchbar *::-webkit-input-placeholder {
    color: #e0e0e0;
  }

  .discussions .search .searchbar input *:-moz-placeholder {
    color: #e0e0e0;
  }

  .discussions .search .searchbar input *::-moz-placeholder {
    color: #e0e0e0;
  }

  .discussions .search .searchbar input *:-ms-input-placeholder {
    color: #e0e0e0;
  }

  .discussions .message-active {
    width: 98.5%;
    height: 90px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .discussions .discussion .photo {
    margin-left: 5px;
    display: block;
    width: 45px;
    height: 45px;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .desc-contact {
    height: 43px;
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .discussions .discussion .name {
    margin: 0 0 0 20px;
    font-family: "Montserrat", sans-serif;
    font-size: 8pt;
    color: #fff;
  }

  .discussions .discussion .message {
    margin: 6px 0 0 20px;
    font-family: "Montserrat", sans-serif;
    font-size: 9pt;
    color: #fff;
  }

  .timer {
    margin-left: 15%;
    font-size: 0.7rem;
    padding: 64px 5px;
    color: #fff;
    border-radius: 15px;
  }

  .ms-auto {
    display: flex;
  }

  .chat {
    width: calc(65% - 85px);
  }

  .header-chat {
    background-color: #fff;
    height: 90px;
    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }

  .chat .header-chat .icon {
    margin-left: 30px;
    color: #515151;
    font-size: 14pt;
  }

  .chat .header-chat .name {
    margin: 0 0 0 20px;
    text-transform: uppercase;
    font-family: "Montserrat", sans-serif;
    font-size: 13pt;
    color: #515151;
  }

  .chat .header-chat .right {
    position: absolute;
    right: 40px;
  }

  .chat .messages-chat {
    padding: 25px 35px;
  }

  .chat .messages-chat .message {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .chat .messages-chat .message .photo {
    display: block;
    width: 45px;
    height: 45px;
    background: #e6e7ed;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .chat .messages-chat .text {
    margin: 0 35px;
    background-color: #f6f6f6;
    padding: 15px;
    border-radius: 12px;
  }

  .text-only {
    margin-left: 45px;
  }

  .time {
    font-size: 10px;
    color: lightgrey;
    margin-bottom: 10px;
    margin-left: 85px;
  }

  .response-time {
    float: right;
    margin-right: 40px !important;
  }

  .response {
    float: right;
    margin-right: 0px !important;
    margin-left: auto;
    /* flexbox alignment rule */
  }

  .response .text {
    background-color: #e3effd !important;
  }

  .footer-chat {
    width: calc(65% - 66px);
    height: 80px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    background-color: transparent;
    border-top: 2px solid #eee;
  }

  .chat .footer-chat .icon {
    margin-left: 30px;
    color: #c0c0c0;
    font-size: 14pt;
  }

  .chat .footer-chat .send {
    color: #fff;
    position: absolute;
    right: 50px;
    padding: 12px 12px 12px 12px;
    border-radius: 50px;
    font-size: 14pt;
  }

  .chat .footer-chat .name {
    margin: 0 0 0 20px;
    text-transform: uppercase;
    font-family: "Montserrat", sans-serif;
    font-size: 13pt;
    color: #515151;
  }

  .chat .footer-chat .right {
    position: absolute;
    right: 40px;
  }

  .write-message {
    border: none !important;
    width: 60%;
    height: 50px;
    margin-left: 20px;
    padding: 10px;
  }

  .footer-chat *::-webkit-input-placeholder {
    color: #6d6c6c;
    font-size: 13pt;
  }

  .footer-chat input *:-moz-placeholder {
    color: #fdfcfc;
    font-size: 13pt;
  }

  .footer-chat input *::-moz-placeholder {
    color: #fdfcfc;
    font-size: 13pt;
    margin-left: 5px;
  }

  .footer-chat input *:-ms-input-placeholder {
    color: #fdfcfc;
    font-size: 13pt;
  }

  .clickable {
    cursor: pointer;
  }

  .logo {
    margin-bottom: 1rem;

    img {
      width: 2rem;
      transition: width 0.5s, height 0.5s;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;

    .menu-toggle {
      transition: 0.2s ease-in-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: #fdfcfc;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    text-align: center;
    padding-top: 1.75rem;
    padding-bottom: 1.75rem;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;


      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }

  &.is-expanded {
    width: 21rem;

    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    section,
    .discussion {
      opacity: 100;
      overflow: hidden;
      transition: width 1s, height 1s;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    .footer {
      opacity: 0;
    }

    #imgLogo {
      height: auto;
      width: 10rem;
      transition: width 1s, height 1s;
    }
  }

  &.isLight {
    background-color: var(--light);
    color: var(--dark);

    h3 {
      color: var(--dark);
    }

    .nav-tabs .nav-item.show .nav-link,
    .nav-tabs .nav-link.active {
      color: var(--light);
      background-color: var(--dark);
      border-color: var(--dark);
    }

    .nav-link:not(.active) {
      color: var(--dark) !important;
    }

    .discussions .discussion {
      border-bottom: solid 1px var(--dark);
    }

    .discussions .discussion .name {
      color: var(--dark);
    }

    .discussions .discussion .message {
      color: var(--dark);
    }

    .timer {
      color: var(--dark);
    }
  }

  @media (max-width: 1024px) {
    z-index: 99;
  }

  input[type="text"],
  textarea {
    outline: none;
    box-shadow: none !important;
    border: 1px solid #fdfcfc !important;
  }
}</style>
