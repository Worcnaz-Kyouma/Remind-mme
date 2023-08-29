import Profile from "./Profile"
import styles from "./../styles/components/Header.module.scss"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import LogoutButton from "./LogoutButton"


export default function Header() {
    const router = useRouter()

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((res: UserModel) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <header className={styles['main-header']}>
            <Profile user={userQuery.data as UserModel}/>
            <div className={styles['logo-wrapper']}> <img src="/RemindMMelogo4.png" alt="" /></div>
            <LogoutButton />
        </header>
    )
}