

export interface ChatUser {
  id: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  content: string; 
  senderEmail: string;
  sentAt: string; 
}
