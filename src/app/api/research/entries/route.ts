import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENTRIES_DIR = path.join(process.cwd(), "research", "entries");

function ensureDirectory() {
  if (!fs.existsSync(ENTRIES_DIR)) {
    fs.mkdirSync(ENTRIES_DIR, { recursive: true });
  }
}

function parseFrontmatter(rawContent: string) {
  const match = rawContent.match(/^---[\s\S]*?---/);
  if (!match) {
    return { metadata: {}, body: rawContent };
  }

  const frontmatterBlock = match[0];
  const body = rawContent.replace(frontmatterBlock, "").trim();
  const yamlLines = frontmatterBlock.replace(/^---/, "").replace(/---$/, "").trim().split("\n");

  const metadata: Record<string, any> = {};
  let currentKey = "";
  let inArray = false;

  yamlLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    if (trimmed.startsWith("- ") && currentKey && inArray) {
      if (!Array.isArray(metadata[currentKey])) {
        metadata[currentKey] = [];
      }
      metadata[currentKey].push(trimmed.replace(/^- /, "").replace(/["']/g, "").trim());
      return;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      currentKey = key;

      if (!value) {
        inArray = true;
        metadata[key] = [];
        return;
      }

      inArray = false;
      // Strip quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      metadata[key] = value;
    }
  });

  return { metadata, body };
}

function formatFrontmatter(metadata: Record<string, any>) {
  let yaml = "---\n";
  yaml += `title: "${metadata.title || "Untitled"}"\n`;
  yaml += `createdAt: "${metadata.createdAt || new Date().toISOString()}"\n`;
  yaml += `updatedAt: "${new Date().toISOString()}"\n`;
  yaml += `project: "${metadata.project || "failure-recovery-benchmark"}"\n`;

  const tags = Array.isArray(metadata.tags)
    ? metadata.tags
    : typeof metadata.tags === "string"
    ? metadata.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : ["research-notes"];

  yaml += `tags:\n`;
  tags.forEach((tag: string) => {
    yaml += `  - "${tag}"\n`;
  });

  yaml += `status: "${metadata.status === "draft" ? "draft" : "published"}"\n`;
  yaml += `summary: "${(metadata.summary || "").replace(/"/g, '\\"')}"\n`;
  yaml += "---\n\n";

  return yaml;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Local editor API is only available in development mode." },
      { status: 403 }
    );
  }

  ensureDirectory();

  try {
    const files = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

    const entries = files.map((filename) => {
      const filePath = path.join(ENTRIES_DIR, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");
      const { metadata, body } = parseFrontmatter(rawContent);

      const slug = filename.replace(/\.(md|mdx)$/, "");

      return {
        slug,
        filename,
        title: metadata.title || slug.replace(/-/g, " "),
        createdAt: metadata.createdAt || metadata.publishedAt || new Date().toISOString(),
        updatedAt: metadata.updatedAt || metadata.createdAt || new Date().toISOString(),
        project: metadata.project || "failure-recovery-benchmark",
        tags: Array.isArray(metadata.tags) ? metadata.tags : ["research-notes"],
        status: metadata.status || "published",
        summary: metadata.summary || "",
        content: body,
      };
    });

    // Sort entries by createdAt descending
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Local editor API is only available in development mode." },
      { status: 403 }
    );
  }

  ensureDirectory();

  try {
    const body = await req.json();
    const { slug: rawSlug, title, project, tags, status, summary, content } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = (rawSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) + ".md";
    const filePath = path.join(ENTRIES_DIR, slug.endsWith(".md") ? slug : `${slug}.md`);

    const now = new Date().toISOString();
    const frontmatter = formatFrontmatter({
      title,
      createdAt: body.createdAt || now,
      updatedAt: now,
      project: project || "failure-recovery-benchmark",
      tags: tags || ["research-notes"],
      status: status || "draft",
      summary: summary || "",
    });

    const fileContent = frontmatter + (content || "");
    fs.writeFileSync(filePath, fileContent, "utf8");

    return NextResponse.json({ success: true, slug: path.basename(filePath, ".md") });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

export async function DELETE(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Local editor API is only available in development mode." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const filename = slug.endsWith(".md") || slug.endsWith(".mdx") ? slug : `${slug}.md`;
    const filePath = path.join(ENTRIES_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
