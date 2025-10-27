<script lang="ts">
  import { aiStore, aiActions } from '$lib/state/aiStore.js';
  import { data } from '$lib/state/index.svelte.js';

  let jobDescription = $state('');
  let showResults = $state(false);
  let isLoading = $state(false);

  // Subscribe to AI store
  let atsScore = $derived($aiStore.atsScore);
  let error = $derived($aiStore.error);

  async function handleAtsScore() {
    if (!jobDescription.trim()) {
      aiActions.clearError();
      return;
    }

    isLoading = true;
    showResults = true;
    
    const result = await aiActions.getAtsScore(data, jobDescription);
    
    if (!result.success) {
      // Error is already set in the store
    }
    
    isLoading = false;
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  function getScoreLabel(score: number) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  }
</script>

<div class="ats-score bg-white p-5 rounded-lg shadow-sm border border-gray-200">
  <div class="mb-4">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">
      <i class="i-material-symbols:analytics mr-2 text-green-600"></i>
      ATS Score Checker
    </h3>
    <p class="text-sm text-gray-700 mb-4">
      Paste a job description to analyze how well your resume matches the requirements.
    </p>
  </div>

  <div class="mb-4">
    <label for="job-description" class="block text-sm font-medium text-gray-700 mb-2">
      Job Description
    </label>
    <textarea
      id="job-description"
      bind:value={jobDescription}
      rows="6"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
      placeholder="Paste the job description here..."
    ></textarea>
  </div>

  <button
    class="btn-primary px-4 py-2 text-sm mb-4"
    onclick={handleAtsScore}
    disabled={isLoading || !jobDescription.trim()}
  >
    {#if isLoading}
      <i class="i-material-symbols:hourglass-empty mr-2"></i>
      Analyzing...
    {:else}
      <i class="i-material-symbols:search mr-2"></i>
      Check ATS Score
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

  {#if showResults && atsScore}
    <div class="ats-results border-t pt-4">
      <div class="mb-4">
        <h4 class="text-md font-semibold mb-3">Analysis Results</h4>
        
        <!-- ATS Score -->
        <div class="flex items-center gap-4 mb-4">
          <div class="text-3xl font-bold {getScoreColor(atsScore.atsScore)} px-4 py-2 rounded-lg">
            {atsScore.atsScore}/100
          </div>
          <div>
            <div class="font-medium">{getScoreLabel(atsScore.atsScore)}</div>
            <div class="text-sm text-gray-600">ATS Compatibility Score</div>
          </div>
        </div>

        <!-- Missing Keywords -->
        {#if atsScore.missingKeywords && atsScore.missingKeywords.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-red-700 mb-2">
              <i class="i-material-symbols:warning mr-1"></i>
              Missing Keywords
            </h5>
            <div class="flex flex-wrap gap-2">
              {#each atsScore.missingKeywords as keyword}
                <span class="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                  {keyword}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Suggestions -->
        {#if atsScore.suggestions && atsScore.suggestions.length > 0}
          <div class="mb-4">
            <h5 class="font-medium text-blue-700 mb-2">
              <i class="i-material-symbols:lightbulb mr-1"></i>
              Suggestions for Improvement
            </h5>
            <ul class="space-y-1">
              {#each atsScore.suggestions as suggestion}
                <li class="text-sm text-gray-700 flex items-start">
                  <i class="i-material-symbols:arrow-right mr-2 mt-0.5 text-blue-500"></i>
                  {suggestion}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Additional Notes -->
        {#if atsScore.notes}
          <div class="mb-4">
            <h5 class="font-medium text-gray-700 mb-2">
              <i class="i-material-symbols:notes mr-1"></i>
              Additional Insights
            </h5>
            <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {atsScore.notes}
            </div>
          </div>
        {/if}
      </div>

      <button
        class="btn-soft px-3 py-2 text-sm"
        onclick={() => { showResults = false; aiActions.clearAtsScore(); }}
      >
        <i class="i-material-symbols:close mr-1"></i>
        Clear Results
      </button>
    </div>
  {/if}
</div>
