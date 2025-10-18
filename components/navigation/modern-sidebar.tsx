"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Users,
  MessageSquare,
  Bell,
  BarChart3,
  Database,
  Bot,
  LogOut,
  User,
  TrendingUp,
  AlertTriangle,
  FileText,
  Building,
  Shield,
  AlertCircle,
  Activity,
  Settings,
  Home,
  Zap,
  Star,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { generateDepartmentSlug } from "@/lib/utils/department-utils"
import { cn } from "@/lib/utils"

export function ModernSidebar() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Small delay to ensure proper rendering
    const timer = setTimeout(() => setIsReady(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!user || !isReady) return null

  const getNavItems = () => {
    switch (user.role) {
      case "admin":
        return [
          {
            group: "Overview",
            items: [
              { href: "/admin", icon: Home, label: "Dashboard", badge: null },
              { href: "/admin/analytics", icon: TrendingUp, label: "Analytics", badge: "NEW" },
            ]
          },
          {
            group: "Management",
            items: [
              { href: "/admin/users", icon: Users, label: "User Management", badge: null },
              { href: "/admin/departments", icon: Building, label: "Departments", badge: null },
              { href: "/admin/all-concerns", icon: MessageSquare, label: "All Concerns", badge: null },
            ]
          },
          {
            group: "Communication",
            items: [
              { href: "/department/chat", icon: MessageSquare, label: "Real-time Chat", badge: null },
              { href: "/admin/announcements", icon: Bell, label: "Announcements", badge: null },
              { href: "/admin/notifications", icon: Bell, label: "Push Notifications", badge: null },
            ]
          },
          {
            group: "AI & Automation",
            items: [
              { href: "/admin/chatbot", icon: Bot, label: "AI Chatbot", badge: null },
            ]
          },
          {
            group: "System",
            items: [
              { href: "/admin/settings", icon: Database, label: "System Settings", badge: null },
              { href: "/admin/reports", icon: BarChart3, label: "Reports", badge: null },
              { href: "/admin/emergency", icon: AlertTriangle, label: "Emergency Help", badge: null },
              { href: "/admin/audit-logs", icon: FileText, label: "Audit Logs", badge: null },
            ]
          }
        ]

      case "department_head":
        const departmentSlug = generateDepartmentSlug(user.department || '')
        return [
          {
            group: "Overview",
            items: [
              { href: `/department/${departmentSlug}`, icon: Home, label: "Dashboard", badge: null },
              { href: `/department/${departmentSlug}?tab=analytics`, icon: TrendingUp, label: "Analytics", badge: null },
            ]
          },
          {
            group: "Management",
            items: [
              { href: `/department/${departmentSlug}?tab=concerns`, icon: MessageSquare, label: "Department Concerns", badge: null },
              { href: `/department/${departmentSlug}?tab=staff`, icon: Users, label: "Staff Management", badge: null },
              { href: `/department/oversight`, icon: Activity, label: "Staff Oversight", badge: null },
            ]
          },
          {
            group: "Communication",
            items: [
              { href: `/department/${departmentSlug}?tab=announcements`, icon: Bell, label: "Announcements", badge: null },
            ]
          },
          {
            group: "Settings",
            items: [
              { href: `/department/${departmentSlug}?tab=settings`, icon: Settings, label: "Settings", badge: null },
            ]
          }
        ]

      case "staff":
        const staffDepartmentSlug = generateDepartmentSlug(user.department || '')
        return [
          {
            group: "Overview",
            items: [
              { href: `/staff/dashboard`, icon: Home, label: "My Dashboard", badge: null },
              { href: `/staff/analytics`, icon: TrendingUp, label: "My Analytics", badge: null },
            ]
          },
          {
            group: "Work",
            items: [
              { href: `/staff/concerns`, icon: MessageSquare, label: "My Concerns", badge: null },
              { href: `/staff/chat`, icon: MessageSquare, label: "Real-time Chat", badge: null },
            ]
          },
          {
            group: "Account",
            items: [
              { href: `/staff/profile`, icon: User, label: "My Profile", badge: null },
            ]
          }
        ]

      default:
        return []
    }
  }

  const navGroups = getNavItems()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-br from-red-500 to-red-600'
      case 'department_head':
        return 'bg-gradient-to-br from-blue-500 to-blue-600'
      case 'staff':
        return 'bg-gradient-to-br from-green-500 to-green-600'
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield
      case 'department_head':
        return Building
      case 'staff':
        return User
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <Sidebar variant="inset" className="border-r-0" style={{ contain: 'layout style paint' }}>
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2A78] to-[#2480EA] flex items-center justify-center shadow-lg">
              <Image 
                src="/studentlinklogo.png" 
                alt="StudentLink Logo" 
                width={24} 
                height={24}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#E22824] to-[#DC2626] rounded-full border-2 border-background flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#1E2A78] tracking-tight truncate">
              StudentLink
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.group} className="px-2">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 px-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#1E2A78]/10 data-[active=true]:to-[#2480EA]/10",
                        "data-[active=true]:text-[#1E2A78] data-[active=true]:font-semibold",
                        "data-[active=true]:border-l-2 data-[active=true]:border-[#1E2A78]"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-gradient-to-r from-[#E22824] to-[#DC2626] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < navGroups.length - 1 && (
              <SidebarSeparator className="mx-2 my-4" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <div className="space-y-2">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10 border border-sidebar-border/50">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className={cn("text-white font-semibold", getRoleColor(user.role))}>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E2A78] truncate text-sm">
                {user.name}
              </p>
              <div className="flex items-center gap-1">
                <RoleIcon className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground capitalize font-medium">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-9 justify-start text-xs font-medium hover:bg-sidebar-accent/50"
            >
              <Link href={`/${user.role}/profile`}>
                <User className="w-3 h-3 mr-2" />
                Profile
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 justify-start text-xs font-medium hover:bg-red-50 hover:text-red-600"
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <LogOut className="h-8 w-8 text-red-600" />
                  </div>
                  <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                    Sign Out of StudentLink
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 leading-relaxed">
                    You're about to sign out of your account. Any unsaved changes will be lost and you'll need to sign in again to access your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
                    Stay Signed In
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleLogout}
                    className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
