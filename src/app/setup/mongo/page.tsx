import { Button } from "@/components/ui/button";
import Link from "next/link";
import SetupMongoForm from "./setupMongoDBForm";

export default async function SetupMongo() {
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupMongoForm />
    </div>
  );
}
