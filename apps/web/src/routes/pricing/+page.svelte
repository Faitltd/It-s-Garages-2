<script>
  export let data;
  let result = null;
  let error = null;
  let submitting = false;
  let qty = 1;
  let jobType = 'install-door';
  let zip = '';

  async function submitEstimate() {
    submitting = true; error = null; result = null;
    try {
      const body = {
        jobType,
        qty,
        address: { line1: 'TBD', city: 'TBD', state: 'CA', zip },
        urgency: 'standard'
      };
      const r = await fetch('/api/estimate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      result = data;
    } catch (e) {
      error = e.message;
    } finally {
      submitting = false;
    }
  }

  async function reserve(tier) {
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ estimateId: result.estimateId, amount: tier.total })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-semibold">Instant pricing</h1>

  <div class="grid md:grid-cols-3 gap-4">
    <label class="block">Job type
      <select bind:value={jobType} class="mt-2 w-full border rounded p-2">
        <option value="install-door">Install Door</option>
        <option value="install-opener">Install Opener</option>
        <option value="repair">Repair</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </label>
    <label class="block">Quantity
      <input class="mt-2 w-full border rounded p-2" type="number" min="1" max="10" bind:value={qty}>
    </label>
    <label class="block">ZIP Code
      <input class="mt-2 w-full border rounded p-2" type="text" bind:value={zip} placeholder="90210">
    </label>
  </div>
  <button class="pixel-btn disabled:opacity-50" on:click|preventDefault={submitEstimate} disabled={submitting}>Calculate</button>

  {#if error}
    <p class="text-red-600">{error}</p>
  {/if}

  {#if !result && data?.defaultTiers}
    <div class="grid md:grid-cols-3 gap-4 mt-6">
      {#each data.defaultTiers as t}
        <div class="pixel-card p-4">
          <h3 class="font-semibold">{t.name}</h3>
        </div>
      {/each}
    </div>
  {/if}

  {#if result}
    <div class="grid md:grid-cols-3 gap-4 mt-6">
      {#each result.tiers as t}
        <div class="pixel-card p-4">
          <h3 class="font-semibold">{t.name}</h3>
          <p class="text-2xl mt-2">${(t.total/100).toFixed(2)}</p>
          <div class="mt-4 grid grid-cols-1 gap-2">
            <button class="w-full pixel-btn-outline" on:click={() => window.location.href = `/book?estimateId=${result.estimateId}`}>Continue</button>
            {#if data?.stripeEnabled}
              <button class="w-full pixel-btn" on:click={() => reserve(t)}>Reserve with deposit</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

