"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, BuildingIcon, CalendarIcon, PhoneIcon } from "../components/icons";
import { authFetch } from "../lib/clientFetch";
import { getChapterProgress } from "../lib/moduleProgress";
import { profileData } from "../lib/profileData";
import { toEvaluationReport, type EvaluationReport, type ReportKind } from "../lib/reportsData";
import type { AppUser, PracticeSessionRecord, StatsSummary } from "../lib/types";
import { useModules } from "../lib/useModules";

const REPORT_KIND_LABEL: Record<ReportKind, string> = {
  practice: "প্র্যাকটিস পিচ",
  exam: "মডিউল এক্সাম",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export default function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [recentReports, setRecentReports] = useState<EvaluationReport[] | null>(null);
  const { modules } = useModules();

  useEffect(() => {
    let cancelled = false;

    authFetch("/api/auth/me")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) setUser(body);
      })
      .catch(() => {});

    authFetch("/api/sessions/stats")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) setStats(body as StatsSummary);
      })
      .catch(() => {});

    authFetch("/api/sessions?pageSize=3")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) setRecentReports((body.items as PracticeSessionRecord[]).map(toEvaluationReport));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const trainingProgress = modules?.map((m) => {
    const { completed, total } = getChapterProgress(m);
    return { skill: m.title, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 py-6 lg:px-10 lg:py-10 max-w-[1000px] w-full mx-auto flex flex-col gap-6">
        {user?.mustChangePassword && (
          <div className="rounded-xl bg-accent-soft text-accent text-[13.5px] px-4 py-3.5 flex items-center justify-between gap-4">
            <span>You&apos;re still using a temporary password — change it to secure your account.</span>
            <Link href="/profile/password" className="font-display font-semibold whitespace-nowrap">
              Change now
            </Link>
          </div>
        )}

        <div className="bg-background-elevated border border-border rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder photo from an external stub image host */}
            <img
              src={profileData.avatarUrl}
              alt=""
              className="w-28 h-28 rounded-2xl object-cover shrink-0 bg-border"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="font-display font-bold text-[22px] lg:text-[26px] text-foreground">
                  {user?.name ?? "…"}
                </h1>
                <span className="px-2.5 py-1 rounded-full bg-success-soft text-success text-[11px] font-bold">
                  {user ? (user.isBanned ? "নিষিদ্ধ" : "আক্টিভ") : "…"}
                </span>
              </div>

              <div className="text-[13px] text-foreground-muted font-semibold mb-3">{profileData.employeeId}</div>

              <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-[13px] text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <BuildingIcon size={14} />
                  {profileData.department}
                </span>
                <span aria-hidden>•</span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon size={14} />
                  {user?.phone ?? "…"}
                </span>
                <span aria-hidden>•</span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon size={14} />
                  জয়েনিং: {user ? formatDate(user.createdAt) : "…"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="px-4 py-2 rounded-xl border-[1.5px] border-navy/20 bg-navy-soft text-navy font-display font-semibold text-[13px] whitespace-nowrap">
                {profileData.roleLabel}
              </span>
              <Link href="/profile/password" className="text-[12px] font-semibold text-foreground-muted hover:text-foreground">
                পাসওয়ার্ড পরিবর্তন
              </Link>
            </div>
          </div>

          <div className="h-px bg-border my-6" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "বাকি পিচ", value: stats ? String(stats.pitchesRemainingThisMonth) : "…" },
              { label: "মূল্যায়িত পিচ", value: stats ? String(stats.totalPitchesEvaluated) : "…" },
              { label: "কমপ্লেটেড মডিউল", value: stats ? String(stats.completedModules) : "…" },
              { label: "গড় স্কোর", value: stats?.averageScore != null ? `${stats.averageScore}%` : "…" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-background border border-border p-4 lg:p-5 text-center">
                <div className="text-[12px] font-semibold text-foreground-muted mb-1.5">{stat.label}</div>
                <div className="font-display font-bold text-[22px] text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-elevated border border-border rounded-2xl p-6 lg:p-8 flex flex-col gap-5">
          <h2 className="font-display font-bold text-[17px] text-foreground">ট্রেনিং প্রোগ্রেস</h2>

          {!trainingProgress ? (
            <div className="text-[13.5px] text-foreground-muted text-center py-2">লোড হচ্ছে…</div>
          ) : trainingProgress.length === 0 ? (
            <div className="text-[13.5px] text-foreground-muted text-center py-2">কোনো মডিউল পাওয়া যায়নি।</div>
          ) : (
            trainingProgress.map((item) => (
              <div key={item.skill}>
                <div className="flex items-center justify-between mb-1.5 text-[13.5px]">
                  <span className="font-semibold text-foreground">{item.skill}</span>
                  <span className="font-bold text-foreground">{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.percent === 100 ? "bg-success" : "bg-navy"}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-background-elevated border border-border rounded-2xl p-6 lg:p-8 flex flex-col gap-4">
          <h2 className="font-display font-bold text-[17px] text-foreground">সাম্প্রতিক ইভালুয়েশন হিস্ট্রি</h2>

          {!recentReports ? (
            <div className="text-[13.5px] text-foreground-muted text-center py-2">লোড হচ্ছে…</div>
          ) : recentReports.length === 0 ? (
            <div className="text-[13.5px] text-foreground-muted text-center py-2">কোনো রিপোর্ট খুঁজে পাওয়া যায়নি।</div>
          ) : (
            recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 rounded-xl bg-background border border-border p-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-[15px] shrink-0 ${
                    report.passed ? "bg-success-soft text-success" : "bg-error-soft text-error"
                  }`}
                >
                  {report.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-foreground truncate">{report.title}</div>
                  <div className="text-[12px] text-foreground-muted">
                    {REPORT_KIND_LABEL[report.kind]} • {report.date}
                  </div>
                </div>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-[13px] font-bold text-navy shrink-0"
                >
                  রিপোর্ট দেখুন
                  <ArrowRightIcon size={13} />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
