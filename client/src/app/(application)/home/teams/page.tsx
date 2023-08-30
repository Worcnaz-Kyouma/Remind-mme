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
import ErrorMessage from "@/app/components/ErrorMessage"
import Loading from "@/app/components/Loading"

export default function Teams() {
    type UserShowcaseData = {
        user: UserModel
        userLevel: number
        loggedUser: UserModel
        loggedUserLevel: number
        maxTeamLevel: number
        team: TeamModel
    }

    const router = useRouter()
    const [ teams, setTeams ] = useState<TeamModel[] | null>(null)
    const [ isUserShowcaseEnabled, setUserShowcaseEnabled ] = useState(false)
    const [ userShowcaseData, setUserShowcaseData ] = useState<UserShowcaseData|null>(null)
    const [ error, setError ] = useState<{errorTitle: string, errorMessage: string} | null>(null)
    const [ isLoading, setLoading ] = useState(false)

    function setUserShowcaseFromComponents(userShowcaseDate:UserShowcaseData){
        setUserShowcaseData(userShowcaseDate)
        setUserShowcaseEnabled(true)
    }

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: UserModel | ErrorJSON) => {
                if('rawError' in resJson) 
                    throw resJson
                return resJson
            })
            .then((res: UserModel) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
        onSuccess: (data: UserModel) => {
            setTeams(data.teams || null)
            setLoading(false)
        },
        onError: (error: any) => {
            if('rawError' in error)
                setError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                setError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    if(userQuery.isSuccess)
    return (
        <>
            {error && <ErrorMessage errorTitle={error.errorTitle} errorMessage={error.errorMessage} />}
            <div className={styles['teams-wrapper']}>
            {isLoading && <Loading />}
                <div className={styles.teams}>
                    {teams && teams.map((team) => <Team key={ team._id } setLoading={setLoading} generateError={setError} team={team} loggedUser={userQuery.data} setUserShowcaseData={setUserShowcaseFromComponents} />)}
                </div>
                <TeamGenerator setLoading={setLoading} generateError={setError} user={userQuery.data}/>
            </div>
            {isUserShowcaseEnabled && userShowcaseData &&
                <UserShowcase generateError={setError} user={userShowcaseData.user} userLevel={userShowcaseData.userLevel} loggedUser={userShowcaseData.loggedUser} loggedUserLevel={userShowcaseData.loggedUserLevel} maxTeamLevel={userShowcaseData.maxTeamLevel} team={userShowcaseData.team} setCompressedOn={() => setUserShowcaseEnabled(false)} />
            }
        </>
    )
}