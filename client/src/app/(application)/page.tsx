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
              if('rawError' in resJson){
                if(resJson.errorTitle === 'Cookie'){
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
        }
    })

    if(userQuery.isError){
      if(!('rawError' in (userQuery.error as any)))
          return <ErrorMessage errorTitle='Error' errorMessage='Internal Error' />
      else
          return <ErrorMessage errorTitle={(userQuery.error as any).errorTitle} errorMessage={(userQuery.error as any).errorMessage} />
    }

    return (
      <div className={styles['image-wrapper']}><img src="/RemindMMelogo4.png" alt="Remind-mme logo" /></div>
    )
  
}