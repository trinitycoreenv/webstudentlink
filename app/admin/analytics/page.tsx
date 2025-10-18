"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Building,
  Star
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { MetricCard } from "@/components/analytics/metric-card"
import { ChartContainer } from "@/components/analytics/chart-container"

interface AnalyticsData {
  overview: {
    total_concerns: number
    pending_concerns: number
    in_progress_concerns: number
    resolved_concerns: number
    confirmed_concerns: number
    urgent_concerns: number
    high_priority_concerns: number
    archived_concerns: number
    resolution_rate: number
    avg_resolution_time: number
  }
  performance: {
    avg_first_response_time_hours: number
    avg_resolution_time_hours: number
    fastest_resolution_hours: number
    slowest_resolution_hours: number
    resolved_within_24h: number
    resolved_within_48h: number
    resolution_within_24h_rate: number
    resolution_within_48h_rate: number
  }
  trends: {
    period: string
    data: Array<{
      period: string
      total_concerns: number
      resolved_concerns: number
      urgent_concerns: number
      avg_resolution_time: number
      resolution_rate: number
    }>
  }
  department_analytics: Array<{
    id: number
    name: string
    code: string
    total_concerns: number
    resolved_concerns: number
    urgent_concerns: number
    staff_count: number
    avg_resolution_time: number
    resolution_rate: number
    workload_per_staff: number
  }>
  staff_analytics: Array<{
    id: number
    name: string
    email: string
    department: string
    total_assigned: number
    resolved_concerns: number
    urgent_concerns: number
    avg_resolution_time: number
    resolution_rate: number
  }>
  response_times: {
    avg_first_response_minutes: number
    avg_resolution_hours: number
    responded_within_30min: number
    responded_within_1hour: number
    resolved_within_2hours: number
    resolved_within_24hours: number
    response_within_30min_rate: number
    response_within_1hour_rate: number
  }
  satisfaction_metrics: {
    avg_rating: number
    high_ratings: number
    good_ratings: number
    low_ratings: number
    total_rated: number
    satisfaction_rate: number
  }
}

export default function AdvancedAnalyticsPage() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    period: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly',
    department_id: undefined as number | undefined,
  })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [filters])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiClient.getAdvancedAnalytics(filters)
      setAnalyticsData(data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await apiClient.clearAnalyticsCache()
      await fetchAnalytics()
    } catch (err) {
      console.error('Failed to refresh analytics:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (!user || !['admin', 'department_head'].includes(user.role)) {
    return <div>Access denied</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
        <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">
              Comprehensive insights and performance metrics
            </p>
          </div>
        <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          <Badge variant="secondary" className="text-xs">
              {user.role === 'admin' ? 'System Admin' : 'Department Head'}
            </Badge>
          </div>
        </div>

      {/* Analytics Filters */}
      <Card className="border-0 shadow-sm">
          <CardHeader>
          <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
        <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Error Loading Analytics</p>
              <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchAnalytics}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : analyticsData ? (
        <div className="space-y-8">
          {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Concerns</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.total_concerns}</div>
                <p className="text-xs text-muted-foreground mt-1">All concerns tracked</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.resolved_concerns}</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.overview.resolution_rate}% resolution rate</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Urgent Concerns</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.urgent_concerns}</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.overview.high_priority_concerns} high priority</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution Time</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.avg_resolution_time}h</div>
                <p className="text-xs text-muted-foreground mt-1">Average time to resolve</p>
              </CardContent>
            </Card>
            </div>

          {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">First Response</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.performance.avg_first_response_time_hours}h</div>
                <p className="text-xs text-muted-foreground mt-1">Average first response time</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">24h Resolution</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.performance.resolution_within_24h_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.performance.resolved_within_24h} concerns</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">48h Resolution</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.performance.resolution_within_48h_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.performance.resolved_within_48h} concerns</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fastest Resolution</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.performance.fastest_resolution_hours}h</div>
                <p className="text-xs text-muted-foreground mt-1">Best performance</p>
              </CardContent>
            </Card>
            </div>

          {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Concerns Over Time</CardTitle>
              </CardHeader>
              <CardContent>
              <ChartContainer
                title="Concerns Over Time"
                chartType="concerns_over_time"
                filters={filters}
              />
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
              <ChartContainer
                title="Priority Distribution"
                chartType="priority_distribution"
                filters={filters}
              />
              </CardContent>
            </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
              <ChartContainer
                title="Department Performance"
                chartType="department_performance"
                filters={filters}
              />
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Resolution Times</CardTitle>
              </CardHeader>
              <CardContent>
              <ChartContainer
                title="Resolution Times"
                chartType="resolution_times"
                filters={filters}
              />
              </CardContent>
            </Card>
            </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Staff Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer
              title="Staff Workload Distribution"
              chartType="staff_workload"
              filters={filters}
            />
            </CardContent>
          </Card>

          {/* Department Performance Table */}
          <Card className="border-0 shadow-sm">
              <CardHeader>
              <CardTitle className="flex items-center text-lg">
                  <Building className="h-5 w-5 mr-2" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Total Concerns</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Resolved</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Resolution Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Avg Time</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Staff Count</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Workload/Staff</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.department_analytics.map((dept) => (
                      <tr key={dept.id} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                            <div className="font-medium text-sm">{dept.name}</div>
                            <div className="text-xs text-muted-foreground">{dept.code}</div>
                            </div>
                          </td>
                        <td className="text-right py-3 px-4 text-sm">{dept.total_concerns}</td>
                        <td className="text-right py-3 px-4 text-sm">{dept.resolved_concerns}</td>
                          <td className="text-right py-3 px-4">
                          <Badge variant={dept.resolution_rate >= 80 ? "default" : "secondary"} className="text-xs">
                              {dept.resolution_rate}%
                            </Badge>
                          </td>
                        <td className="text-right py-3 px-4 text-sm">{dept.avg_resolution_time}h</td>
                        <td className="text-right py-3 px-4 text-sm">{dept.staff_count}</td>
                        <td className="text-right py-3 px-4 text-sm">{dept.workload_per_staff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          {/* Staff Performance Table */}
          <Card className="border-0 shadow-sm">
              <CardHeader>
              <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Top Performing Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Staff Member</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Total Assigned</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Resolved</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Resolution Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Avg Time</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Urgent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.staff_analytics.map((staff) => (
                      <tr key={staff.id} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                            <div className="font-medium text-sm">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                            </div>
                          </td>
                        <td className="py-3 px-4 text-sm">{staff.department}</td>
                        <td className="text-right py-3 px-4 text-sm">{staff.total_assigned}</td>
                        <td className="text-right py-3 px-4 text-sm">{staff.resolved_concerns}</td>
                          <td className="text-right py-3 px-4">
                          <Badge variant={staff.resolution_rate >= 80 ? "default" : "secondary"} className="text-xs">
                              {staff.resolution_rate}%
                            </Badge>
                          </td>
                        <td className="text-right py-3 px-4 text-sm">{staff.avg_resolution_time}h</td>
                          <td className="text-right py-3 px-4">
                            {staff.urgent_concerns > 0 && (
                            <Badge variant="destructive" className="text-xs">{staff.urgent_concerns}</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          {/* Satisfaction Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.satisfaction_metrics.avg_rating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.satisfaction_metrics.total_rated} total ratings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction Rate</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.satisfaction_metrics.satisfaction_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">{analyticsData.satisfaction_metrics.high_ratings} high ratings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData.response_times.response_within_30min_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Within 30 minutes</p>
              </CardContent>
            </Card>
            </div>
          </div>
        ) : null}
    </div>
  )
}