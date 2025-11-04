"use client";

import { signOut } from "next-auth/react";
import Button from "@/app/components/ui/button";

export default function ButtonLogOut() {
    return (
        <Button onClick={() => signOut()} variant="cancel" size="sm">
            Log Out
        </Button>
    );
}
