import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const navLinks = ["Product", "Solutions", "Research", "Docs"];

const stats = [
  {
    label: "Voice triages / day",
    value: "18K+",
    detail: "Realtime, bilingual conversations flowing through SehatSathi nodes.",
  },
  {
    label: "Hospitals auto-alerted",
    value: "342",
    detail: "District hospitals, PHCs and private partners on one switchboard.",
  },
  {
    label: "Avg. routing speed",
    value: "47s",
    detail: "From first hello to a ready ER team with context in hand.",
  },
  {
    label: "Languages live",
    value: "07",
    detail: "Hindi + Hinglish foundation with fast training for regional dialects.",
  },
];

const featurePillars = [
  {
    title: "Careflight OS",
    subtitle: "Signal-first infrastructure",
    body: "Tracks every symptom cue, latency spike, and hospital bed update in one orchestration layer.",
    detail: "Autoscales on-call GPUs & PSTN bridges like ElevenLabs voice pipelines.",
  },
  {
    title: "Empathy Engine",
    subtitle: "Intent + emotion detection",
    body: "Mirror ElevenLabs-style intonation to calm families while escalating red flags instantly.",
    detail: "Voice presets tuned with ASHA workers, built on multilingual embeddings.",
  },
  {
    title: "Hospital Glass",
    subtitle: "Ambient handoffs",
    body: "Glassmorphic briefing cards flow into ER tablets with recordings, vitals, and ETA.",
    detail: "One-tap accept; ack loops sync back to caregivers over IVR or WhatsApp.",
  },
];

const labsFocus = [
  {
    tag: "Voice Lab",
    title: "Multi-modal reassurance",
    bullets: [
      "Dual speaker diarisation keeps caregiver + patient intents separate.",
      "Dynamic warmth slider emulates ElevenLabs neural performances.",
      "Low-bandwidth codecs preserve clarity on copper lines.",
    ],
  },
  {
    tag: "Ops Lab",
    title: "Routing intelligence",
    bullets: [
      "Predictive queues find the fastest, safest bed within 90 seconds.",
      "Escalation playbooks auto-translate for district medical officers.",
      "Continuous telemetry shows where to reinforce ambulances or staff.",
    ],
  },
];

const workflow = [
  {
    step: "01",
    title: "Village call spins up",
    copy: "Toll-free IVR authenticates caller voiceprint, starts warm tone preset.",
  },
  {
    step: "02",
    title: "AI triage composes brief",
    copy: "Symptoms, vitals, and sentiment captured as structured data + emotive clip.",
  },
  {
    step: "03",
    title: "Hospitals sync in glass UI",
    copy: "Nearest capable facility accepts, triggers transport + caretaker nudges.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-10 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[160px]" />
        <div className="absolute bottom-[-120px] left-[-40px] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_45%)]" />
      </div>

      <header className="relative z-10 border-b border-border bg-background/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm uppercase tracking-[0.24em] text-muted-foreground lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src="/WhatsApp Image 2025-12-02 at 15.45.06_3edbaee9.jpg"
              alt="SehatSathi logo"
              className="h-9 w-auto rounded-full border border-border bg-card object-contain"
            />
            <span className="text-xs font-semibold tracking-[0.32em] text-foreground">
              SehatSathi
            </span>
          </div>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[0.65rem] font-semibold tracking-[0.3em] text-primary-foreground shadow-[0_0_25px_rgba(34,197,94,0.45)] transition hover:bg-primary/90"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[0.7rem]">
              📞
            </span>
            Launch call
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 text-foreground/90 lg:px-10 lg:pt-24">
        {/* Hero */}
        <section className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8">
            <Badge className="w-fit border-white/20 bg-white/5 px-3 py-1 text-[0.58rem] uppercase tracking-[0.32em] text-white/70">
              Inspired by ElevenLabs · Built for Bharat
            </Badge>
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Voice-forward{" "}
                <span className="text-transparent bg-gradient-to-r from-white via-[#d6da8a] to-[#8a8b3c] bg-clip-text">
                  health OS
                </span>{" "}
                for every village.
              </h1>
              <p className="max-w-2xl text-base text-white/70 sm:text-lg">
                We reimagined ElevenLabs’ expressive voice aesthetic for life-saving triage. SehatSathi blends cinematic clarity, ambient gradients, and free-flowing whitespace so caregivers feel guided—not overwhelmed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <a
                href="/demo"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/90 px-7 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-black transition hover:-translate-y-0.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/90 text-white shadow-inner shadow-black/40">
                  ▶
                </span>
                Watch the triage
              </a>
              <div className="flex flex-col text-[0.75rem] uppercase tracking-[0.3em] text-white/60">
                Toll-free · 1800-SEHAT-SATHI
                <span className="text-white">24×7 · Hindi + English</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[0.7rem] uppercase tracking-[0.4em] text-white/30">
              {["NHA", "PHC", "ASHA", "NGO"].map((logo) => (
                <span key={logo} className="text-white/60">
                  {logo}
                </span>
              ))}
            </div>
          </div>

          <Card className="relative border-white/10 bg-white/5 p-0 shadow-[0_12px_80px_rgba(2,0,20,0.65)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
            <CardHeader className="relative border-b border-white/10 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm text-white">Live triage stream</CardTitle>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Hindi + English · Emotion aware
                  </p>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[0.65rem] text-primary">
                  <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                  Live
                </span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6 px-6 py-6 text-sm">
              <div className="space-y-1">
                <p className="text-[0.68rem] uppercase tracking-[0.4em] text-white/60">
                  Conversation log
                </p>
                <div className="space-y-3 text-white/80 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                  <p>Caller: “Maa ko saans lene mein dikkat hai aur bukhaar hai.”</p>
                  <p>SehatSathi: “Hum saath hain. Abhi aap pulse aur bukhaar batayein.”</p>
                  <p>System: “Severity score ↑. Notifying JNV Hospital · 9.4 km.”</p>
                  <p>Caller: “Ambulance kitni der mein pahunch sakti hai?”</p>
                  <p>SehatSathi: “Approx 12 minute. Tab tak maa ko sidhe bithakar, dheere-dheere saans lene mein madad karein.”</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50">
                  Signal
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-8 items-end gap-1">
                    {[8, 24, 16, 30, 18].map((height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}px`, animationDelay: `${index * 120}ms` }}
                        className="inline-flex w-1.5 animate-[pulse_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-t from-primary to-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-primary">Latency 162ms</p>
                    <p className="text-xs text-white/60">Edge node: Lucknow · QoS stable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">Live Telemetry</p>
              <h2 className="text-3xl font-semibold text-white">Where the grid breathes.</h2>
            </div>
            <p className="max-w-xl text-sm text-white/60">
              Designed after the airy pacing of ElevenLabs.com—cards float with generous whitespace so decision makers never feel cramped.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card
                key={item.label}
                className="border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-0 shadow-[0_25px_80px_rgba(3,0,20,0.35)]"
              >
                <CardContent className="space-y-3 px-6 py-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="text-sm text-white/60">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {labsFocus.map((module) => (
            <Card
              key={module.tag}
              className="border-white/10 bg-gradient-to-br from-[#160930]/70 via-[#0b031c]/50 to-[#080214]/60 shadow-[0_15px_60px_rgba(3,0,20,0.45)] backdrop-blur-2xl"
            >
              <CardHeader className="space-y-3">
                <Badge className="w-fit border border-white/15 bg-white/5 text-[0.6rem] uppercase tracking-[0.32em] text-white/60">
                  {module.tag}
                </Badge>
                <CardTitle className="text-2xl text-white">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/70">
                {module.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                    <p>{bullet}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Workflow */}
        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.42em] text-white/45">Workflow</p>
            <h2 className="text-3xl font-semibold text-white">From copper wire to cloud glass.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflow.map((node) => (
              <Card key={node.step} className="border-white/10 bg-white/5">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/80">
                    {node.step}
                  </div>
                  <CardTitle className="text-xl text-white">{node.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-white/60">{node.copy}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="relative overflow-hidden border-white/10 bg-gradient-to-r from-white/10 via-transparent to-primary/10 shadow-[0_25px_100px_rgba(10,16,8,0.65)]">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/25 to-transparent" />
            <CardContent className="relative flex flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Deploy</p>
                <h3 className="text-3xl font-semibold text-white">
                  Spin up a pilot corridor in under a week.
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-white/60">
                  We package ElevenLabs-inspired brand polish with telephony, GPU inference, and hospital onboarding so your team can focus on trust.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:team@sehatsathi.in"
                  className="rounded-full border border-white/20 px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
                >
                  Talk to founders
                </a>
                <a
                  href="/demo"
                  className="rounded-full bg-primary px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] text-primary-foreground shadow-[0_0_30px_rgba(138,139,60,0.6)] transition hover:-translate-y-0.5"
                >
                  See live demo
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}