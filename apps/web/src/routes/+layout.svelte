<script>
  import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
  <header class="border-b pixel-sky">
    <div class="max-w-6xl mx-auto p-4 flex items-center justify-between">
      <a href="/" class="font-semibold text-lg" style="color:white; text-shadow:2px 2px 0 #111">It’s Garages</a>
      <nav class="space-x-3 text-xs">
        <a class="pixel-btn-outline" href="/pricing">Pricing</a>
        <a class="pixel-btn-outline" href="/book">Book</a>
        <a class="pixel-btn-outline" href="/apply">Apply</a>
        <a class="pixel-btn-outline" href="/legal/terms">Terms</a>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="border-t text-center text-xs py-6 opacity-90" style="background:linear-gradient(90deg,var(--ig-purple),var(--ig-teal)); color:white; text-shadow:2px 2px 0 #111">
    © {new Date().getFullYear()} It’s Garages • <a class="underline" href="/legal/privacy" style="color:white">Privacy</a>
  </footer>
</div>

