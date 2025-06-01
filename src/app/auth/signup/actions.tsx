"use server";

import { SignupFormSchema } from "@/app/util/constants";
import FormState from "@/app/util/types/formState";
import { usersTable } from "@/db/schema";
import { hash, UUID } from "crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { createSession } from "../session/actions";

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Prepare data for insertion into database
    const { name, email, password } = validatedFields.data;
    // Hash the user's password before storing it
    const hashedPassword = await hash("sha256", password);

    // Connect to the database
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client);

    // Check if user already exists
    const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
        return {
            message: "User already exists.",
        };
    }

    // Insert user into database
    const user = await db
        .insert(usersTable)
        .values({
            name: name,
            email: email,
            password_hash: hashedPassword,
        })
        .returning();

    if (!user || user.length === 0) {
        return {
            message: "An error occurred while creating your account.",
        };
    }

    // Create user session
    await createSession(user[0].id as UUID);

    // Redirect user
    redirect("/");
}
