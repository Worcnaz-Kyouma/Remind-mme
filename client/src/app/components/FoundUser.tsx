'use client'
import User from "@shared/models/UserModel"

import styles from "@/app/styles/components/FoundUser.module.scss"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import UserTeam from "@shared/models/UserTeamModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import { Dispatch, SetStateAction } from "react"

export default function FoundUser({
    user,
    teamId,
    level,
    refetchUserList,
    generateError,
    setLoading
}: {
    user: User
    teamId: string
    level: string | undefined
    refetchUserList: () => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
    setLoading: Dispatch<SetStateAction<boolean>>
}) {
    const clientQuery = useQueryClient()

    const memberMutation = useMutation({
        mutationFn: (newMember: { userId: string, teamId: string, level:string|undefined }) => {
            return fetch('http://localhost:22194/usersteams', {
                method: "POST",
                body: JSON.stringify(newMember),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((resJson: UserTeam | ErrorJSON) => {
                if('rawError' in resJson) 
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            refetchUserList()
            clientQuery.invalidateQueries(['segments', teamId])
            setLoading(true)
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    return (
        <div className={styles['found-user-wrapper']} onClick={() => {
            memberMutation.mutate({ userId:user._id as string, teamId:teamId, level: level })
        }}>
            <div className={styles['img-relative-wrapper']}>
                <div className={styles['image-wrapper']}>
                    <img src={`http://localhost:22194/${user.imageUrl}`} alt="User found image" />
                </div>
            </div>
            <div className={styles['data-wrapper']} >
                <p>Name: {user.username}</p>
                <p>Email: {user.email}</p>
                {user.phone && <p>Phone: {user.phone}</p>}
            </div>
        </div>
    )
}