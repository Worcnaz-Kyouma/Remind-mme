'use client'
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/app/styles/login.module.scss"
import { useState } from "react"

export default function Login() {
    const router = useRouter()
    const [ isPasswordVisible, setPasswordVisible ] = useState(false)

    const userMutation = useMutation({
        mutationFn: (user: { [k:string]: FormDataEntryValue }) => {
            return fetch('http://localhost:22194/users/login', {
                method: "POST",
                body: JSON.stringify(user),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
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
            router.push('./')
        },
        onError: (err) => {
            console.log(err)
        }
    })

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        const formJson = Object.fromEntries(formData.entries())

        userMutation.mutate(formJson)
    }
    
    return (
        <div className={styles['div-wrapper']}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles['input-wrapper']}>
                    <input type="text" name="username" id="username" placeholder=' ' />
                    <label htmlFor="username">Username </label>
                </div>
                <div className={styles['input-wrapper']}>
                    <input type={isPasswordVisible ? "text" : "password"} name="password" id="password" placeholder=' ' />
                    <label htmlFor="password">Password </label>
                    <span id="show-password" onClick={() => setPasswordVisible((isVisible) => !isVisible)}></span>
                </div>
                <button type="submit">Login</button>
            </form>

            <button className={styles['signup-button']} onClick={() => router.push('login/signup')}>Signup</button>
        </div>
    )
}