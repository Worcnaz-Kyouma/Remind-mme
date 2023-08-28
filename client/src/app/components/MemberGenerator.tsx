import TeamModel from "@shared/models/TeamModel";
import styles from "@/app/styles/components/MemberGenerator.module.scss" 
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserModel from "@shared/models/UserModel";
import ErrorJSON from "@shared/models/ErrorJSON";
import FoundUser from "./FoundUser";

export default function UserTeamGenerator({
    team,
    closeModal
}: {
    team: TeamModel
    closeModal: () => void
}) {
    const [ inputSearchType, setInputSearchType ] = useState<string>("text")
    const [ page, setPage ] = useState(1)

    const fieldInputDOMRef = useRef<HTMLSelectElement|null>(null)
    const valueInputDOMRef = useRef<HTMLInputElement|null>(null)
    const levelInputDOMRef = useRef<HTMLInputElement|null>(null)
 
    const userSearchMutation = useMutation({
        mutationFn: ({page, field, value}:{page:number, field:string, value:string}) => {
            const limit = 3

            return fetch(`http://localhost:22194/users/search/?limit=${limit}&page=${page}&field=${field}&value=${value}&teamId=${team._id}`)
                .then(res => res.json())
                .then((resJson: { users: UserModel[], totalPages: number, currentPage: number } | ErrorJSON) => {
                    if('error' in resJson)
                        throw resJson
                    return resJson
                })
        },
    })


    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={styles['search-wrapper']}>
            <div className={styles['inputs-wrapper']}>
                <div className={styles['input-wrapper']}>
                    <select name="field" id="field" defaultValue={"name"} ref={fieldInputDOMRef} onChange={(event) => {
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
                    <input type={inputSearchType} ref={valueInputDOMRef} name="value" id="value"/>
                </div>

                <button onClick={() => {
                    userSearchMutation.mutate({
                        page:page, field: fieldInputDOMRef.current!.value, value: valueInputDOMRef.current!.value
                    })
                }}>Search</button>
            </div>

            {userSearchMutation.data && userSearchMutation.data.totalPages!==0 && <div className={styles['users-wrapper']}>
                <div className={styles['input-wrapper']}>
                    <label htmlFor="level">Level </label>
                    <input type="number" name="level" ref={levelInputDOMRef} id="level" defaultValue={1}/>
                </div>
                {userSearchMutation.data.users.map(user => 
                    <FoundUser key={user._id} user={user} team={team._id as string} level={levelInputDOMRef.current?.value} />
                )}

                <div className={styles['btn-page-controllers']}>
                    <button onClick={() => {
                        setPage(page => ++page)
                        userSearchMutation.mutate({
                            page:page+1, field: fieldInputDOMRef.current!.value, value: valueInputDOMRef.current!.value
                        })
                    }} disabled={page===userSearchMutation.data?.totalPages}>Back</button>
                    <button onClick={() => {
                        setPage(page => --page)
                        userSearchMutation.mutate({
                            page:page-1, field: fieldInputDOMRef.current!.value, value: valueInputDOMRef.current!.value
                        })
                    }} disabled={page===1}>Forward</button>
                </div>
            </div>}

            <button className={styles['exit-button']} onClick={closeModal}>Exit</button>
        </div>
        </>
    )
}