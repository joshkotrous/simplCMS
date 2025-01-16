"use client";
import { createUserAction } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddFirstUserPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function submit() {
    setLoading(true);
    toast.promise(createUserAction({ email: email }), {
      loading: "Creating user...",
      success: () => {
        router.push("/login");
        setLoading(false);
        return "Successfully created user.";
      },
      error: () => {
        setLoading(false);
        return "Error creating user.";
      },
    });
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
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
    </div>
  );
}
