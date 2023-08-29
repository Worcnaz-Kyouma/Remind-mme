'use client'
import Team from "@/app/components/Team"
import TeamGenerator from "@/app/components/TeamGenerator"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import styles from "@/app/styles/teams.module.scss"
import { useRouter } from "next/navigation"
import { useState } from "react"
import TeamModel from "@shared/models/TeamModel"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import UserShowcase from "@/app/components/UserShowcase"
import ErrorMessage from "@/app/components/ErrorMessage"

export default function Teams() {
    type UserShowcaseData = {
        user: UserModel
        userLevel: number
        loggedUser: UserModel
        loggedUserLevel: number
        maxTeamLevel: number
        team: TeamModel
    }

    const [ teams, setTeams ] = useState<TeamModel[] | null>(null)
    const [ isUserShowcaseEnabled, setUserShowcaseEnabled ] = useState(false)
    const [ userShowcaseData, setUserShowcaseData ] = useState<UserShowcaseData|null>(null)
    const [ error, setError ] = useState<{errorTitle: string, errorMessage: string} | null>(null)

    const queryClient = useQueryClient()

    function setUserShowcaseFromComponents(userShowcaseDate:UserShowcaseData){
        setUserShowcaseData(userShowcaseDate)
        setUserShowcaseEnabled(true)
    }

    if(queryClient.getQueryState(['users'])?.status === 'success' && queryClient.getQueryData(['users'])){
    return (
        <>
            {error && <ErrorMessage errorTitle={error.errorTitle} errorMessage={error.errorMessage} />}
            <div className={styles['teams-wrapper']}>
                <div className={styles.teams}>
                    {teams && teams.map((team) => <Team key={ team._id } generateError={setError} team={team} loggedUser={queryClient.getQueryData(['users']) as UserModel} setUserShowcaseData={setUserShowcaseFromComponents} />)}
                </div>
                <TeamGenerator generateError={setError} user={queryClient.getQueryData(['users']) as UserModel}/>
            </div>
            {isUserShowcaseEnabled && userShowcaseData &&
                <UserShowcase generateError={setError} user={userShowcaseData.user} userLevel={userShowcaseData.userLevel} loggedUser={userShowcaseData.loggedUser} loggedUserLevel={userShowcaseData.loggedUserLevel} maxTeamLevel={userShowcaseData.maxTeamLevel} team={userShowcaseData.team} setCompressedOn={() => setUserShowcaseEnabled(false)} />
            }
        </>
    )
    }
}