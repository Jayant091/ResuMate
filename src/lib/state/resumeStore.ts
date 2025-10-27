import { writable } from 'svelte/store';
import { apiClient, type Resume } from '../api/client.js';

interface ResumeState {
  resumes: Omit<Resume, 'resumeData'>[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
};

// Create resume store
export const resumeStore = writable<ResumeState>(initialState);

// Resume actions
export const resumeActions = {
  // Load all resumes for the user
  async loadResumes() {
    resumeStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.listResumes();
      resumeStore.update(state => ({
        ...state,
        resumes: response.resumes,
        isLoading: false,
      }));
      return { success: true, resumes: response.resumes };
    } catch (error) {
      resumeStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Save current resume data
  async saveResume(resumeData: any, title?: string) {
    resumeStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.createResume({ resumeData, title });
      resumeStore.update(state => ({
        ...state,
        currentResume: response.resume,
        resumes: [response.resume, ...state.resumes],
        isLoading: false,
      }));
      return { success: true, resume: response.resume };
    } catch (error) {
      resumeStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Update existing resume
  async updateResume(id: string, resumeData: any, title?: string) {
    resumeStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.updateResume(id, { resumeData, title });
      resumeStore.update(state => ({
        ...state,
        currentResume: response.resume,
        resumes: state.resumes.map(r => 
          r.id === id ? { ...r, title: response.resume.title, updatedAt: response.resume.updatedAt } : r
        ),
        isLoading: false,
      }));
      return { success: true, resume: response.resume };
    } catch (error) {
      resumeStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Load specific resume
  async loadResume(id: string) {
    resumeStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.getResume(id);
      resumeStore.update(state => ({
        ...state,
        currentResume: response.resume,
        isLoading: false,
      }));
      return { success: true, resume: response.resume };
    } catch (error) {
      resumeStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Delete resume
  async deleteResume(id: string) {
    resumeStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      await apiClient.deleteResume(id);
      resumeStore.update(state => ({
        ...state,
        resumes: state.resumes.filter(r => r.id !== id),
        currentResume: state.currentResume?.id === id ? null : state.currentResume,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      resumeStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Clear current resume
  clearCurrentResume() {
    resumeStore.update(state => ({
      ...state,
      currentResume: null,
    }));
  },

  // Clear error
  clearError() {
    resumeStore.update(state => ({
      ...state,
      error: null,
    }));
  },
};
