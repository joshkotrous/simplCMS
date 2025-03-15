import HostProviderForm from "@/app/components/hostProviderForm";

export default async function HostSetupPage() {
  return (
    <div className="size-full flex flex-col justify-center items-center  space-y-12 text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
      </div>

      <p>Select a Host Provider</p>
      <div className="grid grid-cols-1 gap-4">
        <HostProviderForm />
      </div>
    </div>
  );
}
