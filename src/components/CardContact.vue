<template>
  <div>
    <div :class="{ 'header-light': !isDark, 'header-dark': isDark }">
      <div class="d-flex align-items-center">
        <div>
          <div class="contact-card" v-if="messagesReceive !== ''">
            <img src="../../public/blank-profile.png" class="avatar">
            <div class="info">
              <p class="name">{{ messagesReceive }}</p>
            </div>
            <div v-if="!isSendMsgDisabled">
              <ThreeDotMenuVue />
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <div>
          <i class="iconclassDirection" :class="iconClasses"></i>
        </div>
        <div class="p-3">
          <div class="toggle" :class="toggleClasses" @click="handleToggle">
            <input type="checkbox" class="toggle__checkbox" :checked="isLeft" @change="handleToggle" />
            <div class="toggle__slider"></div>
          </div>
        </div>
        <div class="p-3">
          <div @click.prevent="logout">
          <i class="fa-solid fa-right-from-bracket" :class="{ 'loguout-light': !isDark, 'loguout-dark': isDark }"
            data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Sair"></i>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import * as bootstrap from "bootstrap";
import { useStore } from "../stores/Store";
import { apiPost } from "../services/apiServices";
import ThreeDotMenuVue from './ThreeDotMenu.vue';
import router from '../router';
import SignalRReceiver from "../services/signalr-receiver";
import swal from '../util/swal'

const store = useStore();
const CodUsuario = localStorage.getItem("codUsuario");
const Token = localStorage.getItem("token");
const usuarioOnline = ref<any>({});
let nomeUser = localStorage.getItem("NomeUsuario");
const signalRReceiver = new SignalRReceiver();
const isLeft = ref(false);
// define uma variável reativa messagesReceive que é obtida a partir de um getter armazenado no objeto store.
const messagesReceive = computed(() => {
  const messages = ref();
  const author = ref('');
  // Obtém todas as mensagens do armazenamento de dados
  messages.value = store.getMessages();
  // Cria um array para armazenar as mensagens filtradas
  const messageUser = messages.value.filter((m: any) => {
    // Filtra as mensagens que atendem aos seguintes critérios:
    return (
      // A mensagem é enviada pelo usuário logado ou pelo usuário destinatário
      (m.author === store.author || m.author == nomeUser || m.author == m.nomeUsuarioEnvio) &&
      // A mensagem é enviada para o usuário logado ou para o usuário remetente
      (m.to === nomeUser || m.to == store.author) &&
      // A mensagem tem conteúdo
      m.body !== "" &&
      // A mensagem pertence ao mesmo atendimento que o usuário logado
      m.codAtendimento == store.codAtendimento && (m.usuarioAtendente == 0 || m.usuarioAtendente == CodUsuario)
    );
  });
  messageUser.forEach((e: any) => {
    if (e.author == store.author)
      author.value = e.author;
  });
  if (author.value) {
    return author.value;
  } else {
    store.IsStartServicesDisabled(false);
    return ''
  }
});

// define uma variável reativa newToken que é obtida a partir de um getter que retorna o token.
const smaeUser = () => {
  signalRReceiver.LogOutUser((oldUser: any) => {
    if (oldUser.codUsuario.toString() === CodUsuario && oldUser.oldToken === Token) {
      swal.error('<p> Usuario logado em outro computador!</p>')
      localStorage.clear();
      router.push({ path: "/login" });
    }
  })
};

const iconClasses = computed(() => {
  return isLeft.value ? 'fas fa-moon' : 'fas fa-sun';
});
const toggleClasses = computed(() => {
  return {
    'toggle--left': isLeft.value,
    'toggle--right': !isLeft.value,
  }
});

const handleToggle = () => {
  isLeft.value = !isLeft.value;
  if (isLeft.value) {
    store.setIsDark(true);
  }
  else if (!isLeft.value) {
    store.setIsDark(false);
  }
};

const setDark = () => {

}

const isDark = computed(() => {
  return store.getIsDark();
})

// define uma variável reativa isSendMsgDisabled que é obtida a partir de um getter armazenado no objeto store.
const isSendMsgDisabled = computed(() => {
  return store.getIsSendMsgDisabled();
});


// define uma função assíncrona logout que é executada quando um usuário faz logout da aplicação.
const logout = async () => {
  try {
    sessionStorage.removeItem('usuSession');
    // Verifica se o CodUsuario é diferente de null
    if (CodUsuario !== null) {
      // Limpa o localStorage
      localStorage.clear();
      // Cria um objeto usuário com o código do usuário logado
      const user: { CodUsuario: string } = { CodUsuario }
      // Faz uma requisição POST para a API logout
      const data = await apiPost('/Home/logout', user);
      // Itera sobre o objeto data e armazena o usuário online na variável usuarioOnline
      data.forEach((a: any) => {
        usuarioOnline.value = {
          codigo: a.codUsuario,
          nome: a.nome,
        }
      });
      // Remove todos os usuários online do objeto store.usuarioOnline
      store.usuarioOnline.splice(0, store.usuarioOnline.length);
      // Adiciona o usuário online à lista de usuários online do objeto store
      store.addUsuarioOnline(usuarioOnline.value);
      // Navega para a página de login
      router.push({ path: "/login" })
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

onBeforeUnmount(() => {
  router.push({ path: "/login" });
});

// Executado quando o componente é montado. 
onMounted(() => {
  // Inicializa todos os elementos com o atributo data-bs-toggle="tooltip" como tooltips usando o bootstrap.
  smaeUser();
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.header-dark {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background-color: var(--dark);
  color: var(--light);
  padding: 1.3em;
  align-items: center;
  max-height: 76px;
}

.header-light {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background-color: var(--light);
  color: var(--dark);
  padding: 1.3em;
  align-items: center;
  max-height: 76px;
}

.loguout-dark {
  font-size: 2rem;
  color: var(--light);
  transition: 0.2s ease-out;
  cursor: pointer;
  align-items: right;
}

.loguout-light {
  font-size: 2rem;
  color: var(--dark);
  transition: 0.2s ease-out;
  cursor: pointer;
  align-items: right;
}

.loguout-light:hover {
  color: var(--primary);
  transform: translateX(0.5rem);
}

.loguout-dark:hover {
  color: var(--primary);
  transform: translateX(0.5rem);
}

.contact-card {
  display: flex;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 16px;
}

.info {
  flex: 1;
}

.name {
  font-weight: bold;
  margin-bottom: 4px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 27px;
}

.toggle__checkbox {
  display: none;
}

.toggle__slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--dark);
  transition: 0.4s;
  border-radius: 34px;
}

.toggle__slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle__checkbox:checked+.toggle__slider {
  background-color: var(--light);
}

.toggle--left .toggle__slider:before {
  background-color: var(--dark);
  transform: translateX(0);
}

.toggle--right .toggle__slider:before {
  background-color: var(--light);
  transform: translateX(26px);
}

.iconclassDirection {
  font-size: 24px;
}
</style>