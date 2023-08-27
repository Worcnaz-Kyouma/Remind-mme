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
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, team:TeamModel}) => void
}) {
    const [ isClosed, setClosed ] = useState(true)
    const [ segments, setSegments ] = useState<{ level: number, users: UserModel[] }[] | null>(null)
    const [ isMemberGeneratorOpen, setMemberGeneratorOpen ] = useState(false)

    const segmentsQuery = useQuery({
        queryKey: ['segments'],
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

    return (
        <>
        <div className={`${styles['team-wrapper']} ${!isClosed && styles.opened}`}>
            <span>{team.name}</span>
            {!isClosed && 
                <div className={styles['opened-team']}>
                    {segments && segments.map((segment) => <SegmentTeam key={segment.level} level={segment.level} users={segment.users} loggedUser={loggedUser} team={team} setUserShowcaseData={setUserShowcaseData} />)}
                    <button className={styles['member-opener']} onClick={() => {
                        setMemberGeneratorOpen(true)
                    }}></button>
                </div>
            }
            <button className={`${styles['team-opener']} ${!isClosed && styles.opened}`} onClick={() => {
                setClosed((isClosed) => !isClosed)
            }}></button>
        </div>
        {isMemberGeneratorOpen && <MemberGenerator team={team} closeModal={() => setMemberGeneratorOpen(false)} />}
        </>
    )
}