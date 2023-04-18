<template>
    <div class="modal" v-if="isOpen">
        <div class="modal__overlay" @click="hideModal"></div>
        <div class="modal__content">
            <button class="modal__close" @click="hideModal">×</button>
            <div class="modal__header">
                <h2 class="modal__title">Selecione os arquivos que deseja enviar:</h2>
            </div>
            <div class="modal__body">
                <div class="modal__image flex-column mb-3" v-for="(image, index) in base64Array" :key="index">
                    <button class="modal__remove" @click="removeImage(index)">x</button>
                    <div class="flex-fill">
                        <img :src="image.base64.includes('data:image/png;base64,') || image.base64.includes('data:image/jpg;base64,') || image.base64.includes('data:image/jpeg;base64,') ? image.base64 : '../../public/pdf.png'"
                            alt="Image" />
                    </div>
                    <div v-if="!image.base64.includes('data:image/png;base64,')">
                        <p class="p-2">{{ image.name }}</p>
                    </div>
                </div>
            </div>
            <div class="modal_footer d-flex justify-content-between align-items-center">
                <div class="p-2 align-self-center">
                    <label for="file-input" class="btn btn-primary">Adicionar arquivo</label>
                    <input id="file-input" type="file" accept=".png,.jpg,.jpeg,.pdf" multiple style="display: none"
                        @change="handleFileUpload">
                </div>
                <div class="p-2 align-self-center">
                    <div class="d-flex">
                        <div class="p-2">
                            <button class="btn btn-success" @click="uploadMedia">Enviar</button>
                        </div>
                        <div class="p-2">
                            <button class="btn btn-danger" @click="hideModal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from "../stores/Store";
import { apiPost } from "../services/apiServices";
import moment from "moment";
import swal from '../util/swal'

const store = useStore();
const base64Array = ref<FileObject[]>([]);

// Definindo o tipo para o objeto de arquivo
type FileObject = {
    base64: string;
    name: string;
};

// Obtendo o código do usuário e o nome do usuário do localStorage
const codUser: string = localStorage.getItem("codUsuario") as string;
let nomeUser = localStorage.getItem("NomeUsuario");

// Definindo as extensões de arquivo permitidas
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];

// Função para lidar com o upload de arquivos
const handleFileUpload = (event: any) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;

    // Iterando sobre a lista de arquivos selecionados
    Array.from(files).forEach((file: File) => {
        const fileName = file.name.toLowerCase();

        // Verificando se a extensão do arquivo é permitida
        if (allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            const reader = new FileReader();

            // Convertendo o arquivo para base64 e adicionando ao array reativo
            reader.onload = () => {
                const base64 = reader.result as string;
                const fileObject: FileObject = {
                    base64,
                    name: file.name,
                };
                base64Array.value.push(fileObject);
            };
            reader.readAsDataURL(file);
        } else {
            // Mostrando um erro se a extensão do arquivo não for permitida
            swal.error('<p>Tipo de arquivo não permitido. Por favor, selecione um arquivo png, jpg, jpeg ou pdf.<p>');
        }
    });
};
const removeImage = (index: any) => {
    // Remove o objeto de imagem correspondente ao índice fornecido
    base64Array.value.splice(index, 1);
};

const uploadMedia = async () => {
    try {
        store.IsOpenAddImg(false);

        // Objeto de dados a ser enviado na solicitação de upload
        const data = {
            mediaUploads: base64Array.value.map((base64) => {
                return {
                    Base64: base64.base64,
                    Name: base64.name
                }
            }),
            sendMediaMessageViewModel: {
                RecipientPhoneNumber: "55" + store.tel,
                MediaType: '',
                SelectedMediaType: '',
                Message: '',
                MediaLink: '',
                MediaId: '',
                FileName: ''
            },
            atendimentoWpp: {
                CodAtendimento: store.codAtendimento,
                Message: '',
                CodMensagem: 0,
                Nome: '',
                DDD: '',
                Telefone: '',
                Status: '',
                UsuarioEnvio: +codUser,
                Tipo: ''
            }
        };

        // Faz a solicitação de upload para o servidor e aguarda a resposta
        const response = await apiPost('/Home/uploadMediaWithViewModel', data);

        // Se houver resposta, percorre cada mensagem e adiciona no store
        if (response != 0) {
            response.forEach((m: any) => {
                base64Array.value.forEach((base64) => {
                    store.addMessage({
                        body: base64.base64.replace("data:image/png;base64,", "").replace("data:application/pdf;base64,", "").replace("data:image/jpeg;base64,", "").replace("data:image/jpg;base64,", ""),
                        author: nomeUser,
                        to: store.author,
                        data:moment(new Date()).format("L"),
                        hora: moment(new Date()).format("HH:mm"),
                        telefone: store.tel,
                        codMensagem: m.codMsg,
                        codAtendimento: store.codAtendimento,
                        usuarioEnvio: codUser,
                        nomeUsuarioEnvio: nomeUser,
                        usuarioAtendente: codUser,
                        status: "-1",
                        contentType: base64.base64.includes("data:image/png;base64,") || base64.base64.includes("data:image/jpeg;base64,") || base64.base64.includes("data:image/jpg;base64,") ? "Image" : "Document",
                    })
                })
            });

            // Limpa o array de objetos de imagem após o upload
            base64Array.value = [];
        }
    } catch (error) {
        console.error(error);
    }
};

// Calcula se o modal de upload de imagem deve ser exibido
const isOpen = computed(() => {
    return store.getIsOpenAddImg();
});

// Esconde o modal de upload de imagem e limpa o array de objetos de imagem
const hideModal = () => {
    store.IsOpenAddImg(false);
    base64Array.value = [];
}
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

}
.modal__body {
  display: flex;
  flex-direction: row;
  height: 400px; /* Defina a altura desejada para o modal */
}

.modal__tab {
  display: flex;
  flex-direction: column;
  width: 200px; /* Defina a largura desejada para a side nav bar */
  background-color: #f0f0f0; /* Defina a cor de fundo desejada para a side nav bar */
  padding: 10px; /* Defina o preenchimento desejado para a side nav bar */
}

.modal__tab ul {
  list-style: none; /* Remova os pontos da lista */
  margin: 0;
  padding: 0;
}

.modal__tab li {
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

.modal__tab li:hover {
  background-color: #d0d0d0;
}

.modal__tab li.active {
  background-color: #ccc;
}

.modal__tab-content {
  display: grid;
  grid-template-columns: 1fr; /* Defina o número de colunas desejado para o conteúdo da tabulação */
  grid-gap: 20px; /* Defina a distância entre as colunas do conteúdo da tabulação */
  padding: 10px; /* Defina o preenchimento desejado para o conteúdo da tabulação */
}

.modal__tab-content div {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 3px;
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
    padding-left: 70px;
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
</style>
