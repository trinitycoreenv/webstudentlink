"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleBasedNav } from "@/components/navigation/role-based-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Eye,
  MessageCircle,
  Building
} from "lucide-react"
import { apiClient, type Concern } from "@/lib/api-client"
import { ChatHistoryModal } from "@/components/concerns/chat-history-modal"
import { ViewConcernDetailsDialog } from "@/components/staff/view-concern-details-dialog"

export default function StaffConcerns() {
  const { user } = useAuth()
  const [concerns, setConcerns] = useState<Concern[]>([])
  const [archivedConcerns, setArchivedConcerns] = useState<Concern[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isViewDetailsOpen, setViewDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchConcerns = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        const [activeConcerns, archived] = await Promise.all([
          apiClient.getMyConcerns(),
          apiClient.getMyArchivedConcerns()
        ])
        setConcerns(activeConcerns)
        setArchivedConcerns(archived)
      } catch (error) {
        console.error('Failed to fetch concerns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConcerns()
  }, [user])

  const handleChatClick = (concern: Concern) => {
    setSelectedConcern(concern)
    setIsChatModalOpen(true)
  }

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedConcern(null)
  }

  const handleViewDetails = (concern: Concern) => {
    setSelectedConcern(concern)
    setViewDetailsOpen(true)
  }

  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false)
    setSelectedConcern(null)
  }

  // Filter concerns based on search and filters
  const currentConcerns = showArchived ? archivedConcerns : concerns
  const filteredConcerns = currentConcerns.filter(concern => {
    const matchesSearch = concern.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concern.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || concern.status === statusFilter
    const matchesPriority = priorityFilter === "all" || concern.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user || user.role !== 'staff') {
    return (
      <ProtectedRoute allowedRoles={['staff']}>
        <div>Access denied</div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <div className="flex h-screen bg-gray-50">
        <RoleBasedNav />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {showArchived ? 'My Archived Concerns' : 'My Assigned Concerns'}
                </h1>
                <p className="text-gray-600">
                  {showArchived ? 'View completed and archived concerns' : 'Manage concerns assigned to you'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant={showArchived ? "default" : "outline"}
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center space-x-2"
                >
                  <Building className="h-4 w-4" />
                  <span>{showArchived ? 'Show Active' : 'Show Archived'}</span>
                </Button>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {user.department}
                </Badge>
                <Badge variant="secondary">
                  Staff Member
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search concerns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Concerns List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {showArchived ? 'Archived' : 'Assigned'} Concerns ({filteredConcerns.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredConcerns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No concerns found</p>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                        ? "Try adjusting your search or filters" 
                        : showArchived 
                          ? "You don't have any archived concerns yet"
                          : "You don't have any assigned concerns yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredConcerns.map((concern) => (
                      <div key={concern.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{concern.subject}</h3>
                              <Badge variant="outline" className="text-xs">
                                #{concern.reference_number}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {concern.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Building className="h-4 w-4" />
                                <span>{concern.department.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(concern.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(concern.priority)}>
                                {concern.priority}
                              </Badge>
                              <Badge className={getStatusColor(concern.status)}>
                                {concern.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewDetails(concern)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (showArchived) {
                                    // For archived concerns, show chat history modal
                                    handleChatClick(concern)
                                  } else {
                                    // For active concerns, redirect to real-time chat
                                    window.open(`/staff/chat?concern=${concern.id}`, '_blank')
                                  }
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {showArchived ? 'History' : 'Chat'}
                              </Button>
                              {concern.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={async () => {
                                    try {
                                      await apiClient.updateConcernStatus(concern.id, 'in_progress')
                                      setConcerns(prev => prev.map(c => 
                                        c.id === concern.id ? { ...c, status: 'in_progress' } : c
                                      ))
                                      alert('✅ Concern status updated to "In Progress"!')
                                    } catch (error) {
                                      console.error('Failed to update status:', error)
                                      alert('❌ Failed to update concern status. Please try again.')
                                    }
                                  }}
                                >
                                  Start Working
                                </Button>
                              )}
                              {concern.status === 'in_progress' && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={async () => {
                                    try {
                                      await apiClient.updateConcernStatus(concern.id, 'resolved')
                                      setConcerns(prev => prev.map(c => 
                                        c.id === concern.id ? { ...c, status: 'resolved' } : c
                                      ))
                                      alert('✅ Concern marked as "Resolved"!')
                                    } catch (error) {
                                      console.error('Failed to update status:', error)
                                      alert('❌ Failed to update concern status. Please try again.')
                                    }
                                  }}
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Chat History Modal */}
      <ChatHistoryModal
        concern={selectedConcern}
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
      />

      {/* View Concern Details Dialog */}
      {selectedConcern && (
        <ViewConcernDetailsDialog
          concern={selectedConcern}
          isOpen={isViewDetailsOpen}
          onClose={handleCloseViewDetails}
        />
      )}
    </ProtectedRoute>
  )
}
