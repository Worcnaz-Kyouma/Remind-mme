import styles from "@/app/styles/components/TeamName.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import Team from "@shared/models/TeamModel"
import { useMutation } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"

export default function TeamName({
    teamId,
    teamName,
    generateError
}: {
    teamId:string,
    teamName:string,
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
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
                if(typeof resJson !== 'string' && 'rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
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