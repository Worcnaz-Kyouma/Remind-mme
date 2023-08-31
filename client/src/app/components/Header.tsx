import Profile from "./Profile"
import styles from "./../styles/components/Header.module.scss"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import LogoutButton from "./LogoutButton"
import ErrorMessage from "./ErrorMessage"
import { useState } from "react"
import Loading from "./Loading"


export default function Header() {
    const router = useRouter()
    const [ error, setError ] = useState<{errorTitle: string, errorMessage: string} | null>(null)
    const [ isLoading, setLoading ] = useState(false)

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
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError){
        if(!('rawError' in (userQuery.error as any)))
            return <ErrorMessage errorTitle='Error' errorMessage='Internal Error' />
        else
            return <ErrorMessage errorTitle={(userQuery.error as any).errorTitle} errorMessage={(userQuery.error as any).errorMessage} />
    }

    else{
        return (
            <>
            {error && <ErrorMessage errorTitle={error.errorTitle} errorMessage={error.errorMessage} />}
            {isLoading && <Loading />}
            <header className={styles['main-header']}>
                <Profile generateError={setError} user={userQuery.data as UserModel}/>
                <div className={styles['logo-wrapper']}> <img src="/RemindMMelogo4.png" alt="" /></div>
                <LogoutButton setLoading={setLoading} />
            </header>
            </>
        )
    }
}