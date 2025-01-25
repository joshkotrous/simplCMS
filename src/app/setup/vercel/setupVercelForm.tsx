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
import {
  GetProjectsProjects,
  GetProjectsResponseBody,
} from "@vercel/sdk/models/getprojectsop.js";
import { toast } from "sonner";
import * as vercel from "@/app/actions/vercel";
import { useRouter } from "next/navigation";
import { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";
import { TeamLimited } from "@vercel/sdk/models/teamlimited.js";
import Link from "next/link";

export default function SetupVercelForm({
  initialProjects,
  initialSiteUrl,
}: {
  initialProjects: GetProjectsResponseBody | null;
  initialSiteUrl: string | null;
}) {
  const [siteUrl, setSiteUrl] = useState<string | null>(initialSiteUrl ?? null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    token: "",
    loading: false,
  });
  const [projectConnected, setProjectConnected] = useState(false);
  const [projects, setProjects] = useState<GetProjectsResponseBody | null>(
    initialProjects
  );
  const [teams, setTeams] = useState<GetTeamsResponseBody | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<GetProjectsProjects | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<
    TeamLimited | { [k: string]: any } | null
  >(null);

  async function getProjects() {
    setFormData({ ...formData, loading: true });
    if (!selectedTeam) throw new Error("Team must be selected");
    const projects = await vercel.getProjectsAction(
      formData.token,
      selectedTeam.id
    );
    console.log(projects);
    setProjects(projects);
    setFormData({ ...formData, loading: false });
  }

  async function getTeams() {
    setFormData({ ...formData, loading: true });
    toast.promise(vercel.getTeams(formData.token), {
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
    setFormData({ ...formData, loading: false });
  }

  async function connectVercelProject() {
    if (!selectedProject) {
      toast.error("You must select a project to connect.");
      return;
    }

    toast.promise(vercel.connectProject(selectedProject, formData.token), {
      loading: `Connecting to ${selectedProject.name}...`,
      success: () => {
        // router.push("/setup/database");
        setProjectConnected(true);
        return `Successfully connected ${selectedProject.name}.`;
      },
      error: (error) => {
        const _error = JSON.parse(
          error.message.replace("Response validation failed: ", "")
        );
        const message = _error.length > 1 ? _error[1].received : null;
        return `Error connecting to ${selectedProject.name}: ${message}.`;
      },
    });
  }

  async function configureSiteUrl() {
    if (!selectedProject || !siteUrl) return;
    toast.promise(
      vercel.addEnvVar(formData.token, selectedProject, {
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
                  if (selectedProject && selectedProject.id === project.id) {
                    setSelectedProject(null);
                  } else {
                    setSelectedProject(project);
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  selectedProject &&
                  selectedProject.id === project.id &&
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
            disabled={!selectedProject}
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
                  if (selectedTeam && selectedTeam.id === team.id) {
                    setSelectedTeam(null);
                  } else {
                    setSelectedTeam(team);
                  }
                }}
                className={`border rounded p-2 flex flex-col hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                  selectedTeam &&
                  selectedTeam.id === team.id &&
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
            disabled={!selectedTeam || formData.loading}
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
          value={formData.token}
          onChange={(e) => setFormData({ ...formData, token: e.target.value })}
          type="password"
          placeholder="Access token..."
        />
        <Button
          onClick={getTeams}
          disabled={formData.token === "" || formData.loading}
          className="w-full"
        >
          Connect Vercel
        </Button>
      </CardContent>
    </Card>
  );
}
