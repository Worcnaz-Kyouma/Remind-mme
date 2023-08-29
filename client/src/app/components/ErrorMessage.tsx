'use client'
import { useEffect, useState } from "react"
import styles from "@/app/styles/components/ErrorMessage.module.scss"

export default function ErrorMessage({
    errorTitle,
    errorMessage,
    errorTime=5000
}: {
    errorTitle?:string
    errorMessage:string
    errorTime?:number
}) {
    const [ errorTimeout, setErrorTimeout ] = useState(errorTime)
    const [ isDisable, setDisable ] = useState(false)
    
    useEffect(() => {
        setTimeout(() => {
            setDisable(true)
        }, errorTimeout)
    }, [isDisable])

    return(
        <div className={`${styles['fixed-wrapper']}`}>
            <div className={`${styles['error-wrapper']} ${isDisable && styles["disabled"]}`}>
                <h1>{errorTitle || 'Error'}</h1>
                <p>{errorMessage}</p>
                <button className={styles['close-button']} onClick={() => setDisable(true)}></button>
            </div>
        </div>
    )
}