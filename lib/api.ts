/**
 * Typed API client for the Nikupangishe NestJS backend.
 *
 * The backend TransformInterceptor wraps every response in:
 *   { success: true, data: <payload>, timestamp: "..." }
 * `unwrap()` strips that envelope so callers get the payload directly.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

// ── Envelope unwrap ────────────────────────────────────────────────────────
function unwrap<T>(body: unknown): T {
  const b = body as Record<string, unknown>;
  return (b?.data ?? b) as T;
}

// ── Core fetch helper ──────────────────────────────────────────────────────
type RequestOptions = RequestInit & {
  token?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
};

export async function apiFetch<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  const { token, params, ...init } = options ?? {};

  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const str = qs.toString();
    if (str) url += `?${str}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (body as Record<string, unknown>)?.message ?? `API error ${res.status}`;
    throw new Error(Array.isArray(msg) ? (msg as string[])[0] : String(msg));
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
  status: "available" | "occupied" | "pending";
  createdAt: string;
  hasWater?: boolean;
  hasElectricity?: boolean;
  hasInternet?: boolean;
  hasCCTV?: boolean;
  hasSecurityGuard?: boolean;
  hasGarden?: boolean;
  petFriendly?: boolean;
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
}

export interface AuthResponse {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

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

export interface ExchangeRequest {
  id: string;
  fromHouseId: string;
  toHouseId: string;
  requesterId: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
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
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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
    });
  },

  async resendOtp(phone: string): Promise<{ message: string; otp?: string }> {
    return apiFetch("/auth/resend-otp/" + encodeURIComponent(phone), {
      method: "POST",
    });
  },

  async me(token: string): Promise<ApiUser> {
    return apiFetch<ApiUser>("/auth/me", { token });
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return apiFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
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
};

// ── Viewings API ───────────────────────────────────────────────────────────
export const viewingsApi = {
  async list(token: string): Promise<ViewingRequest[]> {
    const res = await apiFetch<ViewingRequest[] | { data: ViewingRequest[] }>("/viewings", { token });
    if (Array.isArray(res)) return res;
    if ("data" in res) return (res as { data: ViewingRequest[] }).data;
    return [];
  },

  async create(payload: { houseId: string; scheduledAt: string; notes?: string }, token: string) {
    return apiFetch("/viewings", { method: "POST", body: JSON.stringify(payload), token });
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

  async create(payload: { fromHouseId: string; toHouseId: string; message?: string }, token: string) {
    return apiFetch("/exchanges", {
      method: "POST",
      body: JSON.stringify({
        exchangeType: "exchange",
        targetHouseId: payload.toHouseId,
        notes: payload.message,
      }),
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
        : Array.isArray((p as any).photos) && (p as any).photos.length > 0
          ? (p as any).photos
          : ["/images/house-placeholder.jpg"],
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    area: p.squareMeters ?? 0,
    propertyType: (p.houseType ?? p.propertyType ?? "apartment") as
      | "apartment"
      | "standalone"
      | "single-room"
      | "commercial",
    amenities: p.amenities ?? [],
    isVerified: p.isVerified ?? false,
    isUnique: p.isUnique ?? false,
    isOpenToExchange: p.isOpenToExchange ?? false,
    ownerId: p.ownerId ?? "",
    agentId: p.agentId,
    owner: p.owner,
    agent: p.agent,
    status: (p.status ?? "available") as "available" | "occupied" | "pending",
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

// ── Chat API ───────────────────────────────────────────────────────────────
export const chatApi = {
  async conversations(token: string) {
    const res = await apiFetch<unknown>("/chat/conversations", { token });
    return res;
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

  async messages(conversationId: string, token: string) {
    const res = await apiFetch<unknown>(`/chat/conversations/${conversationId}/messages`, { token });
    // API returns { data: [...], meta: {...} } after envelope unwrap
    const arr = (res as Record<string, unknown>)?.data ?? res;
    return Array.isArray(arr) ? (arr as ChatMessage[]) : [];
  },

  async markAsRead(conversationId: string, token: string) {
    await apiFetch(`/chat/conversations/${conversationId}/read`, {
      method: "PATCH",
      token,
    });
  },
};
