'use client'
import Team from "@/app/components/Team"
import TeamGenerator from "@/app/components/TeamGenerator"
import { useQuery } from "@tanstack/react-query"
import styles from "@/app/styles/teams.module.scss"
import { useRouter } from "next/navigation"
import { useState } from "react"
import TeamModel from "@shared/models/TeamModel"
import User from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
 
export default function Teams() {
    const router = useRouter()
    const [ teams, setTeams ] = useState<TeamModel[] | null>(null)

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: User | ErrorJSON) => {
                if('error' in resJson) 
                    throw resJson
                return resJson
            })
            .then((res: User) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
        onSuccess: (data: User) => {
            setTeams(data.teams || null)
        }
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <div className={styles['teams-wrapper']}>
            <div className={styles.teams}>
                {teams && teams.map((team) => <Team key={team._id } team={team} />)}
            </div>

            <TeamGenerator user={userQuery.data} />
        </div>
    )
}