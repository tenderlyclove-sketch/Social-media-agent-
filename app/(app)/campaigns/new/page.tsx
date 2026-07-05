import { PageHeader } from "@/components/page-header"
import { NewCampaignForm } from "@/components/new-campaign-form"

export default function NewCampaignPage() {
  return (
    <>
      <PageHeader
        title="Plan a campaign"
        description="Describe your product and goals. The agent designs a complete cross-platform media strategy you can launch in one click."
      />
      <NewCampaignForm />
    </>
  )
}
