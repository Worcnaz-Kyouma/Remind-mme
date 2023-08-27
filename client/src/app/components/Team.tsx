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
        <div className={`${styles['team-wrapper']} ${!isClosed && styles.opened}`}>
            <span>{team.name}</span>
            {!isClosed && 
                <div className={styles['opened-team']}>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                    <div className={styles['showcase']}></div>
                </div>
            }
            <button id="team-opener" className={!isClosed ? styles.opened : ""} onClick={() => setClosed((isClosed) => !isClosed)}><label></label></button>
        </div>
    )
}