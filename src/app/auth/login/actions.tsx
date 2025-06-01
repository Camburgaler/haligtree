"use server";

import { LoginFormSchema } from "@/app/util/constants";
import FormState from "@/app/util/types/formState";
import { usersTable } from "@/db/schema";
import { hash, UUID } from "crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { createSession } from "../session/actions";

export async function login(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Prepare data for comparison with database
    const { email, password } = validatedFields.data;
    // Hash the user's password before comparing it
    const hashedPassword = await hash("sha256", password);

    // Compare the form data with the database
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client);
    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (!user || user[0].password_hash !== hashedPassword) {
        return {
            message:
                "An error occurred while logging you in. Check your username and password.",
        };
    }

    // Create user session
    await createSession(user[0].id as UUID);

    // Redirect user
    redirect("/");
}
