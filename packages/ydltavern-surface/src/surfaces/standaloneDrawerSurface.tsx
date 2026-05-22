import { useEffect, type ComponentType } from 'react';
import { TavernProvider } from '../app/TavernProvider.js';
import { useTavern } from '../app/TavernProvider.js';
import { ThemedRoot } from '../components/product/themes/ThemedRoot.js';
import { useDrawers, type DrawerId, type DrawerState } from '../components/shell/useDrawers.js';

export interface StandaloneDrawerSurfaceProps {
  readonly className?: string;
}

export interface CreateStandaloneDrawerSurfaceOptions {
  readonly drawerId: DrawerId;
  readonly surfaceClassName: string;
  readonly Drawer: ComponentType<{ drawers: DrawerState }>;
}

/**
 * Creates a standalone surface that renders a drawer body in an always-open
 * harness, without the TavernShell rails/sheld around it.
 */
export function createStandaloneDrawerSurface({
  drawerId,
  surfaceClassName,
  Drawer,
}: CreateStandaloneDrawerSurfaceOptions): (props: StandaloneDrawerSurfaceProps) => JSX.Element {
  return function StandaloneDrawerSurface({ className }: StandaloneDrawerSurfaceProps): JSX.Element {
    return (
      <div className={composeClass(['ydltavern-surface', 'tavern-surface', surfaceClassName], className)}>
        <TavernProvider>
          <StandaloneDrawerRoot drawerId={drawerId} Drawer={Drawer} />
        </TavernProvider>
      </div>
    );
  };
}

function StandaloneDrawerRoot({
  drawerId,
  Drawer,
}: {
  readonly drawerId: DrawerId;
  readonly Drawer: ComponentType<{ drawers: DrawerState }>;
}): JSX.Element {
  const tavern = useTavern();
  const drawers = useDrawers();

  // Force this surface's drawer to be open since it IS the surface.
  useEffect(() => {
    drawers.open(drawerId);
  }, [drawerId, drawers]);

  return (
    <ThemedRoot theme={tavern.theme}>
      <div className="tavern-standalone-surface" data-drawer-open={drawers.openId ?? 'none'}>
        <Drawer drawers={drawers} />
      </div>
    </ThemedRoot>
  );
}

function composeClass(base: readonly string[], extra: string | undefined): string {
  return extra ? [...base, extra].join(' ') : base.join(' ');
}
