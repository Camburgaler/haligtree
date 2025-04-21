"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
    const [state, action, pending] = useActionState(login, undefined);

    return (
        <form action={action}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                />
            </div>
            {state?.errors?.email && (
                <p style={{ color: "var(--error)" }}>{state.errors.email}</p>
            )}

            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
            </div>
            {state?.errors?.password && (
                <div>
                    <p style={{ color: "var(--error)" }}>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error} style={{ color: "var(--error)" }}>
                                - {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {state?.message && (
                <div>
                    <p style={{ color: "var(--error)" }}>{state.message}</p>
                </div>
            )}

            <button disabled={pending} type="submit">
                Log In
            </button>
        </form>
    );
}
