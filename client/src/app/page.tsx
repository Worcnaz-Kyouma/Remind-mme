'use client'
import { useRouter } from 'next/navigation'

export default function Home() {

  const router = useRouter()

  fetch('http://localhost:22194/tokens')
    .then((res) => res.json())
    .then((res) => !res?.userId && router.push('/login'))

  return <h1>Sus</h1>
}