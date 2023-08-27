import styles from "@/app/styles/components/TeamGenerator.module.scss"
import { QueryClient, useMutation } from "@tanstack/react-query"

export default function TeamGenerator({
    user
}: {
    user:any
}) {
    const queryClient = new QueryClient()

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
            .then(resJson => {
                if(resJson?.error) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        onError: (err) => {
            console.log(err)
        }
    })

    return <button className={styles['team-generator']} onClick={() => {
        teamMutation.mutate(user)
    }}></button>
}