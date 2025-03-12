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
import { useEffect, useState } from "react";
import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import { toast } from "sonner";
import * as vercel from "@/app/actions/vercel";
import { useRouter } from "next/navigation";
import { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";
import Link from "next/link";
import { useSetupData } from "../setupContextProvider";
import { SimplCMSPlatformConfiguration } from "@/types/types";
import { Loader2 } from "lucide-react";

export default function SetupVercelForm({
  initialSiteUrl,
  platformConfiguration,
}: {
  initialSiteUrl: string | null;
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const { setupData, setSetupData, isInitialized } = useSetupData();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [siteUrl, setSiteUrl] = useState<string | null>(initialSiteUrl ?? null);
  const router = useRouter();
  const [projectConnected, setProjectConnected] = useState(false);
  const [projects, setProjects] = useState<GetProjectsResponseBody | null>(
    null
  );
  const [teams, setTeams] = useState<GetTeamsResponseBody | null>(null);

  // Handle initialization and ensure host provider is set up
  useEffect(() => {
    if (isInitialized) {
      // If no host property exists at all, initialize it with Vercel provider
      if (!setupData.host) {
        console.log("Initializing host with Vercel provider");
        setSetupData((prev) => ({
          ...prev,
          host: {
            provider: "Vercel",
            vercel: {
              token: platformConfiguration.host?.vercel?.token || null,
              teamId: null,
              projectId: null,
              projectName: null,
            },
          },
        }));
      }
      // If host exists but no provider, set the provider to Vercel
      else if (!setupData.host.provider) {
        console.log("Setting provider to Vercel");
        setSetupData((prev) => ({
          ...prev,
          host: {
            // Only spread prev.host if it exists
            ...(prev.host || {}),
            provider: "Vercel",
            vercel: prev.host?.vercel || {
              token: platformConfiguration.host?.vercel?.token || null,
              teamId: null,
              projectId: null,
              projectName: null,
            },
          },
        }));
      }

      setInitializing(false);
    }
  }, [isInitialized, setupData.host, platformConfiguration.host, setSetupData]);

  async function getProjects() {
    setLoading(true);

    try {
      if (!setupData.host?.vercel?.token) {
        toast.error("Vercel token is not set");
        setLoading(false);
        return;
      }

      if (!setupData.host.vercel?.teamId) {
        toast.error("Team must be selected");
        setLoading(false);
        return;
      }

      const projects = await vercel.getProjectsAction(
        platformConfiguration.host?.vercel?.token ??
          setupData.host.vercel.token,
        setupData.host.vercel.teamId
      );

      console.log(projects);
      setProjects(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  async function getTeams() {
    setLoading(true);

    try {
      if (!setupData.host?.vercel?.token) {
        toast.error("Vercel token not setup");
        setLoading(false);
        return;
      }

      console.log("Using token:", setupData.host.vercel.token);

      await toast.promise(
        vercel.getTeams(
          platformConfiguration.host?.vercel?.token ??
            setupData.host.vercel.token
        ),
        {
          loading: "Connecting to Vercel...",
          success: (data) => {
            setTeams(data);
            console.log("Teams:", data);
            return "Successfully connected to Vercel";
          },
          error: (error) => {
            console.error("Error connecting to Vercel:", error);
            return "Error connecting to Vercel";
          },
        }
      );
    } catch (error) {
      console.error("Error in getTeams:", error);
    } finally {
      setLoading(false);
    }
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
          console.error("Project connection error:", error);
          // Remove error parsing that was causing issues
          return `Error connecting to project. Please try again.`;
        },
      }
    );
  }

  async function configureSiteUrl() {
    try {
      if (!setupData.host?.vercel?.projectId) {
        toast.error("Project is missing");
        return;
      }

      if (!setupData.host.vercel.teamId) {
        toast.error("Team ID is missing");
        return;
      }

      if (!siteUrl) {
        toast.error("Please enter a site URL");
        return;
      }

      if (!setupData.host.vercel.token) {
        toast.error("Vercel token is not configured");
        return;
      }

      await toast.promise(
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
            router.push("/setup");
            return "Successfully configured site url.";
          },
          error: (error) => {
            console.error("Error configuring site URL:", error);
            return "Error configuring site url.";
          },
        }
      );
    } catch (error) {
      console.error("Error in configureSiteUrl:", error);
      toast.error("Failed to configure site URL");
    }
  }

  // Show loading state while initializing
  if (initializing) {
    return (
      <Card>
        <CardHeader className="gap-4 text-center">
          <div className="flex w-full justify-center">
            <VercelLogo />
          </div>
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Initializing Vercel setup...</span>
          </div>
        </CardHeader>
      </Card>
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
            disabled={!siteUrl || siteUrl === "" || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Setting URL...
              </>
            ) : (
              "Set Site URL"
            )}
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
                          token: prev.host?.vercel?.token || null,
                          teamId: prev.host?.vercel?.teamId || null,
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
                          token: prev.host?.vercel?.token || null,
                          teamId: prev.host?.vercel?.teamId || null,
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
            disabled={!setupData.host?.vercel?.projectId || loading}
            onClick={connectVercelProject}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              "Connect Project"
            )}
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
                          token: prev.host?.vercel?.token || null,
                          teamId: null,
                          projectId: prev.host?.vercel?.projectId || null,
                          projectName: prev.host?.vercel?.projectName || null,
                        },
                      },
                    }));
                  } else {
                    setSetupData((prev) => ({
                      ...prev,
                      host: {
                        provider: "Vercel",
                        vercel: {
                          token: prev.host?.vercel?.token || null,
                          teamId: team.id,
                          projectId: prev.host?.vercel?.projectId || null,
                          projectName: prev.host?.vercel?.projectName || null,
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
            disabled={!setupData.host?.vercel?.teamId || loading}
            onClick={getProjects}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading Projects...
              </>
            ) : (
              "Connect Team"
            )}
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
          value={setupData.host?.vercel?.token ?? ""}
          onChange={(e) =>
            setSetupData((prev) => ({
              ...prev,
              host: {
                provider: "Vercel",
                vercel: {
                  token: e.target.value,
                  teamId: prev.host?.vercel?.teamId ?? null,
                  projectId: prev.host?.vercel?.projectId ?? null,
                  projectName: prev.host?.vercel?.projectName ?? null,
                },
              },
            }))
          }
          type="password"
          placeholder="Access token..."
        />
        <div className="flex flex-col gap-y-3">
          <Button
            onClick={getTeams}
            disabled={!setupData.host?.vercel?.token || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              "Connect Vercel"
            )}
          </Button>
          <Link href="/setup/host">
            <Button variant="secondary" className="w-full text-foreground">
              Back
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
