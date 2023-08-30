import styles from "@/app/styles/components/Loading.module.scss"
export default function Loading() {
    return <div className={styles['loading-wrapper']}>
        <div className={styles['loading']}></div>
    </div>
}