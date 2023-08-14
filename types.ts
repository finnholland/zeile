export interface Message {
  createdAt: Date;
  mid: string;
  text: string;
  uid: string;
  last: boolean;
  first: boolean;
  showImage: boolean;
}