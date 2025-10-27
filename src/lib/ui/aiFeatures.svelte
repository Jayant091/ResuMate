<script lang="ts">
  import AtsScore from './atsScore.svelte';
  import AutoStructure from './autoStructure.svelte';
</script>

<div class="ai-features bg-white p-6 rounded-lg shadow-md border border-gray-200">
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">
      <i class="i-material-symbols:auto-awesome mr-2 text-blue-600"></i>
      AI-Powered Features
    </h3>
    <p class="text-sm text-gray-700">
      Enhance your resume with AI-powered analysis and auto-filling capabilities.
    </p>
  </div>

  <div class="space-y-6">
    <AtsScore />
    <AutoStructure />
  </div>
</div>
