export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: {
    lat: number
    lng: number
    neighborhood: string
    city: string
  }
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  propertyType: "apartment" | "standalone" | "single-room" | "commercial"
  amenities: string[]
  isVerified: boolean
  isUnique: boolean
  isOpenToExchange: boolean
  ownerId: string
  agentId?: string
  status: "available" | "occupied" | "pending"
  createdAt: string
}

export interface User {
  id: string
  name: string
  role: "tenant" | "owner" | "agent"
  phone: string
  email?: string
  avatar?: string
  isVerified: boolean
}

export interface ExchangeRequest {
  id: string
  fromTenantId: string
  fromTenantName: string
  fromPropertyId: string
  fromPropertyTitle: string
  toPropertyId: string
  toPropertyTitle: string
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
  reason: string
}

export interface ChatConversation {
  id: string
  participants: { id: string; name: string; avatar?: string; role: string }[]
  propertyId: string
  propertyTitle: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
}

export interface Tenancy {
  id: string
  tenantId: string
  tenantName: string
  propertyId: string
  propertyTitle: string
  ownerId: string
  startDate: string
  monthlyRent: number
  status: "active" | "ended"
}

export interface DashboardStats {
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}
