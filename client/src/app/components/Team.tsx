import { Dispatch, SetStateAction, useState } from "react"
import styles from "@/app/styles/components/Team.module.scss"
import TeamModel from "@shared/models/TeamModel"
import { useQuery } from "@tanstack/react-query"
import ErrorJSON from "@shared/models/ErrorJSON"
import SegmentTeam from "./SegmentTeam"
import UserModel from "@shared/models/UserModel"
import MemberGenerator from "./MemberGenerator"

export default function Team({
    team,
    loggedUser,
    setUserShowcaseData
}: {
    team: TeamModel,
    loggedUser: UserModel,
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, loggedUserLevel:number, maxTeamLevel:number, team:TeamModel}) => void
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
                if('error' in resJson) 
                    throw resJson
                return resJson
            })
        },
        enabled: !isClosed,
        onSuccess: (data) => {
            setSegments(data)
        },
        refetchInterval: 5000
    })

    const levelQuery = useQuery({
        queryKey: ['users', 'level', loggedUser._id],
        queryFn: () => {
            return fetch(`http://localhost:22194/usersteams/level-compare/?userId=${loggedUser._id}&teamId=${team!._id}`)
                .then((res) => res.json())
                .then((resJson: {loggedUserLevel:number, maxLevel:number} | ErrorJSON) => {
                    if('error' in resJson) 
                        throw resJson
                    return resJson
                })
        },
        enabled: segmentsQuery.isSuccess,
        onSuccess: (data) => {
            setLoggedUserLevel(data.loggedUserLevel)
            setMaxTeamLevel(data.maxLevel)
        },
    })

    return (
        <>
        <div className={`${styles['team-wrapper']} ${!isClosed && styles.opened}`}>
            <div className={styles['btn-team-controllers']}>
                <button></button>
            </div>
            <span>{team.name}</span>
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
        {isMemberGeneratorOpen && levelQuery.data?.loggedUserLevel && <MemberGenerator team={team} loggedUserLevel={loggedUserLevel as number} closeModal={() => setMemberGeneratorOpen(false)} />}
        </>
    )
}