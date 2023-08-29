'use client'
import { useRouter } from 'next/navigation'
import ErrorJSON from '@shared/models/ErrorJSON'
import { useQuery } from '@tanstack/react-query'
import UserModel from '@shared/models/UserModel'
import ErrorMessage from '../components/ErrorMessage'
import styles from "@/app/styles/root.module.scss"

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
              if('error' in resJson){
                if(resJson.error === 'cookie not valid'){
                    router.push('/login')
                    throw resJson
                }
                else
                    throw resJson
              }
              return resJson
            })
        },
        onSuccess: (data) => {
          data?._id ? router.push('/home/teams') : router.push('/login')
        },
        onError: (error:any) => {
          'error' in error && error.error === 'cookie not valid' && router.push('/login')
        }
    })

    if(userQuery.isError){
      if(!('error' in (userQuery.error as any)))
          return <ErrorMessage errorTitle='Error' errorMessage='Internal Error' />
      else
          return <ErrorMessage errorTitle={(userQuery.error as any).error} errorMessage={(userQuery.error as any).error} />
    }

    return (
      <div className={styles['image-wrapper']}><img src="/RemindMMelogo4.png" alt="Remind-mme logo" /></div>
    )
  
}