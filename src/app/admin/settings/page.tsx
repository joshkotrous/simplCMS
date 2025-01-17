import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers } from "@/packages/core/src/user";
import { FaGoogle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MongoDBLogo } from "@/app/setup/page";
import { Separator } from "@/components/ui/separator";
import Users from "./users";

export default async function AdminSettingsPage() {
  const users = await getAllUsers();
  const dataBaseProvider = process.env.SIMPLCMS_DB_PROVIDER ?? null;
  const oauthProviders = process.env.SIMPLCMS_OAUTH_PROVIDERS
    ? process.env.SIMPLCMS_OAUTH_PROVIDERS.split(",")
    : [];

  return (
    <div className="p-4 h-full overflow-auto space-y-2">
      <h2 className="text-3xl font-bold">Settings</h2>
      <Tabs defaultValue="users" className="flex gap-4 w-full">
        <TabsList className="flex flex-col h-fit">
          <TabsTrigger
            value="users"
            className="text-lg font-semibold w-full justify-end px-2"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="site"
            className="text-lg font-semibold w-full justify-end px-2"
          >
            Site
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full flex justify-center">
          <TabsContent value="users" className="w-[44rem]">
            <Users users={users} />
          </TabsContent>
          <TabsContent value="site" className="w-[44rem] space-y-4">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Database Connection</h3>
              <div className="grid grid-cols-3">
                {dataBaseProvider && (
                  <Card className="">
                    <CardContent className="p-2 flex justify-center items-center flex-col gap-4">
                      <MongoDBLogo />
                      <span className="font-semibold">{dataBaseProvider}</span>
                      <Button className="w-full" variant="destructive">
                        Disconnect
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">OAuth Providers</h3>
              <div className="grid grid-cols-3">
                {oauthProviders && (
                  <div>
                    {oauthProviders.map((provider) => (
                      <Card key={provider} className="">
                        <CardContent className="p-2 flex justify-center items-center flex-col gap-4">
                          <FaGoogle className="size-24" />
                          <span className="font-semibold">Google OAuth</span>
                          <Button className="w-full" variant="destructive">
                            Disconnect
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
