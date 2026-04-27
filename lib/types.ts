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
  propertyType: string
  furnishingStatus?: string
  amenities: string[]
  isVerified: boolean
  isUnique: boolean
  isOpenToExchange: boolean
  ownerId: string
  agentId?: string
  owner?: {
    id: string
    firstName: string
    lastName: string
    phone: string
  }
  agent?: {
    id: string
    firstName: string
    lastName: string
    phone: string
  }
  status: "available" | "occupied" | "pending"
  createdAt: string
  // Utility features
  hasWater?: boolean
  hasElectricity?: boolean
  hasInternet?: boolean
  hasCCTV?: boolean
  hasSecurityGuard?: boolean
  hasGarden?: boolean
  petFriendly?: boolean
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

export interface Viewing {
  id: string
  agentId: string
  tenantName: string
  propertyTitle: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
}

export interface Commission {
  id: string
  agentId: string
  propertyTitle: string
  amount: number
  date: string
  status: "paid" | "pending"
}
