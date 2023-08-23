'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Zeile from '../assets/Zeile';
import { colours } from '../constants';

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>
}

const MAX_LENGTH = 16
const Login: React.FC<Props> = (props: Props) => {
  const [name, setName] = useState('')
  const [colour, setColour] = useState('bg-pink-300')
  const inputRef = React.createRef<HTMLInputElement>();
  const colourItem = colours.map((i) => {
    return <button key={i} onClick={() => setColour(i)}
      className={`${i} w-8 h-8 rounded-lg ${i !== colours[colours.length - 1] ? 'mr-6' : ''} ${i === colour ? 'border-4 border-white' : ''}`} />;
  });

  useEffect(() => {
    setColour(colours[Math.floor(Math.random() * ((colours.length -1) - 0 + 1)) + 0])
  }, [setColour])

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const joinRoom = async () => {
    let uuid = uuidv4();
    localStorage.setItem('user', JSON.stringify({ uid: uuid, name: name, colour: colour }))
    props.setLoggedIn(true)
  }

  return (
    <div className='flex flex-col items-center'>
      <Zeile width={150}/>
      <div className='flex-row flex justify-between w-full mt-12'>
        <div onClick={handleClick} className={`rounded-2xl flex h-14 flex-grow items-end overflow-hidden ${colour} focus-within:border-violet-400 focus-within:ring-violet-400 focus-within:ring-2`}>
          <input ref={inputRef} type="text" placeholder='name...' autoFocus onChange={(e) => setName(e.target.value.replace(/[^\w.\-]/, '_'))} maxLength={MAX_LENGTH} value={name}
            className={`placeholder:text-neutral-50 placeholder:opacity-80 text-neutral-800 ${colour} flex flex-grow h-full
            pl-5 focus:outline-none`} />
          <span className='text-xs mb-1 mr-3 text-neutral-600'>{name.length}/{MAX_LENGTH - name.length}</span>
        </div>

      </div>
      <div className='flex flex-row px-5 py-3 bg-violet-300 rounded-2xl mt-5 mb-10'>
        {colourItem}
      </div>
      
      <button disabled={name.trim() === ''} onClick={() => joinRoom()}
        className='w-full flex flex-row px-5 py-3 bg-violet-300 rounded-2xl mb-10 items-center justify-center text-neutral-50 disabled:bg-opacity-50'>
        <span>join</span>
      </button>
      <div className='w-full'>
        <p className=' text-neutral-700 text-sm'>your login is saved until you logout.</p>
        <p className=' text-red-600 text-sm'>you will not be able to log back into the same account</p>
        <p className=' text-neutral-700 text-sm'>you can still choose the same name again :)</p>
      </div>
    </div>
  )
}

export default Login
