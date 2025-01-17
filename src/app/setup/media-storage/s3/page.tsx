import SetupS3Form from "./setupS3Form";
export default async function SetupS3Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background text-foreground">
      <SetupS3Form />
    </div>
  );
}
