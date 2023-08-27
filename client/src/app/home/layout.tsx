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
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className={styles['page-wrapper']}>
                <Header />
                {children}
            </div>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}