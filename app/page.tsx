'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  useEffect(() => {
    if (localStorage.getItem('user')) {
      router.push('/chat')
    } else {
      router.push('/login', { scroll: false })
    }
  })
}