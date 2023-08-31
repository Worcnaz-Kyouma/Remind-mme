import styles from "@/app/styles/components/TeamControllers.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import TeamModel from "@shared/models/TeamModel"
import UserTeam from "@shared/models/UserTeamModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"

export default function TeamControllers({
    canDelete,
    teamId,
    userId,
    generateError,
    setLoading
}: {
    canDelete: boolean
    teamId: string
    userId: string
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
    setLoading: Dispatch<SetStateAction<boolean>>
}) {
    const queryClient = useQueryClient()

    const leaveTeamMutation = useMutation({
        mutationFn: ({ userId, teamId }: {userId:string, teamId:string}) => {
            return fetch(`http://localhost:22194/usersteams/?userId=${userId}&teamId=${teamId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then((resJson: number | ErrorJSON) => {
                if(typeof resJson !== 'number' && 'rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
            setTimeout(() => {
                generateError(null)
            }, 5100)
        }
    })

    const deleteTeamMutation = useMutation({
        mutationFn: (teamId:string) => {
            return fetch(`http://localhost:22194/teams/${teamId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then((resJson: TeamModel | ErrorJSON) => {
                if('rawError' in resJson)
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
            setLoading(true)
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
            setTimeout(() => {
                generateError(null)
            }, 5100)
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