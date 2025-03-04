import { json } from "@sveltejs/kit";
import type { PublicSet } from "$lib/database/documents/Set";

export async function GET({ fetch, locals }) {
    const sets: PublicSet[] = await (await fetch(`/api/account/${locals.userID}/sets`)).json();

    return json({
        type: "set",
        linkTo: "/my/sets/",
        cards: sets,
    });
}
