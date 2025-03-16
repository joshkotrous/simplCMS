"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as vercelActions from "@/core/serverActions/providers/vercel";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";
interface CurrentDeployment {
  id: string;
  status: string;
}
export default function useRedeployToast() {
  const [currentDeployment, setCurrentDeployment] =
    useState<CurrentDeployment | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const storedDeployment = localStorage.getItem("currentDeployment");
    if (storedDeployment && !currentDeployment) {
      try {
        const deploymentData = JSON.parse(storedDeployment);
        setCurrentDeployment(deploymentData);

        toast.loading(
          `Optimization status: ${deploymentData.status
            .charAt(0)
            .toUpperCase()}${deploymentData.status.slice(1).toLowerCase()}`,
          {
            id: "deployment-status",
            duration: Infinity,
          }
        );
      } catch (e) {
        console.error("Error restoring deployment state:", e);
        localStorage.removeItem("currentDeployment");
      }
    }
  }, []);

  useEffect(() => {
    if (currentDeployment) {
      localStorage.setItem(
        "currentDeployment",
        JSON.stringify(currentDeployment)
      );
    }

    if (isCompleted) {
      localStorage.removeItem("currentDeployment");
    }
  }, [currentDeployment, isCompleted]);

  async function getRunningDeployment() {
    try {
      if (!currentDeployment) return;

      const deployment = await vercelActions.getDeploymentAction(
        currentDeployment.id
      );

      setCurrentDeployment({ id: deployment.id, status: deployment.status });

      const formattedStatus =
        deployment.status.charAt(0).toUpperCase() +
        deployment.status.slice(1).toLowerCase();

      toast.loading(`Optimization status: ${formattedStatus}`, {
        id: "deployment-status",
      });

      if (
        ["READY", "ERROR", "CANCELED", "FAILED"].includes(deployment.status)
      ) {
        setIsCompleted(true);

        if (deployment.status === "READY") {
          toast.success("Optimization completed successfully", {
            id: "deployment-status",
            duration: 3000,
          });
        } else {
          toast.error(
            `Optimization status: ${deployment.status.toLowerCase()}`,
            {
              id: "deployment-status",
              duration: 5000,
            }
          );
        }
      }
    } catch (error) {
      toast.error(`Error checking optimization status: ${String(error)}`, {
        id: "deployment-status",
      });
      setIsCompleted(true);
    }
  }

  useEffect(() => {
    if (currentDeployment && !isCompleted) {
      getRunningDeployment();

      const interval = setInterval(getRunningDeployment, 2000);

      return () => clearInterval(interval);
    }
  }, [currentDeployment, isCompleted]);

  const triggerRedeploy = async (latestDeployment: Deployments) => {
    if (!latestDeployment) {
      toast.error("Could not get latest deployment");
      return;
    }

    const toastId = toast.loading("Initiating SEO optimization...");

    try {
      const data = await vercelActions.triggerRedeployAction(
        latestDeployment.uid
      );

      if (!data) throw new Error("Could not trigger optimization");

      console.log("Optimization triggered:", data);

      setCurrentDeployment({ id: data.id, status: data.status });
      setIsCompleted(false);

      toast.success("Optimization started successfully", { id: toastId });

      toast.loading(`Optimization status: ${data.status}`, {
        id: "deployment-status",
        duration: Infinity,
      });

      return data;
    } catch (error) {
      toast.error("Error triggering optimization", { id: toastId });
      console.error("Optimization error:", error);
      throw error;
    }
  };

  return {
    triggerRedeploy,
    currentDeployment,
    isCompleted,
  };
}
