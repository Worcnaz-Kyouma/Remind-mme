'use client'
import { useRouter } from 'next/navigation'
import User from '@shared/models/UserModel'
import ErrorJSON from '@shared/models/ErrorJSON'

export default function Page() {

  const router = useRouter()

  fetch('http://localhost:22194/users/webtoken', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((resJson: User | ErrorJSON) => {
      if('error' in resJson) 
          throw resJson
      return resJson
    })
    .then((res:User) => res?._id 
      ? router.push('/home/teams')
      : router.push('/login')
    )
}