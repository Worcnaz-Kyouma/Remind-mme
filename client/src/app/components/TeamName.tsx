import styles from "@/app/styles/components/TeamName.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import Team from "@shared/models/TeamModel"
import { useMutation } from "@tanstack/react-query"

export default function TeamName({
    teamId,
    teamName
}: {
    teamId:string,
    teamName:string
}) {
    const teamNameMutation = useMutation({
        mutationFn: (editedName:string) => {
            return fetch(`http://localhost:22194/teams/${teamId}`, {
                method: 'PUT',
                body: JSON.stringify({ teamName:editedName }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((resJson: string | ErrorJSON) => {
                if(typeof resJson !== 'string' && 'error' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onError: (err: ErrorJSON) => {
            console.log(err)
        }
    })

    let saveNameTimeout:NodeJS.Timeout

    return <input className={styles['team-name']} type="text" name="name" id="name" defaultValue={teamName} onChange={(event) => {
        if(saveNameTimeout)
            clearTimeout(saveNameTimeout)
        saveNameTimeout = setTimeout(() => {
            teamNameMutation.mutate(event.target.value)
        }, 2000)
    }}/>
}