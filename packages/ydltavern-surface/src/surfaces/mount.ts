import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { TavernPlaySurface } from './TavernPlaySurface.js';
import { TavernSettingsSurface } from './TavernSettingsSurface.js';
import { TavernExtensionsSurface } from './TavernExtensionsSurface.js';
import { TavernCharactersSurface } from './TavernCharactersSurface.js';
import { TavernWorldInfoSurface } from './TavernWorldInfoSurface.js';
import { TavernPersonaSurface } from './TavernPersonaSurface.js';
import { TavernAIResponseConfigSurface } from './TavernAIResponseConfigSurface.js';
import { TavernUserSettingsSurface } from './TavernUserSettingsSurface.js';
import { TavernBackgroundsSurface } from './TavernBackgroundsSurface.js';
import { configureHostRpcBridgeFromProps, resetHostRpcBridgeConfig, setActiveSessionId } from '../host-rpc/index.js';

/**
 * Mount adapter contract: takes a root element and props, mounts a React
 * tree, returns an unmount function. Compatible with SurfaceHost iframe
 * bootstrap which calls (root, props).
 */
export type MountFn = (root: HTMLElement, props?: Record<string, unknown>) => () => void;

function makeMounter(Component: React.ComponentType<any>): MountFn {
  return (root, props = {}) => {
    const sessionId = readStringProp(props, 'sessionId') ?? readStringProp(props, 'session_id');
    const projectId = readStringProp(props, 'projectId') ?? readStringProp(props, 'project_id');
    configureHostRpcBridgeFromProps(props);
    setActiveSessionId(sessionId);
    const reactRoot: Root = createRoot(root);
    reactRoot.render(React.createElement(Component, { ...props, sessionId, projectId }));
    return () => {
      reactRoot.unmount();
      setActiveSessionId(undefined);
      resetHostRpcBridgeConfig();
    };
  };
}

function readStringProp(props: Record<string, unknown>, key: string): string | undefined {
  const value = props[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const mountTavernPlaySurface = makeMounter(TavernPlaySurface);
export const mountTavernSettingsSurface = makeMounter(TavernSettingsSurface);
export const mountTavernExtensionsSurface = makeMounter(TavernExtensionsSurface);
export const mountTavernCharactersSurface = makeMounter(TavernCharactersSurface);
export const mountTavernWorldInfoSurface = makeMounter(TavernWorldInfoSurface);
export const mountTavernPersonaSurface = makeMounter(TavernPersonaSurface);
export const mountTavernAIResponseConfigSurface = makeMounter(TavernAIResponseConfigSurface);
export const mountTavernUserSettingsSurface = makeMounter(TavernUserSettingsSurface);
export const mountTavernBackgroundsSurface = makeMounter(TavernBackgroundsSurface);
