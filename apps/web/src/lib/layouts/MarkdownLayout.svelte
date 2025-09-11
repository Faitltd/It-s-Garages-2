<script>
  export let title = '';
</script>

<article class="pixel-card max-w-3xl mx-auto p-6">
  {#if title}<h1 style="text-shadow:2px 2px 0 #111">{title}</h1>{/if}
  <slot />
</article>

