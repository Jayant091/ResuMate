<script lang="ts">
  import { onMount } from 'svelte';
  import { resumeStore, resumeActions } from '$lib/state/resumeStore.js';
  import { authStore } from '$lib/state/auth.js';
  import { data } from '$lib/state/index.svelte.js';

  let showSaveModal = $state(false);
  let showLoadModal = $state(false);
  let resumeTitle = $state('');
  let isSaving = $state(false);
  let isUpdating = $state(false);

  // Subscribe to stores
  let isAuthenticated = $derived($authStore.isAuthenticated);
  let resumes = $derived($resumeStore.resumes);
  let currentResume = $derived($resumeStore.currentResume);
  let isLoading = $derived($resumeStore.isLoading);
  let error = $derived($resumeStore.error);

  onMount(() => {
    if (isAuthenticated) {
      resumeActions.loadResumes();
    }
  });

  async function handleSaveResume() {
    if (!resumeTitle.trim()) {
      resumeActions.clearError();
      return;
    }

    isSaving = true;
    const result = await resumeActions.saveResume(data, resumeTitle);
    
    if (result.success) {
      showSaveModal = false;
      resumeTitle = '';
    }
    isSaving = false;
  }

  async function handleUpdateResume() {
    if (!currentResume) return;

    isUpdating = true;
    const result = await resumeActions.updateResume(currentResume.id, data, resumeTitle || currentResume.title);
    
    if (result.success) {
      showSaveModal = false;
      resumeTitle = '';
    }
    isUpdating = false;
  }

  async function handleLoadResume(resumeId: string) {
    const result = await resumeActions.loadResume(resumeId);
    
    if (result.success && result.resume) {
      // Load resume data into the editor
      const resumeData = result.resume.resumeData;
      
      // Update the editor state with loaded resume data
      if (resumeData.details) {
        Object.assign(data.details, resumeData.details);
      }
      
      if (resumeData.workExp) {
        data.workExp.length = 0;
        data.workExp.push(...resumeData.workExp);
      }
      
      if (resumeData.education) {
        data.education.length = 0;
        data.education.push(...resumeData.education);
      }
      
      if (resumeData.projects) {
        data.projects.length = 0;
        data.projects.push(...resumeData.projects);
      }
      
      if (resumeData.skills) {
        data.skills.length = 0;
        data.skills.push(...resumeData.skills);
      }
      
      showLoadModal = false;
    }
  }

  async function handleDeleteResume(resumeId: string) {
    if (confirm('Are you sure you want to delete this resume?')) {
      await resumeActions.deleteResume(resumeId);
    }
  }

  function openSaveModal() {
    resumeTitle = currentResume?.title || '';
    showSaveModal = true;
    resumeActions.clearError();
  }

  function openLoadModal() {
    showLoadModal = true;
    resumeActions.clearError();
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

{#if isAuthenticated}
  <div class="resume-manager bg-white p-4 rounded-lg shadow-sm border">
    <div class="flex gap-2 mb-4">
      <button
        class="btn-primary px-3 py-2 text-sm"
        onclick={openSaveModal}
        disabled={isLoading}
      >
        <i class="i-material-symbols:save mr-1"></i>
        {currentResume ? 'Update Resume' : 'Save Resume'}
      </button>
      
      <button
        class="btn-soft px-3 py-2 text-sm"
        onclick={openLoadModal}
        disabled={isLoading}
      >
        <i class="i-material-symbols:folder-open mr-1"></i>
        Load Resume
      </button>
    </div>

    {#if currentResume}
      <div class="text-sm text-gray-600 mb-2">
        Current: <strong>{currentResume.title}</strong> (last updated: {formatDate(currentResume.updatedAt)})
      </div>
    {/if}

    {#if error}
      <div class="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700 mb-4">
        {error}
      </div>
    {/if}
  </div>

  <!-- Save/Update Modal -->
  {#if showSaveModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-lg font-semibold mb-4">
          {currentResume ? 'Update Resume' : 'Save Resume'}
        </h3>
        
        <div class="mb-4">
          <label for="resume-title" class="block text-sm font-medium text-gray-700 mb-2">
            Resume Title
          </label>
          <input
            id="resume-title"
            type="text"
            bind:value={resumeTitle}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter resume title..."
          />
        </div>

        <div class="flex gap-2 justify-end">
          <button
            class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            onclick={() => { showSaveModal = false; resumeTitle = ''; }}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onclick={currentResume ? handleUpdateResume : handleSaveResume}
            disabled={isSaving || isUpdating || !resumeTitle.trim()}
          >
            {#if isSaving || isUpdating}
              <i class="i-material-symbols:hourglass-empty mr-1"></i>
              {isSaving ? 'Saving...' : 'Updating...'}
            {:else}
              {currentResume ? 'Update' : 'Save'}
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Load Modal -->
  {#if showLoadModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 max-h-96">
        <h3 class="text-lg font-semibold mb-4">Load Resume</h3>
        
        {#if isLoading}
          <div class="text-center py-4">
            <i class="i-material-symbols:hourglass-empty text-2xl mb-2"></i>
            <div>Loading resumes...</div>
          </div>
        {:else if resumes.length === 0}
          <div class="text-center py-4 text-gray-500">
            No saved resumes found.
          </div>
        {:else}
          <div class="space-y-2 max-h-60 overflow-y-auto">
            {#each resumes as resume}
              <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <div class="flex-1">
                  <div class="font-medium text-sm">{resume.title}</div>
                  <div class="text-xs text-gray-500">
                    Updated: {formatDate(resume.updatedAt)}
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    onclick={() => handleLoadResume(resume.id)}
                  >
                    Load
                  </button>
                  <button
                    class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onclick={() => handleDeleteResume(resume.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            onclick={() => showLoadModal = false}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <div class="bg-yellow-50 border border-yellow-200 rounded p-4">
    <div class="flex items-center">
      <i class="i-material-symbols:warning text-yellow-600 mr-2"></i>
      <div class="text-sm text-yellow-700">
        Please <a href="/login" class="underline">login</a> to save and load your resumes.
      </div>
    </div>
  </div>
{/if}
