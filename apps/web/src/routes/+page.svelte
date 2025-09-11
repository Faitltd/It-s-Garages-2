<script>
  const features = [
    { title: 'Instant Estimates', desc: 'Transparent pricing with Good / Better / Best options.' },
    { title: 'Easy Booking', desc: "Pick a slot that works. We'll confirm ASAP." },
    { title: 'Trusted Pros', desc: 'Vetted 1099 techs with insurance and background checks.' }
  ];
</script>

<section class="pixel-sky">
  <div class="max-w-6xl mx-auto px-6 py-20 text-center relative">
    <div class="coin absolute left-6 top-6"></div>
    <h1 class="text-4xl md:text-6xl font-bold tracking-tight" style="color:white; text-shadow:4px 4px 0 #111">Fast, Fair Garage Door Service</h1>
    <p class="mt-4 text-lg opacity-90" style="color:white">Get an instant estimate, book online, and we'll handle the rest.</p>
    <div class="mt-8 flex items-center justify-center gap-4">
      <a class="pixel-btn" href="/pricing">Get an instant estimate</a>
      <a class="pixel-btn-outline" href="/book">Book now</a>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
  {#each features as f}
    <div class="pixel-card p-6">
      <h3 class="font-semibold">{f.title}</h3>
      <p class="opacity-80 mt-2 text-sm">{f.desc}</p>
    </div>
  {/each}
</section>

