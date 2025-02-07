import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Folder } from "$lib/database/documents/Folder";
import type { User } from "$lib/database/documents/User";
import permissionCheck from "$lib/utils/permissionCheck";

const users: Collection<User> = loadCollection("accounts", "users");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function GET({ params, locals }) {
    const response = await fetch(`/api/documents/set/${params.id}`);
    const hasPermission = await permissionCheck(locals.userID, response);

    if (hasPermission) {
        return hasPermission;
    }

    const id: ObjectId = new ObjectId(params.id);

    await folders.deleteOne({
        _id: id,
    });

    await users.updateOne(
        { email: locals.session.user.email },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                folders: id,
            },
        }
    );

    return json({
        success: true,
    });
}
