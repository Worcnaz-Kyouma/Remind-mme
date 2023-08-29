import TeamModel from "@shared/models/TeamModel";
import styles from "@/app/styles/components/MemberGenerator.module.scss" 
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserModel from "@shared/models/UserModel";
import ErrorJSON from "@shared/models/ErrorJSON";
import FoundUser from "./FoundUser";

export default function UserTeamGenerator({
    team,
    loggedUserLevel,
    closeModal,
    generateError
}: {
    team: TeamModel
    loggedUserLevel: number
    closeModal: () => void
    generateError: Dispatch<SetStateAction<{
        errorTitle: string;
        errorMessage: string;
    } | null>>
}) {
    const [ inputSearchType, setInputSearchType ] = useState<string>("text")
    const [ page, setPage ] = useState(1)
    const [ field, setField ] = useState("name")
    const [ value, setValue ] = useState("")
    const [ level, setLevel ] = useState("1")

    const userSearchMutation = useMutation({
        mutationFn: ({page, field, value}:{page:number, field:string, value:string}) => {
            const limit = 3

            return fetch(`http://localhost:22194/users/search/?limit=${limit}&page=${page}&field=${field}&value=${value}&teamId=${team._id}`)
                .then(res => res.json())
                .then((resJson: { users: UserModel[], totalPages: number, currentPage: number } | ErrorJSON) => {
                    if('rawError' in resJson)
                        throw resJson
                    return resJson
                })
        },
        onError: (error: any) => {
            if('rawError' in error)
                generateError({errorTitle: error.errorTitle, errorMessage: error.errorMessage})
            else
                generateError({errorTitle: 'Error', errorMessage: 'Internal Error'})
        }
    })


    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={styles['search-wrapper']}>
            <div className={styles['input-search-wrapper']}>
                <div className={styles['input-wrapper']}>
                    <select name="field" id="field" value={field} onChange={(event) => {
                        setField(event.target.value)
                        const value = event.target.value
                        if(value === 'name')
                            setInputSearchType('text')
                        else if (value === "email")
                            setInputSearchType('email')
                        else
                            setInputSearchType('tel')
                    }}>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                    </select>
                    <input type={inputSearchType} value={value} name="value" id="value" onChange={(event) => setValue(event.target.value)}/>
                </div>
                <button onClick={() => {
                    userSearchMutation.mutate({
                        page:page, field: field, value: value
                    })
                }}>Search</button>
            </div>

            {userSearchMutation.data && userSearchMutation.data.totalPages!==0 && <>
                <div className={styles['controllers-wrapper']}>
                    <div className={`${styles['input-wrapper']} ${styles['level-wrapper']}`}>
                        <label htmlFor="level">Level </label>
                        <input type="number" name="level" value={level} id="level" onChange={(event) => setLevel(event.target.value)} max={loggedUserLevel}/>
                    </div>

                    <div className={styles['btn-page-controllers']}>
                        <button onClick={() => {
                            setPage(page => --page)
                            userSearchMutation.mutate({
                                page:page-1, field: field, value: value
                            })
                        }} disabled={page===1}></button>
                        <span>{page}/{userSearchMutation.data?.totalPages}</span>
                        <button onClick={() => {
                            setPage(page => ++page)
                            userSearchMutation.mutate({
                                page:page+1, field: field, value: value
                            })
                        }} disabled={page===userSearchMutation.data?.totalPages}></button>
                    </div>
                </div>
                <div className={styles['users-wrapper']}>
                    {userSearchMutation.data.users.map(user =>
                        <FoundUser key={user._id} generateError={generateError} user={user} teamId={team._id as string} level={level} refetchUserList={() => {
                            userSearchMutation.mutate({
                                page:page, field: field, value: value
                            })
                        }} />
                    )}
                </div>
            </>}

            <button className={styles['exit-button']} onClick={closeModal}>Exit</button>
        </div>
        </>
    )
}