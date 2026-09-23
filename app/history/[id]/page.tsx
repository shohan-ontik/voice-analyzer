import { notFound, redirect } from "next/navigation";
import { AnalysisBreakdown } from "../../components/AnalysisBreakdown";
import { BackHeader } from "../../components/BackHeader";
import { ScoreCircle } from "../../components/history/ScoreCircle";
import { PracticeAgainButton } from "../../components/PracticeAgainButton";
import { ApiClientError, getOwnPracticeSession } from "../../lib/apiClient";
import { getSessionToken } from "../../lib/session";
import type { PracticeSessionRecord } from "../../lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// Where "Practice Again" should send the user: back to the specific chapter's
// roleplay briefing or the module exam briefing this session came from, or
// the ad-hoc pitch recorder for a topic-only session. moduleSlug/chapterSlug
// are resolved server-side (see getOwnPracticeSession).
function practiceAgainHref(session: PracticeSessionRecord) {
  if (session.chapterId) {
    return session.moduleSlug && session.chapterSlug
      ? `/modules/${session.moduleSlug}/chapters/${session.chapterSlug}/roleplay`
      : "/modules";
  }
  if (session.examId) {
    return session.moduleSlug ? `/modules/${session.moduleSlug}/exam` : "/modules";
  }
  return "/record";
}

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const token = await getSessionToken();
  if (!token) redirect("/login");

  let session: PracticeSessionRecord;
  try {
    session = await getOwnPracticeSession(token, id);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) notFound();
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader
        title={`${session.topicName} — Results`}
        subtitle={formatDate(session.createdAt)}
        backHref="/history"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">
        <div className="p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border flex flex-col items-center gap-6">
          <ScoreCircle score={session.overallScore} />

          <div className="text-center">
            <div className="font-display font-bold text-[19px] mb-1.5 text-foreground">{session.verdict}</div>
            <div className="text-[13.5px] text-foreground-muted leading-relaxed">
              Practiced {formatDate(session.createdAt)}.
            </div>
          </div>

          <PracticeAgainButton href={practiceAgainHref(session)} />
        </div>

        <div className="p-6 sm:p-8 lg:p-12">
          <AnalysisBreakdown categories={session.categories} transcript={session.transcript} />
        </div>
      </div>
    </div>
  );
}
