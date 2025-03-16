"use server";
import MediaStorageProviderForm from "@/app/client/components/mediaStorageProviderForm";

export default async function SetupMediaStoragePage() {
  return (
    <div className="size-full flex flex-col justify-center items-center  space-y-12 text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
      </div>
      <MediaStorageProviderForm />
    </div>
  );
}
