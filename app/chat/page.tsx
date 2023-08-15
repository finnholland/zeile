'use client';

import * as fb from '@/firebase';
import { useEffect, useState } from 'react';
import { Message, User } from '@/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Send from '../assets/send';

let lastMessage = {}


export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState<User>({
    uid: '', name: '', colour: '', createdAt: new Date()
  });

  let  messagesListener: any;
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user') || ''))
    }
    loadMessages();

    return () => {  messagesListener() };
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

     messagesListener = fb.onSnapshot(q, querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        const i = messageList.findIndex(d => d.messageId === change.doc.data().messageId);
        if (change.type === 'modified') {
          if (i === -1) {
            console.log(change.doc.data().text)
            messageList.unshift(change.doc.data() as Message);
            messageList[0].last = true;
            if (messageList[1])
              messageList[1].last = change.doc.data().uid == messageList[1].uid ? false : true;
          }
        }
        setIsLoading(true);
      });
       for (let i = 0; i < messageList.length; i++) {
        if (!messageList[i - 1] || messageList[i].uid != messageList[i-1].uid) {
          messageList[i].showName = true;
         } else if (messageList[i].showName)
          messageList[i].showName = false
        console.log(messageList)
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
       
      setMessages([...messageList]);
      setIsLoading(false);
    });
  };

  const sendMessage = async () => {
    let msg = message;
    const messageRef = fb.collection(fb.db, 'messages');

    await fb.addDoc(messageRef, {text: msg, createdAt: fb.serverTimestamp(), uid: user.uid, name: user.name, colour: user.colour}).then(doc => {
      const messageRef = fb.doc(fb.db, 'messages', doc.id);
      fb.setDoc(messageRef, { messageId: doc.id }, { merge: true });
    });
    setMessage('')
  };

  const scrollLoad = async () => {
    if (lastMessage) {
      const messageList: Message[] = []
      const lazyLoad = fb.collection(fb.db, 'messages');
      const q = fb.query(lazyLoad, fb.orderBy('createdAt', 'desc'), fb.startAfter(lastMessage), fb.limit(10));
      const querySnapshot = await fb.getDocs(q);
      querySnapshot.forEach(c => {
        messageList.push(c.data() as Message);
      });
      const tempList: Message[] = messages.concat(messageList);
      lastMessage = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (tempList.length <= 0) {
        setHasMore(false)
      }
      setMessages(tempList);
    }
  }
  
  const messageItem = messages.map((i) => {
    return <MessageItem key={i.messageId} msg={i} uid={user.uid}/>;
  });

  const enterPress = (e: React.KeyboardEvent<HTMLInputElement>) =>{
    if (e.key == 'Enter') {
      sendMessage()
    }
  };

  return (
    <div className='flex flex-col max-w-3xl w-full'>

      <div className='flex-row flex justify-between h-8 w-full bg-violet-300 rounded-2xl'>
      </div>

      <div className='flex flex-col bg-violet-300 max-w-3xl w-full px-5 my-8 rounded-2xl'>
        <InfiniteScroll
          dataLength={messages.length}
          next={() => scrollLoad()}
          hasMore={hasMore}
          endMessage={<p style={{textAlign: 'center', color: '#820bff '}}>the beginning</p>}
          loader={isLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          className='flex flex-col-reverse w-100 items-start pb-4'
          style={{ overflow: 'visible' }}>
          {messageItem}
        </InfiniteScroll>
      </div>
      <div className='flex-row flex justify-between'>
        <input type="text" onKeyDown={enterPress} placeholder='message' onChange={(e) => setMessage(e.target.value)} value={message}
          className='placeholder:text-violet-400 text-neutral-800 bg-violet-300 flex 
          flex-grow rounded-2xl pl-5 focus:outline-none focus:border-violet-400 focus:ring-violet-400 focus:ring-2'/>
        <button disabled={message.trim() === ''} onClick={sendMessage}
          className=' disabled:opacity-50 bg-violet-300 rounded-2xl w-16 h-16 justify-center items-center flex ml-8'>
          <Send/>
        </button>
      </div>
    </div>
  )
}

interface MessageProp {
  msg: Message,
  uid: string,
}
const MessageItem: React.FC<MessageProp> = ({msg, uid}) => {
  if (msg.uid != uid) {
    return (
      <div>
        <div className={'px-5 py-3 self-start' + ` ${msg.colour} ` + (msg.first ? 'receive-first' : msg.last ? 'receive-last' : 'receive-middle')}>   
          <span className='text-neutral-800'>
            {msg.text}
          </span>
          
        </div>
        {msg.showName ? ( <div className=' text-xs mt-1 mb-3'> <span>{ msg.name }</span> </div>) : (<div />)}  
      </div>

    );
  } else {
    return (
      <div
        className={'px-5 py-3 self-end flex' + ` ${msg.colour} ` +
          (msg.first ? 'send-first' : msg.last ? 'send-last' : 'send-middle')}>
        <span className='text-neutral-800'>{msg.text}</span>
      </div>
    );
  }
};