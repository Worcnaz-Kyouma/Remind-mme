import ErrorJSON from "@shared/models/ErrorJSON"
import UserTeam from "@shared/models/UserTeamModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import styles from "@/app/styles/components/RemoveMember.module.scss"

export default function RemoveMember({
    userId,
    teamId,
    setCompressedOn
}: {
    userId:string
    teamId:string,
    setCompressedOn:() => void
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
            setCompressedOn()
        }
    })

    return <button className={styles['remove-button']} onClick={() => {
        leaveTeamMutation.mutate({ userId:userId, teamId:teamId })
    }}>Remove from team</button>
}