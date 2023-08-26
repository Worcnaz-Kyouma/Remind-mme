'use client'
import { useMutation, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const router = useRouter()

    // const [ usernameInvalid, setUsernameInvalid ] = useState<boolean>(false)

    const userMutation = useMutation({
        mutationFn: (newUser: FormData) => {
            return fetch('http://localhost:22194/users', {
                method: "POST",
                body: newUser,
                credentials: 'include',
                headers: {
                    "Accept": "application/json"
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
            router.push('./../')
        },
        onError: (err) => {
            console.log(err)
        }
    })

    /*const userValidateMutation = useMutation({
        mutationFn: (username: string) => {
            return fetch(`http://localhost:22194/users/username/${username}`)
                .then((res) => res.json())
                .then((resJson) => {
                    if(resJson?.error)
                        throw resJson.error
                    return resJson
                })
                .then((resJson) => {
                    if(resJson)
                        return true
                    return false
                })
        }
    })*/

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        userMutation.mutate(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="image">Image </label>
                <input type="file" name="image" id="image" accept="image/*" />

                <label htmlFor="username">Username </label>
                <input type="text" name="username" id="username" required />

                {/*onChange={(event) => {
                    if (!userValidateMutation.data) {
                        event.target.setCustomValidity("Username already in use"); 
                    } else {
                        event.target.setCustomValidity("");
                    }
                }}*/}

                <label htmlFor="password">Password </label>
                <input type="password" name="password" id="password" required />

                <label htmlFor="name">Name </label>
                <input type="text" name="name" id="name" required />

                <label htmlFor="email">Email </label>
                <input type="email" name="email" id="email" required />

                <label htmlFor="phone">Phone </label>
                <input type="tel" name="phone" id="phone" />

                <label htmlFor="bornDate">Born date </label>
                <input type="date" name="bornDate" id="bornDate" required max={new Date().toISOString().slice(0,10)} />

                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}