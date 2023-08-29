import ErrorJSON from "@shared/models/ErrorJSON"
import UserTeam from "@shared/models/UserTeamModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import styles from "@/app/styles/components/RemoveMember.module.scss"
import { Dispatch, SetStateAction } from "react"

export default function RemoveMember({
    userId,
    teamId,
    setCompressedOn,
    generateError
}: {
    userId:string
    teamId:string,
    setCompressedOn:() => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
}) {
    const queryClient = useQueryClient()

    const leaveTeamMutation = useMutation({
        mutationFn: ({ userId, teamId }: {userId:string, teamId:string}) => {
            return fetch(`http://localhost:22194/usersteams/?userId=${userId}&teamId=${teamId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then((resJson: UserTeam | ErrorJSON) => {
                if('rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
            setCompressedOn()
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    return <button className={styles['remove-button']} onClick={() => {
        leaveTeamMutation.mutate({ userId:userId, teamId:teamId })
    }}>Remove from team</button>
}