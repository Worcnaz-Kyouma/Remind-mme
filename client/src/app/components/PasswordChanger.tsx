import ErrorJSON from "@shared/models/ErrorJSON";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

import styles from "@/app/styles/components/PasswordChanger.module.scss"

export default function PasswordChanger({
    userId,
    setCompressedOn,
    generateError
}: {
    userId:string
    setCompressedOn: () => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
}) {
    const queryClient = useQueryClient()

    const [ isCurrectPasswordVisible, setCurrentPasswordVisible ] = useState(false)
    const [ isPasswordVisible, setPasswordVisible ] = useState(false)

    const userMutation = useMutation({
        mutationFn: (editedPassword: { [k:string]: FormDataEntryValue }) => {
            return fetch('http://localhost:22194/users', {
                method: "PATCH",
                body: JSON.stringify(editedPassword),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((resJson: number | ErrorJSON) => {
                if(typeof resJson != 'number' && 'rawError' in resJson) 
                    throw resJson
                return resJson
            })
            
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
            setCompressedOn()
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        formData.append('_id', userId)

        const formJson = Object.fromEntries(formData.entries())

        userMutation.mutate(formJson)
    }

    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={`${styles['password-wrapper']}`}>
            <form onSubmit={handleSubmit}>
                <div className={styles['input-wrapper']}>
                    <input type={isCurrectPasswordVisible ? "text" : "password"} name="currentPassword" id="currentPassword"  required />
                    <label htmlFor="password">Password </label>
                    <span id="show-password" onClick={() => setCurrentPasswordVisible((isVisible) => !isVisible)}></span>
                </div>

                <div className={styles['input-wrapper']}>
                    <input type={isPasswordVisible ? "text" : "password"} name="newPassword" id="newPassword"  required />
                    <label htmlFor="password">Password </label>
                    <span id="show-password" onClick={() => setPasswordVisible((isVisible) => !isVisible)}></span>
                </div>

                <button className={userMutation.isSuccess ? styles['success'] : ""} type="submit">Save</button>
            </form>
            <button className={styles['exit-button']} onClick={
                () => {setCompressedOn()}
            }>Exit</button>
        </div>
        </>
    )
}