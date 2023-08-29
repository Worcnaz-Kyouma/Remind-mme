import { useQueryClient } from "@tanstack/react-query";
import styles from "@/app/styles/components/LogoutButton.module.scss"

export default function LogoutButton() {
    const queryClient = useQueryClient()

    function deleteCookie(cookieName:string) {
        document.cookie = cookieName + "=" +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    }

    return <button className={styles['logout-button']} onClick={() => {
        deleteCookie('SESSIONRMM')
        queryClient.invalidateQueries(['users'])
    }}>Logout</button>
}