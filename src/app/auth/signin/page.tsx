"use client";

import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function SignIn() {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            redirect: true,
            username,
            password,
        });

        console.log(result);
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
