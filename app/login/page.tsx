'use client';
import React, { useState } from 'react'
import * as fb from '@/firebase'
import { useRouter } from 'next/navigation';

const colours = [
  'bg-green-400','bg-teal-400','bg-sky-400','bg-indigo-400','bg-purple-400','bg-pink-400','bg-rose-400'
]


const Login = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [colour, setColour] = useState('bg-violet-300')


  const colourItem = colours.map((i) => {
    return <div onClick={() => setColour(i)} className={`${i} w-8 h-8 rounded-lg ${i !== colours[colours.length-1] ? 'mr-6' : ''}`}/>;
  });

  const joinRoom = async () => {
    const userRef = fb.collection(fb.db, 'users');

    await fb.addDoc(userRef, {name: name, createdAt: fb.serverTimestamp(), colour: colour}).then(doc => {
      const userRef = fb.doc(fb.db, 'users', doc.id);
      fb.setDoc(userRef, { uid: doc.id }, { merge: true });
      localStorage.setItem('user', JSON.stringify({uid: doc.id, name: name, colour: colour}))
    });
    
    router.push('/chat', { scroll: false })
  }

  return (
    <div>
      <div className='flex-row flex justify-between'>
        <input type="text" placeholder='message' onChange={(e) => setName(e.target.value)} value={name}
          className={`placeholder:text-neutral-50 placeholder:opacity-50 text-neutral-800 ${colour} flex h-14
          flex-grow rounded-2xl pl-5 focus:outline-none focus:border-violet-400 focus:ring-violet-400 focus:ring-2`} />
      </div>
      <div className='flex flex-row px-5 py-3 bg-violet-300 rounded-2xl mt-5 mb-10'>
        {colourItem}
      </div>
      
      <button disabled={name.trim() === ''} onClick={joinRoom}
        className='w-full flex flex-row px-5 py-3 bg-violet-300 rounded-2xl mb-10 items-center justify-center text-neutral-50 disabled:bg-opacity-50'>
        <span>join</span>
      </button>

    </div>
  )
}

export default Login