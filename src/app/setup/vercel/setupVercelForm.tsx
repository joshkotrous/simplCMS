"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VercelLogo } from "@/components/logos";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import { toast } from "sonner";
import * as vercel from "@/app/actions/vercel";
import { useRouter } from "next/navigation";
import { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";
import Link from "next/link";
import { useSetupData } from "../setupContextProvider";
import { SimplCMSPlatformConfiguration } from "@/types/types";

export default function SetupVercelForm({
  initialSiteUrl,
  platformConfiguration,
}: {
  initialSiteUrl: string | null;
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const { setupData, setSetupData } = useSetupData();
  if (!setupData.host || !setupData.host.provider)
    throw new Error("Missing host or provider");
  const [loading, setLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState<string | null>(initialSiteUrl ?? null);
  const router = useRouter();

  const [projectConnected, setProjectConnected] = useState(false);
  const [projects, setProjects] = useState<GetProjectsResponseBody | null>(
    null
  );
  const [teams, setTeams] = useState<GetTeamsResponseBody | null>(null);

  async function getProjects() {
    setLoading(true);
    if (!setupData.host?.vercel?.token)
      throw new Error("Vercel token is not set");
    if (!setupData.host.vercel?.teamId)
      throw new Error("Team must be selected");
    const projects = await vercel.getProjectsAction(
      platformConfiguration.host?.vercel?.token ?? setupData.host.vercel.token,
      setupData.host.vercel.teamId
    );
    console.log(projects);
    setProjects(projects);
    setLoading(false);
  }

  async function getTeams() {
    setLoading(true);
    if (!setupData.host?.vercel?.token)
      throw new Error("Vercel token not setup");
    toast.promise(
      vercel.getTeams(
        platformConfiguration.host?.vercel?.token ?? setupData.host.vercel.token
      ),
      {
        loading: "Connecting to Vercel...",
        success: (data) => {
          setTeams(data);
          console.log(teams);
          return "Successfully connected to Vercel";
        },
        error: () => {
          return "Error connecting to Vercel";
        },
      }
    );
    setLoading(false);
  }

  async function connectVercelProject() {
    if (!setupData.host?.vercel?.projectId || !setupData.host.vercel.token) {
      toast.error("You must select a project to connect.");
      return;
    }

    if (!setupData.host.vercel.teamId) {
      toast.error("You must select a team to connect.");
      return;
    }

    toast.promise(
      vercel.connectProject(
        setupData.host.vercel.projectId,
        setupData.host.vercel.teamId,
        platformConfiguration.host?.vercel?.token ?? setupData.host.vercel.token
      ),
      {
        loading: `Connecting to project...`,
        success: () => {
          setProjectConnected(true);

          return `Successfully connected project.`;
        },
        error: (error) => {
          const _error = JSON.parse(
            error.message.replace("Response validation failed: ", "")
          );
          const message = _error.length > 1 ? _error[1].received : null;
          return `Error connecting to project.`;
        },
      }
    );
  }

  async function configureSiteUrl() {
    if (!setupData.host?.vercel?.projectId)
      throw new Error("Project is missing");
    if (!setupData.host.vercel.teamId)
      throw new Error("Vercel token is missing");
    if (!siteUrl) throw new Error("Could not get site url");
    if (!setupData.host.vercel.token)
      throw new Error("Vercel token is not configurred");
    toast.promise(
      vercel.addEnvVar(
        setupData.host.vercel.token,
        setupData.host.vercel.projectId,
        setupData.host.vercel.teamId,
        {
          key: "NEXT_PUBLIC_SITE_URL",
          value: siteUrl,
          target: ["production"],
          type: "plain",
        }
      ),
      {
        loading: "Setting site url...",
        success: () => {
          router.push("/");
          return "Successfully configured site url.";
        },
        error: () => {
          return "Error configuring site url.";
        },
      }
    );
  }

  if (projectConnected) {
    return (
      <Card>
        <CardHeader className="gap-4 text-center">
          <div className="flex w-full justify-center">
            <VercelLogo />
          </div>
          Configure Site URL
        </CardHeader>
        <CardContent className="space-y-4 w-72">
          <Input
            value={siteUrl ?? ""}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="Site URL..."
          />
          <Button
            onClick={configureSiteUrl}
            disabled={!siteUrl || siteUrl === ""}
            className="w-full"
          >
            Set Site URL
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (projects) {
    return (
      <Card className="">
        <CardHeader className="w-full text-center gap-4">
          <div className="flex justify-center">
            <VercelLogo />
          </div>
          <span className="font-semibold">Select your Vercel Project</span>
        </CardHeader>
        <CardContent className="space-y-4 h-full w-96">
          <div className="space-y-4 h-56 overflow-scroll">
            {projects.projects.map((project) => (
              <div
                onClick={() => {
                  if (setupData.host?.vercel?.projectId === project.id) {
                    setSetupData((prev) => ({
                      ...prev,
                      host: {
                        provider: "Vercel",
                        vercel: {
                          token: prev.host?.vercel?.token ?? null,
                          teamId: prev.host?.vercel?.teamId ?? null,
                          projectId: null,
                          projectName: null,
                        },
                      },
                    }));
                  } else {
                    setSetupData((prev) => ({
                      ...prev,
                      host: {
                        provider: "Vercel",
                        vercel: {
                          token: prev.host?.vercel?.token ?? null,
                          teamId: prev.host?.vercel?.teamId ?? null,
                          projectId: project.id,
                          projectName: project.name,
                        },
                      },
                    }));
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  setupData.host?.vercel?.projectId === project.id &&
                  "bg-zinc-200 dark:bg-zinc-800"
                }`}
                key={project.id}
              >
                <span>{project.name}</span>
                {project.createdAt && (
                  <span className="text-xs">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            disabled={!setupData.host.vercel?.projectId}
            onClick={connectVercelProject}
            className="w-full"
          >
            Connect Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (teams) {
    return (
      <Card className="">
        <CardHeader className="w-full text-center gap-4">
          <div className="flex justify-center">
            <VercelLogo />
          </div>
          <span className="font-semibold">Select your Vercel Team</span>
        </CardHeader>
        <CardContent className="space-y-4 h-full w-96">
          <div className="space-y-4 h-56 overflow-scroll">
            {teams.teams.map((team) => (
              <div
                onClick={() => {
                  if (setupData.host?.vercel?.teamId === team.id) {
                    setSetupData((prev) => ({
                      ...prev,
                      host: {
                        provider: "Vercel",
                        vercel: {
                          token: prev.host?.vercel?.token ?? null,
                          teamId: null,
                          projectId: prev.host?.vercel?.projectId ?? null,
                        },
                      },
                    }));
                  } else {
                    setSetupData((prev) => ({
                      ...prev,
                      host: {
                        provider: "Vercel",
                        vercel: {
                          token: prev.host?.vercel?.token ?? null,
                          teamId: team.id,
                          projectId: prev.host?.vercel?.projectId ?? null,
                        },
                      },
                    }));
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  setupData.host?.vercel?.teamId === team.id &&
                  "bg-zinc-200 dark:bg-zinc-800"
                }`}
                key={team.id}
              >
                <span>{team.name}</span>
                {team.createdAt && (
                  <span className="text-xs">
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            disabled={!setupData.host.vercel?.teamId || loading}
            onClick={getProjects}
            className="w-full"
          >
            Connect Team
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="gap-4 text-center">
        <div className="flex w-full justify-center">
          <VercelLogo />
        </div>
        Connect Vercel to SimplCMS
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          Go to{" "}
          <Link
            href="https://vercel.com/account/settings/tokens"
            target="_blank"
            className="hover:underline"
          >
            https://vercel.com/account/settings/tokens
          </Link>{" "}
          and create an access token.
        </CardDescription>
        <Input
          value={
            platformConfiguration.host?.vercel?.token ??
            setupData.host?.vercel?.token ??
            ""
          }
          onChange={(e) =>
            setSetupData((prev) => ({
              ...prev,
              host: {
                provider: "Vercel",
                vercel: {
                  token: e.target.value,
                  teamId: prev.host?.vercel?.teamId ?? null,
                  projectId: prev.host?.vercel?.projectId ?? null,
                },
              },
            }))
          }
          type="password"
          placeholder="Access token..."
        />
        <div className=" flex flex-col gap-y-3">
          <Button
            onClick={getTeams}
            disabled={setupData.host.vercel?.token === "" || loading}
            className="w-full"
          >
            Connect Vercel
          </Button>
          <Link href="/setup">
            <Button variant="secondary" className="w-full text-foreground">
              Back
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
