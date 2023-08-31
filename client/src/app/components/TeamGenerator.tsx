import styles from "@/app/styles/components/TeamGenerator.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import User from "@shared/models/UserModel"
import UserModel from "@shared/models/UserModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"

export default function TeamGenerator({
    user,
    generateError,
    setLoading
}: {
    user: UserModel
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
    setLoading: Dispatch<SetStateAction<boolean>>
}) {
    const queryClient = useQueryClient()

    const teamMutation = useMutation({
        mutationFn: (user: any) => {
            return fetch('http://localhost:22194/teams', {
                method: "POST",
                body: JSON.stringify({ userId: user._id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((resJson: User | ErrorJSON) => {
                if('rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
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

    return <h1 title="Generate Team" className={styles['team-generator']} onClick={() => {
        teamMutation.mutate(user)
    }}>New Team</h1>
}