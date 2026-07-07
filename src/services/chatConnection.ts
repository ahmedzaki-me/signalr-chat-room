import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const createChatConnection = (token: string) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hub/chat`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection;
};
