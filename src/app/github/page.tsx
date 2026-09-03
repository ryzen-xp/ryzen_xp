import { Suspense } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EngineeringJourney } from "@/components/github/engineering-journey";
import { RepositoryShowcase } from "@/components/github/repository-showcase";
import { LiveFeed } from "@/components/github/live-feed";
import { CodingDNA } from "@/components/github/coding-dna";
import { ProjectSpotlight } from "@/components/github/project-spotlight";
import { Philosophy } from "@/components/github/philosophy";
import { OpenSourceStats } from "@/components/github/open-source-stats";
import { GithubCommandPalette } from "@/components/github/command-palette";

const BLUR_FADE_DELAY = 0.04;
const GITHUB_USERNAME = "ryzen-xp";

async function getGithubData() {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    
    if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const options = {
        headers,
        next: { revalidate: 3600 } // 1 hour cache
    };

    try {
        const [userRes, reposRes1, reposRes2, eventsRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, options),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&page=1`, options),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&page=2`, options),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=20`, options)
        ]);

        const user = userRes.ok ? await userRes.json() : null;
        const repos1 = reposRes1.ok ? await reposRes1.json() : [];
        const repos2 = reposRes2.ok ? await reposRes2.json() : [];
        const repos = [...(Array.isArray(repos1) ? repos1 : []), ...(Array.isArray(repos2) ? repos2 : [])];
        const events = eventsRes.ok ? await eventsRes.json() : [];

        return { user, repos, events };
    } catch (e) {
        console.error("Failed to fetch Github data:", e);
        return { user: null, repos: [], events: [] };
    }
}

export default async function GithubShowcasePage() {
    const { user, repos, events } = await getGithubData();

    return (
        <main className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
            <GithubCommandPalette repos={repos} />
            
            <div className="w-[95%] max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-24 relative z-10">
                
                {/* Header & Navigation */}
                <div className="flex flex-col gap-6 pt-10">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    
                    <BlurFade delay={BLUR_FADE_DELAY}>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Engineering DNA.</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                A curated exploration of my open-source contributions, technical experiments, and continuous learning journey. Press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded-md border border-border text-sm">⌘K</kbd> to explore.
                            </p>
                        </div>
                    </BlurFade>
                </div>

                <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                    <ProjectSpotlight repos={repos} />
                </Suspense>

                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
                    <Philosophy />
                </Suspense>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 flex flex-col gap-24">
                        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                            <RepositoryShowcase repos={repos} />
                        </Suspense>
                        
                        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                            <CodingDNA repos={repos} />
                        </Suspense>
                    </div>

                    <div className="flex flex-col gap-12">
                        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
                            <OpenSourceStats user={user} repos={repos} events={events} />
                        </Suspense>
                        
                        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                            <LiveFeed events={events} />
                        </Suspense>
                    </div>
                </div>

                <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                    <EngineeringJourney />
                </Suspense>

            </div>
        </main>
    );
}
