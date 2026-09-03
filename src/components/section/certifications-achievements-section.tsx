import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { BadgeCheck, Trophy } from "lucide-react";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function CertificationsAchievementsSection() {
  return (
    <div className="flex min-h-0 flex-col gap-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h2 className="text-xl font-bold">Certifications &amp; Achievements</h2>
      </BlurFade>

      {/* Certifications */}
      <div className="flex flex-col gap-4">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Certifications
          </p>
        </BlurFade>
        {DATA.certifications.map((cert, i) => (
          <BlurFade key={cert.title} delay={BLUR_FADE_DELAY * 3 + i * 0.05}>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              {cert.logoUrl ? (
                <img
                  src={cert.logoUrl}
                  alt={cert.issuer}
                  className="size-12 rounded-xl border border-border object-cover shrink-0"
                />
              ) : (
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                  <BadgeCheck className="size-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug">{cert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                {cert.credentialId && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    ID: {cert.credentialId}
                  </p>
                )}
                {cert.credentialUrl && (
                  <Link
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-primary hover:underline underline-offset-4"
                  >
                    View certificate
                  </Link>
                )}
              </div>
              <span className="text-xs tabular-nums text-muted-foreground shrink-0 mt-0.5">
                {cert.date}
              </span>
            </div>
          </BlurFade>
        ))}
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-4">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Achievements
          </p>
        </BlurFade>
        {DATA.achievements.map((item, i) => (
          <BlurFade key={item.title} delay={BLUR_FADE_DELAY * 6 + i * 0.05}>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="mt-0.5 rounded-lg bg-amber-500/10 p-2 text-amber-500 shrink-0">
                <Trophy className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm leading-snug">{item.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.issuer}</p>
                <p className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground shrink-0 mt-0.5">
                {item.date}
              </span>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
