export interface Message {
  createdAt: Date;
  messageId: string;
  text: string;
  uid: string;
  last: boolean;
  first: boolean;
  showImage: boolean;
}