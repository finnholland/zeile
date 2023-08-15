import * as fb from '@/firebase'

export interface Message {
  createdAt: fb.Timestamp;
  messageId: string;
  text: string;
  uid: string;
  last: boolean;
  first: boolean;
  showName: boolean;
  name: string;
  colour: string
}
export interface User {
  uid: string;
  name: string;
  colour: string
}