'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "../components/Header"
import styles from "@/app/styles/home.module.scss"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles['page-wrapper']}>
            <Header />
            {children}
        </div>
    )
}