"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VercelLogo } from "../page";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  GetProjectsProjects,
  GetProjectsResponseBody,
} from "@vercel/sdk/models/getprojectsop.js";
import { toast } from "sonner";
import { connectProject, getProjectsAction } from "@/app/actions/vercelActions";
import { useRouter } from "next/navigation";

export default function SetupVercelForm({
  initialProjects,
}: {
  initialProjects: GetProjectsResponseBody | null;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamId: "",
    token: "",
    loading: false,
  });

  const [projects, setProjects] = useState<GetProjectsResponseBody | null>(
    initialProjects
  );

  const [selectedProject, setSelectedProject] =
    useState<GetProjectsProjects | null>(null);

  function getProjects() {
    setFormData({ ...formData, loading: true });
    console.log(formData);
    toast.promise(getProjectsAction(formData.token, formData.teamId), {
      loading: "Connecting to Vercel...",
      success: (data) => {
        setProjects(data);
        return "Successfully connected to Vercel";
      },
      error: () => {
        return "Error connecting to Vercel.";
      },
    });
    setFormData({ ...formData, loading: false });
  }

  async function connectVercelProject() {
    if (!selectedProject) {
      toast.error("You must select a project to connect.");
      return;
    }

    toast.promise(connectProject(selectedProject, formData.token), {
      loading: `Connecting to ${selectedProject.name}...`,
      success: () => {
        router.push("/setup/database");
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

  if (projects) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
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
                  className={`border rounded p-2 flex flex-col hover:bg-zinc-200 transition-all ${
                    selectedProject &&
                    selectedProject.id === project.id &&
                    "bg-zinc-200"
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
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex w-full justify-center">
            <VercelLogo />
          </div>
          Connect Vercel to SimplCMS
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={formData.teamId}
            onChange={(e) =>
              setFormData({ ...formData, teamId: e.target.value })
            }
            placeholder="Team id..."
          />
          <Input
            value={formData.token}
            onChange={(e) =>
              setFormData({ ...formData, token: e.target.value })
            }
            type="password"
            placeholder="Vercel token..."
          />
          <Button
            onClick={getProjects}
            disabled={
              formData.teamId === "" ||
              formData.token === "" ||
              formData.loading
            }
            className="w-full"
          >
            Connect Vercel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
