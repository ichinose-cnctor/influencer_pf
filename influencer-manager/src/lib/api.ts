const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ──── Token management ────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth-token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth-token");
}

// ──── Fetch wrapper ────
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "エラーが発生しました" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ──── Auth ────
export const authApi = {
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.access_token);
    return res;
  },

  logout: () => {
    removeToken();
  },

  getMe: () => apiFetch<{
    id: number; email: string; name: string; role: string; photo_url: string | null;
  }>("/api/auth/me"),

  updateMe: (data: { name?: string; photo_url?: string | null }) =>
    apiFetch("/api/auth/me", { method: "PUT", body: JSON.stringify(data) }),
};

// ──── Dashboard ────
export const dashboardApi = {
  getStats: () => apiFetch<{
    total_influencers: number; recruiting_campaigns: number;
    active_campaigns: number; completed_campaigns: number;
    new_influencers_this_month: number;
  }>("/api/dashboard/stats"),

  getRecentCampaigns: () => apiFetch<Array<{
    id: number; title: string; status: string; category: string;
    platform: string; client_name: string; created_at: string;
  }>>("/api/dashboard/recent-campaigns"),
};

// ──── Campaigns ────
export const campaignApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{
      items: CampaignOut[]; total: number; page: number;
      per_page: number; total_pages: number;
    }>(`/api/campaigns${qs}`);
  },

  get: (id: number) => apiFetch<CampaignOut>(`/api/campaigns/${id}`),

  create: (data: Record<string, unknown>) =>
    apiFetch<CampaignOut>("/api/campaigns", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    apiFetch<CampaignOut>(`/api/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  updateStatus: (id: number, status: string) =>
    apiFetch(`/api/campaigns/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  delete: (id: number) =>
    apiFetch(`/api/campaigns/${id}`, { method: "DELETE" }),

  // Applications
  listApplications: (campaignId: number) =>
    apiFetch<ApplicationOut[]>(`/api/campaigns/${campaignId}/applications`),

  apply: (campaignId: number, comment?: string) =>
    apiFetch(`/api/campaigns/${campaignId}/applications`, {
      method: "POST", body: JSON.stringify({ comment }),
    }),

  updateVerdict: (campaignId: number, appId: number, verdict: string) =>
    apiFetch(`/api/campaigns/${campaignId}/applications/${appId}`, {
      method: "PATCH", body: JSON.stringify({ verdict }),
    }),
};

// ──── Influencers ────
export const influencerApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{
      items: InfluencerOut[]; total: number; page: number;
      per_page: number; total_pages: number;
    }>(`/api/influencers${qs}`);
  },

  get: (id: number) => apiFetch<InfluencerOut & { campaign_history: CampaignHistory[] }>(
    `/api/influencers/${id}`,
  ),

  updateRating: (id: number, rating: number) =>
    apiFetch(`/api/influencers/${id}/rating`, { method: "PUT", body: JSON.stringify({ rating }) }),

  updateMemo: (id: number, memo: string) =>
    apiFetch(`/api/influencers/${id}/memo`, { method: "PUT", body: JSON.stringify({ memo }) }),
};

// ──── Messages ────
export const messageApi = {
  listConversations: () => apiFetch<ConversationOut[]>("/api/messages/conversations"),

  getConversation: (id: number) =>
    apiFetch<MessageOut[]>(`/api/messages/conversations/${id}`),

  sendMessage: (convId: number, text: string) =>
    apiFetch(`/api/messages/conversations/${convId}`, {
      method: "POST", body: JSON.stringify({ text }),
    }),

  createConversation: (participantId: number, campaignId?: number, initialMessage?: string) =>
    apiFetch<{ id: number; existing: boolean }>("/api/messages/conversations", {
      method: "POST",
      body: JSON.stringify({ participant_id: participantId, campaign_id: campaignId, initial_message: initialMessage }),
    }),

  markRead: (convId: number) =>
    apiFetch(`/api/messages/conversations/${convId}/read`, { method: "PATCH" }),
};

// ──── Announcements ────
export const announcementApi = {
  list: () => apiFetch<AnnouncementOut[]>("/api/announcements"),
  get: (id: number) => apiFetch<AnnouncementOut>(`/api/announcements/${id}`),
  create: (data: Record<string, unknown>) =>
    apiFetch<AnnouncementOut>("/api/announcements", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    apiFetch<AnnouncementOut>(`/api/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/announcements/${id}`, { method: "DELETE" }),
};

// ──── Notifications ────
export const notificationApi = {
  list: () => apiFetch<NotificationOut[]>("/api/notifications"),
  markRead: (id: number) => apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => apiFetch("/api/notifications/read-all", { method: "PATCH" }),
};

// ──── Portal ────
export const portalApi = {
  getStats: () => apiFetch<{
    applying: number; active: number; completed: number;
    total_earned: number; rating_avg: number | null;
  }>("/api/portal/stats"),

  listCampaigns: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{
      items: Array<Record<string, unknown>>; total: number;
      page: number; per_page: number; total_pages: number;
    }>(`/api/portal/campaigns${qs}`);
  },

  listMyCampaigns: () => apiFetch<Array<Record<string, unknown>>>("/api/portal/my-campaigns"),
};

// ──── Master Data ────
export const masterApi = {
  categories: () => apiFetch<string[]>("/api/master/categories"),
  areas: () => apiFetch<string[]>("/api/master/areas"),
  countries: () => apiFetch<string[]>("/api/master/countries"),
  platforms: () => apiFetch<string[]>("/api/master/platforms"),
  skills: () => apiFetch<string[]>("/api/master/skills"),
  languages: () => apiFetch<string[]>("/api/master/languages"),
};

// ──── Types ────
export interface CampaignOut {
  id: number;
  created_by: number;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  area: string | null;
  country: string | null;
  platform: string | null;
  reward_style: string | null;
  min_budget: number;
  max_budget: number;
  publish_start: string | null;
  publish_end: string | null;
  start_date: string | null;
  end_date: string | null;
  headcount: string | null;
  min_followers: string | null;
  required_skills: string[] | null;
  required_languages: string[] | null;
  video_url: string | null;
  image_gradient: string | null;
  client_name: string | null;
  client_logo: string | null;
  client_logo_color: string | null;
  applicant_count: number;
  created_at: string;
  updated_at: string;
}

export interface InfluencerProfileOut {
  id: number;
  user_id: number;
  handle: string | null;
  platform: string | null;
  followers: number;
  engagement_rate: number | null;
  bio: string | null;
  genres: string[] | null;
  price_range: string | null;
  status: string;
  admin_memo: string | null;
}

export interface InfluencerOut {
  id: number;
  email: string;
  name: string;
  photo_url: string | null;
  created_at: string;
  profile: InfluencerProfileOut | null;
  rating_avg: number | null;
  campaign_count: number;
}

export interface ApplicationOut {
  id: number;
  campaign_id: number;
  influencer_id: number;
  comment: string | null;
  verdict: string;
  applied_at: string;
  influencer?: InfluencerOut;
}

export interface CampaignHistory {
  id: number;
  campaign_id: number;
  title: string;
  client: string | null;
  category: string | null;
  platform: string | null;
  status: string;
  period: string | null;
  reward: string | null;
}

export interface ConversationOut {
  id: number;
  campaign_id: number | null;
  created_at: string;
  updated_at: string;
  other_user: { id: number; email: string; name: string; role: string; photo_url: string | null } | null;
  last_message: string | null;
  last_time: string | null;
  unread_count: number;
}

export interface MessageOut {
  id: number;
  conversation_id: number;
  sender_id: number;
  text: string;
  is_read: boolean;
  created_at: string;
}

export interface AnnouncementOut {
  id: number;
  created_by: number;
  title: string;
  body: string;
  category: string;
  target: string;
  publish_at: string | null;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationOut {
  id: number;
  title: string;
  body: string | null;
  type: string | null;
  reference_id: number | null;
  is_read: boolean;
  created_at: string;
}
