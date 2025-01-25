"use client";

import * as userActions from "@/app/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddUserButton() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    await userActions.createUserAction({ email: email });
    setLoading(false);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        <Button className="w-full">Add User</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Add User</AlertDialogTitle>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />
        <AlertDialogAction
          onClick={submit}
          disabled={!email || email === "" || loading}
        >
          Add User
        </AlertDialogAction>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
