"use client";
import * as userActions from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSetupData } from "../setupContextProvider";

export default function AddFirstUserForm() {
  const { setupData } = useSetupData();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function submit() {
    if (!setupData.database?.mongo?.uri)
      throw new Error("Mongo db has not been configure");
    setLoading(true);
    toast.promise(
      userActions.createUserAction(
        { email: email },
        setupData.database?.mongo?.uri
      ),
      {
        loading: "Creating user...",
        success: () => {
          router.push("/");
          setLoading(false);
          return "Successfully created user.";
        },
        error: () => {
          setLoading(false);
          return "Error creating user.";
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader className="text-center font-semibold">
        Add Your First User
      </CardHeader>
      <CardContent className="space-y-4 w-96">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />

        <Button
          disabled={email === "" || loading}
          onClick={submit}
          className="w-full"
        >
          Add User
        </Button>
      </CardContent>
    </Card>
  );
}
