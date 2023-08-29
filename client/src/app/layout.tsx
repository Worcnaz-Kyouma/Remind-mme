import React from 'react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remmind-mme',
  description: 'Keep calm, we gonna remind you!',
  icons:{
    icon: '/next.svg'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {

  return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
  )
}
