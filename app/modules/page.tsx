import { redirect } from "next/navigation";
import { ModuleCard } from "../components/modules/ModuleCard";
import { ModulesFilters } from "../components/modules/ModulesFilters";
import { ApiClientError, listModules } from "../lib/apiClient";
import { getSessionToken } from "../lib/session";
import type { TrainingModule } from "../lib/types";

export default async function ModulesPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let modules: TrainingModule[];
  try {
    const { items } = await listModules(token);
    modules = items;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  const entries = modules.map((m) => ({
    module: m,
    node: <ModuleCard key={m.id} module={m} />,
  }));

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ModulesFilters entries={entries} />
    </div>
  );
}
