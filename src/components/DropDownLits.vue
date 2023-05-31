<template>
    <div class="dropdown" ref="dropdownRef">
        <button @click="toggleDropdown">
            <i class="fas fa-ellipsis-v" :class="{ 'attach-light': isDark, 'attach-dark': !isDark }"></i>
        </button>
        <ul v-if="isDropdownOpen">
            <li @click="openModalPhrase()" @mouseover="showSublist"><i class="fas fa-comment liOptions"></i>Texto Padrão
            </li>
            <li @click="isOpenMaps()" @mouseover="showSublistLocation"><i
                    class="fas fa-location-dot liOptions"></i>Localização
            </li>
            <li @click="openModalUpImg()" @mouseover="hiddenSublist"><i class="fas fa-paperclip liOptions"></i>Arquivos</li>
        </ul>
        <div v-if="isSublistOpen">
            <ul class="sublist" @mouseleave="hiddenSublist">
                <div class="search">
                    <input type="text" v-model="searchTerm" placeholder="Search...">
                </div>
                <li v-for="(TextStandarRetrive, index) in filteredTextStandarRetrive" :key="index"
                    @click="selectMsg(TextStandarRetrive.texto)">
                    {{ TextStandarRetrive.texto }}
                </li>
            </ul>
        </div>
        <div v-if="isSublistLocationOpen">
            <ul class="sublist" @mouseleave="hiddenSublist">
                <li v-for="(location, index) in locationLits" :key="index"
                    @click="sendLocation(location.endereco, location.descricao)">
                    <div>
                        <p>Unidade: {{ location.descricao }}</p>
                        <p>
                            Endereço: {{ location.endereco }}-{{ location.bairro }}, {{ location.cidade }},
                            {{ location.cep }}, {{ location.complemento }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from "../stores/Store";
import { onClickOutside } from '@vueuse/core';
import { apiPost, apiGet } from '../services/apiServices';
import axios from 'axios';
import moment from "moment";


type CodUsuario = number;
const isDropdownOpen = ref<boolean>(false);
const store = useStore();
const dropdownRef = ref(null);
const isSublistOpen = ref<boolean>(false);
const isSublistLocationOpen = ref<boolean>(false);
const locationLits = ref<any>();
const searchTerm = ref<string>('');
let nomeUser = localStorage.getItem("NomeUsuario");
const codUser: CodUsuario = localStorage.getItem(
    "codUsuario"
) as unknown as CodUsuario;


const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const getTextStandarRetrive = computed(() => {
    const textoPadrao = store.getTextoPadrao();
    const filteredText = textoPadrao.filter((o: any) => o.texto !== '');
    return filteredText;
});

const filteredTextStandarRetrive = computed(() => {
    if (searchTerm.value.length === 0) {
        return getTextStandarRetrive.value;
    } else {
        const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
        return getTextStandarRetrive.value.filter((TextStandarRetrive: any) =>
            TextStandarRetrive.texto.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }
});

const isDark = computed(()=>{
    return store.getIsDark();
})

const sendLocation = async (adress: any, descricao: any) => {
    try {
        const apiKey = '...';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${adress}`;
        const response = await axios.get(url);
        const result = response.data;
        if (result.status === 'OK') {
            const msg = {
                latitude: result.results[0].geometry.location.lat,
                longitude: result.results[0].geometry.location.lng,
                address: adress,
                name: descricao,
                RecipientPhoneNumber: "55" + store.tel,
                CodAtendimento: store.codAtendimento,
                UsuarioEnvio: codUser,
                DataHoraMensagem: moment(new Date()),
            };
            const apiResponse = await apiPost('/Home/SendWhatsAppLocationMessage', msg)
            console.log(apiResponse)
            if (apiResponse!== 0) {
                store.addMessage({
                    body: `{"messaging_product":"","recipient_type":"", "to":"", "type":"location","location":{"longitude":${msg.longitude},"latitude":${msg.latitude}, "name":"${msg.name}","address":"${msg.address}" }}`,
                    author: nomeUser,
                    to: store.author,
                    hora: moment(new Date()).format("HH:mm"),
                    data: moment(new Date()).format('L'),
                    telefone: store.tel,
                    codAtendimento: store.codAtendimento,
                    codMensagem: apiResponse.data,
                    usuarioEnvio: codUser,
                    nomeUsuarioEnvio: nomeUser,
                    usuarioAtendente: codUser,
                    status: "-1",
                    contentType: "Location",
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const isOpenMaps = () => {
    store.IsOpenMaps(true);
}

const selectMsg = (text: any) => {
    let texto = text;
    const horaAtual = new Date().getHours();
    let saudacao;

    if (horaAtual >= 6 && horaAtual < 12) {
        saudacao = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }
    if (texto.includes('<<')) {
        texto = texto.replace('<<VR_NOMEUSUARIO>>', nomeUser);
        texto = texto.replace('<<VR_SAUDACAO>>', saudacao);
    }
    store.setSelectedText(texto)
    closeDropdown();
    hiddenSublist();
};

const unidadesPush = async () => {
    const textoPadrao = await apiGet("/Home/unidade");
    locationLits.value = textoPadrao.filter((o: any) => o.endereco !== null);
}

const openModalUpImg = (): void => {
    store.IsOpenAddImg(true);
};

const openModalPhrase = (): void => {
    store.IsOpenPhrase(true);
};

const closeDropdown = (): void => {
    searchTerm.value = '';
    isDropdownOpen.value = false;
};

const showSublist = (): void => {
    const exists = store.getTextoPadrao().filter((o: any) => o.texto !== '');
    if (exists.length > 0) {
        isSublistOpen.value = true;
    }
    isSublistLocationOpen.value = false;
}

const showSublistLocation = (): void => {
    const exists = locationLits.value.filter((o: any) => o.texto !== '');
    if (exists.length > 0) {
        isSublistLocationOpen.value = true;
    }
    isSublistOpen.value = false;
}


const hiddenSublist = (): void => {
    isSublistOpen.value = false;
    isSublistLocationOpen.value = false;
};

onMounted(() => {
    onClickOutside(dropdownRef, closeDropdown);
    onClickOutside(dropdownRef, hiddenSublist);
    unidadesPush();
});

onUnmounted(() => {
    onClickOutside(dropdownRef, () => {});
});
</script>

<style scoped>
.search {
    padding: 5px;
}

input.search {
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 3px;
    padding: 5px;
    margin-bottom: 5px;
}

.dropdown {
    position: relative;
    right: inherit;
    right: 2%;
    padding-top: 0.5rem;
}

button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

ul {
    position: absolute;
    top: -500%;
    right: -20;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 100;
}

li {
    padding: 8px 12px;
    color: #333;
    cursor: pointer;
    font-size: 1rem;
    width: 13rem;
}

li:hover {
    background: #091A29;
    color: #fff;
}

a {
    color: #333;
    text-decoration: none;
}

.attach-light {
    display: block;
    color: var(--light);
    font-size: 1.5rem;
    padding-left: 1rem;
    transition: 0.2s ease-out;
}
.attach-dark {
    display: block;
    color: var(--dark);
    font-size: 1.5rem;
    padding-left: 1rem;
    transition: 0.2s ease-out;
}
.attach:hover {
    color: var(--primary);
    transform: translateY(0.5rem);
    cursor: pointer;
}

.liOptions {
    padding: .8rem;
}

.sublist {
    position: absolute;
    top: -400%;
    left: 960%;
    background-color: #f1f1f1;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 10rem;
    width: auto;
    overflow: auto;
}

.sublist li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    width: 50rem;
}

.sublist::-webkit-scrollbar {
    width: 12px;
}

.sublist::-webkit-scrollbar-track {
    background-color: rgba(18, 24, 34, 0.26);
    border-radius: 12px;
}

.sublist::-webkit-scrollbar-thumb {
    background-color: #021a2e;
    ;
    border-radius: 20px;
    border: 0;
}
</style>