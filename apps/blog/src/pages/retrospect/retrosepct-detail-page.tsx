import { getRetrospect } from "@/service/retrospects";
import { ContentDetailLayout } from "@/components/content-detail-layout";

export default function RetrospectDetailPage() {
  return <ContentDetailLayout getItem={getRetrospect} category="retrospect" />;
}
