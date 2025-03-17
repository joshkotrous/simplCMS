"use server";
import ErrorToast from "../../../client/components/errorToast";
import RedeployForm from "../../../client/components/redeployForm";

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
