import client from "./client";

const updateMessageStatusByChatId = (chatId, newStatus) => {
  return client.post(`/gmessages/updateStatusByChat/${chatId}`, {
    status: newStatus,
  });
};

const updateResponseStatusByChatId = (chatId, newStatus) => {
  return client.post(`/mresponses/updateStatusByChat/${chatId}`, {
    status: newStatus,
  });
};

const postMessageResponse = (messageData) => {
  console.log(messageData);
  return client.post("/mresponses", messageData);
};

const postMessage = (messageData) => {
  return client.post("/gmessages", messageData);
};

const createChat = (chatData) => {
  return client.post("/chats", chatData);
};

export default {
  updateMessageStatusByChatId,
  updateResponseStatusByChatId,
  postMessageResponse,
  createChat,
  postMessage,
};
