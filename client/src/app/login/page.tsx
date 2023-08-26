'use client'
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter()

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
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username </label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password </label>
                <input type="password" name="password" id="password" />
                <button type="submit">Login</button>
            </form>

            <Link href="login/signup/">Sign Up</Link>
        </div>
    )
}