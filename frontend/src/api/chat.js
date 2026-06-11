import API from "./index";

export const getConversations = () => API.get("/chat/conversations");
export const getMessages = (conversationId) => API.get(`/chat/messages/${conversationId}`);
export const sendMessageApi = (receiverId, text) => API.post("/chat/send", { receiverId, text });
