import { useState } from "react"
import styles from "@/app/styles/components/Team.module.scss"
import TeamModel from "@shared/models/TeamModel"
import { useQuery } from "@tanstack/react-query"
import ErrorJSON from "@shared/models/ErrorJSON"
import SegmentTeam from "./SegmentTeam"
import User from "@shared/models/UserModel"
import UserTeamGenerator from "./UserTeamGenerator"

export default function Team({
    team
}: {
    team: TeamModel
}) {
    const [ isClosed, setClosed ] = useState(true)
    const [ segments, setSegments ] = useState<{ level: string, users: User[] }[] | null>(null)

    const segmentsQuery = useQuery({
        queryKey: ['segments'],
        queryFn: () => {
            return fetch(`http://localhost:22194/usersteams/${team._id}`, { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: { level: string, users: User[] }[] | ErrorJSON) => {
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
        <div className={`${styles['team-wrapper']} ${!isClosed && styles.opened}`}>
            <span>{team.name}</span>
            {!isClosed && 
                <div className={styles['opened-team']}>
                    {segments && segments.map((segment) => <SegmentTeam key={segment.level} level={segment.level} users={segment.users}/>)}
                    <UserTeamGenerator team={team}/>
                </div>
            }
            <button id="team-opener" className={!isClosed ? styles.opened : ""} onClick={() => {
                setClosed((isClosed) => !isClosed)
            }}></button>
        </div>
    )
}