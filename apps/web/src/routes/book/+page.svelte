<script>
  export let data;
  const calUrl = `https://cal.com/itsgarages/booking?embed=inline${data?.estimateId ? `&estimateId=${data.estimateId}` : ''}`;
  let CalEmbed = null;
  import { onMount } from 'svelte';
  onMount(async () => {
    const mod = await import('$lib/components/CalEmbed.svelte');
    CalEmbed = mod.default;
  });
</script>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-semibold mb-4">Book your appointment</h1>
  {#if CalEmbed}
    <svelte:component this={CalEmbed} url={calUrl} />
  {:else}
    <div class="border rounded p-6 text-center text-sm opacity-.75">Loading calendar…</div>
  {/if}
</div>

