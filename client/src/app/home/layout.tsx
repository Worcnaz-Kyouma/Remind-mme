'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "../components/Header"
import UserShowcase from "../components/UserShowcase"

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Header />
            {children}
        </QueryClientProvider>
    )
}