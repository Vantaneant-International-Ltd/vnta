<script lang="ts">
	import type { FileEntry } from '../content/types';

	let { files }: { files: FileEntry[] } = $props();
</script>

<section class="p-section" aria-labelledby="p-files-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-files-h">Files</h2>
		<span class="p-shead__meta">Reports and documents</span>
	</div>

	<div class="p-files">
		{#each files as file}
			<a class="p-file" href={file.href} aria-label={`Open ${file.name}`}>
				<span class="p-file__body">
					<span class="p-file__name">{file.name}</span>
					<span class="p-file__kind">{file.kind}</span>
				</span>
				<span class="p-file__open">Open</span>
			</a>
		{/each}
	</div>
</section>
