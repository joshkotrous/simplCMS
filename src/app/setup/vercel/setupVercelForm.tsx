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

export default function SetupVercelForm({
  initialProjects,
  initialSiteUrl,
}: {
  initialProjects: GetProjectsResponseBody | null;
  initialSiteUrl: string | null;
}) {
  const { setupData, setSetupData } = useSetupData();
  const [loading, setLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState<string | null>(initialSiteUrl ?? null);
  const router = useRouter();

  const [projectConnected, setProjectConnected] = useState(false);
  const [projects, setProjects] = useState<GetProjectsResponseBody | null>(
    initialProjects
  );
  const [teams, setTeams] = useState<GetTeamsResponseBody | null>(null);

  async function getProjects() {
    setLoading(true);
    if (!setupData.vercelToken) throw new Error("Vercel token is not set");
    if (!setupData.vercelTeam) throw new Error("Team must be selected");
    const projects = await vercel.getProjectsAction(
      setupData.vercelToken,
      setupData.vercelTeam.id
    );
    console.log(projects);
    setProjects(projects);
    setLoading(false);
  }

  async function getTeams() {
    setLoading(true);
    if (!setupData.vercelToken) throw new Error("Vercel token not setup");
    toast.promise(vercel.getTeams(setupData.vercelToken), {
      loading: "Connecting to Vercel...",
      success: (data) => {
        setTeams(data);
        console.log(teams);
        return "Successfully connected to Vercel";
      },
      error: () => {
        return "Error connecting to Vercel";
      },
    });
    setLoading(false);
  }

  async function connectVercelProject() {
    if (!setupData.vercelProject || !setupData.vercelToken) {
      toast.error("You must select a project to connect.");
      return;
    }

    toast.promise(
      vercel.connectProject(setupData.vercelProject, setupData.vercelToken),
      {
        loading: `Connecting to ${setupData.vercelProject.name}...`,
        success: () => {
          setProjectConnected(true);
          return `Successfully connected ${setupData.vercelProject!.name}.`;
        },
        error: (error) => {
          const _error = JSON.parse(
            error.message.replace("Response validation failed: ", "")
          );
          const message = _error.length > 1 ? _error[1].received : null;
          return `Error connecting to ${
            setupData.vercelProject!.name
          }: ${message}.`;
        },
      }
    );
  }

  async function configureSiteUrl() {
    if (!setupData.vercelProject || !siteUrl) return;
    if (!setupData.vercelToken) return;
    toast.promise(
      vercel.addEnvVar(setupData.vercelToken, setupData.vercelProject, {
        key: "NEXT_PUBLIC_SITE_URL",
        value: siteUrl,
        target: ["production"],
        type: "plain",
      }),
      {
        loading: "Setting site url...",
        success: () => {
          router.push("/setup/database");
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
                  if (setupData.vercelProject?.id === project.id) {
                    setSetupData((prev) => ({ ...prev, vercelProject: null }));
                  } else {
                    setSetupData((prev) => ({
                      ...prev,
                      vercelProject: project,
                    }));
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  setupData.vercelProject &&
                  setupData.vercelProject.id === project.id &&
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
            disabled={!setupData.vercelProject}
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
                  if (
                    setupData.vercelTeam &&
                    setupData.vercelTeam.id === team.id
                  ) {
                    setSetupData((prev) => ({ ...prev, vercelTeam: null }));
                  } else {
                    setSetupData((prev) => ({ ...prev, vercelTeam: team }));
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  setupData.vercelTeam &&
                  setupData.vercelTeam.id === team.id &&
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
            disabled={!setupData.vercelTeam || loading}
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
          value={setupData.vercelToken}
          onChange={(e) =>
            setSetupData((prev) => ({ ...prev, vercelToken: e.target.value }))
          }
          type="password"
          placeholder="Access token..."
        />
        <Button
          onClick={getTeams}
          disabled={setupData.vercelToken === "" || loading}
          className="w-full"
        >
          Connect Vercel
        </Button>
      </CardContent>
    </Card>
  );
}
