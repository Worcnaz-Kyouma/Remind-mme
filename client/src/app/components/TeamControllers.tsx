import styles from "@/app/styles/components/TeamControllers.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import TeamModel from "@shared/models/TeamModel"
import UserTeam from "@shared/models/UserTeamModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function TeamControllers({
    canDelete,
    teamId,
    userId
}: {
    canDelete: boolean
    teamId: string
    userId: string
}) {
    const queryClient = useQueryClient()

    const leaveTeamMutation = useMutation({
        mutationFn: ({ userId, teamId }: {userId:string, teamId:string}) => {
            return fetch(`http://localhost:22194/usersteams/?userId=${userId}&teamId=${teamId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then((resJson: UserTeam | ErrorJSON) => {
                if('error' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        }
    })

    const deleteTeamMutation = useMutation({
        mutationFn: (teamId:string) => {
            return fetch(`http://localhost:22194/teams/${teamId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then((resJson: TeamModel | ErrorJSON) => {
                if('error' in resJson)
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        }
    })

    return (
        <div className={styles['btn-team-controllers']}>
            <button onClick={() => {
                leaveTeamMutation.mutate({ userId: userId, teamId: teamId })
            }}>Leave</button>

            {canDelete && <button onClick={() => {
                deleteTeamMutation.mutate(teamId)
            }}>Delete</button>}
        </div>
    )
}