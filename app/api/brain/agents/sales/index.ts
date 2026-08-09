import { SalesTask, SalesResult } from "./types";

import { pricingSpecialist } from "./pricing";
import { offerSpecialist } from "./offers";
import { funnelSpecialist } from "./funnel";
import { retentionSpecialist } from "./retention";
import { upsellSpecialist } from "./upsell";

export async function salesDepartment(
  task: SalesTask
): Promise<SalesResult> {

  const pricing = await pricingSpecialist(task);

  const offers = await offerSpecialist(task);

  const funnel = await funnelSpecialist(task);

  const retention = await retentionSpecialist(task);

  const upsell = await upsellSpecialist(task);

  return {

    success: true,

    specialist: "sales",

    title: "Complete Sales Department",

    data: {

      pricing: pricing.data,

      offers: offers.data,

      funnel: funnel.data,

      retention: retention.data,

      upsell: upsell.data

    },

    recommendations: [

      ...(pricing.recommendations ?? []),

      ...(offers.recommendations ?? []),

      ...(funnel.recommendations ?? []),

      ...(retention.recommendations ?? []),

      ...(upsell.recommendations ?? [])

    ]

  };

}