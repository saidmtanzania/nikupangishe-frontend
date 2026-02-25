import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Nikupangishe",
  description: "Manage your properties, tenancies, and more on Nikupangishe.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {children}
    </div>
  )
}
