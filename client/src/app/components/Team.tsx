import { useState } from "react"
import styles from "@/app/styles/components/Team.module.scss"
import TeamModel from "@shared/models/TeamModel"

export default function Team({
    team
}: {
    team: TeamModel
}) {
    const [ isClosed, setClosed ] = useState(true)

    return (
        isClosed
            ? 
            <div className={styles['closed-team']}>
                <span>{team.name}</span>
            </div>
            : <div className={styles['opened-team']}></div>
    )
}