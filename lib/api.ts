/**
 * Typed API client for the Nikupangishe NestJS backend.
 *
 * The backend TransformInterceptor wraps every response in:
 *   { success: true, data: <payload>, timestamp: "..." }
 * `unwrap()` strips that envelope so callers get the payload directly.
 */

import type { ChatConversation } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const ACCESS_TOKEN_KEY = "nkp_access_token";
export const REFRESH_TOKEN_KEY = "nkp_refresh_token";
export const AUTH_EXPIRED_EVENT = "nkp:auth-expired";
export const COOKIE_SESSION_TOKEN = "__cookie_session__";

// ── Envelope unwrap ────────────────────────────────────────────────────────
function unwrap<T>(body: unknown): T {
  const b = body as Record<string, unknown>;
  return (b?.data ?? b) as T;
}

// ── Core fetch helper ──────────────────────────────────────────────────────
type RequestOptions = RequestInit & {
  token?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  skipAuthRefresh?: boolean;
  allowAuthRefresh?: boolean;
};

type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
  refreshed?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("nkp_user");
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

async function refreshStoredAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Platform": "web",
        },
        credentials: "include",
        body: storedRefreshToken
          ? JSON.stringify({ refreshToken: storedRefreshToken })
          : undefined,
      });

      const body = await response.json().catch(() => ({}));
      if (response.status === 401) {
        clearStoredSession();
        return null;
      }
      if (!response.ok) {
        throw new Error("Unable to refresh session");
      }

      const tokens = unwrap<AuthTokens>(body);
      if (tokens.accessToken && tokens.refreshToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        return tokens.accessToken;
      }

      if (tokens.refreshed) return "";
      throw new Error("Refresh response is incomplete");
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function getErrorMessage(body: unknown, status: number): string {
  const message = (body as Record<string, unknown>)?.message ?? `API error ${status}`;
  return Array.isArray(message) ? String(message[0]) : String(message);
}

export async function apiFetch<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  const {
    token,
    params,
    skipAuthRefresh = false,
    allowAuthRefresh = false,
    ...init
  } = options ?? {};

  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const str = qs.toString();
    if (str) url += `?${str}`;
  }

  const request = async (requestToken?: string) => {
    const headers = new Headers(init.headers);
    const isMultipart =
      typeof FormData !== "undefined" && init.body instanceof FormData;
    if (!headers.has("Content-Type") && !isMultipart) {
      headers.set("Content-Type", "application/json");
    }
    if (requestToken) headers.set("Authorization", `Bearer ${requestToken}`);
    return fetch(url, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });
  };

  let res = await request(token);
  if (
    res.status === 401 &&
    !skipAuthRefresh &&
    (Boolean(token) || allowAuthRefresh)
  ) {
    const refreshedToken = await refreshStoredAccessToken();
    if (refreshedToken !== null) {
      res = await request(refreshedToken || undefined);
    }
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getErrorMessage(body, res.status));
  }

  return unwrap<T>(body);
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ApiProperty {
  id: string;
  title: string;
  description: string;
  rentAmount: number;
  price: number;
  currency: string;
  depositMonths: number;
  address: string;
  area: string;             // neighbourhood string
  city: string;
  latitude: number;
  longitude: number;
  location: { lat: number; lng: number; neighborhood: string; city: string };
  images: string[];         // photos from backend
  photos?: string[];
  bedrooms: number;
  bathrooms: number;
  squareMeters?: number;
  houseType: string;
  propertyType: string;     // same as houseType
  furnishingStatus?: string;
  amenities: string[];
  isVerified: boolean;
  isUnique: boolean;
  isOpenToExchange: boolean;
  ownerId: string;
  agentId?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  status: "available" | "occupied" | "pending" | "active" | "draft" | "pending_verification" | "rented" | "inactive" | "rejected";
  createdAt: string;
  hasWater?: boolean;
  hasElectricity?: boolean;
  hasInternet?: boolean;
  hasCCTV?: boolean;
  hasSecurityGuard?: boolean;
  hasGarden?: boolean;
  petFriendly?: boolean;
  availableFrom?: string | null;
  // Verification evidence submitted by owner for admin review
  verificationVideoUrl?: string | null;
  ownerVerificationNote?: string | null;
  // Admin outcome
  verificationNotes?: string | null;
  rejectionReason?: string | null;
}

export interface ApiPropertyList {
  data: ApiProperty[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "owner" | "agent" | "tenant" | "admin";
  status: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  profilePhoto?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: ApiUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface ApiViewingRequest {
  id: string;
  houseId: string;
  house?: { id: string; title: string; city: string; area: string; images?: string[] };
  tenantId: string;
  tenant?: { id: string; firstName: string; lastName: string; email: string; phone?: string };
  assignedAgentId?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  preferredDate: string;
  confirmedDate?: string;
  tenantMessage?: string;
  agentNotes?: string;
  tenantInterestedAfterViewing: boolean;
  cancellationReason?: string;
  createdAt: string;
}

/** @deprecated use ApiViewingRequest */
export interface ViewingRequest {
  id: string;
  houseId: string;
  houseTitle?: string;
  tenantId: string;
  agentId?: string;
  scheduledAt: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface ApiTenancy {
  id: string;
  houseId: string;
  house?: { id: string; title: string; city: string; area: string; images?: string[] };
  tenantId: string;
  tenant?: { id: string; firstName: string; lastName: string; email: string; phone?: string; avatar?: string };
  status: "pending_owner_confirmation" | "active" | "ended" | "transferred";
  startDate?: string | null;
  endDate?: string | null;
  agreedRent?: number | null;
  currency: string;
  agentCommissionRate?: number | null;
  agentCommissionAmount?: number;
  commissionPaid: boolean;
  /** Official payment details the owner shared on approval. Rent goes directly to the owner. */
  paymentInstructions?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ApiAgentProfile {
  id: string;
  userId: string;
  /** Flattened fields returned by the public GET /agents endpoints */
  name?: string;
  phone?: string | null;
  user?: { id: string; firstName: string; lastName: string; email: string; phone?: string; profilePhoto?: string };
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  commissionRate: number;
  rating: number;
  totalCompletedDeals: number;
  totalActiveManagedHouses: number;
  rejectionReason?: string;
  createdAt?: string;
}

/** Exchange/move request as returned by GET /exchanges/* */
export interface ExchangeRequest {
  id: string;
  fromTenantId: string;
  fromTenantName: string;
  fromPropertyId: string;
  fromPropertyTitle: string;
  toPropertyId: string;
  toPropertyTitle: string;
  status: "pending" | "approved" | "rejected" | "completed";
  reason?: string;
  createdAt: string;
}

export interface ApiCommission {
  id: string;
  type: "initial_placement" | "exchange";
  amount: number;
  currency: string;
  houseId: string;
  propertyTitle: string;
  propertyLocation: string;
  tenantName: string;
  exchangeRequestId: string | null;
  date: string;
}

export interface ApiCommissionSummary {
  items: ApiCommission[];
  totals: {
    allTime: number;
    thisMonth: number;
    placements: number;
    exchanges: number;
    currency: string;
  };
}

export interface ApproveTenantResult {
  tenancy: ApiTenancy;
  commission: { id: string; type: string; amount: number; rate: number; currency: string } | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  createdAt?: string;
}

export interface ApiNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

// ── Auth API ───────────────────────────────────────────────────────────────
export interface RegisterResponse {
  message: string;
  userId: string;
  otp?: string; // only returned in dev mode
}

export interface VerifyPhoneResponse {
  message: string;
  user: ApiUser;
  accessToken?: string;
  refreshToken?: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "X-Client-Platform": "web" },
    });
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: "owner" | "agent" | "tenant";
  }): Promise<RegisterResponse> {
    return apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async verifyPhone(phone: string, otp: string): Promise<VerifyPhoneResponse> {
    return apiFetch<VerifyPhoneResponse>("/auth/verify-phone", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
      headers: { "X-Client-Platform": "web" },
    });
  },

  async resendOtp(phone: string): Promise<{ message: string; otp?: string }> {
    return apiFetch("/auth/resend-otp/" + encodeURIComponent(phone), {
      method: "POST",
    });
  },

  async me(token?: string): Promise<ApiUser> {
    return apiFetch<ApiUser>("/auth/me", {
      token,
      allowAuthRefresh: true,
    });
  },

  async logout(token?: string): Promise<void> {
    await apiFetch("/auth/logout", {
      method: "POST",
      token,
      skipAuthRefresh: true,
    });
  },

  async refreshToken(refreshToken?: string): Promise<{ accessToken?: string; refreshToken?: string; refreshed?: boolean }> {
    return apiFetch("/auth/refresh", {
      method: "POST",
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
      headers: { "X-Client-Platform": "web" },
    });
  },
};

// ── Properties / Houses API ────────────────────────────────────────────────
export const propertiesApi = {
  async list(
    params?: {
      page?: number;
      limit?: number;
      city?: string;
      area?: string;
      houseType?: string;
      minRent?: number;
      maxRent?: number;
      bedrooms?: number;
      isVerified?: boolean;
      isOpenToExchange?: boolean;
      isUnique?: boolean;
      search?: string;
    },
    token?: string
  ): Promise<ApiPropertyList> {
    return apiFetch<ApiPropertyList>("/houses", { params: params as RequestOptions["params"], token });
  },

  async get(id: string, token?: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/${id}`, { token });
  },

  async getByShortId(shortId: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/s/${shortId}`);
  },

  async myHouses(token: string): Promise<ApiProperty[]> {
    // Returns the raw list (not paginated) for owner's properties
    const res = await apiFetch<ApiProperty[] | ApiPropertyList>("/houses/my-houses", { token });
    // Handle both shapes
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as ApiPropertyList).data;
    return [];
  },

  async create(payload: Record<string, unknown>, token: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>("/houses", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  async uploadPhotos(houseId: string, files: File[], token: string): Promise<{ images: string[] }> {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    const url = `${API_BASE}/houses/${houseId}/images`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (body as Record<string, unknown>)?.message ?? `Upload error ${res.status}`;
      throw new Error(Array.isArray(msg) ? (msg as string[])[0] : String(msg));
    }
    return unwrap<{ images: string[] }>(body);
  },

  async publishHouse(houseId: string, token: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/${houseId}/publish`, {
      method: "PATCH",
      token,
    });
  },

  async unpublishHouse(houseId: string, token: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/${houseId}/unpublish`, {
      method: "PATCH",
      token,
    });
  },

  async delete(houseId: string, token: string): Promise<void> {
    await apiFetch(`/houses/${houseId}`, {
      method: "DELETE",
      token,
    });
  },

  async updateHouse(houseId: string, payload: Record<string, unknown>, token: string): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/${houseId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    });
  },

  async reorderPhotos(houseId: string, photos: string[], token: string): Promise<void> {
    await apiFetch(`/houses/${houseId}/photos/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ photos }),
      token,
    });
  },
};

// ── Viewings API ───────────────────────────────────────────────────────────
export const viewingsApi = {
  async myViewings(token: string): Promise<ApiViewingRequest[]> {
    const res = await apiFetch<ApiViewingRequest[] | { data: ApiViewingRequest[] }>(
      "/viewings/my-viewings",
      { token }
    );
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ApiViewingRequest[] }).data;
    return [];
  },

  /** @deprecated use myViewings */
  async list(token: string): Promise<ApiViewingRequest[]> {
    return viewingsApi.myViewings(token);
  },

  async get(id: string, token: string): Promise<ApiViewingRequest> {
    return apiFetch<ApiViewingRequest>(`/viewings/${id}`, { token });
  },

  async create(
    payload: { houseId: string; preferredDate: string; tenantMessage?: string },
    token: string
  ): Promise<ApiViewingRequest> {
    return apiFetch<ApiViewingRequest>("/viewings", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  async update(
    id: string,
    dto: {
      status?: "confirmed" | "completed" | "cancelled" | "no_show";
      confirmedDate?: string;
      agentNotes?: string;
      tenantInterestedAfterViewing?: boolean;
      cancellationReason?: string;
    },
    token: string
  ): Promise<ApiViewingRequest> {
    return apiFetch<ApiViewingRequest>(`/viewings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
      token,
    });
  },

  /**
   * Owner approves a tenant the agent reported as interested after a completed
   * viewing. Creates the tenancy, shares payment details and records the
   * agent's placement commission.
   */
  async approveTenant(
    id: string,
    dto: { paymentInstructions: string; startDate?: string; agreedRent?: number },
    token: string
  ): Promise<ApproveTenantResult> {
    return apiFetch<ApproveTenantResult>(`/viewings/${id}/approve-tenant`, {
      method: "POST",
      body: JSON.stringify(dto),
      token,
    });
  },
};

// ── Agents API ─────────────────────────────────────────────────────────────
export const agentsApi = {
  async list(
    params?: { verificationStatus?: string; page?: number; limit?: number }
  ): Promise<{ data: ApiAgentProfile[]; meta: { total: number } }> {
    const res = await apiFetch<ApiAgentProfile[] | { data: ApiAgentProfile[]; meta: { total: number } }>(
      "/agents",
      { params: params as RequestOptions["params"] }
    );
    if (Array.isArray(res)) return { data: res, meta: { total: res.length } };
    return res as { data: ApiAgentProfile[]; meta: { total: number } };
  },

  async me(token: string): Promise<ApiAgentProfile> {
    return apiFetch<ApiAgentProfile>("/agents/me", { token });
  },

  async myCommissions(token: string): Promise<ApiCommissionSummary> {
    return apiFetch<ApiCommissionSummary>("/agents/me/commissions", { token });
  },

  async get(id: string): Promise<ApiAgentProfile> {
    return apiFetch<ApiAgentProfile>(`/agents/${id}`);
  },

  async pendingVerification(token: string): Promise<ApiAgentProfile[]> {
    const res = await apiFetch<ApiAgentProfile[] | { data: ApiAgentProfile[] }>(
      "/agents/pending",
      { token }
    );
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ApiAgentProfile[] }).data;
    return [];
  },

  async verify(
    agentProfileId: string,
    dto: { approved: boolean; notes?: string; rejectionReason?: string },
    token: string
  ): Promise<ApiAgentProfile> {
    return apiFetch<ApiAgentProfile>(`/agents/${agentProfileId}/verify`, {
      method: "PATCH",
      body: JSON.stringify(dto),
      token,
    });
  },
};

// ── Exchange API ───────────────────────────────────────────────────────────
export const exchangeApi = {
  async list(token: string): Promise<ExchangeRequest[]> {
    const res = await apiFetch<ExchangeRequest[] | { data: ExchangeRequest[] }>("/exchanges/my-exchanges", { token });
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ExchangeRequest[] }).data;
    return [];
  },

  async create(
    payload: { exchangeType: "move" | "exchange"; targetHouseId: string; notes?: string },
    token: string
  ): Promise<ExchangeRequest> {
    return apiFetch<ExchangeRequest>("/exchanges", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  async approve(id: string, token: string): Promise<ExchangeRequest> {
    return apiFetch<ExchangeRequest>(`/exchanges/${id}/approve`, {
      method: "PATCH",
      token,
    });
  },

  async reject(id: string, token: string, reason?: string): Promise<ExchangeRequest> {
    return apiFetch<ExchangeRequest>(`/exchanges/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
      token,
    });
  },

  async confirmTenancy(
    dto: {
      tenantUserId: string;
      houseId: string;
      startDate?: string;
      agreedRent?: number;
      paymentInstructions?: string;
    },
    token: string
  ): Promise<ApiTenancy> {
    return apiFetch<ApiTenancy>("/exchanges/confirm-tenancy", {
      method: "POST",
      body: JSON.stringify(dto),
      token,
    });
  },

  async myTenancies(token: string): Promise<ApiTenancy[]> {
    const res = await apiFetch<ApiTenancy[] | { data: ApiTenancy[] }>(
      "/exchanges/my-tenancies",
      { token }
    );
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ApiTenancy[] }).data;
    return [];
  },

  async myTenancy(token: string): Promise<ApiTenancy | null> {
    return apiFetch<ApiTenancy | null>("/exchanges/my-tenancy", { token });
  },

  async assignAgent(
    houseId: string,
    agentUserId: string,
    token: string
  ): Promise<unknown> {
    return apiFetch(`/houses/${houseId}/agents`, {
      method: "POST",
      body: JSON.stringify({ agentUserId }),
      token,
    });
  },

  async removeAgent(
    houseId: string,
    agentId: string,
    token: string
  ): Promise<void> {
    await apiFetch(`/houses/${houseId}/agents/${agentId}`, {
      method: "DELETE",
      token,
    });
  },
};

// ── Shape adapter ─────────────────────────────────────────────────────────
// Converts an ApiProperty (backend shape) to the frontend Property type used
// by PropertyCard and other UI components.
export function toProperty(p: ApiProperty) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    price: p.rentAmount ?? p.price ?? 0,
    location: p.location ?? {
      lat: p.latitude ?? 0,
      lng: p.longitude ?? 0,
      neighborhood: p.area ?? "",
      city: p.city ?? "",
    },
    images:
      Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : Array.isArray(p.photos) && p.photos.length > 0
          ? p.photos
          : ["/images/house-placeholder.jpg"],
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    area: p.squareMeters ?? 0,
    propertyType: (p.houseType ?? p.propertyType ?? "apartment") as string,
    furnishingStatus: p.furnishingStatus,
    amenities: p.amenities ?? [],
    isVerified: p.isVerified ?? false,
    isUnique: p.isUnique ?? false,
    isOpenToExchange: p.isOpenToExchange ?? false,
    ownerId: p.ownerId ?? "",
    agentId: p.agentId,
    owner: p.owner,
    agent: p.agent,
    // Map raw backend status → UI-friendly value
    status: (() => {
      const s = p.status ?? "draft";
      if (s === "active" || s === "available") return "active" as const;
      if (s === "rented" || s === "occupied") return "rented" as const;
      if (s === "inactive") return "inactive" as const;
      if (s === "rejected") return "rejected" as const;
      // draft, pending_verification → not yet published
      return "draft" as const;
    })(),
    createdAt: p.createdAt ?? new Date().toISOString(),
    hasWater: p.hasWater,
    hasElectricity: p.hasElectricity,
    hasInternet: p.hasInternet,
    hasCCTV: p.hasCCTV,
    hasSecurityGuard: p.hasSecurityGuard,
    hasGarden: p.hasGarden,
    petFriendly: p.petFriendly,
  };
}

// ── Chat API ───────────────────────────────────────────────────────────────
export const chatApi = {
  async conversations(token: string): Promise<ChatConversation[]> {
    const res = await apiFetch<ChatConversation[] | { data: ChatConversation[] }>(
      "/chat/conversations",
      { token }
    );
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  async startConversation(
    payload: { recipientId: string; houseId?: string; message?: string },
    token: string
  ): Promise<{ id: string }> {
    return apiFetch<{ id: string }>("/chat/conversations", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  async messages(conversationId: string, token: string): Promise<ChatMessage[]> {
    const res = await apiFetch<ChatMessage[] | { data: ChatMessage[] }>(
      `/chat/conversations/${conversationId}/messages`,
      { token }
    );
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  async sendMessage(
    conversationId: string,
    payload: { content: string; receiverId?: string },
    token: string
  ): Promise<ChatMessage> {
    return apiFetch<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  async markAsRead(conversationId: string, token: string) {
    await apiFetch(`/chat/conversations/${conversationId}/read`, {
      method: "PATCH",
      token,
    });
  },
};

// ── Notifications API ─────────────────────────────────────────────────────
export const notificationsApi = {
  async list(
    token: string,
    params?: { page?: number; limit?: number },
  ): Promise<{
    data: ApiNotification[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    return apiFetch("/notifications", {
      params: params as RequestOptions["params"],
      token,
    });
  },

  async unreadCount(token: string): Promise<number> {
    const result = await apiFetch<{ count: number }>(
      "/notifications/unread-count",
      { token },
    );
    return result.count;
  },

  async markRead(id: string, token: string): Promise<void> {
    await apiFetch(`/notifications/${id}/read`, {
      method: "PATCH",
      token,
    });
  },

  async markAllRead(token: string): Promise<void> {
    await apiFetch("/notifications/mark-all-read", {
      method: "PATCH",
      token,
    });
  },
};

// ── Admin API ──────────────────────────────────────────────────────────────
export type AdminHouseFilters = {
  status?: string;
  search?: string;
  houseType?: string;
  page?: number;
  limit?: number;
};

export type AdminAgentFilters = {
  verificationStatus?: string;
  page?: number;
  limit?: number;
};

export const adminApi = {
  async listUsers(
    filters: { role?: string; status?: string; page?: number; limit?: number },
    token: string
  ): Promise<{ data: ApiUser[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    return apiFetch("/users", { params: filters as RequestOptions["params"], token });
  },

  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "banned",
    token: string
  ): Promise<ApiUser> {
    return apiFetch<ApiUser>(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    });
  },

  async updateUserRole(
    userId: string,
    role: "owner" | "agent" | "tenant",
    token: string
  ): Promise<ApiUser> {
    return apiFetch<ApiUser>(`/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
      token,
    });
  },

  async sendPasswordReset(userId: string, token: string): Promise<{ message: string; resetToken?: string }> {
    return apiFetch(`/users/${userId}/send-password-reset`, {
      method: "POST",
      token,
    });
  },

  async pendingHouses(token: string): Promise<ApiProperty[]> {
    const res = await apiFetch<ApiProperty[] | { data: ApiProperty[] }>(
      "/houses/pending-verification",
      { token }
    );
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ApiProperty[] }).data;
    return [];
  },

  async verifyHouse(
    houseId: string,
    dto: { approved: boolean; notes?: string; rejectionReason?: string },
    token: string
  ): Promise<ApiProperty> {
    return apiFetch<ApiProperty>(`/houses/${houseId}/verify`, {
      method: "PATCH",
      body: JSON.stringify(dto),
      token,
    });
  },

  async adminListHouses(
    filters: AdminHouseFilters,
    token: string
  ): Promise<{ data: ApiProperty[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    return apiFetch("/houses/admin/all", {
      params: filters as RequestOptions["params"],
      token,
    });
  },

  async deleteHouse(houseId: string, token: string): Promise<void> {
    return apiFetch(`/houses/${houseId}`, { method: "DELETE", token });
  },

  async adminListAgents(
    filters: AdminAgentFilters,
    token: string
  ): Promise<{ data: ApiAgentProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    return apiFetch("/agents/admin/all", {
      params: filters as RequestOptions["params"],
      token,
    });
  },

  async allHousesMeta(token: string): Promise<ApiPropertyList> {
    return apiFetch<ApiPropertyList>("/houses", {
      params: { limit: 1 } as RequestOptions["params"],
      token,
    });
  },
};

