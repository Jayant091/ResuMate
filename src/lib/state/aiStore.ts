import { writable } from 'svelte/store';
import { apiClient, type AtsScoreResponse, type AutoStructureResponse } from '../api/client.js';

interface AiState {
  atsScore: AtsScoreResponse | null;
  autoStructure: AutoStructureResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AiState = {
  atsScore: null,
  autoStructure: null,
  isLoading: false,
  error: null,
};

// Create AI store
export const aiStore = writable<AiState>(initialState);

// AI actions
export const aiActions = {
  // Get ATS score for resume
  async getAtsScore(resumeData: any, jobDescription: string) {
    aiStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.getAtsScore({ resumeData, jobDescription });
      aiStore.update(state => ({
        ...state,
        atsScore: response,
        isLoading: false,
      }));
      return { success: true, data: response };
    } catch (error) {
      aiStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Auto-structure text into resume format
  async autoStructure(text: string) {
    aiStore.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.autoStructure({ text });
      aiStore.update(state => ({
        ...state,
        autoStructure: response,
        isLoading: false,
      }));
      return { success: true, data: response };
    } catch (error) {
      aiStore.update(state => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  },

  // Clear ATS score results
  clearAtsScore() {
    aiStore.update(state => ({
      ...state,
      atsScore: null,
    }));
  },

  // Clear auto-structure results
  clearAutoStructure() {
    aiStore.update(state => ({
      ...state,
      autoStructure: null,
    }));
  },

  // Clear error
  clearError() {
    aiStore.update(state => ({
      ...state,
      error: null,
    }));
  },
};
