import { AppearancePane } from "@/components/settings/appearance-pane";
import { AccentPane } from "@/components/settings/accent-pane";
import { BackgroundPane } from "@/components/settings/background-pane";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import { ChevronLeft, Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-transparent text-foreground pb-24 relative overflow-hidden">
            <div className="w-[95%] max-w-4xl mx-auto p-6 md:p-10 flex flex-col gap-12 relative z-10 pt-10">
                
                {/* Header & Navigation */}
                <div className="flex flex-col gap-8 border-b border-border pb-8">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    
                    <BlurFade delay={0.04}>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
                                <Settings className="w-8 h-8 text-primary-foreground" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                                <p className="text-muted-foreground text-lg">
                                    Customize your portfolio experience.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-16">
                    <AppearancePane />
                    <AccentPane />
                    <BackgroundPane />
                </div>
                
            </div>
        </main>
    );
}
