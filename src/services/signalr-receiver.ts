import * as signalR from "@microsoft/signalr";
const baseURL = process.env.NODE_ENV !== "development" ? `https://${location.hostname}:${location.port}` :  `https://localhost:5001`;
export default class SignalRReceiver {
  private connection: signalR.HubConnection;

  constructor() {
    const signalRUrl = baseURL+"/chat";
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(signalRUrl, {
      transport: signalR.HttpTransportType.None | signalR.HttpTransportType.LongPolling | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => {
        const token = localStorage.getItem('token');
        return token != null ? Promise.resolve(token) : Promise.reject('No token found.');
      },
    })
    .build();

    this.startConnection();
  }

  startConnection() {
    this.connection.start().then(() => {
      console.log("SignalR connection started");
    }).catch(err => {
      console.error(`SignalR connection error: ${err.toString()}`);
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  onMessageReceived(callback: (message: any) => void) {
    this.connection.on("ReceiveMessage", (message) => {
      callback(message);
    });
  }

  loadOnlineUsers(callback: (message: any) => void) {
    this.connection.on("UserOnline", (message) => {
      callback(message);
    });
  }

  loadOfflineUsers(callback: (message: any) => void) {
    this.connection.on("UserOffline", (message) => {
      callback(message);
    });
  }

  loadUpdateUsers(callback: (message: any) => void) {
    this.connection.on("UpdateUser", (message) => {
      callback(message);
    });
  }
  loadTextoPadrao(callback: (message: any) => void) {
    this.connection.on("ReceiveTextoPadrao", (message) => {
      callback(message);
    });
  }

  LogOutUser(callback: (message: any) => void) {
    this.connection.on("LogoutUser", (message) => {
      callback(message);
    });
  }
  sendMessage(message: any) {
    this.connection.invoke("SendMessage", message).catch(err => console.error(err.toString()));
  }
}
