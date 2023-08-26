'use client'
import { useRouter } from 'next/navigation'

export default function Page() {

  const router = useRouter()

  fetch('http://localhost:22194/users/webtoken', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((res) => res?._id 
      ? router.push('/home/teams')
      : router.push('/login')
    )
}