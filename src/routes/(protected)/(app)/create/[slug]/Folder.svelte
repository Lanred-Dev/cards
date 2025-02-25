<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { onMount } from "svelte";

    let { stage }: { stage: "creation" | "setup" } = $props();

    let sets: PublicSet[] = $state([]);
    let setsToAdd: string[] = $state([]);
    let setsToAddValue: string = $derived.by(() => {
        const sets = setsToAdd;
        return JSON.stringify(sets);
    });

    onMount(async () => {
        const userID: string = await (await fetch("/api/account")).json();
        sets = await (await fetch(`/api/account/${userID}/sets`)).json();
    });
</script>

{#if stage === "creation"}
    <FormRow>
        <FormInput
            id="isPublic"
            label="Visiblity"
            type="checkbox"
            placeholder={true}
            checkboxText={["Public", "Private"]}
            checkboxIcons={["/icons/general/Web.svg", "/icons/general/Lock.svg"]}
        />
        <FormInput
            id="icon"
            label="Icon"
            type="dropdown"
            options={[
                {
                    value: "/icons/folder/Folder.svg",
                    image: "/icons/folder/Folder.svg",
                    text: "Folder",
                },
                {
                    value: "/icons/folder/Camera.svg",
                    image: "/icons/folder/Camera.svg",
                    text: "Camera",
                },
                {
                    value: "/icons/folder/Briefcase.svg",
                    image: "/icons/folder/Briefcase.svg",
                    text: "Briefcase",
                },
            ]}
            placeholder={{
                value: "/icons/folder/Folder.svg",
                image: "/icons/folder/Folder.svg",
                text: "Folder",
            }}
        />
        <FormInput id="name" label="Name" type="text" placeholder="AP Lit Exam" />
    </FormRow>

    <FormInput
        id="description"
        label="What is this folder for?"
        type="textarea"
        placeholder="This folder contains all my study sets for..."
        classes="h-40"
    />
{:else}
    <FormInput id="sets" type="custom">
        <div class="data" data-type="json" data-value={setsToAddValue}></div>

        <div class="grid grid-cols-2 gap-4">
            {#each sets as set}
                <div
                    class="primary flex w-full justify-between gap-6 border border-primary px-8 py-6 [&>p]:leading-tight"
                >
                    <div class="space-y-2">
                        <div>
                            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">
                                {set.name}
                            </p>
                            <p class="text-dark text-sm">{set.subject}</p>
                        </div>

                        <p class="line-clamp-1 overflow-ellipsis">{set.description}</p>
                    </div>

                    <div class="flex-shrink-0">
                        <button
                            onclick={() => {
                                if (setsToAdd.includes(set._id)) {
                                    setsToAdd.splice(setsToAdd.indexOf(set._id), 1);
                                } else {
                                    setsToAdd.push(set._id);
                                }
                            }}
                            type="button"
                        >
                            {#if setsToAdd.includes(set._id)}
                                <img class="size-6" src="/icons/general/X.svg" alt="Remove" />
                            {:else}
                                <img class="size-6" src="/icons/general/Plus.svg" alt="Add" />
                            {/if}
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </FormInput>
{/if}
