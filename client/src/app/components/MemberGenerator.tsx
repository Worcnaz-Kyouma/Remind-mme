import TeamModel from "@shared/models/TeamModel";
import styles from "@/app/styles/components/MemberGenerator.module.scss" 
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserModel from "@shared/models/UserModel";
import ErrorJSON from "@shared/models/ErrorJSON";

export default function UserTeamGenerator({
    team,
    closeModal
}: {
    team: TeamModel
    closeModal: () => void
}) {
    const [ inputSearchType, setInputSearchType ] = useState<string>("text")
    const [ field, setField ] = useState("name")
    const [ value, setValue ] = useState('')
    const [ page, setPage ] = useState(1)
 
    const userSearchQuery = useQuery({
        queryKey: ['users', 'search'],
        queryFn: () => {
            const limit = 5

            return fetch(`http://localhost:22194/users/search/?limit=${limit}&page=${page}&field=${field}&value=${value}&teamId=${team._id}`)
                .then(res => res.json())
                .then((resJson: UserModel | ErrorJSON) => {
                    if('error' in resJson)
                        throw resJson
                    return resJson
                })
        },
        onSuccess: () => {
            console.log('success')

        },
        onError: (err: ErrorJSON) => {
            console.log(err)
        }
    })


    return (
        <>
        <div className={styles['pseudo-body']} ></div>
        <div className={styles['search-wrapper']}>
            <select name="field" id="field" defaultValue={"name"} onChange={(event) => {
                const value = event.target.value
                if(value === 'name')
                    setInputSearchType('text')
                else if (value === "email")
                    setInputSearchType('email')
                else
                    setInputSearchType('number')
            }}>
                <option value="name">Name</option>

                <option value="email">Email</option>

                <option value="number">Number</option>
            </select>
            <input type={inputSearchType} name="value" id="value"/>
            <button>Search</button>

            <div className={styles['found-users']}></div>

            <div className={styles['btn-page-controllers']}>
                <button>Back</button>
                <button>Forward</button>
            </div>

            <button className={styles['exit-button']} onClick={closeModal}>Exit</button>
        </div>
        </>
    )
}