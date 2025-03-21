import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettings from "@/components/dashboard/settings/general-setting"
import SeoSettings from "@/components/dashboard/settings/seo-setting"
import ApiSettings from "@/components/dashboard/settings/api-setting"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Pengaturan | Dashboard Admin",
  description: "Kelola pengaturan website Brick Property",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola pengaturan website Brick Property</p>
      </div>

      <Card>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-6 bg-transparent h-auto">
            <TabsTrigger
              value="general"
              className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Umum
            </TabsTrigger>
            <TabsTrigger
              value="seo"
              className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              SEO
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-6 pt-4">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="seo" className="p-6 pt-4">
            <SeoSettings />
          </TabsContent>

          <TabsContent value="api" className="p-6 pt-4">
            <ApiSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

