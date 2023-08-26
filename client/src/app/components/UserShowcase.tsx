'use client'
import { useRef, useState } from "react"
import styles from "./../styles/components/UserShowcase.module.scss"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function UserShowcase({
    user,
    loggedUser,
    setCompressedOn,
}: {
    user:any,
    loggedUser:any,
    setCompressedOn: () => void
}) {
    const [ imgSrc, setImgSrc ] = useState<string|null>(null)
    const [ haveChanges, setHaveChanges ] = useState(false)
    const [ isPasswordVisible, setPasswordVisible ] = useState(false)
    const queryClient = useQueryClient()

    const userMutation = useMutation({
        mutationFn: (editedUser: FormData) => {
            return fetch('http://localhost:22194/users', {
                method: "PUT",
                body: editedUser,
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
            queryClient.invalidateQueries(["users"])
            console.log('success')

        },
        onError: (err) => {
            console.log(err)
        }
    })

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        formData.append('_id', user._id)
        formData.append('webToken', user.webToken)
        formData.append('createdAt', user.createdAt)
        formData.append('imageUrl', user.imageUrl)

        //console.log(Object.fromEntries(formData.entries()))

        userMutation.mutate(formData)
    }

    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={`${styles['showcase-wrapper']} ${user._id !== loggedUser._id && styles['not-editable']}`}>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" id="image" accept="image/*" onChange={(event) => {
                    setHaveChanges(true)
                    const input = event.currentTarget.files
                    if (input){
                        const file = input[0]
                        const reader = new FileReader()

                        reader.onloadend = () => {
                            typeof reader.result === "string" && setImgSrc(reader.result)
                        }

                        if (file) {
                            reader.readAsDataURL(file)
                        }
                    }
                }}/>
                <div className={styles['image-wrapper']}>
                    <label htmlFor="image">
                        <img src={imgSrc || `http://localhost:22194/${user.imageUrl}`} alt="Character image"/>
                    </label>
                </div>

                <div className={styles['inputs-wrapper']}>
                    <div className={styles['input-wrapper']}>
                        <input type="text" name="username" id="username" required defaultValue={user.username} readOnly={user._id !== loggedUser._id} onChange={() => setHaveChanges(true)}/>
                        <label htmlFor="username">Username </label>
                    </div>
                    {user._id === loggedUser._id &&
                        <div className={styles['input-wrapper']}>
                            <input type={isPasswordVisible ? "text" : "password"} name="password" id="password"  required defaultValue={user.password} onChange={() => setHaveChanges(true)}/>
                            <label htmlFor="password">Password </label>
                            <span id="show-password" onClick={() => setPasswordVisible((isVisible) => !isVisible)}></span>
                        </div>
                    }
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="text" name="name" id="name" required defaultValue={user.name} readOnly={user._id !== loggedUser._id} onChange={() => setHaveChanges(true)}/>
                    <label htmlFor="name">Name </label>
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="email" name="email" id="email" required defaultValue={user.email} readOnly={user._id !== loggedUser._id} onChange={() => setHaveChanges(true)}/>
                    <label htmlFor="email">Email </label>
                </div>

                <div className={styles['inputs-wrapper']}>
                    <div className={styles['input-wrapper']}>
                        <input type="tel" name="phone" id="phone" defaultValue={user.phone} readOnly={user._id !== loggedUser._id} onChange={() => setHaveChanges(true)}/>
                        <label htmlFor="phone">Phone </label>
                    </div>
                    <div className={styles['input-wrapper']}>
                        <input type="date" name="bornDate" id="bornDate" required defaultValue={user.bornDate} max={new Date().toISOString().slice(0,10)} readOnly={user._id !== loggedUser._id} onChange={() => setHaveChanges(true)}/>
                        <label htmlFor="bornDate">Born date </label>
                    </div>
                </div>

                {haveChanges &&<button className={userMutation.isSuccess ? styles['success'] : ""} type="submit">Save</button>}
            </form>
            <button className={styles['exit-button']} onClick={
                () => {setCompressedOn()}
            }>Exit</button>
        </div>
        </>
    )
}