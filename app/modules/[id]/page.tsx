import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ModuleDetailView } from "../../components/modules/ModuleDetailView";
import { ArrowLeftIcon } from "../../components/icons";
import { ApiClientError, getModule } from "../../lib/apiClient";
import { getSessionToken } from "../../lib/session";
import type { TrainingModule } from "../../lib/types";

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const token = await getSessionToken();
  if (!token) redirect("/login");

  let trainingModule: TrainingModule;
  try {
    trainingModule = await getModule(token, id);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) notFound();
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8">
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground-muted hover:text-foreground"
        >
          <ArrowLeftIcon size={15} />
          সকল মডিউল ফিরে যান
        </Link>
      </div>

      <ModuleDetailView initialModule={trainingModule} />
    </div>
  );
}
