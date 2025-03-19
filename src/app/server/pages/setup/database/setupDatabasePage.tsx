"use server";
import DatabaseProviderForm from "../../../../client/components/databaseProviderForm";

export default async function SetupDatabasePage() {
  return (
    <div className="size-full flex flex-col justify-center items-center  space-y-12 text-simplcms-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
        <DatabaseProviderForm />
      </div>
    </div>
  );
}
