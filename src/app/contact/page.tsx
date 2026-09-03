import { Suspense } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ContactInfo } from "@/components/contact/contact-info";
import { PremiumComposer } from "@/components/contact/premium-composer";
import { QuickContactCards } from "@/components/contact/quick-contact-cards";
import { FAQAccordion } from "@/components/contact/faq-accordion";

const BLUR_FADE_DELAY = 0.04;

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
            {/* Subtle background animation/gradient */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} 
            />
            
            <div className="w-[95%] max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-16 relative z-10">
                
                {/* Header & Navigation */}
                <div className="flex flex-col gap-6 pt-10">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    
                    <BlurFade delay={BLUR_FADE_DELAY}>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Let&apos;s Build Something <span className="text-primary">Great</span> Together.
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl text-balance">
                                Whether it&apos;s a startup idea, internship opportunity, freelance project, collaboration, or just a conversation—I&apos;d love to hear from you.
                            </p>
                        </div>
                    </BlurFade>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left Column: Contact Info */}
                    <div className="flex flex-col gap-8 lg:sticky lg:top-24">
                        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                            <ContactInfo />
                        </Suspense>
                    </div>

                    {/* Right Column: Premium Composer */}
                    <BlurFade delay={BLUR_FADE_DELAY * 2} className="w-full">
                        <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted rounded-xl" />}>
                            <PremiumComposer />
                        </Suspense>
                    </BlurFade>
                </div>

                {/* Quick Contact Cards */}
                <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-xl" />}>
                    <QuickContactCards />
                </Suspense>

                {/* FAQ */}
                <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-xl" />}>
                    <FAQAccordion />
                </Suspense>

            </div>
        </main>
    );
}
