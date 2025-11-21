export interface OpenRouterResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: {
    text?: string;
    message?: { content?: string };
    index?: number;
    finish_reason?: string;
  }[];
}
