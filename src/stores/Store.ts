import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: "Mensagem Recebida", // Identificador da loja de estado
  state: () => { // Definindo o estado inicial da loja
    return {
      messagesReceive: [ // Matriz de mensagens recebidas
        {
          body: "", // Corpo da mensagem
          author: "", // Autor da mensagem
          to: "", // Destinatário da mensagem
          hora: "", // hora da mensagem
          data: "", // Data  da mensagem
          telefone: "", // Número do telefone da mensagem
          codAtendimento: "", // Código de atendimento da mensagem
          codMensagem: "", // Código da mensagem
          usuarioEnvio: "", // Usuário que enviou a mensagem
          nomeUsuarioEnvio: "", // Nome do usuário que enviou a mensagem
          usuarioAtendente: "", // Usuário que está atendendo a mensagem
          status: "", // Status da mensagem
          contentType: "" // Tipo de conteúdo da mensagem
        }
      ],
      textStandardReceive: [ // Matriz de texto padrão
        {
          texto: "", // texto padrão
          codTexto: "", // codigo do texto
          codUsuario: "", // codUsuario criador/modificador
          dthrultmodificacao: "", // data e hora da criaçao/modificação
        }
      ],

      usuarioOnline: [ // Matriz de usuários online
        {
          codigo: "", // Código do usuário
          nome: "", // Nome do usuário
        }
      ],
      usuarioOffline: [ // Matriz de usuários offline
        {
          codigo: "", // Código do usuário
          nome: "", // Nome do usuário
        }
      ], 
      author: '' as string, // Autor da mensagem atual
      tel: '' as string, // Número de telefone da mensagem atual
      codAtendimento: '' as string, // Código de atendimento da mensagem atual
      usuarioAtendente: '' as string, // Usuário que está atendendo a mensagem atual
      quantidadeEmEspera: 0 as number, // Quantidade de mensagens em espera
      quantidadeEmAtendimento: 0 as number, // Quantidade de mensagens em atendimento
      quantidadeFinalizados: 0 as number, // Quantidade de mensagens finalizadas
      modalVisible: false as boolean, // Define se o modal está visível ou não
      isOpenDocument: false as boolean, // Define se o Office está aberto ou não
      isOpenMaps: false as boolean,
      isOpenVideo: false as boolean,
      isOpenPhrase: false as boolean,
      isOpenPdf: false as boolean, // Define se o PDF está aberto ou não
      isOpenImg: false as boolean, // Define se a imagem está aberta ou não
      isOpenAddImg: false as boolean, // Define se a janela de adição de imagem está aberta ou não
      isSendMsgDisabled: true as boolean, // Define se o botão de enviar mensagem está desabilitado ou não
      isStartServicesDisabled: false as boolean, // Define se o botão de iniciar serviço está desabilitado ou não
      selectedUser: '' as any, // Usuário selecionado
      pdfUrl:'' as any, // URL do PDF
      documentUrl:'' as any, // URL do Office
      imgUrl:'' as any, // URL da imagem
      videoUrl:'' as any, // URL do video
      SelectedMediaType:'' as any, // Tipo de mídia selecionado
      clicked: false, // Define se o botão foi clicado ou não
      frase: '' as string, // Frase
      codFrase: 0 as number, // CodFrase
      selectedText: '' as string,
      latitude: '' as string,
      longitude: '' as string,
      adressLine: '' as string,
      isDark: false as boolean,

    }
  },
  actions: { // Definindo as funções da loja de estado
    addMessage(message: any) { // Adiciona uma mensagem à matriz de mensagens
      this.messagesReceive.push(message);
    },
    getMessages() { // Retorna a matriz de mensagens
      return this.messagesReceive;
    },
    addTextoPadrao(message: any) { // Adiciona uma mensagem à matriz de texto padrão
      this.textStandardReceive.push(message);
    },
    getTextoPadrao() { // Retorna a matriz de texto padrão
      return this.textStandardReceive;
    },
    setSelectedText(message: string) { // Adiciona uma mensagem a variavel
      this.selectedText = message;
    },
    addUsuarioOnline(usuario: any) { // Adiciona um usuário à matriz de usuários online
      this.usuarioOnline.push(usuario);
    },
    addUsuarioOffline(usuario: any) { // Adiciona um usuário à matriz de usuários offline
      this.usuarioOffline.push(usuario);
    },
    getUsuarioOnline() { // Retorna a matriz de usuários online
      return this.usuarioOnline;
    },
    getUsuarioOffline() { // Retorna a matriz de usuários offline
      return this.usuarioOffline;
    },
    openModal(message: boolean) { // Define se o modal será visível ou não
      this.modalVisible = message;
    },
    getOpenModal(): boolean { // Retorna se o modal está visível ou não
      return this.modalVisible;
    },
    IsOpenPdf(message: boolean) { // Define se o PDF está aberto ou não
      this.isOpenPdf = message;
    },
    IsOpenAddImg(message: boolean) { // Define se o recurso de adicionar imagem está aberto ou não
      this.isOpenAddImg = message;
    },
    IsSendMsgDisabled(message: boolean) { // Define se o botão de enviar mensagem está desabilitado ou não
      this.isSendMsgDisabled = message;
    },
    getIsSendMsgDisabled(): boolean { // Retorna se o botão de enviar mensagem está desabilitado ou não
      return this.isSendMsgDisabled;
    },
    getIsOpenPdf(): boolean { // Retorna se o PDF está aberto ou não
      return this.isOpenPdf;
    },
    getIsOpenAddImg(): boolean {
      return this.isOpenAddImg;
    },
    PdfUrl(message: string) {
      this.pdfUrl = message;
    },
    getPdfUrl(): string {
      return this.pdfUrl;
    },
    IsOpenDocument(message: boolean) { // Define se o Office está aberto ou não
      this.isOpenDocument = message;
    },
    IsOpenVideo(message: boolean) { // Define se o Office está aberto ou não
      this.isOpenVideo = message;
    },
    getIsOpenDocument(): boolean { // Retorna se o Office está aberto ou não
      return this.isOpenDocument;
    },
    getIsOpenVideo(): boolean { // Retorna se o Office está aberto ou não
      return this.isOpenVideo;
    },
    DocumentUrl(message: string) {
      this.documentUrl = message;
    },
    getDocumentUrl(): string {
      return this.documentUrl;
    },
    ImgUrl(message: string) {
      this.imgUrl = message;
    },
    getImgUrl(): string {
      return this.imgUrl;
    },
    VideoUrl(message: string) {
      this.videoUrl = message;
    },
    getVideoUrl(): string {
      return this.videoUrl;
    },
    IsOpenImg(message: boolean) {
      this.isOpenImg = message;
    },
    getIsOpenImg(): boolean {
      return this.isOpenImg;
    },
    IsOpenPhrase(message: boolean) {
      this.isOpenPhrase = message;
    },
    getIsOpenPhrase(): boolean {
      return this.isOpenPhrase;
    },
    IsOpenMaps(message: boolean) {
      this.isOpenMaps = message;
    },
    getIsOpenMaps(): boolean {
      return this.isOpenMaps;
    },
    IsStartServicesDisabled(message: boolean) {
      this.isStartServicesDisabled = message;
    },
    getIsStartServicesDisabled(): boolean {
      return this.isStartServicesDisabled;
    },
    setClicked(clicked: boolean) {
      this.clicked = clicked;
    },
    getIsDark(): boolean {
      return this.isDark;
    },
    setIsDark(message: boolean) {
      this.isDark = message;
    },
  }
})