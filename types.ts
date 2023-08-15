export interface Message {
  createdAt: Date;
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
  createdAt: Date;
  uid: string;
  name: string;
  colour: string
}