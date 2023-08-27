'use client'
import Team from "@/app/components/Team"
import TeamGenerator from "@/app/components/TeamGenerator"
import { useQuery } from "@tanstack/react-query"
import styles from "@/app/styles/teams.module.scss"
import { useRouter } from "next/navigation"
import { useState } from "react"
 
export default function Teams() {
    const router = useRouter()
    const [ teams, setTeams ] = useState<{}[] | null>(null)

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then(resJson => {
                if(resJson?.error) 
                    throw resJson
                return resJson
            })
            .then((res) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
        onSuccess: (data) => {
            setTeams(data.teams)
        }
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <div className={styles['teams-wrapper']}>
            <div className={styles.teams}>
                {teams && teams.map((team:any) => <Team key={team._id } />)}
            </div>

            <TeamGenerator user={userQuery.data} />
        </div>
    )
}