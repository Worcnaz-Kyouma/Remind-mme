import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/Member.module.scss"
import TeamModel from "@shared/models/TeamModel"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import HoverData from "./HoverData"

export default function Member({
    user,
    userLevel,
    loggedUser,
    loggedUserLevel,
    maxTeamLevel,
    team,
    setUserShowcaseData,
    segmentWrapperRef
}: {
    user: UserModel
    userLevel: number
    loggedUser: UserModel
    loggedUserLevel: number
    maxTeamLevel: number
    team: TeamModel
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, loggedUserLevel:number, maxTeamLevel:number, team:TeamModel}) => void
    segmentWrapperRef: MutableRefObject<HTMLDivElement | null>
}) {
    const [ isHover, setIsHover ] = useState(false)
    const [ inLeft, setInLeft ] = useState(true)
    const memberWrapperDOMRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const rect = memberWrapperDOMRef.current!.getBoundingClientRect()
            if(rect.left>window.innerWidth/2)
                setInLeft(false)
            else
                setInLeft(true)
        })

        observer.observe(segmentWrapperRef.current as HTMLDivElement)

        return () => observer.disconnect()
    }, [inLeft])

    return (
    <>
        <div className={styles['member-wrapper']}
         ref={memberWrapperDOMRef} onClick={() => {
            setUserShowcaseData({user, userLevel, loggedUser, loggedUserLevel, maxTeamLevel, team})
        }} >
            {isHover && !inLeft && <HoverData user={user} inLeft={false} />}
            <div className={styles['image-wrapper']} onMouseEnter={() => {
                setIsHover(true)
            }} onMouseLeave={() => {
                setIsHover(false)
            }}>
                <img src={`http://localhost:22194/${user.imageUrl}`} alt="Member image" />
            </div>
            {isHover && inLeft && <HoverData user={user} inLeft={true} />}
        </div>
    </>
    )
}