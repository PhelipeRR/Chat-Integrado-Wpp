<template  class="d-flex">
    <transition name="fade">
        <div v-if="state.loading" class="d-flex justify-content-center">
            <div class="spinner-border text-primary spinner-cht" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </transition>
    <div class="container-login100" v-if="!state.loading">
        <div class="wrap-login100">
            <form class="login100-form validate-form">
                <div class="login100-pic js-tilt login100-form-title" data-tilt>
                    <img src="../../public/logoLogin.png" alt="IMG">
                </div>
                <div class="wrap-input100 validate-input" data-validate="Valid login is required">
                    <input v-model="username" class="input100" type="text" name="login" placeholder="Login">
                    <span class="focus-input100"></span>
                    <span class="symbol-input100">
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </span>
                </div>
                <div class="wrap-input100 validate-input" data-validate="Password is required">
                    <input v-model="password" class="input100" type="password" name="pass" placeholder="Senha"
                        autocomplete="on">
                    <span class="focus-input100"></span>
                    <span class="symbol-input100">
                        <i class="fa fa-lock" aria-hidden="true"></i>
                    </span>
                </div>
                <div class="container-login100-form-btn">
                    <button class="login100-form-btn" @click.prevent="login">
                        Login
                    </button>
                </div>
                <div class="text-center p-t-12">
                    <span class="txt1">
                    </span>
                    <a class="txt2" href="#">
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { apiPost } from '../services/apiServices';
import router from '../router';
import swal from '../util/swal'
import { useStore } from "../stores/Store";

const store = useStore();
const state = reactive({
    loading: false
});
const API_URL = '/Home/login';
const username = ref('');
const password = ref('');
const usuarioOnline = ref<Array<any>>([]);
const errors = ref({
    username: '',
    password: ''
});

function formValidate(): boolean {
    // Verifica se o campo de login está preenchido
    if (!username.value) {
        errors.value.username = 'Login é obrigatório';
    } else {
        errors.value.username = '';
    }
    // Verifica se o campo de senha está preenchido
    if (!password.value) {
        errors.value.password = 'Senha é obrigatória';
    } else {
        errors.value.password = '';
    }
    let errorMessage = "";
    // Verifica se há erros nos campos de login e senha
    if (errors.value.password !== '' || errors.value.username !== '') {
        if (errors.value.password !== '' && errors.value.username !== '') {
            // Mensagem de erro caso os dois campos estejam com problemas
            errorMessage = `<p>${errors.value.password}<p>` + `<p>${errors.value.username}<p>`;
        } else if (errors.value.password !== '' && errors.value.username === '') {
            // Mensagem de erro caso apenas o campo de senha esteja com problemas
            errorMessage = `<p>${errors.value.password}<p>`;
        } else if (errors.value.password === '' && errors.value.username !== '') {
            // Mensagem de erro caso apenas o campo de login esteja com problemas
            errorMessage = `<p>${errors.value.username}<p>`;
        }
        // Exibe a mensagem de erro
        swal.error(errorMessage);
    }
    // Retorna true se não houver erros nos campos de login e senha
    return !Object.values(errors.value).some((err: string) => err);
}

const login = () => {
    // Verifica se os campos de login e senha são válidos
    if (formValidate()) {
        state.loading = true
        // Aguarda 2 segundos para simular uma requisição à API
        setTimeout(async () => {
            // Faz uma requisição à API para verificar se o login e a senha estão corretos
            const response = await apiPost(API_URL, { "identificacao": username.value, "senha": password.value });
            console.log(response)
            if (response == 'Senha inválida!') {
                // Mensagem de erro caso a senha estejam incorreto
                swal.error('<p>Senha inválida!<p>');
            }
            else if (response == "Usuário não encontrado!") {
                // Mensagem de erro caso o login estejam incorreto
                swal.error('<p>Usuário não encontrado!<p>');
            }
            else if (response[1] !== null && response[1][0].msg == 'Usuario Já Logado no Sistema!') {
                let oldToken = `Bearer ${response[1][0].token}`;
                // Mensagem caso o usuário já esteja logado no sistema
                const shouldLogOut = await swal.confirm('<p>Usuario Já Logado no Sistema!</p> <p>Deseja continuar?</p>');
                if (shouldLogOut.isConfirmed) {
                    console.log(username.value, password.value);
                    const response = await apiPost('/Home/refreshToken', { "identificacao": username.value, "senha": password.value, "oldToken":oldToken });
                    if (response[0].token) {
                        // Armazena as informações do usuário no local storage
                        taskLogin(response);
                    }
                }
                else {
                    return
                }
            } else if (response[0].token) {
                // Armazena as informações do usuário no local storage
                taskLogin(response);
            }
            state.loading = false;
        }, 2000);
    }
};

const taskLogin = (response: any) => {
    console.log(response);
    if(response[1] !== null){
        response[1].forEach((a: any) =>
        usuarioOnline.value = [{
            codigo: a.codUsuario,
            nome: a.nome,
        }]);
    }
    store.addUsuarioOnline(usuarioOnline);
    localStorage.setItem('token', `Bearer ${response[0].token}`);
    localStorage.setItem('codUsuario', response[0].codUsuario);
    localStorage.setItem('NomeUsuario', response[0].nome);
    localStorage.setItem('Usuario', response[0].identificacao);
    // Redireciona para a página de chat e atualiza a página
    router.push({ path: "chatwpp" })
    location.reload();
}
</script>
<style scoped>
@import url('../LoginView/css/main.css');
@import url('../LoginView/css/util.css');

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.spinner-cht {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
}
</style>