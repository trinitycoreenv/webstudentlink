import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Users, Target, Save, Send, Eye, Image as ImageIcon, Upload, X, CheckCircle } from "lucide-react"
import { 
  AnnouncementMegaphoneIcon, 
  LinkIcon, 
  UploadIcon, 
  ScheduleCalendarIcon, 
  UsersIcon, 
  FeaturedPlaylistIcon 
} from "@/components/icons/custom-icons"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { apiClient } from "@/lib/api-client"

interface CreateAnnouncementDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (announcement: any) => void
  editingAnnouncement?: any
}

export function CreateAnnouncementDialog({ 
  isOpen, 
  onClose, 
  onCreate, 
  editingAnnouncement 
}: CreateAnnouncementDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [description, setDescription] = useState("")
  const [actionButtonText, setActionButtonText] = useState("")
  const [actionButtonUrl, setActionButtonUrl] = useState("")
  const [announcementTimestamp, setAnnouncementTimestamp] = useState<Date>()
  const [status, setStatus] = useState("draft")
  const [isScheduled, setIsScheduled] = useState(false)
  const [publishDate, setPublishDate] = useState<Date>()
  const [publishTime, setPublishTime] = useState("")
  const [expiresAt, setExpiresAt] = useState<Date>()
  const [expireTime, setExpireTime] = useState("")
  const [targetDepartments, setTargetDepartments] = useState<number[]>([])
  const [targetRoles, setTargetRoles] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState("")
  const [departments, setDepartments] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([
    'Academic Modules',
    'Class Schedules & Exams',
    'Enrollment & Clearance',
    'Scholarships & Financial Aid',
    'Student Activities & Events',
    'Emergency Notices',
    'Administrative Updates',
    'OJT & Career Services',
    'Campus Ministry',
    'Faculty Announcements',
    'System Maintenance',
    'Student Services'
  ])
  const [loading, setLoading] = useState(false)
  const [announcementType, setAnnouncementType] = useState<"text" | "image">("image")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Load departments and categories when dialog opens
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading categories...')
        const [depts, cats] = await Promise.all([
          apiClient.getDepartments(),
          apiClient.getAnnouncementCategories()
        ])
        console.log('Categories loaded:', cats)
        setDepartments(depts)
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback to hardcoded categories if API fails
        const fallbackCategories = [
          'Academic Modules',
          'Class Schedules & Exams',
          'Enrollment & Clearance',
          'Scholarships & Financial Aid',
          'Student Activities & Events',
          'Emergency Notices',
          'Administrative Updates',
          'OJT & Career Services',
          'Campus Ministry',
          'Faculty Announcements',
          'System Maintenance',
          'Student Services'
        ]
        console.log('Using fallback categories:', fallbackCategories)
        setCategories(fallbackCategories)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // Load editing announcement data
  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.internal_title || "")
      setContent(editingAnnouncement.content || "")
      setExcerpt(editingAnnouncement.excerpt || "")
      setCategory(editingAnnouncement.category || "")
      setAnnouncementTitle(editingAnnouncement.title || "")
      setDescription(editingAnnouncement.description || "")
      setActionButtonText(editingAnnouncement.action_button_text || "")
      setActionButtonUrl(editingAnnouncement.action_button_url || "")
      setAnnouncementTimestamp(editingAnnouncement.announcement_timestamp ? new Date(editingAnnouncement.announcement_timestamp) : undefined)
      setStatus(editingAnnouncement.status || "draft")
      setTargetDepartments(editingAnnouncement.target_departments || [])
      setTargetRoles(editingAnnouncement.target_roles || [])
      setFeaturedImage(editingAnnouncement.featured_image || "")
      setAnnouncementType(editingAnnouncement.announcement_type || "image")
      
      // Set image preview if editing an image announcement
      if (editingAnnouncement.announcement_type === "image" && editingAnnouncement.image_url) {
        setImagePreview(editingAnnouncement.image_url)
      }
      
      if (editingAnnouncement.published_at) {
        setIsScheduled(true)
        setPublishDate(new Date(editingAnnouncement.published_at))
        setPublishTime(format(new Date(editingAnnouncement.published_at), "HH:mm"))
      }
      
      if (editingAnnouncement.expires_at) {
        setExpiresAt(new Date(editingAnnouncement.expires_at))
        setExpireTime(format(new Date(editingAnnouncement.expires_at), "HH:mm"))
      }
    } else {
      // Reset form for new announcement
      setTitle("")
      setContent("")
      setExcerpt("")
      setCategory("")
      setAnnouncementTitle("")
      setDescription("")
      setActionButtonText("")
      setActionButtonUrl("")
      setAnnouncementTimestamp(undefined)
      setStatus("draft")
      setIsScheduled(false)
      setPublishDate(undefined)
      setPublishTime("")
      setExpiresAt(undefined)
      setExpireTime("")
      setTargetDepartments([])
      setTargetRoles([])
      setFeaturedImage("")
      setAnnouncementType("image")
      setSelectedImage(null)
      setImagePreview(null)
    }
  }, [editingAnnouncement, isOpen])

  const handleDepartmentToggle = (departmentId: number) => {
    setTargetDepartments(prev => 
      prev.includes(departmentId) 
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    )
  }

  const handleRoleToggle = (role: string) => {
    setTargetRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (publishNow = false) => {
    // Validate required fields
    if (!category) {
      alert("Please select a category.")
      return
    }

    if (!announcementTitle) {
      alert("Please fill out the announcement title.")
      return
    }

    if (!selectedImage && !editingAnnouncement) {
      alert("Please select an image for the announcement.")
      return
    }

    // Format action button URL if provided
    let formattedActionButtonUrl = actionButtonUrl
    if (actionButtonUrl && actionButtonUrl.trim()) {
      // Add https:// if no protocol is specified
      if (!actionButtonUrl.match(/^https?:\/\//i)) {
        formattedActionButtonUrl = `https://${actionButtonUrl}`
      }
    }

    setLoading(true)
    try {
      // Determine the final status
      const finalStatus = publishNow ? "published" : (status || "draft")
      
      const announcementData = {
        internal_title: title || undefined,
        category,
        title: announcementTitle,
        description: description || undefined,
        action_button_text: actionButtonText || undefined,
        action_button_url: formattedActionButtonUrl || undefined,
        announcement_timestamp: announcementTimestamp?.toISOString(),
        status: finalStatus,
        target_departments: targetDepartments.length > 0 ? targetDepartments : undefined,
        target_roles: targetRoles.length > 0 ? targetRoles : undefined,
        featured_image: featuredImage || undefined,
        published_at: isScheduled && publishDate 
          ? new Date(`${format(publishDate, "yyyy-MM-dd")}T${publishTime || "00:00"}`).toISOString()
          : publishNow 
            ? new Date().toISOString()
            : undefined,
        expires_at: expiresAt 
          ? new Date(`${format(expiresAt, "yyyy-MM-dd")}T${expireTime || "23:59"}`).toISOString()
          : undefined,
        image: selectedImage,
        remove_image: editingAnnouncement && !selectedImage && !imagePreview,
      }

      console.log('🚀 Creating announcement with data:', {
        ...announcementData,
        image: selectedImage ? `File(${selectedImage.name}, ${selectedImage.size} bytes)` : null
      })
      console.log('📸 Selected image details:', {
        name: selectedImage?.name,
        size: selectedImage?.size,
        type: selectedImage?.type,
        lastModified: selectedImage?.lastModified
      })
      console.log('🔐 Auth token present:', !!localStorage.getItem('auth_token'))
      
      await onCreate(announcementData)
      onClose()
    } catch (error: any) {
      console.error('❌ Failed to create announcement:', error)
      
      // Better error handling
      let errorMessage = 'Failed to create announcement. Please try again.'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => handleSubmit(false)
  const handlePublishNow = () => handleSubmit(true)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#1E2A78]">
              {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
            </DialogTitle>
            <p className="text-gray-600 mt-2 font-medium">
              Create announcements with categories, action buttons, and rich content that will appear in the mobile app.
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <AnnouncementMegaphoneIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 rounded-lg border-2 border-gray-200 focus:border-[#1E2A78] focus:ring-2 focus:ring-[#1E2A78]/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    )) : (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-10 rounded-lg border-2 border-gray-200 focus:border-[#1E2A78] focus:ring-2 focus:ring-[#1E2A78]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label htmlFor="announcementTitle" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Announcement Title
                </Label>
                <Input
                  id="announcementTitle"
                  placeholder="e.g., Module Grant Steps"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="h-10 rounded-lg border-2 border-gray-200 focus:border-[#1E2A78] focus:ring-2 focus:ring-[#1E2A78]/20"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the announcement"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="rounded-lg border-2 border-gray-200 focus:border-[#1E2A78] focus:ring-2 focus:ring-[#1E2A78]/20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internalTitle" className="text-sm font-semibold text-gray-700">Internal Title (Optional)</Label>
                  <Input
                    id="internalTitle"
                    placeholder="Internal reference title for admin management"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 rounded-lg border-2 border-gray-200 focus:border-[#1E2A78] focus:ring-2 focus:ring-[#1E2A78]/20"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Internal title is only visible to admins and departments for management purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Action Button (Optional)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionButtonText" className="text-sm font-semibold text-gray-700">Button Text</Label>
                <Input
                  id="actionButtonText"
                  placeholder="e.g., Open Module"
                  value={actionButtonText}
                  onChange={(e) => setActionButtonText(e.target.value)}
                  className="h-10 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionButtonUrl" className="text-sm font-semibold text-gray-700">Button URL</Label>
                <Input
                  id="actionButtonUrl"
                  placeholder="e.g., https://sms.bcp.com"
                  value={actionButtonUrl}
                  onChange={(e) => setActionButtonUrl(e.target.value)}
                  className="h-10 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
            
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs text-green-700 font-medium leading-relaxed">
                  Add a call-to-action button that will appear in the mobile app.
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center">
                <UploadIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Upload Image</h3>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">Required</span>
            </div>
            
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center bg-white/50 hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-60 mx-auto rounded-xl object-contain bg-gray-50 shadow-lg"
                      style={{ aspectRatio: 'auto' }}
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-input')?.click()}
                      className="h-9 px-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-sm"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                      className="h-9 px-3 rounded-lg border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-input')?.click()}
                      className="h-10 px-4 rounded-lg border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 font-semibold"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 max-w-sm mx-auto">
                    <p className="text-xs text-gray-600 font-medium">PNG, JPG, GIF, WebP up to 10MB</p>
                  </div>
                </div>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Scheduling & Timestamp */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                <ScheduleCalendarIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Scheduling & Timestamp</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Announcement Timestamp (Optional)</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 w-full justify-start text-left font-normal rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {announcementTimestamp ? format(announcementTimestamp, "PPP") : "Select timestamp"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={announcementTimestamp}
                        onSelect={setAnnouncementTimestamp}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      value={announcementTimestamp ? format(announcementTimestamp, "HH:mm") : ""}
                      onChange={(e) => {
                        if (announcementTimestamp) {
                          const [hours, minutes] = e.target.value.split(':')
                          const newDate = new Date(announcementTimestamp)
                          newDate.setHours(parseInt(hours), parseInt(minutes))
                          setAnnouncementTimestamp(newDate)
                        }
                      }}
                      className="h-10 flex-1 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Targeting */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                <UsersIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Targeting</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Target className="h-4 w-4 mr-2" />
                  Target Departments
                </Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-white">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={targetDepartments.includes(dept.id)}
                        onCheckedChange={() => handleDepartmentToggle(dept.id)}
                        className="rounded"
                      />
                      <Label htmlFor={`dept-${dept.id}`} className="text-xs font-medium cursor-pointer">
                        {dept.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {targetDepartments.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        No departments selected - visible to all
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Users className="h-4 w-4 mr-2" />
                  Target Roles
                </Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-white">
                  {['student', 'faculty', 'staff', 'department_head', 'admin'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={targetRoles.includes(role)}
                        onCheckedChange={() => handleRoleToggle(role)}
                        className="rounded"
                      />
                      <Label htmlFor={`role-${role}`} className="text-xs font-medium capitalize cursor-pointer">
                        {role.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
                {targetRoles.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        No roles selected - visible to all roles
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gray-500 flex items-center justify-center">
                <FeaturedPlaylistIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Featured Image URL (Optional)</h3>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="featuredImage" className="text-sm font-semibold text-gray-700">Image URL</Label>
              <Input
                id="featuredImage"
                placeholder="https://example.com/image.jpg"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="h-10 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20"
              />
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ImageIcon className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Optional: Add a featured image URL for additional visual content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="h-10 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={loading}
              className="h-10 px-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
          <Button 
            onClick={handlePublishNow} 
            disabled={loading}
            className="h-10 px-6 rounded-lg bg-[#1E2A78] hover:bg-[#2480EA] font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Publishing..." : "Publish Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
