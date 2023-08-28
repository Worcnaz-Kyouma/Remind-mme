import styles from "@/app/styles/components/TeamGenerator.module.scss"
import ErrorJSON from "@shared/models/ErrorJSON"
import User from "@shared/models/UserModel"
import UserModel from "@shared/models/UserModel"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function TeamGenerator({
    user
}: {
    user: UserModel
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
        onError: (err: ErrorJSON) => {
            console.log(err)
        }
    })

    return <button className={styles['team-generator']} onClick={() => {
        teamMutation.mutate(user)
    }}></button>
}