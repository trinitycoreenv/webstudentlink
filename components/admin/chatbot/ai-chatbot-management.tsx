"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  Brain, 
  TestTube, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Plus,
  Trash2,
  Edit,
  Eye,
  Upload,
  Download,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface DialogflowConfig {
  projectId: string
  privateKey: string
  clientEmail: string
  languageCode: string
  sessionId: string
  enabled: boolean
}

interface HuggingFaceConfig {
  apiKey: string
  model: string
  maxLength: number
  temperature: number
  timeout: number
  enabled: boolean
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  intent: string
  confidence: number
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ChatSession {
  id: string
  userId: number
  userName: string
  userRole: string
  messages: Array<{
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: string
    service: 'dialogflow' | 'huggingface' | 'fallback'
  }>
  context: string
  createdAt: string
  lastActivity: string
}

interface TrainingBatch {
  id: number
  batch_id: string
  filename: string
  type: string
  total_items: number
  successful_items: number
  failed_items: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  success_rate: number
  created_by: string
  created_at: string
  processed_at?: string
  errors?: any[]
}

interface TrainingStats {
  total_faq_items: number
  active_faq_items: number
  total_training_data: number
  active_training_data: number
  total_batches: number
  completed_batches: number
  recent_batches: number
}

export function AIChatbotManagement() {
  const [dialogflowConfig, setDialogflowConfig] = useState<DialogflowConfig>({
    projectId: "",
    privateKey: "",
    clientEmail: "",
    languageCode: "en",
    sessionId: "default-session",
    enabled: false
  })

  const [huggingFaceConfig, setHuggingFaceConfig] = useState<HuggingFaceConfig>({
    apiKey: "",
    model: "microsoft/DialoGPT-medium",
    maxLength: 150,
    temperature: 0.7,
    timeout: 30,
    enabled: true
  })

  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [trainingBatches, setTrainingBatches] = useState<TrainingBatch[]>([])
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [testResponse, setTestResponse] = useState("")
  const [activeTab, setActiveTab] = useState("config")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Load configurations and data
  useEffect(() => {
    loadConfigurations()
    loadFAQItems()
    loadChatSessions()
    loadTrainingBatches()
    loadTrainingStats()
  }, [])

  const loadConfigurations = async () => {
    try {
      setLoading(true)
      const [dialogflow, huggingface] = await Promise.all([
        apiClient.getDialogflowConfig(),
        apiClient.getHuggingFaceConfig()
      ])
      setDialogflowConfig(dialogflow)
      setHuggingFaceConfig(huggingface)
    } catch (error) {
      console.error("Failed to load configurations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadFAQItems = async () => {
    try {
      const faqs = await apiClient.getFAQItems()
      setFaqItems(Array.isArray(faqs) ? faqs : [])
    } catch (error) {
      console.error("Failed to load FAQ items:", error)
      setFaqItems([])
    }
  }

  const loadChatSessions = async () => {
    try {
      const sessions = await apiClient.getChatSessions()
      setChatSessions(Array.isArray(sessions) ? sessions : [])
    } catch (error) {
      console.error("Failed to load chat sessions:", error)
      setChatSessions([])
    }
  }

  const loadTrainingBatches = async () => {
    try {
      // TODO: Implement API endpoint for training batches
      setTrainingBatches([])
    } catch (error) {
      console.error('Failed to load training batches:', error)
      setTrainingBatches([])
    }
  }

  const loadTrainingStats = async () => {
    try {
      // TODO: Implement API endpoint for training stats
      setTrainingStats({
        total_faq_items: (faqItems || []).length,
        active_faq_items: (faqItems || []).filter(item => item.active).length,
        total_training_data: 0,
        active_training_data: 0,
        total_batches: 0,
        completed_batches: 0,
        recent_batches: 0
      })
    } catch (error) {
      console.error('Failed to load training stats:', error)
      setTrainingStats({
        total_faq_items: (faqItems || []).length,
        active_faq_items: (faqItems || []).filter(item => item.active).length,
        total_training_data: 0,
        active_training_data: 0,
        total_batches: 0,
        completed_batches: 0,
        recent_batches: 0
      })
    }
  }

  const saveDialogflowConfig = async () => {
    try {
      setSaving(true)
      await apiClient.updateDialogflowConfig(dialogflowConfig)
      // Show success message
    } catch (error) {
      console.error("Failed to save Dialogflow config:", error)
    } finally {
      setSaving(false)
    }
  }

  const saveHuggingFaceConfig = async () => {
    try {
      setSaving(true)
      await apiClient.updateHuggingFaceConfig(huggingFaceConfig)
      // Show success message
    } catch (error) {
      console.error("Failed to save Hugging Face config:", error)
    } finally {
      setSaving(false)
    }
  }

  const testChatbot = async () => {
    if (!testMessage.trim()) return

    try {
      setTesting(true)
      const response = await apiClient.testChatbot(testMessage)
      setTestResponse(response.message)
    } catch (error) {
      console.error("Failed to test chatbot:", error)
      setTestResponse("Error: Failed to get response from chatbot")
    } finally {
      setTesting(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      setSelectedFile(file)
    } else {
      alert('Please select a valid JSON file')
    }
  }

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    try {
      setUploading(true)
      // TODO: Implement API endpoint for training data upload
      alert('Training data upload feature is not yet implemented. Please contact the development team.')
      setSelectedFile(null)
      loadFAQItems()
      loadTrainingBatches()
      loadTrainingStats()
    } catch (error) {
      console.error('Bulk upload failed:', error)
      alert('Failed to upload training data. Please check the file format.')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = {
      training_data: [
        {
          type: "faq",
          question: "How do I submit a concern?",
          answer: "You can submit a concern by going to the 'Submit Concern' section and filling out the form with your details and the nature of your concern.",
          category: "concern",
          context: "general",
          tags: ["concern", "submit", "help"],
          priority: "high"
        },
        {
          type: "conversation",
          user_message: "I need help with my grades",
          assistant_response: "I can help you with grade-related questions. You can check your grades in the student portal or contact your instructor directly.",
          category: "academic",
          context: "general",
          tags: ["grades", "academic", "help"],
          priority: "medium"
        },
        {
          type: "department_info",
          department: "Registrar Office",
          topic: "Grade Change Request",
          information: "Grade change requests must be submitted within 30 days of grade posting. Contact the Registrar Office for the proper form.",
          category: "academic",
          context: "general",
          tags: ["grades", "registrar", "forms"],
          priority: "high"
        }
      ]
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'training_data_template.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addFAQItem = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      category: "general",
      intent: "",
      confidence: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFaqItems([...(faqItems || []), newFAQ])
  }

  const updateFAQItem = (id: string, updates: Partial<FAQItem>) => {
    setFaqItems((faqItems || []).map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ))
  }

  const deleteFAQItem = (id: string) => {
    setFaqItems((faqItems || []).filter(item => item.id !== id))
  }

  const saveFAQItems = async () => {
    try {
      setSaving(true)
      await apiClient.updateFAQItems(faqItems || [])
      // Show success message
    } catch (error) {
      console.error("Failed to save FAQ items:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E2A78]">AI Chatbot Management</h1>
          <p className="text-muted-foreground">Configure and manage your AI chatbot services</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={dialogflowConfig.enabled || huggingFaceConfig.enabled ? "default" : "secondary"}>
            {dialogflowConfig.enabled || huggingFaceConfig.enabled ? "Active" : "Inactive"}
          </Badge>
          <Button onClick={loadConfigurations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="faq">FAQ Management</TabsTrigger>
          <TabsTrigger value="training">Bulk Training</TabsTrigger>
          <TabsTrigger value="sessions">Chat Sessions</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dialogflow Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Dialogflow Configuration
                </CardTitle>
                <CardDescription>
                  Configure Google Dialogflow for intent recognition and FAQ handling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={dialogflowConfig.enabled}
                    onCheckedChange={(enabled) => 
                      setDialogflowConfig({ ...dialogflowConfig, enabled })
                    }
                  />
                  <Label>Enable Dialogflow</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={dialogflowConfig.projectId}
                    onChange={(e) => 
                      setDialogflowConfig({ ...dialogflowConfig, projectId: e.target.value })
                    }
                    placeholder="your-dialogflow-project-id"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    value={dialogflowConfig.clientEmail}
                    onChange={(e) => 
                      setDialogflowConfig({ ...dialogflowConfig, clientEmail: e.target.value })
                    }
                    placeholder="service-account@project.iam.gserviceaccount.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateKey">Private Key</Label>
                  <Textarea
                    id="privateKey"
                    value={dialogflowConfig.privateKey}
                    onChange={(e) => 
                      setDialogflowConfig({ ...dialogflowConfig, privateKey: e.target.value })
                    }
                    placeholder="-----BEGIN PRIVATE KEY-----..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languageCode">Language Code</Label>
                  <Select
                    value={dialogflowConfig.languageCode}
                    onValueChange={(value) => 
                      setDialogflowConfig({ ...dialogflowConfig, languageCode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fil">Filipino</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={saveDialogflowConfig} 
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Dialogflow Config"}
                </Button>
              </CardContent>
            </Card>

            {/* Hugging Face Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Hugging Face Configuration
                </CardTitle>
                <CardDescription>
                  Configure Hugging Face models for AI chat responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={huggingFaceConfig.enabled}
                    onCheckedChange={(enabled) => 
                      setHuggingFaceConfig({ ...huggingFaceConfig, enabled })
                    }
                  />
                  <Label>Enable Hugging Face</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hfApiKey">API Key (Optional)</Label>
                  <Input
                    id="hfApiKey"
                    type="password"
                    value={huggingFaceConfig.apiKey}
                    onChange={(e) => 
                      setHuggingFaceConfig({ ...huggingFaceConfig, apiKey: e.target.value })
                    }
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={huggingFaceConfig.model}
                    onValueChange={(value) => 
                      setHuggingFaceConfig({ ...huggingFaceConfig, model: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="microsoft/DialoGPT-small">DialoGPT Small</SelectItem>
                      <SelectItem value="microsoft/DialoGPT-medium">DialoGPT Medium</SelectItem>
                      <SelectItem value="microsoft/DialoGPT-large">DialoGPT Large</SelectItem>
                      <SelectItem value="facebook/blenderbot-400M-distill">BlenderBot 400M</SelectItem>
                      <SelectItem value="microsoft/DialoGPT-medium">DialoGPT Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLength">Max Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={huggingFaceConfig.maxLength}
                      onChange={(e) => 
                        setHuggingFaceConfig({ ...huggingFaceConfig, maxLength: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={huggingFaceConfig.temperature}
                      onChange={(e) => 
                        setHuggingFaceConfig({ ...huggingFaceConfig, temperature: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <Button 
                  onClick={saveHuggingFaceConfig} 
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Hugging Face Config"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Current status of AI services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Dialogflow</p>
                      <p className="text-sm text-muted-foreground">Intent recognition</p>
                    </div>
                  </div>
                  <Badge variant={dialogflowConfig.enabled ? "default" : "secondary"}>
                    {dialogflowConfig.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Hugging Face</p>
                      <p className="text-sm text-muted-foreground">AI responses</p>
                    </div>
                  </div>
                  <Badge variant={huggingFaceConfig.enabled ? "default" : "secondary"}>
                    {huggingFaceConfig.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Training Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Training Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trainingStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{trainingStats.total_faq_items}</div>
                      <div className="text-sm text-gray-600">Total FAQ Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{trainingStats.active_faq_items}</div>
                      <div className="text-sm text-gray-600">Active FAQ Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{trainingStats.total_training_data}</div>
                      <div className="text-sm text-gray-600">Training Data Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{trainingStats.total_batches}</div>
                      <div className="text-sm text-gray-600">Total Batches</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">Loading statistics...</div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Bulk Upload Training Data
                </CardTitle>
                <CardDescription>
                  Upload a JSON file containing training data to improve chatbot responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="training-file">Select Training Data File</Label>
                  <Input
                    id="training-file"
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <div className="text-sm text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleBulkUpload} 
                    disabled={!selectedFile || uploading}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Training Data"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={downloadTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Batches History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Training Batches History
              </CardTitle>
              <CardDescription>
                View the history of bulk training data uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainingBatches.length > 0 ? (
                <div className="space-y-4">
                  {trainingBatches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{batch.filename}</span>
                          <Badge variant={batch.status === 'completed' ? 'default' : 'secondary'}>
                            {batch.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(batch.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span> {batch.type}
                        </div>
                        <div>
                          <span className="text-gray-600">Total Items:</span> {batch.total_items}
                        </div>
                        <div>
                          <span className="text-gray-600">Successful:</span> 
                          <span className="text-green-600 ml-1">{batch.successful_items}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Failed:</span> 
                          <span className="text-red-600 ml-1">{batch.failed_items}</span>
                        </div>
                      </div>
                      {batch.errors && batch.errors.length > 0 && (
                        <div className="mt-2 text-sm text-red-600">
                          <details>
                            <summary className="cursor-pointer">View Errors ({batch.errors.length})</summary>
                            <div className="mt-1 pl-4">
                              {batch.errors.map((error, index) => (
                                <div key={index} className="text-xs">
                                  Item {error.index}: {error.error}
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No training batches found. Upload your first training data to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>FAQ Management</CardTitle>
                  <CardDescription>Manage frequently asked questions and responses</CardDescription>
                </div>
                <Button onClick={addFAQItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(faqItems || []).map((faq) => (
                  <div key={faq.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={faq.active ? "default" : "secondary"}>
                        {faq.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateFAQItem(faq.id, { active: !faq.active })}
                        >
                          {faq.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFAQItem(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQItem(faq.id, { question: e.target.value })}
                        placeholder="Enter the question..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQItem(faq.id, { answer: e.target.value })}
                        placeholder="Enter the answer..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Intent</Label>
                        <Input
                          value={faq.intent}
                          onChange={(e) => updateFAQItem(faq.id, { intent: e.target.value })}
                          placeholder="e.g., concern.submit"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={faq.category}
                          onValueChange={(value) => updateFAQItem(faq.id, { category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="concern">Concern</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                {faqItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No FAQ items yet. Click "Add FAQ" to create your first one.</p>
                  </div>
                )}
              </div>
              {faqItems.length > 0 && (
                <div className="mt-6">
                  <Button onClick={saveFAQItems} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save All FAQ Items"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Chat Sessions</CardTitle>
              <CardDescription>Monitor and review user interactions with the chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(chatSessions || []).map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{session.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.userRole} • {new Date(session.lastActivity).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{session.context}</Badge>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {(session.messages || []).slice(-3).map((message) => (
                        <div
                          key={message.id}
                          className={`p-2 rounded text-sm ${
                            message.role === 'user' 
                              ? 'bg-blue-50 text-blue-900 ml-4' 
                              : 'bg-gray-50 text-gray-900 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{message.content}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.service}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(chatSessions || []).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chat sessions yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Testing</CardTitle>
              <CardDescription>Test your chatbot configuration with sample messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testMessage">Test Message</Label>
                <div className="flex space-x-2">
                  <Input
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Type a test message..."
                    onKeyPress={(e) => e.key === 'Enter' && testChatbot()}
                  />
                  <Button onClick={testChatbot} disabled={testing || !testMessage.trim()}>
                    <TestTube className="h-4 w-4 mr-2" />
                    {testing ? "Testing..." : "Test"}
                  </Button>
                </div>
              </div>
              
              {testResponse && (
                <div className="space-y-2">
                  <Label>Response</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{testResponse}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Quick Test Messages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "How do I submit a concern?",
                    "What are the emergency contacts?",
                    "Where can I check announcements?",
                    "How do I track my concern status?"
                  ].map((message) => (
                    <Button
                      key={message}
                      variant="outline"
                      size="sm"
                      onClick={() => setTestMessage(message)}
                      className="text-left justify-start"
                    >
                      {message}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
