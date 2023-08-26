import UserShowcase from "./UserShowcase"
import styles from "./../styles/components/Header.module.scss"
import { useQuery } from "@tanstack/react-query"


export default function Header() {
    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
        }
    })

    if(userQuery.isLoading)
        return <h1>Loading...</h1>

    if(userQuery.isError)
        return <h1>Error!</h1>

    return (
        <header className={styles['main-header']}>
            <span>Tasks</span>
            <h1>Remind-MME</h1>
            <UserShowcase user={userQuery.data}/>
        </header>
    )
}