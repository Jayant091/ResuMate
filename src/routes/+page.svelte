<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Default from "$lib/templates/default.svelte";
  import Minimal from "$lib/templates/minimal.svelte";
  import Tile from "$lib/templates/tile.svelte";

  import Ui from "$lib/ui/index.svelte";
  import { page } from "$app/state";
  import { ui } from "$lib/state/index.svelte";
  import { authStore } from "$lib/state/auth.js";

  let themes = {
    default: Default,
    minimal: Minimal,
    tile:Tile,
  };

  let Component = $derived(
    themes[page.url.searchParams.get("theme") || "default"],
  );

  // Check authentication status
  let isAuthenticated = $derived($authStore.isAuthenticated);
  let isLoading = $derived($authStore.isLoading);

  onMount(() => {
    document.body.style.overflow = ui.mode == "split"
      ? "hidden"
      : "visible";
    
    // If user is not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      goto('/login');
    }
  });

  // Watch for auth state changes
  $effect(() => {
    if (!isLoading && !isAuthenticated) {
      goto('/login');
    }
  });
</script>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <i class="i-material-symbols:hourglass-empty text-4xl mb-4"></i>
      <div>Loading...</div>
    </div>
  </div>
{:else if isAuthenticated}
  <Ui>
    <Component />
  </Ui>
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div>Redirecting to login...</div>
    </div>
  </div>
{/if}
