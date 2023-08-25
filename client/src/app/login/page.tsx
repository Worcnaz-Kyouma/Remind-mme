import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter()

    const userMutation = useMutation({
        mutationFn: (user: { [k:string]: FormDataEntryValue }) => {
            return fetch('http://localhost:22194/users', {
                method: "POST",
                body: JSON.stringify(user),
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
        }
    })

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        const formJson = Object.fromEntries(formData.entries())

        userMutation.mutate(formJson)
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username </label>
            <input type="text" name="username" id="username" />

            <label htmlFor="password">Password </label>
            <input type="password" name="password" id="password" />

            <button type="submit">Login</button>
        </form>
    )
}