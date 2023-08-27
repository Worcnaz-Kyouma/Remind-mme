import UserModel from "@shared/models/UserModel"

export default function SegmentTeam({
    level,
    users
}: {
    level: string,
    users: UserModel[]
}) {
    return <h1>SegmentTeam</h1>
}