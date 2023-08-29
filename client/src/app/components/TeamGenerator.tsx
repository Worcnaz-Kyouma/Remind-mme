import styles from "@/app/styles/components/TeamGenerator.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import User from "@shared/models/UserModel"
import UserModel from "@shared/models/UserModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"

export default function TeamGenerator({
    user,
    generateError
}: {
    user: UserModel
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
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
                if('error' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        onError: (error: any) => {
            if('error' in error)
                generateError({errorTitle: error.title, errorMessage: error.message})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    return <button className={styles['team-generator']} onClick={() => {
        teamMutation.mutate(user)
    }}></button>
}