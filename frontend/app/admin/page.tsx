"use client";

import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  FileCheck,
  Mail,
  MonitorPlay,
  Newspaper,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSettings } from "../context/SettingsContext";

type ModuleKey =
  | "leads"
  | "siteVisits"
  | "subscribers"
  | "clients"
  | "newsletter"
  | "blogs"
  | "agents"
  | "vendors"
  | "openings"
  | "jobApplications"
  | "employees";

type ModuleColor =
  | "blue"
  | "violet"
  | "green"
  | "orange"
  | "red"
  | "cyan"
  | "slate"
  | "pink"
  | "amber"
  | "emerald"
  | "indigo";

interface DashboardItem {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  subject?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  products?: string[];
  assignedTo?: unknown;
  followUpDate?: string;
  leadStatus?: string;
  verified?: boolean;
  isActive?: boolean;
  status?: string;
  careerId?: { title?: string };
  createdAt?: string;
  updatedAt?: string;
  datePublished?: string;
  lastUpdated?: string;
  [key: string]: unknown;
}

type DashboardCollections = Record<ModuleKey, DashboardItem[]>;

interface ModuleConfig {
  key: ModuleKey;
  label: string;
  singular: string;
  endpoint: string;
  href: string;
  icon: ReactNode;
  color: ModuleColor;
  subtitle: (items: DashboardItem[]) => string;
}

const EMPTY_COLLECTIONS: DashboardCollections = {
  leads: [],
  siteVisits: [],
  subscribers: [],
  clients: [],
  newsletter: [],
  blogs: [],
  agents: [],
  vendors: [],
  openings: [],
  jobApplications: [],
  employees: [],
};

const MODULES: ModuleConfig[] = [
  {
    key: "leads",
    label: "Leads",
    singular: "Lead",
    endpoint: "lead",
    href: "/admin/lead",
    icon: <Users size={19} />,
    color: "blue",
    subtitle: (items) => `${countToday(items)} today`,
  },
  {
    key: "siteVisits",
    label: "Site Visits",
    singular: "Site Visit",
    endpoint: "sitevisit",
    href: "/admin/site-visit",
    icon: <MonitorPlay size={19} />,
    color: "violet",
    subtitle: (items) => `${countByStatus(items, "pending")} pending`,
  },
  {
    key: "subscribers",
    label: "Subscribers",
    singular: "Subscriber",
    endpoint: "subscribers",
    href: "/admin/subscribers",
    icon: <Mail size={19} />,
    color: "green",
    subtitle: (items) =>
      `${items.filter((item) => item.isActive).length} active`,
  },
  {
    key: "clients",
    label: "Clients",
    singular: "Client",
    endpoint: "client",
    href: "/admin/clients",
    icon: <Users2 size={19} />,
    color: "cyan",
    subtitle: () => "Published profiles",
  },
  {
    key: "newsletter",
    label: "Newsletters",
    singular: "Newsletter",
    endpoint: "newsletter",
    href: "/admin/newsletter",
    icon: <Mail size={19} />,
    color: "slate",
    subtitle: (items) => `${countThisMonth(items)} this month`,
  },
  {
    key: "blogs",
    label: "Blogs",
    singular: "Blog",
    endpoint: "blog/viewblog",
    href: "/admin/blogs",
    icon: <Newspaper size={19} />,
    color: "pink",
    subtitle: (items) => `${countThisMonth(items)} this month`,
  },
  {
    key: "agents",
    label: "Agents",
    singular: "Agent",
    endpoint: "agent",
    href: "/admin/agents",
    icon: <BriefcaseBusiness size={19} />,
    color: "orange",
    subtitle: (items) => `${countByStatus(items, "pending")} pending`,
  },
  {
    key: "vendors",
    label: "Vendors",
    singular: "Vendor",
    endpoint: "vendor",
    href: "/admin/vendors",
    icon: <Building2 size={19} />,
    color: "red",
    subtitle: (items) => `${countByStatus(items, "pending")} pending`,
  },
  {
    key: "openings",
    label: "Job Openings",
    singular: "Opening",
    endpoint: "career",
    href: "/admin/openings",
    icon: <Briefcase size={19} />,
    color: "amber",
    subtitle: (items) =>
      `${items.filter((item) => item.isActive).length} active`,
  },
  {
    key: "jobApplications",
    label: "Job Applications",
    singular: "Application",
    endpoint: "job-application",
    href: "/admin/job-applications",
    icon: <FileCheck size={19} />,
    color: "indigo",
    subtitle: (items) => `${countByStatus(items, "new")} new`,
  },
  {
    key: "employees",
    label: "Employees",
    singular: "Employee",
    endpoint: "employee",
    href: "/admin/employee",
    icon: <UserRoundCheck size={19} />,
    color: "emerald",
    subtitle: (items) =>
      `${items.filter((item) => item.isActive !== false).length} active`,
  },
];

function getCollection(payload: unknown): DashboardItem[] {
  if (Array.isArray(payload)) return payload as DashboardItem[];

  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as DashboardItem[];
  }

  return [];
}

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Failed to load dashboard data";
    throw new Error(message);
  }

  return payload;
}

async function requestDashboard(
  apiBase: string | undefined,
  modules: ModuleConfig[],
) {
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_BASE is not configured");
  }

  if (modules.length === 0) {
    return { data: EMPTY_COLLECTIONS, hasPartialFailure: false };
  }

  const results = await Promise.allSettled(
    modules.map((module) => fetchJson(`${apiBase}/${module.endpoint}`)),
  );

  const data = { ...EMPTY_COLLECTIONS };
  let successfulRequests = 0;

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successfulRequests += 1;
      data[modules[index].key] = getCollection(result.value);
    }
  });

  if (successfulRequests === 0) {
    throw new Error("Unable to connect to the dashboard services");
  }

  return {
    data,
    hasPartialFailure: successfulRequests < modules.length,
  };
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getItemDate(item: DashboardItem) {
  return (
    item.createdAt ||
    item.updatedAt ||
    item.datePublished ||
    item.lastUpdated ||
    ""
  );
}

function countToday(items: DashboardItem[]) {
  const today = dateKey(new Date());
  return items.filter((item) => {
    const date = getItemDate(item);
    return date ? dateKey(new Date(date)) === today : false;
  }).length;
}

function countThisMonth(items: DashboardItem[]) {
  const now = new Date();
  return items.filter((item) => {
    const date = getItemDate(item);
    if (!date) return false;
    const itemDate = new Date(date);
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }).length;
}

function countByStatus(items: DashboardItem[], status: string) {
  return items.filter(
    (item) => String(item.status || "").toLowerCase() === status,
  ).length;
}

export default function Dashboard() {
  const { settings, loading: settingsLoading } = useSettings();
  const [dashboard, setDashboard] =
    useState<DashboardCollections>(EMPTY_COLLECTIONS);
  const [chartDays, setChartDays] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [partialWarning, setPartialWarning] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const enabledModules = useMemo(() => {
    const moduleSettings = settings?.modules as
      | Partial<Record<ModuleKey, boolean>>
      | undefined;

    if (!moduleSettings) return MODULES;
    return MODULES.filter((module) => Boolean(moduleSettings[module.key]));
  }, [settings]);

  const loadDashboard = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) setRefreshing(true);
        setError("");

        const { data, hasPartialFailure } = await requestDashboard(
          API_BASE,
          enabledModules,
        );
        setDashboard(data);
        setPartialWarning(hasPartialFailure);
      } catch (err) {
        setDashboard(EMPTY_COLLECTIONS);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_BASE, enabledModules],
  );

  useEffect(() => {
    if (settingsLoading) return;

    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard, settingsLoading]);

  const totalRecords = useMemo(
    () =>
      enabledModules.reduce(
        (sum, module) => sum + dashboard[module.key].length,
        0,
      ),
    [dashboard, enabledModules],
  );

  const leadStats = useMemo(() => {
    const leads = dashboard.leads;
    const openLeads = leads.filter(
      (lead) =>
        !["interested", "not-interested"].includes(lead.leadStatus || "new"),
    );

    return {
      total: leads.length,
      pending: openLeads.length,
      completed: leads.filter((lead) =>
        ["interested", "not-interested"].includes(lead.leadStatus || "new"),
      ).length,
      verified: leads.filter((lead) => lead.verified).length,
      unassigned: leads.filter((lead) => !lead.assignedTo).length,
      followUps: leads.filter((lead) => lead.leadStatus === "follow-up").length,
      interested: leads.filter((lead) => lead.leadStatus === "interested")
        .length,
      notInterested: leads.filter(
        (lead) => lead.leadStatus === "not-interested",
      ).length,
      open: openLeads.length,
      today: countToday(leads),
      thisMonth: countThisMonth(leads),
    };
  }, [dashboard.leads]);

  const leadChartData = useMemo(() => {
    const counts = new Map<string, number>();

    dashboard.leads.forEach((lead) => {
      const date = getItemDate(lead);
      if (!date) return;
      const key = dateKey(new Date(date));
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return Array.from({ length: chartDays }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (chartDays - 1 - index));

      return {
        key: dateKey(date),
        label: date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        value: counts.get(dateKey(date)) || 0,
      };
    });
  }, [chartDays, dashboard.leads]);

  const leadPipeline = useMemo(() => {
    const pipeline = [
      { key: "new", label: "New", value: 0, color: "bg-blue-500" },
      {
        key: "contacted",
        label: "Contacted",
        value: 0,
        color: "bg-cyan-500",
      },
      {
        key: "follow-up",
        label: "Follow Up",
        value: 0,
        color: "bg-yellow-500",
      },
      {
        key: "interested",
        label: "Interested",
        value: 0,
        color: "bg-green-500",
      },
      {
        key: "not-interested",
        label: "Not Interested",
        value: 0,
        color: "bg-red-500",
      },
    ];

    dashboard.leads.forEach((lead) => {
      const status = (lead.leadStatus || "new").toLowerCase();
      const match = pipeline.find((item) => item.key === status);
      if (match) match.value += 1;
    });

    return pipeline;
  }, [dashboard.leads]);

  const latestLeads = useMemo(
    () =>
      [...dashboard.leads]
        .sort(
          (a, b) =>
            new Date(getItemDate(b)).getTime() -
            new Date(getItemDate(a)).getTime(),
        )
        .slice(0, 5),
    [dashboard.leads],
  );

  const attentionItems = useMemo(
    () =>
      enabledModules
        .map((module) => {
          const items = dashboard[module.key];
          let value = 0;
          let label = "";

          if (module.key === "leads") {
            value = leadStats.pending;
            label = "pending leads";
          } else if (module.key === "jobApplications") {
            value = countByStatus(items, "new");
            label = "new applications";
          } else if (module.key === "siteVisits") {
            value = countByStatus(items, "pending");
            label = "pending visits";
          } else if (module.key === "agents" || module.key === "vendors") {
            value = countByStatus(items, "pending");
            label = `pending ${module.label.toLowerCase()}`;
          } else if (module.key === "subscribers") {
            value = items.filter((item) => item.isActive === false).length;
            label = "inactive subscribers";
          } else if (module.key === "openings") {
            value = items.filter((item) => item.isActive).length;
            label = "active openings";
          }

          return { module, value, label };
        })
        .filter((item) => item.label),
    [dashboard, enabledModules, leadStats.pending],
  );

  const completionRate = leadStats.total
    ? Math.round((leadStats.completed / leadStats.total) * 100)
    : 0;
  const verificationRate = leadStats.total
    ? Math.round((leadStats.verified / leadStats.total) * 100)
    : 0;
  const hasLeads = enabledModules.some((module) => module.key === "leads");

  if (settingsLoading || loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        <p className="text-[var(--text-secondary)]">Preparing dashboard...</p>
      </div>
    );
  }

  return (
    <section className="pb-24 md:pb-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
            Admin Panel
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Showing data for enabled modules only.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard(true)}
          disabled={refreshing}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:opacity-60"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            className="text-sm font-semibold text-red-600"
          >
            Try again
          </button>
        </div>
      )}

      {partialWarning && !error && (
        <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-700">
          Some enabled dashboard services did not respond. Available data is
          shown below.
        </div>
      )}

      {enabledModules.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {hasLeads && (
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 md:gap-4">
              <MiniStat
                label="Total Leads"
                value={leadStats.total}
                icon={<Users size={18} />}
              />
              <MiniStat
                label="Leads This Month"
                value={leadStats.thisMonth}
                icon={<CalendarDays size={18} />}
              />
              <MiniStat
                label="Pending Leads"
                value={leadStats.pending}
                icon={<Clock3 size={18} />}
                accent="text-yellow-600"
              />
              <MiniStat
                label="Unassigned"
                value={leadStats.unassigned}
                icon={<AlertCircle size={18} />}
                accent="text-red-600"
              />
              <MiniStat
                label="Follow-ups"
                value={leadStats.followUps}
                icon={<PhoneCall size={18} />}
                accent="text-cyan-600"
              />
              <MiniStat
                label="Interested"
                value={leadStats.interested}
                icon={<Target size={18} />}
                accent="text-green-600"
              />
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
            <Panel>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp size={19} className="text-[var(--primary)]" />
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      Lead Intake Trend
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    New leads received in the selected window
                  </p>
                </div>

                <div className="flex rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-1">
                  {[7, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setChartDays(days as 7 | 30)}
                      className={`h-8 rounded-md px-3 text-xs font-semibold transition ${
                        chartDays === days
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <ActivityChart data={leadChartData} />
            </Panel>

            <Panel>
              {hasLeads ? (
                <>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Lead Health
                  </h2>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Current processing and verification progress
                  </p>

                  <div className="mt-7 space-y-7">
                    <ProgressMetric
                      label="Completion Rate"
                      value={completionRate}
                      count={`${leadStats.completed} of ${leadStats.total}`}
                      color="bg-green-500"
                    />
                    <ProgressMetric
                      label="Verification Rate"
                      value={verificationRate}
                      count={`${leadStats.verified} of ${leadStats.total}`}
                      color="bg-violet-500"
                    />
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Pipeline Snapshot
                      </p>
                      <Link
                        href="/admin/lead"
                        className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                      >
                        Manage <ArrowRight size={13} />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {leadPipeline.map((stage) => (
                        <PipelineRow
                          key={stage.label}
                          label={stage.label}
                          value={stage.value}
                          total={leadStats.total}
                          color={stage.color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Module Mix
                  </h2>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Enabled menu sections currently feeding the dashboard
                  </p>
                  <div className="mt-5 space-y-3">
                    {enabledModules.slice(0, 6).map((module) => (
                      <div
                        key={module.key}
                        className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3"
                      >
                        <span className="text-sm font-medium">
                          {module.label}
                        </span>
                        <span className="text-sm font-bold">
                          {dashboard[module.key].length}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {attentionItems.length > 0 && (
                <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                    Quick Focus
                  </p>
                  <div className="mt-3 space-y-3">
                    {attentionItems
                      .slice(0, 4)
                      .map(({ module, value, label }) => (
                        <Link
                          key={module.key}
                          href={module.href}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-[var(--text-secondary)]">
                            {label}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[var(--primary)]">
                            {value} <ArrowRight size={14} />
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {hasLeads && (
            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.55fr)]">
              <Panel>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      Lead Priorities
                    </h2>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Work that needs admin attention first
                    </p>
                  </div>
                  <ShieldCheck size={18} className="text-[var(--primary)]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PriorityTile
                    label="Open"
                    value={leadStats.open}
                    tone="text-blue-600"
                  />
                  <PriorityTile
                    label="Unassigned"
                    value={leadStats.unassigned}
                    tone="text-red-600"
                  />
                  <PriorityTile
                    label="Verified"
                    value={leadStats.verified}
                    tone="text-violet-600"
                  />
                  <PriorityTile
                    label="Not Interested"
                    value={leadStats.notInterested}
                    tone="text-slate-600"
                  />
                </div>
              </Panel>

              <Panel>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      Latest Leads
                    </h2>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Fresh inquiries for quick review and assignment
                    </p>
                  </div>
                  <Link
                    href="/admin/lead"
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                  >
                    View all <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {latestLeads.length ? (
                    latestLeads.map((lead) => (
                      <LatestLeadRow
                        key={
                          lead._id ||
                          lead.id ||
                          lead.email ||
                          lead.phone ||
                          getItemDate(lead)
                        }
                        lead={lead}
                      />
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed border-[var(--border)] p-5 text-center text-sm text-[var(--text-secondary)]">
                      No leads have arrived yet.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          )}

          <div className="mb-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-semibold text-[var(--text-primary)]">
                  Module Overview
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {totalRecords} records across enabled CRM sections
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6 md:gap-4">
              {enabledModules.map((module) => (
                <StatCard
                  key={module.key}
                  title={module.label}
                  value={dashboard[module.key].length}
                  subtitle={module.subtitle(dashboard[module.key])}
                  icon={module.icon}
                  color={module.color}
                  href={module.href}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-10 text-center">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        No modules enabled
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        Enable modules from settings to show their dashboard data here.
      </p>
      <Link
        href="/admin/settings"
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
      >
        Open Settings <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
      {children}
    </div>
  );
}

function PipelineRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const width = total ? Math.max(6, Math.round((value / total) * 100)) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="font-bold text-[var(--text-primary)]">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function PriorityTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

function LatestLeadRow({ lead }: { lead: DashboardItem }) {
  return (
    <Link
      href="/admin/lead"
      className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 transition hover:border-[var(--primary)]"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {lead.name || lead.companyName || "Unnamed Lead"}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">
          {lead.email || lead.phone || "No contact detail"} ·{" "}
          {formatCompactDate(getItemDate(lead))}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-[var(--card)] px-3 py-1 text-xs font-semibold capitalize text-[var(--primary)]">
        {lead.leadStatus || "new"}
      </span>
    </Link>
  );
}

function formatCompactDate(value?: string) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function ActivityChart({
  data,
}: {
  data: Array<{ key: string; label: string; value: number }>;
}) {
  const width = 760;
  const height = 260;
  const left = 38;
  const right = 18;
  const top = 20;
  const bottom = 42;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const yMax = Math.max(Math.ceil(maxValue / 5) * 5, 5);
  const stepX = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
  const points = data.map((item, index) => ({
    ...item,
    x: left + index * stepX,
    y: top + chartHeight - (item.value / yMax) * chartHeight,
  }));
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${left},${top + chartHeight} ${linePoints} ${
    left + chartWidth
  },${top + chartHeight}`;
  const labelInterval = data.length <= 7 ? 1 : 5;

  return (
    <div>
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto min-h-[220px] w-full"
          role="img"
          aria-label="Lead intake trend chart"
        >
          <defs>
            <linearGradient id="leadArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop
                offset="100%"
                stopColor="var(--primary)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((line) => {
            const y = top + (chartHeight / 4) * line;
            const value = Math.round(yMax - (yMax / 4) * line);

            return (
              <g key={line}>
                <line
                  x1={left}
                  x2={left + chartWidth}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 5"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--text-secondary)"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <polygon points={areaPoints} fill="url(#leadArea)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={point.key}>
              <circle
                cx={point.x}
                cy={point.y}
                r={data.length <= 7 ? 4 : 2.5}
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2.5"
              >
                <title>
                  {point.label}: {point.value} leads
                </title>
              </circle>
              {(index % labelInterval === 0 || index === points.length - 1) && (
                <text
                  x={point.x}
                  y={height - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-secondary)"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--text-secondary)]">
        <span>
          {data.reduce((sum, item) => sum + item.value, 0)} total leads
        </span>
        <span>
          Peak: {Math.max(...data.map((item) => item.value), 0)} leads/day
        </span>
      </div>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
  count,
  color,
}: {
  label: string;
  value: number;
  count: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{count}</p>
        </div>
        <span className="text-lg font-bold text-[var(--text-primary)]">
          {value}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--background-secondary)]">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  accent = "text-[var(--primary)]",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-secondary)] ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  href,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  color: ModuleColor;
  href: string;
}) {
  const styles = cardStyles[color];

  return (
    <Link
      href={href}
      className={`group rounded-lg border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${styles.card}`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.icon}`}
        >
          {icon}
        </div>
        <ArrowRight
          size={15}
          className="text-[var(--text-secondary)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold ${styles.value}`}>{value}</p>
      <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
        {subtitle}
      </p>
    </Link>
  );
}

const cardStyles: Record<
  ModuleColor,
  { card: string; icon: string; value: string }
> = {
  blue: {
    card: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    icon: "bg-blue-500/10 text-blue-600",
    value: "text-blue-600",
  },
  violet: {
    card: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
    icon: "bg-violet-500/10 text-violet-600",
    value: "text-violet-600",
  },
  green: {
    card: "from-green-500/10 to-green-600/5 border-green-500/20",
    icon: "bg-green-500/10 text-green-600",
    value: "text-green-600",
  },
  orange: {
    card: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    icon: "bg-orange-500/10 text-orange-600",
    value: "text-orange-600",
  },
  red: {
    card: "from-red-500/10 to-red-600/5 border-red-500/20",
    icon: "bg-red-500/10 text-red-600",
    value: "text-red-600",
  },
  cyan: {
    card: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
    icon: "bg-cyan-500/10 text-cyan-600",
    value: "text-cyan-600",
  },
  slate: {
    card: "from-slate-500/10 to-slate-600/5 border-slate-500/20",
    icon: "bg-slate-500/10 text-slate-600",
    value: "text-slate-600",
  },
  pink: {
    card: "from-pink-500/10 to-pink-600/5 border-pink-500/20",
    icon: "bg-pink-500/10 text-pink-600",
    value: "text-pink-600",
  },
  amber: {
    card: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
    icon: "bg-amber-500/10 text-amber-600",
    value: "text-amber-600",
  },
  emerald: {
    card: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    icon: "bg-emerald-500/10 text-emerald-600",
    value: "text-emerald-600",
  },
  indigo: {
    card: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
    icon: "bg-indigo-500/10 text-indigo-600",
    value: "text-indigo-600",
  },
};
