'use client';

import Image from 'next/image'
import * as fb from '@/firebase';
import { useEffect, useState } from 'react';
import { Message } from '@/types';

let lastMessage = {}
export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  let unsubSnapListener: any;
  useEffect(() => {
    loadMessages();

    return () => { unsubSnapListener() };
  }, []);

  const loadMessages = async () => {

    const messageList: Message[] = [];
    const messageRef = fb.collection(fb.db, 'messages');
    const q = fb.query(messageRef, fb.orderBy('createdAt', 'desc'), fb.limit(20));
    const querySnapshot = await fb.getDocs(q);
    querySnapshot.forEach(m => {
      messageList.push(m.data() as Message);
    });
    setMessages(messageList);
    lastMessage = querySnapshot.docs[querySnapshot.docs.length - 1];
    createSnapListener(messageList);
  }

    const createSnapListener = async (messageList: Message[]) => {
    const messageRef = fb.collection(
      fb.db,
      'messages'
    );
    const q = fb.query(messageRef, fb.orderBy('createdAt', 'desc'), fb.limit(20));

    unsubSnapListener = fb.onSnapshot(q, querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        const i = messageList.findIndex(d => d.mid === change.doc.data().mid);
        if (change.type === 'modified') {
          if (i !== -1) {
            messageList[i] = change.doc.data() as Message;
          } else {
            messageList.unshift(change.doc.data() as Message);
            messageList[0].last = true;
            
            messageList[1].last = change.doc.data().uid == messageList[1].uid ? false : true;
          }
        }
        if (change.type === 'removed') {
          messageList.splice(i, 1);
        }
        setIsLoading(true);
      });
      let showImage = false;
      for (let i = 0; i < messageList.length; i++) {
        if (!showImage && messageList[i].uid != '4Rowx7y8Lv80wuSepG65') {
          messageList[i].showImage = true;
          showImage = true;
        } else if (messageList[i].showImage) {
          messageList[i].showImage = false;
        }
        const current = messageList[i];
        // list is inverted desc so next (more recent) is the element before
        const next = messageList[i - 1];
        const prev = messageList[i + 1];
        if(prev == null || current.uid != prev.uid){
          current.first = true;
        }
        else if(current.uid != next?.uid && current.uid == prev.uid){
          current.last = true;
        }
      }
      setMessages(messageList);
      setIsLoading(false);
    });
  };

  const sendMessage = async () => {
    let msg = 'hello moon!';
    const messageRef = fb.collection(fb.db, 'messages');

    await fb.addDoc(messageRef, {text: msg, createdAt: fb.serverTimestamp(), uid: '4Rowx7y8Lv80wuSepG65'}).then(doc => {
      const messageRef = fb.doc(fb.db, 'messages', doc.id);
      fb.setDoc(messageRef, { mid: doc.id }, { merge: true });

    });
  };

  return (
    <div className='flex flex-col'>

    
      <button onClick={sendMessage}>
        press me
      </button>
      
      {messages.map((m) => (
        <span>{m.text}</span>
      ))}
    </div>
  )
}
