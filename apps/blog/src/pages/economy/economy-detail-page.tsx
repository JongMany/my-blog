import { getEconomy } from "@/service/economy";
import { ContentDetailLayout } from "@/components/content-detail-layout";

export default function EconomyDetailPage() {
  return <ContentDetailLayout getItem={getEconomy} category="economy" />;
}
