"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  Bot,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Star,
  Building2,
  UserCheck,
  Globe,
  Cpu
} from "lucide-react"
import { apiClient, DashboardStats } from "@/lib/api-client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await apiClient.getDashboardStats()
        setStats(dashboardStats)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Navigation handlers
  const handleManageUsers = () => {
    router.push('/admin/users')
  }

  const handleDatabaseAdmin = () => {
    router.push('/admin/settings')
  }

  const handleSystemConfig = () => {
    router.push('/admin/settings')
  }

  const handleAIChatbot = () => {
    router.push('/admin/chatbot')
  }

  const handleSystemAnalytics = () => {
    router.push('/admin/reports')
  }

  const handleNotificationCenter = () => {
    router.push('/admin/announcements')
  }
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Action Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#1E2A78] hover:bg-[#2480EA]">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and management tools for administrators
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Concerns</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.activeConcerns || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently open</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.systemHealth || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">System uptime</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Interactions</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.aiInteractions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </div>
            <CardTitle className="text-lg font-semibold">User Management</CardTitle>
            <CardDescription>Manage all system users and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleManageUsers}
              className="w-full"
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </div>
            <CardTitle className="text-lg font-semibold">System Settings</CardTitle>
            <CardDescription>Configure system-wide settings and database</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDatabaseAdmin}
              className="w-full"
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" />
              System Config
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
            </div>
            <CardTitle className="text-lg font-semibold">AI & Analytics</CardTitle>
            <CardDescription>Configure AI features and view analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAIChatbot}
              className="w-full"
              variant="outline"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              AI Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Activity Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Department Activity</CardTitle>
                <CardDescription>Latest department activities and performance</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.departmentStats && stats.departmentStats.length > 0 ? (
              stats.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{dept.department}</p>
                        <p className="text-xs text-muted-foreground">
                          {dept.concernCount} concerns • {dept.resolvedCount} resolved
                    </p>
                  </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No activity data</p>
                  <p className="text-xs text-muted-foreground mt-1">Activity will appear here once departments start using the system</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">System Health</p>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  {stats?.systemHealth || 0}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">API Status</p>
                    <p className="text-xs text-muted-foreground">All endpoints responding</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Services</p>
                    <p className="text-xs text-muted-foreground">Chatbot and analytics active</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                  Active
                </Badge>
              </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
