"use client";

import { deleteSession } from "../session/actions";
import SignupForm from "./components/SignupForm";

export default function SignUp() {
    return (
        <div>
            <h1>Sign Up</h1>
            <SignupForm />
            <button onClick={deleteSession}>Clear Session</button>
        </div>
    );
}
