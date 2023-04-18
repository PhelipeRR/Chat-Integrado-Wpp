<template>
  <div id="modal-template">
    <div class="modal" v-if="isVisible">
      <div class="modal-wrapper">
        <div class="modal-container">
          <content select=".modal-header">
            <div class="modal-header">
              <h3>
                Usuarios
              </h3>
            </div>
          </content>
          <div class="modal-body">
            <div>
              <div class="onLine">
                <p class="naoSelecionavel">Online</p>
                <hr />
                <div class="overOn">
                  <div v-for="user in onlineUsers" :key="user.codigo">
                    <input v-if="user.codigo !== '' && user.nome !== nomeUser" type="radio" :id="'user-' + user.codigo"
                      :value="user" v-model="selectedUser">
                    <label class="labelUser" :for="'user-' + user.codigo"
                      v-if="user.codigo !== '' && user.nome !== nomeUser">{{ user.nome
                      }}</label>
                  </div>
                </div>
              </div>
              <div class="offLine">
                <hr />
                <p class="naoSelecionavel">Offline</p>
                <hr />
                <div class="overOff">
                  <div v-for="user in offlineUsers" :key="user.codigo">
                    <label class="labelUser" v-if="user.codigo !== '' && user.nome !== nomeUser">{{ user.nome
                    }}</label>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
          <div class="modal-footer uk-clearfix">
            <button @click="submitModal" class="btn btn-success">Transferir</button>
            <button @click="closeModal" class="btn btn-danger">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup  lang="ts">
import { computed, ref, onMounted, onBeforeMount } from 'vue';
import { useStore } from '../stores/Store';
import { apiPost } from "../services/apiServices";
import moment from "moment";
import SignalRReceiver from "../services/signalr-receiver";
import swal from '../util/swal'

const signalRReceiver = new SignalRReceiver();

const pinia = useStore();
const selectedUser = ref<any>();
let nomeUser = localStorage.getItem("NomeUsuario");
let codUser = localStorage.getItem("codUsuario");
const onlineUsers = ref([{ codigo: '', nome: '', }]);
const offlineUsers = ref([{ codigo: '', nome: '', }]);

const ReceiveUsersgSignalR = () => {
  // Carrega usuários online através do SignalR
  signalRReceiver.loadOnlineUsers((receiveUserOn) => {
    // Limpa lista de usuários offline e online
    pinia.usuarioOffline.splice(0, pinia.usuarioOffline.length);
    pinia.usuarioOnline.splice(0, pinia.usuarioOnline.length);
    receiveUserOn.forEach((a: any) => {
      // Adiciona usuário online na lista de usuários online
      if (a.ONLINE !== null) {
        pinia.addUsuarioOnline({ codigo: a.ONLINE, nome: a.NOME });
      }
      // Adiciona usuário offline na lista de usuários offline
      else if (a.ONLINE === null) {
        pinia.addUsuarioOffline({ codigo: a.OFFLINE, nome: a.NOME });
      }
    });
  });
  // Carrega usuários offline através do SignalR
  signalRReceiver.loadOfflineUsers((receiveUserOff) => {
    // Limpa lista de usuários offline e online
    pinia.usuarioOffline.splice(0, pinia.usuarioOffline.length);
    pinia.usuarioOnline.splice(0, pinia.usuarioOnline.length);
    receiveUserOff.forEach((a: any) => {
      // Adiciona usuário online na lista de usuários online
      if (a.ONLINE !== null) {
        pinia.addUsuarioOnline({ codigo: a.ONLINE, nome: a.NOME });
      }
      // Adiciona usuário offline na lista de usuários offline
      else if (a.ONLINE === null) {
        pinia.addUsuarioOffline({ codigo: a.OFFLINE, nome: a.NOME });
      }
    });
  });
  // Atualiza valores de usuários online e offline
  onlineUsers.value = pinia.getUsuarioOnline()
  offlineUsers.value = pinia.getUsuarioOffline()
};

const UserRetril = async () => {
  // Busca usuários online e offline através da API
  const resposta: any = await apiPost("/Home/userOnline", {});
  // Limpa lista de usuários offline e online
  pinia.usuarioOffline.splice(0, pinia.usuarioOffline.length);
  pinia.usuarioOnline.splice(0, pinia.usuarioOnline.length);
  resposta.forEach((a: any) => {
    // Adiciona usuário online na lista de usuários online
    if (a.ONLINE !== null) {
      pinia.addUsuarioOnline({ codigo: a.ONLINE, nome: a.NOME });
    }
    // Adiciona usuário offline na lista de usuários offline
    else if (a.ONLINE === null) {
      pinia.addUsuarioOffline({ codigo: a.OFFLINE, nome: a.NOME });
    }
  });
  // Atualiza valores de usuários online e offline
  onlineUsers.value = pinia.getUsuarioOnline()
  offlineUsers.value = pinia.getUsuarioOffline()
};

const isVisible = computed(() => {
  // Retorna estado de abertura do modal
  return pinia.getOpenModal();
});

const closeModal = () => {
  // Fecha modal
  pinia.openModal(false);
}

// Função assíncrona que é chamada quando o formulário do modal é submetido
const submitModal = async () => {
  // Define o usuário selecionado como o usuário selecionado atualmente
  pinia.selectedUser = selectedUser.value;
  // Cria uma referência para armazenar a resposta da API
  const response = ref();
  // Cria um objeto que representa o atendimento a ser atualizado
  const atendimento = {
    CodAtendimento: pinia.codAtendimento,
    DataHoraAtendimento: new Date(),
    usuarioAtendente: pinia.selectedUser.codigo,
    status: '-1'
  };
  // Chama a API para atualizar o código do usuário no atendimento
  response.value = await apiPost("/Home/updateCodUsuario", atendimento);
  // Verifica se a resposta é inválida e encerra a função se for
  if (
    response.value == 0 ||
    response.value == "" ||
    response.value == undefined
  ) {
    console.log("Bad Request updateCodUsuario");
    return;
  // } else {
  //   // Remove todas as mensagens recebidas anteriormente 
  //   pinia.messagesReceive.splice(0, pinia.messagesReceive.length);
  //   // Chama a função que recupera as mensagens do atendimento atualizado
  //   await MensegeRetril();
  }
  // Exibe uma mensagem de sucesso usando a biblioteca SweetAlert
  swal.success('<p>Atendimento transferido<p>');
  // Limpa o autor da mensagem
  pinia.author = '';
  // Fecha o modal
  pinia.openModal(false);
}

// Define a função a ser executada quando o componente é montado
onMounted(() => {
  // Chama a função que recebe sinais do servidor SignalR
  ReceiveUsersgSignalR();
  // Chama a função que recupera as informações do usuário
  UserRetril();
});

// Define a função a ser executada antes do componente ser montado
onBeforeMount(() => {
});

</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity .3s ease;

  .modal-container {
    background-color: var(--dark);
    color: #fff;
    padding: 8px;
  }

  .modal-header {
    color: #fff;
    border-bottom: transparent;
  }

  .modal-body {
    background-color: #fff;
    color: #fff;
    height: 400px;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(17, 25, 40, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    .onLine {
      max-height: 200px !important;
    }

    .offLine {
      max-height: 200px !important;


    }
  }

  .overOff::-webkit-scrollbar {
    width: 12px;
  }

  .overOff::-webkit-scrollbar-track {
    background-color: rgba(18, 24, 34, 0.26);
    border-radius: 12px;
  }

  .overOff::-webkit-scrollbar-thumb {
    background-color: #021a2e;
    ;
    border-radius: 20px;
    border: 0;
  }

  .overOn::-webkit-scrollbar {
    width: 12px;
  }

  .overOn::-webkit-scrollbar-track {
    background-color: rgba(18, 24, 34, 0.26);
    border-radius: 12px;
  }

  .overOn::-webkit-scrollbar-thumb {
    background-color: var(--dark);
    ;
    border-radius: 20px;
    border: 3px solid #021a2e;
  }

  .overOn {
    max-height: 200px !important;
    overflow: auto;
  }

  .overOff {
    max-height: 200px !important;
    overflow: auto;
  }

  .modal-footer {
    button {
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      text-decoration: none;
      padding: 10px 10px;
      border: 0px solid #000;
      border-radius: 10px;
      display: inline-block;
    }

    border-top: transparent;
  }


  .naoSelecionavel {
    -webkit-touch-callout: none;
    /* iPhone OS, Safari */
    -webkit-user-select: none;
    /* Chrome, Safari 3 */
    -khtml-user-select: none;
    /* Safari 2 */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE10+ */
    user-select: none;
    /* Possível implementação no futuro */
  }

  .labelUser {
    padding-left: 5px;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    background: #fff;
    width: 450px;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    margin: 0 auto;
    padding: 20px 30px;
  }

  &-footer {
    margin-top: 15px;
  }

  &-enter,
  &-leave {
    opacity: 0;
  }

  &-enter &-container,
  &-leave &-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
</style>