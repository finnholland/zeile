'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
 
export default function Page() {
  const router = useRouter()
 
  useEffect(() => {
    if (localStorage.getItem('loggedIn')) {
      router.push('/chat')
    } else {
      router.push('/login', { scroll: false })
    }
  }, [])
 
  return <Link href="login">Login</Link>
}