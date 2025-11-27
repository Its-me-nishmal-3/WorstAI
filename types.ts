export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum LoadingState {
  IDLE = 'IDLE',
  THINKING = 'THINKING', // Ironically named, since we disabled thinking
  STREAMING = 'STREAMING',
  ERROR = 'ERROR'
}