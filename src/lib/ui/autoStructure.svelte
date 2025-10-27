<script lang="ts">
  import { aiStore, aiActions } from '$lib/state/aiStore.js';
  import { data } from '$lib/state/index.svelte.js';

  let careerText = $state('');
  let showResults = $state(false);
  let isLoading = $state(false);

  // Subscribe to AI store
  let autoStructure = $derived($aiStore.autoStructure);
  let error = $derived($aiStore.error);

  async function handleAutoStructure() {
    if (!careerText.trim()) {
      aiActions.clearError();
      return;
    }

    isLoading = true;
    showResults = true;
    
    const result = await aiActions.autoStructure(careerText);
    
    if (!result.success) {
      // Error is already set in the store
    }
    
    isLoading = false;
  }

  function applyToResume() {
    if (!autoStructure?.structuredData) return;

    const structuredData = autoStructure.structuredData;

    // Apply summary to details
    if (structuredData.summary) {
      data.details.about = structuredData.summary;
    }

    // Apply skills
    if (structuredData.skills && structuredData.skills.length > 0) {
      data.skills.length = 0;
      structuredData.skills.forEach(skill => {
        data.skills.push({ name: skill });
      });
    }

    // Apply experience
    if (structuredData.experience && structuredData.experience.length > 0) {
      data.workExp.length = 0;
      structuredData.experience.forEach(exp => {
        data.workExp.push({ description: exp });
      });
    }

    // Apply education
    if (structuredData.education && structuredData.education.length > 0) {
      data.education.length = 0;
      structuredData.education.forEach(edu => {
        data.education.push({ description: edu });
      });
    }

    // Apply projects
    if (structuredData.projects && structuredData.projects.length > 0) {
      data.projects.length = 0;
      structuredData.projects.forEach(project => {
        data.projects.push({ description: project });
      });
    }

    // Clear results after applying
    showResults = false;
    aiActions.clearAutoStructure();
    careerText = '';
  }
</script>

<div class="auto-structure bg-white p-5 rounded-lg shadow-sm border border-gray-200">
  <div class="mb-4">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">
      <i class="i-material-symbols:auto-awesome mr-2 text-purple-600"></i>
      Auto-Fill Resume
    </h3>
    <p class="text-sm text-gray-700 mb-4">
      Paste your career description and let AI extract structured information for your resume.
    </p>
  </div>

  <div class="mb-4">
    <label for="career-text" class="block text-sm font-medium text-gray-700 mb-2">
      Career Description
    </label>
    <textarea
      id="career-text"
      bind:value={careerText}
      rows="8"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
      placeholder="Paste your career description, work experience, skills, education, and projects here..."
    ></textarea>
  </div>

  <button
    class="btn-primary px-4 py-2 text-sm mb-4"
    onclick={handleAutoStructure}
    disabled={isLoading || !careerText.trim()}
  >
    {#if isLoading}
      <i class="i-material-symbols:hourglass-empty mr-2"></i>
      Analyzing...
    {:else}
      <i class="i-material-symbols:auto-awesome mr-2"></i>
      Auto-Fill Resume
    {/if}
  </button>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 mb-4">
      <i class="i-material-symbols:error mr-2"></i>
      {error}
      {#if error.includes('API key not configured')}
        <div class="mt-2 text-xs text-red-600">
          Please add your Gemini API key to the backend/.env file and restart the server.
        </div>
      {/if}
    </div>
  {/if}

  {#if showResults && autoStructure}
    <div class="auto-structure-results border-t pt-4">
      <div class="mb-4">
        <h4 class="text-md font-semibold mb-3">Extracted Information</h4>
        
        <!-- Summary -->
        {#if autoStructure.structuredData.summary}
          <div class="mb-4">
            <h5 class="font-medium text-blue-700 mb-2">
              <i class="i-material-symbols:description mr-1"></i>
              Professional Summary
            </h5>
            <div class="text-sm text-gray-700 bg-blue-50 p-3 rounded">
              {autoStructure.structuredData.summary}
            </div>
          </div>
        {/if}

        <!-- Skills -->
        {#if autoStructure.structuredData.skills && autoStructure.structuredData.skills.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-green-700 mb-2">
              <i class="i-material-symbols:psychology mr-1"></i>
              Skills ({autoStructure.structuredData.skills.length})
            </h5>
            <div class="flex flex-wrap gap-2">
              {#each autoStructure.structuredData.skills as skill}
                <span class="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Experience -->
        {#if autoStructure.structuredData.experience && autoStructure.structuredData.experience.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-purple-700 mb-2">
              <i class="i-material-symbols:work mr-1"></i>
              Work Experience ({autoStructure.structuredData.experience.length} items)
            </h5>
            <div class="space-y-2">
              {#each autoStructure.structuredData.experience as exp}
                <div class="text-sm text-gray-700 bg-purple-50 p-2 rounded">
                  • {exp}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Education -->
        {#if autoStructure.structuredData.education && autoStructure.structuredData.education.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-orange-700 mb-2">
              <i class="i-material-symbols:school mr-1"></i>
              Education ({autoStructure.structuredData.education.length} items)
            </h5>
            <div class="space-y-2">
              {#each autoStructure.structuredData.education as edu}
                <div class="text-sm text-gray-700 bg-orange-50 p-2 rounded">
                  • {edu}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Projects -->
        {#if autoStructure.structuredData.projects && autoStructure.structuredData.projects.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-indigo-700 mb-2">
              <i class="i-material-symbols:folder mr-1"></i>
              Projects ({autoStructure.structuredData.projects.length} items)
            </h5>
            <div class="space-y-2">
              {#each autoStructure.structuredData.projects as project}
                <div class="text-sm text-gray-700 bg-indigo-50 p-2 rounded">
                  • {project}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="flex gap-2">
        <button
          class="btn-primary px-4 py-2 text-sm"
          onclick={applyToResume}
        >
          <i class="i-material-symbols:check mr-1"></i>
          Apply to Resume
        </button>
        <button
          class="btn-soft px-4 py-2 text-sm"
          onclick={() => { showResults = false; aiActions.clearAutoStructure(); }}
        >
          <i class="i-material-symbols:close mr-1"></i>
          Clear Results
        </button>
      </div>
    </div>
  {/if}
</div>
