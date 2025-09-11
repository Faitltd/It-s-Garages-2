<script>
  let name = '', email = '', phone = '';
  let resume = null;
  async function submit() {
    alert("Thanks! We'll reach out.");
  }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-4">
  <h1 class="text-2xl font-semibold">Apply as a technician</h1>
  <div class="grid md:grid-cols-2 gap-4">
    <input class="border rounded p-2" bind:value={name} placeholder="Full name" />
    <input class="border rounded p-2" bind:value={phone} placeholder="Phone" />
    <input class="border rounded p-2 md:col-span-2" bind:value={email} placeholder="Email" />
    <input class="border rounded p-2 md:col-span-2" type="file" accept=".pdf,.doc,.docx" on:change={(e)=>resume=e.currentTarget.files?.[0]||null} />
  </div>
  <button class="px-4 py-2 rounded bg-black text-white" on:click={submit}>Submit</button>
</div>

