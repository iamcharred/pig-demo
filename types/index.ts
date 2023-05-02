export interface Message {
  role: Role;
  content: string;
}

export interface DataSource {
  source: Blob | string;
  name: string;
  type: DataSourceType;
}

export type DataSourceType = "PDF" | "IMG" | "CSV" | "WEB" | "JSON" | "TXT";

export type Role = "assistant" | "user";

// Can be changed for each demo based on client needs
export enum ConversationStyle {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERT = "expert",
}

export enum Agent {
  MULTITOOL = "multitool",
  RELATIONAL = "relational",
  VECTOR = "vector",
}

export enum Tool {
  QUERY = "query",
  SEARCH = "search",
  EMAIL = "email",
}
