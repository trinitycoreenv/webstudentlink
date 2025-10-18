import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Concern } from "@/lib/api-client"
import { apiClient } from "@/lib/api-client"
import { useState, useRef, useEffect } from "react"
import { Upload, Download, Trash2, File, Image, FileText, MessageSquare, Send, Eye } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"

interface ViewConcernDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  concern: Concern
}

export function ViewConcernDetailsDialog({ isOpen, onClose, concern }: ViewConcernDetailsDialogProps) {
  const [attachments, setAttachments] = useState<any[]>(concern.attachments || [])
  const [uploading, setUploading] = useState(false)
  const [uploadDescription, setUploadDescription] = useState("")
  const [chatRoom, setChatRoom] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get current user and chat room
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await apiClient.getCurrentUser()
        setCurrentUserId(user.id)
        
        // Get or create chat room for this concern
        const room = await apiClient.getOrCreateChatRoom(concern.id)
        setChatRoom(room)
      } catch (error) {
        console.error('Failed to initialize chat:', error)
      }
    }

    if (isOpen && concern) {
      initializeChat()
    }
  }, [isOpen, concern])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const attachment = await apiClient.uploadConcernAttachment(concern.id, file, uploadDescription)
      setAttachments(prev => [...prev, attachment])
      setUploadDescription("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error('Failed to upload attachment:', error)
      alert('Failed to upload attachment. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return

    try {
      await apiClient.deleteConcernAttachment(concern.id, attachmentId)
      setAttachments(prev => prev.filter(att => att.id !== attachmentId))
    } catch (error) {
      console.error('Failed to delete attachment:', error)
      alert('Failed to delete attachment. Please try again.')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleViewAttachment = (attachment: any) => {
    // Open attachment in new tab for viewing
    window.open(attachment.url, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{concern.subject}</DialogTitle>
          <DialogDescription>
            From: {concern.is_anonymous ? 'Anonymous Student' : `${concern.student.name} (${concern.student.display_id})`} | Submitted: {new Date(concern.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments ({attachments.length})</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="font-medium text-[#1E2A78]">Message</h3>
              <p className="bg-gray-50 p-3 rounded-md">{concern.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-[#1E2A78]">Internal Notes</h3>
              <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                <p className="text-sm text-gray-500">No notes yet.</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[#1E2A78]">Conversation History</h3>
              <div className="space-y-4 bg-gray-50 p-3 rounded-md">
                {concern.messages?.map((message, index) => (
                  <div key={index}>
                    <p className="font-medium">{message.author?.name || 'System'}</p>
                    <p className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                    <p className="mt-1">{message.message}</p>
                  </div>
                )) || <p className="text-sm text-gray-500">No conversation history yet.</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#1E2A78]">Attachments</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Description (optional)"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-48"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              </div>
              
              {attachments.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                  No attachments yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(attachment.mime_type)}
                        <div>
                          <p className="font-medium text-sm">{attachment.original_name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
                          </p>
                          {attachment.description && (
                            <p className="text-xs text-gray-600 mt-1">{attachment.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAttachment(attachment)}
                          title="View/Open file"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(attachment.url, '_blank')}
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {chatRoom && currentUserId ? (
              <div className="h-[500px] border rounded-lg">
                <ChatInterface 
                  chatRoom={chatRoom} 
                  currentUserId={currentUserId}
                  onClose={() => {}} 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] border rounded-lg bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Loading chat...</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div>
              <h3 className="font-medium text-[#1E2A78]">Actions</h3>
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      await apiClient.updateConcernStatus(concern.id, 'in_progress')
                      alert('✅ Concern status updated to "In Progress"!')
                      onClose()
                    } catch (error) {
                      console.error('Failed to update status:', error)
                      alert('❌ Failed to update concern status. Please try again.')
                    }
                  }}
                  disabled={concern.status === 'in_progress'}
                >
                  Start Working
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    const resolution = prompt('Please provide a resolution summary:')
                    if (resolution) {
                      try {
                        await apiClient.updateConcernStatus(concern.id, 'resolved')
                        alert('✅ Concern marked as resolved!')
                        onClose()
                      } catch (error) {
                        console.error('Failed to resolve concern:', error)
                        alert('❌ Failed to resolve concern. Please try again.')
                      }
                    }
                  }}
                  disabled={concern.status === 'resolved'}
                >
                  Mark as Resolved
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    const reason = prompt('Please provide a reason for escalation:')
                    if (reason) {
                      try {
                        await apiClient.escalateConcern(concern.id, reason)
                        alert('✅ Concern escalated successfully!')
                        onClose()
                      } catch (error) {
                        console.error('Failed to escalate concern:', error)
                        alert('❌ Failed to escalate concern. Please try again.')
                      }
                    }
                  }}
                >
                  Escalate
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
