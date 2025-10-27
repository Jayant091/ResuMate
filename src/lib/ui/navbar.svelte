<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { Btn, Tab, Tabs, TabsList } from "@haze-ui/svelte";
  import { generatePDF } from "$lib/utils";
  import Viewscale from "./viewscale.svelte";
  import { demoState, ui } from "$lib/state/index.svelte";
  import { authStore, authActions } from "$lib/state/auth.js";

  let theme = $state();
  let showUserMenu = $state(false);

  onMount(() => theme = localStorage.theme);

  const toggleTheme = () => {
    theme = theme == "dark" ? "light" : "dark";
    localStorage.theme = theme;
    document.querySelector("html").className = theme;
  };

  const setActive = (x: string) => {
    document.body.style.overflow = x == "split" ? "hidden" : "visible";
    ui.mode = x;
  };

  const handleDemo = (x: any) => {
    demoState[x.target.checked ? "fill" : "empty"]();
  };

  const handleLogout = () => {
    authActions.logout();
    showUserMenu = false;
  };

  // Subscribe to auth store
  let isAuthenticated = $derived($authStore.isAuthenticated);
  let user = $derived($authStore.user);
</script>

<nav class="p3 brd frow items-center sticky top-0 z-10 bg-bg">
  <a class="frow" href="/">
    <i class="i-icon-park-solid:flashlamp bg-info text-xl"></i>
    <strong>ResuMate</strong>
  </a>

  <a href="/templates" class="mr-auto ml2">Templates</a>

  <!-- Authentication section -->
  {#if isAuthenticated}
    <div class="relative">
      <button
        class="btn-soft-eqlg rounded-full"
        aria-label="user menu"
        onclick={() => showUserMenu = !showUserMenu}
      >
        <i class="i-material-symbols:account-circle"></i>
      </button>
      
      {#if showUserMenu}
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
          <div class="px-4 py-2 text-sm text-gray-700 border-b">
            <div class="font-medium">{user?.name}</div>
            <div class="text-gray-500">{user?.email}</div>
          </div>
          <button
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onclick={handleLogout}
          >
            Sign out
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="frow gap-2">
      <a href="/login" class="btn-soft px-3 py-1 text-sm">Login</a>
      <a href="/signup" class="btn-primary px-3 py-1 text-sm">Sign Up</a>
    </div>
  {/if}

  {#if page.url.pathname == "/"}
    <Viewscale />

    <label for="demoswitch" class="brd frow p2 px3 rounded">
      <input
        type="checkbox"
        class="checkbox-sm"
        id="demoswitch"
        onchange={handleDemo}
      />
      Demo
    </label>

    <Tabs value={ui.mode} setValue={setActive}>
      <TabsList class="p1 tab-(p2 px2 text-sm) tabon-(brd)">
        <Tab value="split"><i class="i-material-symbols:splitscreen-left"></i>
          Split</Tab>
        <Tab value="tab"> <i class="i-gravity-ui:layout-tabs"></i> Tabbed</Tab>
      </TabsList>
    </Tabs>

    <Btn
      iconL="i-tabler:download"
      txt="Download"
      class="btn-primary"
      onclick={generatePDF}
    />
  {/if}

  <button
    class="btn-soft-eqlg rounded-full"
    aria-label="toggle dark mode"
    onclick={toggleTheme}
  >
    <div
      class={theme == "dark"
      ? "i-line-md:sun-rising-twotone-loop"
      : "i-line-md:moon-twotone-loop"}
    >
    </div>
  </button>
</nav>
