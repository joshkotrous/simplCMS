"use client";

import * as userActions from "../../../core/serverActions/simplCms/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddUserButton() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    toast.promise(userActions.createUserAction({ email: email }), {
      loading: `Adding ${email}...`,
      success: () => {
        setLoading(false);
        router.refresh();
        return `Successfully added ${email}`;
      },
      error: () => {
        setLoading(false);
        return `Error adding ${email}`;
      },
    });
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
