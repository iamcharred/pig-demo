import { Agent, ConversationStyle, DataSource, Message, Tool } from "../";

export interface ChatBody {
  messages: Message[];
  prompt: string;
  conversationStyle?: ConversationStyle;
  agent?: Agent;
  tools?: Tool[];
  sources?: DataSource[];
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  prompt: string;
  conversationStyle: ConversationStyle;
  agent: Agent;
  tools?: Tool[];
  folderId: string | null;
}
