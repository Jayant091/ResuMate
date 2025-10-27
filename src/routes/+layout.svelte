<script lang="ts">
  import { onMount } from 'svelte';
  import favicon from "$lib/assets/favicon.svg";

  import "virtual:uno.css";
  import "@unocss/reset/tailwind.css";
  import "$lib/css/style.css";

  import Navbar from "$lib/ui/navbar.svelte";
  import { demoState } from "$lib/state/index.svelte";
  import { authActions } from "$lib/state/auth.js";

  let { children } = $props();

  onMount(() => {
    // Initialize auth state
    authActions.initialize();
    
    // Initialize demo state
    setTimeout(() => {
      demoState.fill();
    }, 0);
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
