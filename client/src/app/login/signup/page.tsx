'use client'
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import styles from "@/app/styles/signup.module.scss"

export default function Login() {
    const router = useRouter()

    const imgElementRef = useRef(null)
    const [ imgSrc, setImgSrc ] = useState<string|null>(null)
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

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        userMutation.mutate(formData)
    }

    return (
        <div className={styles['div-wrapper']}>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" id="image" accept="image/*" onChange={(event) => {
                    const input = event.currentTarget.files
                    if (input){
                        const file = input[0]
                        const reader = new FileReader()

                        reader.onloadend = () => {
                            setImgSrc(typeof reader.result === "string" ? reader.result : null)
                        }

                        if (file) {
                            reader.readAsDataURL(file)
                        }
                    }
                }}/>
                <div className={styles['image-wrapper']}>
                    <label htmlFor="image">
                        {!imgSrc
                            ? <span>+</span>
                            : <img src={imgSrc} ref={imgElementRef} alt="Character image"/>
                        }
                    </label>
                </div>

                <div className={styles['inputs-wrapper']}>
                    <div className={styles['input-wrapper']}>
                        <input type="text" name="username" id="username" placeholder=' ' required />
                        <label htmlFor="username">Username </label>
                    </div>
                    <div className={styles['input-wrapper']}>
                        <input type="password" name="password" id="password" placeholder=' ' required />
                        <label htmlFor="password">Password </label>
                    </div>
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="text" name="name" id="name" required placeholder=' ' />
                    <label htmlFor="name">Name </label>
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="email" name="email" id="email" required placeholder=' ' />
                    <label htmlFor="email">Email </label>
                </div>

                <div className={styles['inputs-wrapper']}>
                    <div className={styles['input-wrapper']}>
                        <input type="tel" name="phone" id="phone" placeholder=' ' />
                        <label htmlFor="phone">Phone </label>
                    </div>
                    <div className={styles['input-wrapper']}>
                        <input type="date" name="bornDate" id="bornDate" required max={new Date().toISOString().slice(0,10)} />
                        <label htmlFor="bornDate">Born date </label>
                    </div>
                </div>

                <button type="submit">Sign up</button>
            </form>
            <button className={styles['login-button']} onClick={() => router.push('./')}>Login</button>
        </div>
    )
}