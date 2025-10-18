interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

interface ChatMessage {
  id: number
  message: string
  author_id: number
  author?: {
    id: number
    name: string
    role: string
  }
  created_at: string
  is_staff: boolean
}

interface ChatRoom {
  id: number
  concern_id: number
  room_name: string
  status: string
  participants: Record<number, {
    user_id: number
    role: string
    joined_at: string
  }>
  latest_message?: ChatMessage
  unread_count: number
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 3000
  private listeners: Map<string, Function[]> = new Map()
  private isConnecting = false

  constructor() {
    this.connect()
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  private connect() {
    if (this.isConnecting || this.isConnected()) {
      return
    }

    this.isConnecting = true
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    if (!wsUrl) {
      console.warn('WebSocket disabled: NEXT_PUBLIC_WS_URL is not set')
      this.isConnecting = false
      return
    }
    
    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.isConnecting = false
        this.emit('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        this.emit('error', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.isConnecting = false
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached')
      this.emit('max_reconnect_attempts_reached')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, this.reconnectInterval * this.reconnectAttempts)
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('📨 WebSocket message received:', message)
    
    switch (message.type) {
      case 'chat_message':
        this.emit('chat_message', message.data)
        break
      case 'chat_room_created':
        this.emit('chat_room_created', message.data)
        break
      case 'chat_room_updated':
        this.emit('chat_room_updated', message.data)
        break
      case 'user_online':
        this.emit('user_online', message.data)
        break
      case 'user_offline':
        this.emit('user_offline', message.data)
        break
      case 'concern_assigned':
        this.emit('concern_assigned', message.data)
        break
      case 'concern_status_updated':
        this.emit('concern_status_updated', message.data)
        break
      default:
        console.log('Unknown message type:', message.type)
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  // Send message to WebSocket
  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString()
      }
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  // Join chat room
  joinChatRoom(roomId: number) {
    this.send('join_room', { room_id: roomId })
  }

  // Leave chat room
  leaveChatRoom(roomId: number) {
    this.send('leave_room', { room_id: roomId })
  }

  // Send chat message
  sendChatMessage(roomId: number, message: string) {
    this.send('chat_message', {
      room_id: roomId,
      message: message
    })
  }

  // Mark messages as read
  markAsRead(roomId: number) {
    this.send('mark_read', { room_id: roomId })
  }

  // Set user online status
  setOnlineStatus(isOnline: boolean) {
    this.send('user_status', { is_online: isOnline })
  }

  // Subscribe to concern updates
  subscribeToConcern(concernId: number) {
    this.send('subscribe_concern', { concern_id: concernId })
  }

  // Unsubscribe from concern updates
  unsubscribeFromConcern(concernId: number) {
    this.send('unsubscribe_concern', { concern_id: concernId })
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Reconnect manually
  reconnect() {
    this.disconnect()
    this.reconnectAttempts = 0
    this.connect()
  }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// Export types
export type { WebSocketMessage, ChatMessage, ChatRoom }
