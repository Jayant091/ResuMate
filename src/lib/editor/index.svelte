<script lang="ts">
  import Details from "./details.svelte";
  import WorkExp from "./workexp.svelte";
  import Project from "./project.svelte";
  import Education from "./edu.svelte";
  import Skills from "./skills.svelte";
  import ResumeManager from "../ui/resumeManager.svelte";
  import AiFeatures from "../ui/aiFeatures.svelte";
</script>

<div class="grid gap5 children:(p7 rounded bg-bg)">
  <ResumeManager />
  <AiFeatures />
  <Details />
  <Skills />
  <WorkExp />
  <Project />
  <Education />
</div>
