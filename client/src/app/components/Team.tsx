import { Dispatch, SetStateAction, useState } from "react"
import styles from "@/app/styles/components/Team.module.scss"
import TeamModel from "@shared/models/TeamModel"
import { useQuery } from "@tanstack/react-query"
import ErrorJSON from "@shared/models/ErrorJSON"
import SegmentTeam from "./SegmentTeam"
import UserModel from "@shared/models/UserModel"
import MemberGenerator from "./MemberGenerator"
import TeamControllers from "./TeamControllers"
import TeamName from "./TeamName"

export default function Team({
    team,
    loggedUser,
    setUserShowcaseData,
    generateError,
    setLoading
}: {
    team: TeamModel,
    loggedUser: UserModel,
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, loggedUserLevel:number, maxTeamLevel:number, team:TeamModel}) => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>,
    setLoading: Dispatch<SetStateAction<boolean>>
}) {
    const [ isClosed, setClosed ] = useState(true)
    const [ segments, setSegments ] = useState<{ level: number, users: UserModel[] }[] | null>(null)
    const [ isMemberGeneratorOpen, setMemberGeneratorOpen ] = useState(false)
    const [ loggedUserLevel, setLoggedUserLevel ] = useState<number | null>(null)
    const [ maxTeamLevel, setMaxTeamLevel ] = useState<number | null>(null)

    const segmentsQuery = useQuery({
        queryKey: ['segments', team._id],
        queryFn: () => {
            return fetch(`http://localhost:22194/usersteams/${team._id}`, { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: { level: number, users: UserModel[] }[] | ErrorJSON) => {
                if('rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        enabled: !isClosed,
        onSuccess: (data) => {
            setSegments(data)
            setLoading(false)
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        },
        refetchInterval: 5000
    })

    const levelQuery = useQuery({
        queryKey: ['users', 'level', loggedUser._id, team!._id],
        queryFn: () => {
            return fetch(`http://localhost:22194/usersteams/level-compare/?userId=${loggedUser._id}&teamId=${team!._id}`)
                .then((res) => res.json())
                .then((resJson: {loggedUserLevel:number, maxLevel:number} | ErrorJSON) => {
                    if('rawError' in resJson) 
                        throw resJson
                    return resJson
                })
        },
        onSuccess: (data) => {
            setLoggedUserLevel(data.loggedUserLevel)
            setMaxTeamLevel(data.maxLevel)
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    return (
        <>
        <div className={`${styles['team-wrapper']} ${!isClosed && styles.opened}`}>
            <TeamControllers setLoading={setLoading} generateError={generateError} canDelete={maxTeamLevel==loggedUserLevel} teamId={team._id as string} userId={loggedUser._id as string}/>
            {maxTeamLevel && loggedUserLevel && maxTeamLevel<=loggedUserLevel
                ? <TeamName generateError={generateError} teamId={team!._id as string} teamName={team.name}/> 
                : <span>{team.name}</span>
            }
            {!isClosed && 
                <div className={styles['opened-team']}>
                    {segments && levelQuery.isSuccess && segments.map((segment) => <SegmentTeam key={segment.level} level={segment.level} users={segment.users} loggedUser={loggedUser} loggedUserLevel={loggedUserLevel as number} maxTeamLevel={maxTeamLevel as number} team={team} setUserShowcaseData={setUserShowcaseData} />)}
                    <button className={styles['member-opener']} onClick={() => {
                        setMemberGeneratorOpen(true)
                    }}></button>
                </div>
            }
            <button className={`${styles['team-opener']} ${!isClosed && styles.opened}`} onClick={() => {
                setClosed((isClosed) => !isClosed)
            }}></button>
        </div>
        {isMemberGeneratorOpen && levelQuery.data?.loggedUserLevel && <MemberGenerator setLoading={setLoading} generateError={generateError} team={team} loggedUserLevel={loggedUserLevel as number} closeModal={() => setMemberGeneratorOpen(false)} />}
        </>
    )
}