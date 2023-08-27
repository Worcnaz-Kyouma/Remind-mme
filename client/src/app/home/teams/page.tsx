'use client'
import Team from "@/app/components/Team"
import TeamGenerator from "@/app/components/TeamGenerator"
import { useQuery } from "@tanstack/react-query"
import styles from "@/app/styles/teams.module.scss"
import { useRouter } from "next/navigation"
import { useState } from "react"
import TeamModel from "@shared/models/TeamModel"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import UserShowcase from "@/app/components/UserShowcase"
 
export default function Teams() {
    type UserShowcaseData = {
        user?: UserModel
        userLevel?: number
        loggedUser?: UserModel
        setCompressedOn: () => void
    }

    const router = useRouter()
    const [ teams, setTeams ] = useState<TeamModel[] | null>(null)
    const [ userShowcaseData, setUserShowcaseData ] = useState<UserShowcaseData>({
        setCompressedOn: () => {
            setUserShowcaseData(userShowcaseData => {
                userShowcaseData.user = undefined
                userShowcaseData.userLevel = undefined
                userShowcaseData.loggedUser = undefined
                return userShowcaseData
            }
        )}
    })

    function setUserShowcaseDataFromComponents(user:UserModel, userLevel:number, loggedUser:UserModel) {
        console.log(user, userLevel, loggedUser)
        setUserShowcaseData(userShowcaseData => {
            userShowcaseData.user = user
            userShowcaseData.userLevel = userLevel
            userShowcaseData.loggedUser = loggedUser
            return userShowcaseData
        })
    }

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
            .then((res: UserModel) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
        onSuccess: (data: UserModel) => {
            setTeams(data.teams || null)
        }
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <>
            <div className={styles['teams-wrapper']}>
                <div className={styles.teams}>
                    {teams && teams.map((team) => <Team key={team._id } team={team} loggedUser={userQuery.data} setUserShowcaseData={setUserShowcaseDataFromComponents} />)}
                </div>
                <TeamGenerator user={userQuery.data} />
            </div>
            {userShowcaseData.user && 
                <UserShowcase user={userShowcaseData.user} userLevel={userShowcaseData.userLevel} loggedUser={userShowcaseData.loggedUser as UserModel} setCompressedOn={userShowcaseData.setCompressedOn} />
            }
        </>
    )
}