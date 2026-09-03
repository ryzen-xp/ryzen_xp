import { DATA } from "@/data/resume";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SpotifyPage() {
    if (!DATA.spotifyPlaylistUrl) return null;

    const playlistIdMatch = DATA.spotifyPlaylistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    const playlistId = playlistIdMatch ? playlistIdMatch[1] : "";
    
    if (!playlistId) return <div className="text-center mt-20 text-destructive">Invalid Spotify URL</div>;

    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-background">
            <div className="w-[95%] max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-10">
                {/* Back Button */}
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex flex-col gap-y-8 mt-4">
                    <div className="flex flex-col gap-y-4 items-center justify-center">
                        <div className="flex items-center w-full">
                            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
                            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
                                <span className="text-background text-sm font-medium">My Music Taste</span>
                            </div>
                            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
                        </div>
                        <div className="flex flex-col gap-y-3 items-center justify-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">What I&apos;m Listening To</h2>
                            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                                Music fuels my coding sessions. Here is a taste of my playlist.
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-[800px] mx-auto rounded-2xl shadow-lg border border-border">
                        <iframe
                            style={{ borderRadius: "12px", background: "transparent" }}
                            src={embedUrl}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
