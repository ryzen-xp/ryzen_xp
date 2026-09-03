"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft,
  Plus,
  Save,
  Trash2,
  FileEdit,
  Tag,
  FolderGit2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Check,
} from "lucide-react";

interface ResearchEntry {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  project: string;
  tags: string[];
  status: "draft" | "published";
  summary: string;
  content: string;
}

const LOCAL_STORAGE_KEY = "research_editor_unsaved_draft";

export default function LocalResearchEditorPage() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Saved");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("",);

  // Editor Form State
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("failure-recovery-benchmark");
  const [tagsInput, setTagsInput] = useState("research-notes, experiment-log");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const isInitialMount = useRef(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedSlugRef = useRef<string | null>(null);

  const updateSelectedSlug = (newSlug: string | null) => {
    selectedSlugRef.current = newSlug;
    setSelectedSlug(newSlug);
  };

  // Load entries from server API
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/research/entries");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Local editor is only available in development mode.");
          return;
        }
        throw new Error("Failed to load entries");
      }
      const data = await res.json();
      const loadedEntries: ResearchEntry[] = data.entries || [];
      setEntries(loadedEntries);

      // Check if there is an unsaved draft in localStorage
      const savedDraftRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDraftRaw && !hasRestoredDraft) {
        try {
          const draft = JSON.parse(savedDraftRaw);
          if (draft.title || draft.content) {
            setSlug(draft.slug || "");
            setTitle(draft.title || "Restored Unsaved Draft");
            setProject(draft.project || "failure-recovery-benchmark");
            setTagsInput(draft.tagsInput || "research-notes");
            setStatus(draft.status || "draft");
            setSummary(draft.summary || "");
            setContent(draft.content || "");
            updateSelectedSlug(draft.slug || null);
            setHasRestoredDraft(true);
            setMessage("Restored unsaved draft from local storage.");
            setLoading(false);
            return;
          }
        } catch {}
      }

      if (loadedEntries.length > 0 && !selectedSlugRef.current && !hasRestoredDraft) {
        loadEntryIntoForm(loadedEntries[0]);
      } else if (loadedEntries.length === 0 && !hasRestoredDraft) {
        handleNewEntry();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Save current form state to localStorage automatically on edit
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!title.trim() && !content.trim()) {
      return;
    }

    const currentDraft = {
      slug: selectedSlugRef.current || "",
      title,
      project,
      tagsInput,
      status,
      summary,
      content,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDraft));
    setAutoSaveStatus("Unsaved changes");

    // Debounced auto-save to disk after 2.5 seconds of idle typing
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (title.trim()) {
        autoSaveToDisk(currentDraft);
      }
    }, 2500);
  }, [title, project, tagsInput, status, summary, content]);

  // Handle Tab close / refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        const draft = {
          slug: selectedSlugRef.current || "",
          title,
          project,
          tagsInput,
          status,
          summary,
          content,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, project, tagsInput, status, summary, content]);

  const loadEntryIntoForm = (entry: ResearchEntry) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    updateSelectedSlug(entry.slug);
    setSlug(entry.slug);
    setTitle(entry.title);
    setProject(entry.project || "failure-recovery-benchmark");
    setTagsInput(Array.isArray(entry.tags) ? entry.tags.join(", ") : "");
    setStatus(entry.status || "draft");
    setSummary(entry.summary || "");
    setContent(entry.content || "");
  };

  const handleNewEntry = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    updateSelectedSlug(null);
    setSlug("");
    setTitle("");
    setProject("failure-recovery-benchmark");
    setTagsInput("research-notes, experiment-log");
    setStatus("draft");
    setSummary("");
    setContent("");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const computeSlug = (targetTitle: string) => {
    const currentSlug = selectedSlugRef.current;
    if (currentSlug && currentSlug.trim() !== "") {
      return currentSlug;
    }
    const today = new Date().toISOString().split("T")[0];
    const cleanTitle = (targetTitle || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slugBody = cleanTitle || `note-${Date.now().toString(36)}`;
    return `${today}-${slugBody}`;
  };

  const autoSaveToDisk = async (draftData: any) => {
    try {
      setAutoSaveStatus("Auto-saving...");
      const parsedTags = (draftData.tagsInput || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      const targetSlug = computeSlug(draftData.title);

      const payload = {
        slug: targetSlug,
        title: draftData.title || "Untitled Note",
        project: draftData.project,
        tags: parsedTags,
        status: draftData.status,
        summary: draftData.summary,
        content: draftData.content,
      };

      const res = await fetch("/api/research/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.slug) {
          updateSelectedSlug(data.slug);
          setSlug(data.slug);
        }
        setAutoSaveStatus("Auto-saved to disk");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch {
      setAutoSaveStatus("Saved to localStorage");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const targetSlug = computeSlug(title);

      const payload = {
        slug: targetSlug,
        title,
        project,
        tags: parsedTags,
        status,
        summary,
        content,
      };

      const res = await fetch("/api/research/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      const data = await res.json();
      setMessage(`Entry saved successfully to research/entries/${data.slug}.md!`);
      setAutoSaveStatus("Saved to disk");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      updateSelectedSlug(data.slug);
      setSlug(data.slug);
      await fetchEntries();
    } catch (err: any) {
      alert(`Error saving entry: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug) return;
    if (!confirm(`Are you sure you want to delete research/entries/${selectedSlug}.md?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/research/entries?slug=${selectedSlug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");

      setMessage(`Deleted entry ${selectedSlug}.md`);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSelectedSlug(null);
      await fetchEntries();
      handleNewEntry();
    } catch (err: any) {
      alert(`Error deleting entry: ${err.message}`);
    }
  };

  // Derive unique projects & tags for filter dropdowns
  const uniqueProjects = Array.from(new Set(entries.map((e) => e.project).filter(Boolean)));
  const uniqueTags = Array.from(
    new Set(entries.flatMap((e) => (Array.isArray(e.tags) ? e.tags : [])))
  );

  const filteredEntries = entries.filter((entry) => {
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    if (projectFilter !== "all" && entry.project !== projectFilter) return false;
    if (tagFilter !== "all" && (!entry.tags || !entry.tags.includes(tagFilter))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchSummary = entry.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 text-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 space-y-4">
          <AlertCircle className="size-10 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Local Development Mode Only</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
          >
            Go to Public Research Log
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <BlurFade delay={0.02}>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/research"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded-md px-2.5 py-1 bg-card"
              >
                <ChevronLeft className="size-3.5" />
                View Public Research Log
              </Link>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="size-3" />
                Local Dev Editor (Localhost Only)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded-md border bg-muted/40 font-mono">
                <Check className="size-3 text-emerald-500" />
                {autoSaveStatus}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Research Log Editor
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNewEntry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
            >
              <Plus className="size-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>{saving ? "Saving..." : "Save Entry"}</span>
            </button>
            {selectedSlug && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className="mb-6 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{message}</span>
          </div>
        )}

        {/* Main Grid: Sidebar List + Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-3 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Filter & Search</span>
                <span className="text-[10px] text-muted-foreground">{filteredEntries.length} Entries</span>
              </div>

              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border bg-background text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Drafts</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1">Project</label>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border bg-background text-xs"
                  >
                    <option value="all">All Projects</option>
                    {uniqueProjects.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Entry Cards List */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredEntries.map((entry) => {
                const isSelected = selectedSlug === entry.slug;
                return (
                  <button
                    key={entry.slug}
                    onClick={() => loadEntryIntoForm(entry)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-muted/60 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          entry.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {entry.status === "published" ? (
                          <CheckCircle2 className="size-2.5" />
                        ) : (
                          <Clock className="size-2.5" />
                        )}
                        <span className="capitalize">{entry.status}</span>
                      </span>

                      <span className="text-[10px] text-muted-foreground truncate">
                        {entry.createdAt.split("T")[0]}
                      </span>
                    </div>

                    <h4 className="font-semibold text-foreground line-clamp-1">{entry.title}</h4>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                      <span className="flex items-center gap-1">
                        <FolderGit2 className="size-3 text-muted-foreground" />
                        <span className="truncate">{entry.project}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form & Live Markdown Preview (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Metadata Fields */}
            <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Entry Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Failure Recovery Latency Benchmark"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Project Field
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="e.g. failure-recovery-benchmark"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. research-notes, experiment-log, finding"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Publish Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === "draft"}
                        onChange={() => setStatus("draft")}
                        className="accent-amber-500"
                      />
                      <span>Draft (Local Only)</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                        className="accent-emerald-500"
                      />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Published (Live on Web)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 1-2 sentence overview of this research log..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Markdown Body & Live Preview Card */}
            <div
              className={`border bg-card p-5 space-y-4 shadow-sm transition-all ${
                isMaximized
                  ? "fixed inset-0 z-[9999] w-screen h-screen bg-background border-none p-6 shadow-2xl flex flex-col overflow-hidden"
                  : "rounded-2xl"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <FileEdit className="size-4 text-primary" />
                  <span>Markdown Entry Content</span>
                  {isMaximized && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      True Fullscreen Mode
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono ml-2 hidden sm:inline">
                    ({autoSaveStatus})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[10px] text-muted-foreground">
                    Markdown & GFM Supported
                  </span>

                  {isMaximized && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Save className="size-3.5" />
                      <span>{saving ? "Saving..." : "Save Entry"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Exit Fullscreen (Minimize)" : "Maximize Fullscreen Editor"}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm"
                  >
                    {isMaximized ? (
                      <>
                        <Minimize2 className="size-3.5" />
                        <span className="hidden sm:inline">Minimize</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="size-3.5 text-primary" />
                        <span className="hidden sm:inline">Maximize</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  isMaximized ? "flex-1 min-h-0 h-full" : ""
                }`}
              >
                {/* Editor Column */}
                <div className={`space-y-1 flex flex-col ${isMaximized ? "h-full min-h-0" : ""}`}>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block shrink-0">
                    Editor (Input)
                  </span>
                  <textarea
                    rows={isMaximized ? undefined : 18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Document your research..."
                    className={`w-full text-xs font-mono p-4 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed ${
                      isMaximized ? "flex-1 h-full min-h-0 resize-none" : ""
                    }`}
                  />
                </div>

                {/* Live Preview Column */}
                <div className={`space-y-1 flex flex-col ${isMaximized ? "h-full min-h-0" : ""}`}>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block flex items-center gap-1 shrink-0">
                    <Eye className="size-3 text-muted-foreground" /> Live Preview
                  </span>
                  <div
                    className={`w-full p-4 rounded-xl border bg-background prose prose-neutral dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto ${
                      isMaximized ? "flex-1 h-full min-h-0" : "h-[375px]"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*No content entered yet...*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
