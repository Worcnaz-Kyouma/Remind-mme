'use client'
import { Dispatch, SetStateAction, useRef, useState } from "react"
import styles from "./../styles/components/UserShowcase.module.scss"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import User from "@shared/models/UserModel"
import TeamModel from "@shared/models/TeamModel"
import RemoveMember from "./RemoveMember"

export default function UserShowcase({
    user,
    userLevel,
    loggedUser,
    loggedUserLevel,
    maxTeamLevel,
    team,
    setCompressedOn,
    generateError,
    canChangeUserData=false
}: {
    user: UserModel
    userLevel?: number
    loggedUser: UserModel
    loggedUserLevel?: number
    maxTeamLevel?: number
    team?: TeamModel
    setCompressedOn: () => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
    canChangeUserData: boolean
}) {
    const [ imgSrc, setImgSrc ] = useState<string|null>(null)
    const [ haveChanges, setHaveChanges ] = useState(false)
    //const [ isPasswordVisible, setPasswordVisible ] = useState(false)
    const [ numberValue, setNumberValue ] = useState(user.phone)

    const queryClient = useQueryClient()

    const userMutation = useMutation({
        mutationFn: (editedUser: FormData) => {
            return fetch('http://localhost:22194/users', {
                method: "PUT",
                body: editedUser,
                headers: {
                    "Accept": "application/json"
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
            team && queryClient.invalidateQueries(['segments', team._id])
            setCompressedOn()
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })

    const userTeamMutation = useMutation({
        mutationFn: (newLevel:string) => {
            return fetch('http://localhost:22194/usersteams/?userId=${}&teamId=${}', {
                method: "PATCH",
                body: JSON.stringify({ newLevel: newLevel })
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
            team && queryClient.invalidateQueries(['segments', team._id])
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

        if(!canChangeUserData)
            userTeamMutation.mutate(formData.get('level') as string)

        else{
            formData.append('_id', user._id as string)
            formData.append('webToken', user.webToken as string)
            formData.append('createdAt', user.createdAt as string)
            formData.append('imageUrl', user.imageUrl as string)
        
            userMutation.mutate(formData)
        }
    }

    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={`${styles['showcase-wrapper']} ${!canChangeUserData && styles['not-editable']} ${team && styles.fixerror}`}>
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
                        <input type="text" name="username" id="username" required defaultValue={user.username} readOnly={!canChangeUserData} onChange={() => setHaveChanges(true)}/>
                        <label htmlFor="username">Username </label>
                    </div>
                    {canChangeUserData &&
                        <div className={styles['input-wrapper']}>
                            <input type={isPasswordVisible ? "text" : "password"} name="password" id="password"  required defaultValue={user.password} onChange={() => setHaveChanges(true)}/>
                            <label htmlFor="password">Password </label>
                            <span id="show-password" onClick={() => setPasswordVisible((isVisible) => !isVisible)}></span>
                        </div>
                    }
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="text" name="name" id="name" required defaultValue={user.name} readOnly={!canChangeUserData} onChange={() => setHaveChanges(true)}/>
                    <label htmlFor="name">Name </label>
                </div>

                <div className={styles['input-wrapper']}>
                    <input type="email" name="email" id="email" required defaultValue={user.email} readOnly={!canChangeUserData} onChange={() => setHaveChanges(true)}/>
                    <label htmlFor="email">Email </label>
                </div>

                <div className={styles['inputs-wrapper']}>
                    <div className={styles['input-wrapper']}>
                        <input type="text" name="phone" id="phone" value={numberValue} readOnly={!canChangeUserData} onChange={(event) => {
                            let formatedValue = event.currentTarget.value
                            
                            formatedValue = formatedValue.replace(/\D/g, '')
                            formatedValue = formatedValue.replace(/^(\d{2})(\d)/g, '($1) $2')              
                            formatedValue = formatedValue.replace(/(\d)(\d{4})$/, '$1-$2')
                        
                            setNumberValue(formatedValue)
                            setHaveChanges(true)
                        }}/>
                        <label htmlFor="phone">Phone </label>
                    </div>
                    <div className={styles['input-wrapper']}>
                        <input type="date" name="bornDate" id="bornDate" required defaultValue={user.bornDate} max={new Date().toISOString().slice(0,10)} readOnly={!canChangeUserData} onChange={() => setHaveChanges(true)}/>
                        <label htmlFor="bornDate">Born date </label>
                    </div>
                </div>
                
                {loggedUserLevel && userLevel && maxTeamLevel &&
                    <div className={styles['additional-data-wrapper']}>
                        <div className={styles['level-wrapper']}>
                            <label htmlFor="level">Level </label>
                            <input type="number" name="level" id="level" required defaultValue={userLevel} max={loggedUserLevel<maxTeamLevel  ? loggedUserLevel : undefined} readOnly={loggedUserLevel<=userLevel && maxTeamLevel!=loggedUserLevel} onChange={() => setHaveChanges(true)}/>
                        </div>
                        {(loggedUserLevel>userLevel || maxTeamLevel==loggedUserLevel) && loggedUser._id!=user._id && <RemoveMember generateError={generateError} userId={user._id as string} teamId={team!._id as string} setCompressedOn={setCompressedOn}/>}
                    </div>
                }

                {haveChanges &&<button className={userMutation.isSuccess ? styles['success'] : ""} type="submit">Save</button>}
            </form>
            <button className={styles['exit-button']} onClick={
                () => {setCompressedOn()}
            }>Exit</button>
        </div>
        </>
    )
}