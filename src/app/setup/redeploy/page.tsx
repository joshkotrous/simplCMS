import ErrorToast from "@/components/errorToast";
import RedeployForm from "./redeployForm";

export default async function RedeployPage() {
  try {
    return (
      <div className="size-full flex justify-center items-center">
        <RedeployForm />
      </div>
    );
  } catch (error) {
    return <ErrorToast error={error} />;
  }
}
