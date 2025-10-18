"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { ModernSidebar } from "@/components/navigation/modern-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const href = '/' + segments.slice(0, i + 1).join('/')
      const isLast = i === segments.length - 1
      
      let label = segment
      switch (segment) {
        case 'admin':
          label = 'Admin'
          break
        case 'analytics':
          label = 'Analytics'
          break
        case 'users':
          label = 'Users'
          break
        case 'departments':
          label = 'Departments'
          break
        case 'all-concerns':
          label = 'All Concerns'
          break
        case 'announcements':
          label = 'Announcements'
          break
        case 'notifications':
          label = 'Notifications'
          break
        case 'chatbot':
          label = 'AI Chatbot'
          break
        case 'settings':
          label = 'Settings'
          break
        case 'reports':
          label = 'Reports'
          break
        case 'emergency':
          label = 'Emergency'
          break
        case 'audit-logs':
          label = 'Audit Logs'
          break
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }
      
      breadcrumbs.push({
        href,
        label,
        isLast
      })
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarProvider defaultOpen={true} className="sidebar-provider">
        <div className="flex min-h-screen w-full">
          <ModernSidebar />
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.href} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage className="font-medium">
                            {breadcrumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
