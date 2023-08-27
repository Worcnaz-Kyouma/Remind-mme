import UserModel from "@shared/models/UserModel"

export default function SegmentTeam({
    level,
    users
}: {
    level: string,
    users: UserModel[]
}) {
    console.log("Level:" + level, users)
    return <h1>SegmentTeam</h1>
}