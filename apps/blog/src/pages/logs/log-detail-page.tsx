import { getLog } from "@/service/logs";
import { ContentDetailLayout } from "@/components/content-detail-layout";

export default function LogDetailPage() {
  return <ContentDetailLayout getItem={getLog} category="logs" />;
}
