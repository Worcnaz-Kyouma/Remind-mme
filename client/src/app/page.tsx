'use client'
import { useRouter } from 'next/navigation'
import User from '@shared/models/UserModel'
import ErrorJSON from '@shared/models/ErrorJSON'
import { useQuery } from '@tanstack/react-query'
import UserModel from '@shared/models/UserModel'

export default function Page() {

  const router = useRouter()

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: UserModel | ErrorJSON) => {
              if('error' in resJson) 
                  throw resJson
              return resJson
            })
        },
        onSuccess: (data) => {
          data?._id ? router.push('/home/teams') : router.push('/login')
        },
        onError: (data:any) => {
          'error' in data && data.error == 'cookie not valid' && router.push('/login')
        }
    })

    return <h1>Sus</h1>
  
}