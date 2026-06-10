import wallpaper from "assets/wallpappers/home_hero_bg.png";
import { ReactNode } from "react";
import {
  AmbientAuroraLayer,
  AmbientBackground,
  AmbientCompactPageBody,
  AmbientGlowOrb,
  AmbientGridOverlay,
  AmbientNoiseOverlay,
  AmbientPageBody,
  AmbientPageRoot,
  AmbientVignette,
} from "./styles";

interface AmbientPageShellProps {
  children: ReactNode;
  compact?: boolean;
}

const AmbientPageShell = ({
  children,
  compact = false,
}: AmbientPageShellProps) => {
  const PageBody = compact ? AmbientCompactPageBody : AmbientPageBody;

  return (
    <AmbientPageRoot>
      <AmbientBackground $wallpaper={wallpaper} aria-hidden>
        <AmbientAuroraLayer />
        <AmbientGlowOrb $variant="primary" />
        <AmbientGlowOrb $variant="accent" />
        <AmbientGlowOrb $variant="depth" />
        <AmbientGlowOrb $variant="americas" />
        <AmbientGridOverlay />
        <AmbientNoiseOverlay />
        <AmbientVignette />
      </AmbientBackground>

      <PageBody>{children}</PageBody>
    </AmbientPageRoot>
  );
};

export default AmbientPageShell;
