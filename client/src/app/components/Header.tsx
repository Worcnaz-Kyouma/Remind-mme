import Profile from "./Profile"
import styles from "./../styles/components/Header.module.scss"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"


export default function Header() {
    const router = useRouter()

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((res) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <header className={styles['main-header']}>
            <span>Tasks</span>
            <h1>Remind-MME</h1>
            <Profile user={userQuery.data}/>
        </header>
    )
}