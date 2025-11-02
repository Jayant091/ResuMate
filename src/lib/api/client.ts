// API client for backend communication
const API_BASE_URL = 'https://resumate-4wr1.onrender.com';

// Get JWT token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt');
  }
  return null;
}

// API client with JWT interceptor
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Resume endpoints
  async createResume(data: { resumeData: any; title?: string }) {
    return this.request('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listResumes() {
    return this.request('/resumes');
  }

  async getResume(id: string) {
    return this.request(`/resumes/${id}`);
  }

  async updateResume(id: string, data: { resumeData?: any; title?: string }) {
    return this.request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string) {
    return this.request(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // AI endpoints
  async getAtsScore(data: { resumeData: any; jobDescription: string }) {
    return this.request('/ats-score', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async autoStructure(data: { text: string }) {
    return this.request('/auto-structure', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  resumes?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Resume {
  id: string;
  title: string;
  resumeData: any;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListResponse {
  resumes: Omit<Resume, 'resumeData'>[];
}

export interface AtsScoreResponse {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  notes: string;
  analysisComplete: boolean;
}

export interface AutoStructureResponse {
  structuredData: {
    summary: string;
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
  };
  extractionComplete: boolean;
}
