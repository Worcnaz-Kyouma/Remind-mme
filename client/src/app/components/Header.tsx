import Profile from "./Profile"
import styles from "./../styles/components/Header.module.scss"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import LogoutButton from "./LogoutButton"
import ErrorMessage from "./ErrorMessage"


export default function Header() {
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
        refetchInterval: 5000,
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError){
        if(!('error' in (userQuery.error as any)))
            return <ErrorMessage errorTitle='Error' errorMessage='Internal Error' />
        else
            return <ErrorMessage errorTitle={(userQuery.error as any).error} errorMessage={(userQuery.error as any).error} />
    }

    else{
        return (
            <>
            <header className={styles['main-header']}>
                <Profile user={userQuery.data as UserModel}/>
                <div className={styles['logo-wrapper']}> <img src="/RemindMMelogo4.png" alt="" /></div>
                <LogoutButton />
            </header>
            </>
        )
    }
}