import { GlowCard } from "@/components/ui/spotlight-card";

export function Default() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10">
      <GlowCard>
        <div className="mt-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Card 01
          </p>
          <p className="text-sm font-medium text-white/90">Spotlight hover</p>
        </div>
      </GlowCard>
      <GlowCard glowColor="purple">
        <div className="mt-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Card 02
          </p>
          <p className="text-sm font-medium text-white/90">Purple glow</p>
        </div>
      </GlowCard>
      <GlowCard glowColor="orange">
        <div className="mt-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Card 03
          </p>
          <p className="text-sm font-medium text-white/90">Orange glow</p>
        </div>
      </GlowCard>
    </div>
  );
}

