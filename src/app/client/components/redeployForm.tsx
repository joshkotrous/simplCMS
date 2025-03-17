"use client";

import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { VercelLogo } from "./logos";
import { useEffect, useState } from "react";
import * as vercelActions from "../../../core/serverActions/providers/vercel";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";
import { toast } from "sonner";
import { CheckCircle2, Loader } from "lucide-react";
import Link from "next/link";
import { useSetupData } from "./setupContextProvider";

interface CurrentDeployment {
  id: string;
  status: string;
}

export default function RedeployForm() {
  const { setupData } = useSetupData();
  const [loading, setLoading] = useState(true);
  const [latestDeployment, setLatestDeployment] = useState<Deployments | null>(
    null
  );
  const [currentDeployment, setCurrentDeployment] =
    useState<CurrentDeployment | null>(null);
  async function getData() {
    if (!setupData.host?.vercel?.token)
      throw new Error("Vercel token is missing");
    if (!setupData.host?.vercel?.projectId)
      throw new Error("Vercel Project is missing");
    if (!setupData.host.vercel.teamId)
      throw new Error("Vercel team is missing");
    const _latestDeployment = await vercelActions.getLatestDeploymentAction(
      setupData.host.vercel.token,
      setupData.host.vercel?.projectId,
      setupData.host.vercel.teamId
    );
    if (!_latestDeployment) throw new Error("Could not get latest deployment");
    setLatestDeployment(_latestDeployment);
    setLoading(false);
  }

  async function redeploy() {
    if (!setupData.host?.vercel?.token)
      throw new Error("Vercel token is missing");
    if (!setupData.host?.vercel?.projectId)
      throw new Error("Vercel project is not configured");
    if (!setupData.host.vercel.teamId)
      throw new Error("Vercel team is missing");
    if (!latestDeployment) throw new Error("Could not get latest deployment");
    toast.promise(
      vercelActions.triggerRedeployAction(
        latestDeployment.uid,
        setupData.host.vercel.token,
        setupData.host.vercel.projectId,
        setupData.host.vercel?.teamId
      ),
      {
        loading: "Redeploying...",
        success: (data) => {
          if (!data) throw new Error("Could not trigger redeploy");
          console.log(data);
          localStorage.removeItem("setupData");
          setCurrentDeployment({ id: data.id, status: data.status });
          return "Successfully triggered redeployment";
        },
        error: () => {
          return "Error triggering redeployment";
        },
      }
    );
  }

  async function getRunningDeployment() {
    try {
      if (!currentDeployment)
        throw new Error("Could not get current deployment");
      if (!setupData.host?.vercel?.token)
        throw new Error("Vercel token is missing");
      if (!setupData.host?.vercel?.teamId)
        throw new Error("Could not get vercel team");
      const deployment = await vercelActions.getDeploymentAction(
        currentDeployment?.id,
        setupData.host.vercel.token,
        setupData.host.vercel.teamId
      );
      setCurrentDeployment({ id: deployment.id, status: deployment.status });
    } catch (error) {
      toast.error(String(error));
    }
  }

  useEffect(() => {
    if (setupData.host?.vercel?.token) {
      getData();
    }
  }, [setupData]);

  useEffect(() => {
    if (currentDeployment) {
      const interval = setInterval(getRunningDeployment, 2000);
      return () => clearInterval(interval);
    }
  }, [currentDeployment]);

  return (
    <Card className="transition-all">
      <CardContent className="flex flex-col gap-4 transition-all">
        <CardHeader className="text-center space-y-4 pb-0">
          <div className="flex w-full justify-center">
            <VercelLogo />
          </div>
          <CardDescription>
            Redeploy your project for changes to take effect.
          </CardDescription>
        </CardHeader>
        <span className="text-center font-semibold">
          {setupData.host?.vercel?.projectName}
        </span>
        {!currentDeployment && (
          <Button disabled={currentDeployment !== null} onClick={redeploy}>
            Redeploy Project
          </Button>
        )}

        {currentDeployment && (
          <div className="text-center flex flex-col gap-4">
            <div className="space-x-2 flex items-center">
              <span className="text-zinc-400">{currentDeployment?.id}</span>

              <span className="capitalize">
                {currentDeployment?.status.toLocaleLowerCase()}
              </span>
              {currentDeployment.status !== "READY" ? (
                <Loader className="animate-spin size-4" />
              ) : (
                <CheckCircle2 className="size-4 text-green-500" />
              )}
            </div>
            {currentDeployment.status === "READY" && (
              <Link href="/admin/login">
                <Button className=" w-full hover:underline">Login</Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
