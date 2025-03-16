import { User } from "@/types";
import { SetupLayout, SimplCMSLayout } from "../layouts";
import SetupDatabasePage from "../pages/setup/database/setupDatabasePage";
import SetupMongoPage from "../pages/setup/database/setupMongoPage";
import HostSetupPage from "../pages/setup/host/setupHostPage";
import SetupVercelPage from "../pages/setup/host/setupVercelPage";
import SetupCloudinaryPage from "../pages/setup/mediaStorage/setupCloudinaryPage";
import SetupMediaStoragePage from "../pages/setup/mediaStorage/setupMediaStoragePage";
import SetupS3Page from "../pages/setup/mediaStorage/setupS3Page";
import SetupGoogleOauthPage from "../pages/setup/oauth/setupGoogleOauthPage";
import SetupOauth from "../pages/setup/oauth/setupOauthPage";
import SetupPage from "../pages/setup/setupPage";

export default async function SetupRouter(slug: string[], user: User) {
  if (slug?.[0] === "setup") {
    if (slug?.[1] === "database") {
      if (slug?.[2] === "mongo") {
        return (
          <SimplCMSLayout user={user}>
            <SetupLayout>
              <SetupMongoPage />
            </SetupLayout>
          </SimplCMSLayout>
        );
      }
      return (
        <SimplCMSLayout user={user}>
          <SetupLayout>
            <SetupDatabasePage />
          </SetupLayout>
        </SimplCMSLayout>
      );
    }
    if (slug?.[1] === "oauth") {
      if (slug?.[2] === "google") {
        return (
          <SimplCMSLayout user={user}>
            <SetupLayout>
              <SetupGoogleOauthPage />
            </SetupLayout>
          </SimplCMSLayout>
        );
      }
      return (
        <SimplCMSLayout user={user}>
          <SetupLayout>
            <SetupOauth />
          </SetupLayout>
        </SimplCMSLayout>
      );
    }
    if (slug?.[1] === "host") {
      if (slug?.[2] === "vercel") {
        return (
          <SimplCMSLayout user={user}>
            <SetupLayout>
              <SetupVercelPage />
            </SetupLayout>
          </SimplCMSLayout>
        );
      }
      return (
        <SimplCMSLayout user={user}>
          <SetupLayout>
            <HostSetupPage />
          </SetupLayout>
        </SimplCMSLayout>
      );
    }
    if (slug?.[1] === "media-storage") {
      if (slug?.[2] === "cloudinary") {
        return (
          <SimplCMSLayout user={user}>
            <SetupLayout>
              <SetupCloudinaryPage />
            </SetupLayout>
          </SimplCMSLayout>
        );
      }
      if (slug?.[2] === "s3") {
        return (
          <SimplCMSLayout user={user}>
            <SetupLayout>
              <SetupS3Page />
            </SetupLayout>
          </SimplCMSLayout>
        );
      }
      return (
        <SimplCMSLayout user={user}>
          <SetupLayout>
            <SetupMediaStoragePage />
          </SetupLayout>
        </SimplCMSLayout>
      );
    }
    return (
      <SimplCMSLayout user={user}>
        <SetupLayout>
          <SetupPage />
        </SetupLayout>
      </SimplCMSLayout>
    );
  }
}
