"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useSetupData } from "../setupContextProvider";
import { Button } from "@/components/ui/button";
import { VercelLogo } from "@/components/logos";
import { useEffect, useState } from "react";
import * as vercelActions from "@/app/actions/vercel";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";
import { CreateDeploymentResponseBody } from "@vercel/sdk/models/createdeploymentop.js";
import { toast } from "sonner";
import { CheckCircle2, Loader } from "lucide-react";
import Link from "next/link";

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
    if (!setupData.vercelProject) throw new Error("Vercel Project is missing");
    if (!setupData.vercelTeam) throw new Error("Vercel team is missing");
    const _latestDeployment = await vercelActions.getLatestDeploymentAction(
      setupData.vercelToken,
      setupData.vercelProject?.id,
      setupData.vercelTeam.id
    );
    if (!_latestDeployment) throw new Error("Could not get latest deployment");
    setLatestDeployment(_latestDeployment);
    setLoading(false);
  }

  async function redeploy() {
    if (!setupData.vercelProject)
      throw new Error("Vercel project is not configured");
    if (!latestDeployment) throw new Error("Could not get latest deployment");
    toast.promise(
      vercelActions.triggerRedeployAction(
        setupData.vercelToken,
        setupData.vercelProject.id,
        setupData.vercelTeam?.id,
        latestDeployment.uid
      ),
      {
        loading: "Redeploying...",
        success: (data) => {
          if (!data) throw new Error("Could not trigger redeploy");
          console.log(data);
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
      if (!setupData.vercelTeam) throw new Error("Could not get vercel team");
      const deployment = await vercelActions.getDeploymentAction(
        setupData.vercelToken,
        currentDeployment?.id,
        setupData.vercelTeam.id
      );
      setCurrentDeployment({ id: deployment.id, status: deployment.status });
    } catch (error) {
      toast.error(String(error));
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (currentDeployment) {
      const interval = setInterval(getRunningDeployment, 2000);
      return () => clearInterval(interval);
    }
  }, [currentDeployment]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <CardHeader className="text-center space-y-4 pb-0">
          <div className="flex w-full justify-center">
            <VercelLogo />
          </div>
          <CardDescription>
            Redeploy your project for changes to take effect.
          </CardDescription>
        </CardHeader>
        <span className="text-center font-semibold">
          {setupData.vercelProject?.name}
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
              <Link href="/setup/add-user">
                <Button className=" w-full hover:underline">
                  Create your first user
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
