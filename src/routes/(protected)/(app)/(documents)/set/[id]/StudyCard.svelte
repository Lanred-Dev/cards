<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";
    import { onMount } from "svelte";

    let { terms }: PublicSet = $props();

    let showDescription: boolean = $state(false);
    let currentTermIndex: number = $state(0);
    let currentTerm: Term = $derived(terms[currentTermIndex]);

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        currentTermIndex = 0;
        showDescription = false;
        terms = terms.sort(() => Math.random() - 0.5);
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous, 1 for next.
     * @returns never
     */
    function cycle(direction: -1 | 1) {
        showDescription = false;
        currentTermIndex += direction;
    }

    onMount(() => {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case " ":
                    showDescription = !showDescription;
                    break;
                case "ArrowLeft":
                    cycle(-1);
                    break;
                case "ArrowRight":
                    cycle(1);
                    break;
                default:
                    break;
            }
        });
    });
</script>

<div class="my-24 w-4/5 space-y-4">
    <div class="w-full">
        <button
            class="relative aspect-[1.9] max-h-96 w-full rounded-primary border border-primary bg-primary-200 p-6 shadow-2xl"
            onclick={() => (showDescription = !showDescription)}
        >
            {#if showDescription}
                <p class="text-light x-center top-6">{currentTerm.name}</p>
            {/if}

            <p class="text-2xl">
                {#if showDescription}
                    {currentTerm.description}
                {:else}
                    {currentTerm.name}
                {/if}
            </p>
        </button>
    </div>

    <div class="relative w-full">
        <div class="flex-center gap-1">
            <button
                class="primary group transition-opacity disabled:pointer-events-none disabled:opacity-50"
                disabled={currentTermIndex === 0}
                onclick={() => cycle(-1)}
            >
                <img
                    class="relative size-6 transition-transform group-hover:-translate-x-0.5 group-hover:scale-105"
                    src="/icons/general/LeftArrow.svg"
                    alt="Previous"
                />
            </button>

            <p class="w-20 text-center text-lg font-bold">
                {currentTermIndex + 1}<span class="font-normal">/</span>{terms.length}
            </p>

            <button
                class="primary group transition-opacity disabled:pointer-events-none disabled:opacity-50"
                disabled={currentTermIndex === terms.length - 1}
                onclick={() => cycle(1)}
            >
                <img
                    class="relative size-6 transition-transform group-hover:translate-x-0.5 group-hover:scale-105"
                    src="/icons/general/RightArrow.svg"
                    alt="Next"
                />
            </button>
        </div>

        <div class="flex-center y-center absolute right-8 gap-2">
            <button
                class="transition-transform hover:rotate-[28deg] hover:scale-110 active:rotate-[180deg]"
                style="-webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;"
                onclick={() => shuffle()}
            >
                <img class="size-6" src="/icons/general/Shuffle.svg" alt="Shuffle" />
            </button>
        </div>
    </div>
</div>
