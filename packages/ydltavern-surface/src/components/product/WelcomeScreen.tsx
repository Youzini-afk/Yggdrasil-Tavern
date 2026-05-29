import React from 'react';

export interface WelcomeRecentChat {
  id: string;
  title?: string;
  charName?: string;
  charAvatarUrl?: string;
  chatName?: string;
  updatedAt?: string;
  dateShort?: string;
  lastMessage?: string;
  messageCount?: number;
  fileSize?: string;
  pinned?: boolean;
}

export interface WelcomeScreenProps {
  /**
   * Version string displayed in the welcome header.
   * Defaults to the package version if available.
   */
  version?: string;
  /** Callback when the API Connections button is clicked. */
  onOpenApiConnections?: () => void;
  /** Callback when the Character Management button is clicked. */
  onOpenCharacters?: () => void;
  /** Callback when the Extensions button is clicked. */
  onOpenExtensions?: () => void;
  /**
   * List of recent chats to display.
   * When empty the "no recent chats" hint is shown.
   */
  recentChats?: readonly WelcomeRecentChat[];
  onTemporaryChat?: () => void;
  onOpenChat?: (id: string) => void;
  onPinChat?: (id: string) => void;
  onRenameChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void;
}

/**
 * WelcomeScreen — SillyTavern-style welcome / empty-state panel.
 *
 * Renders inside #chat when there are no messages.
 * Mirrors the DOM structure of ST's welcomePanel + welcome.html / how-to-start:
 *
 *   .welcomePanel
 *     .welcomeHeaderTitle
 *       .welcomeHeaderLogo (.welcomeHeaderLogoText)
 *       .welcomeHeaderVersionDisplay
 *     .welcomeHeader
 *       .recentChatsTitle ("Welcome")
 *       .welcomeShortcuts (Docs / GitHub / Discord / Temporary Chat)
 *     .welcomeRecent
 *       .recentChatsTitle ("Recent Chats")
 *       .recentChatList (.recentChatList-empty / .welcomeEmptyHint)
 *   .mes.mes_welcome_guide[data-is-system="true"]
 *     .mesAvatarWrapper > .avatar > .avatar-placeholder
 *     .mes_block
 *       .ch_name > .name_text ("Welcome")
 *       .mes_text
 *         h3 ("How to start chatting?")
 *         ol > li > button.drawer-opener[data-target=...]
 */
export function WelcomeScreen({
  version = '0.0.1-alpha',
  onOpenApiConnections,
  onOpenCharacters,
  onOpenExtensions,
  onTemporaryChat,
  onOpenChat,
  onPinChat,
  onRenameChat,
  onDeleteChat,
  recentChats = [],
}: WelcomeScreenProps): JSX.Element {
  const hasRecent = recentChats.length > 0;

  return (
    <>
      <div className="welcomePanel">
        {/* ── welcomeHeaderTitle ── */}
        <div className="welcomeHeaderTitle">
          <div className="welcomeHeaderLogo" aria-label="YdlTavern">
            <span className="welcomeHeaderLogoText">YdlTavern</span>
          </div>
          <span className="welcomeHeaderVersionDisplay">{version}</span>
          <div className="mes_button showRecentChats" title="Show recent chats" aria-hidden="true">
            <i className="fa-solid fa-circle-chevron-down fa-fw fa-lg" aria-hidden="true" />
          </div>
          <div className="mes_button recentChatsSettings" title="Recent chats settings" aria-hidden="true">
            <i className="fa-solid fa-gear fa-fw fa-lg" aria-hidden="true" />
          </div>
          <div className="mes_button hideRecentChats" title="Hide recent chats" aria-hidden="true">
            <i className="fa-solid fa-circle-xmark fa-fw fa-lg" aria-hidden="true" />
          </div>
        </div>

        {/* ── welcomeHeader ── */}
        <div className="welcomeHeader">
          <div className="recentChatsTitle">Recent Chats</div>
          <div className="welcomeShortcuts">
            <a
              className="welcomeShortcut"
              href="https://docs.sillytavern.app/"
              target="_blank"
              rel="noreferrer"
              title="SillyTavern Documentation"
            >
              <i className="fa-solid fa-question-circle" aria-hidden="true" />
              Docs
            </a>
            <a
              className="welcomeShortcut"
              href="https://github.com/Youzini-afk/Yggdrasil-Tavern"
              target="_blank"
              rel="noreferrer"
              title="YdlTavern on GitHub"
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
              GitHub
            </a>
            <a
              className="welcomeShortcut"
              href="https://discord.gg/sillytavern"
              target="_blank"
              rel="noreferrer"
              title="SillyTavern Discord"
            >
              <i className="fa-brands fa-discord" aria-hidden="true" />
              Discord
            </a>
            <span className="welcomeShortcutsSeparator" aria-hidden="true">|</span>
            <button
              type="button"
              className="openTemporaryChat menu_button menu_button_icon"
              onClick={() => (onTemporaryChat ?? onOpenCharacters)?.()}
              title="Start a temporary chat"
            >
              <i className="fa-solid fa-comment-dots" aria-hidden="true" />
              Temporary Chat
            </button>
          </div>
        </div>

        {/* ── welcomeRecent ── */}
        <div className="welcomeRecent">
          <div className={`recentChatList${hasRecent ? '' : ' recentChatList-empty'}`}>
            {hasRecent ? recentChats.map((chat) => (
              <div
                key={chat.id}
                className="recentChat"
                data-file={chat.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenChat?.(chat.id)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  onOpenChat?.(chat.id);
                }}
              >
                <div className="avatar">
                  {chat.charAvatarUrl ? (
                    <img src={chat.charAvatarUrl} alt={chat.charName ?? chat.title ?? chat.id} />
                  ) : (
                    <span className="avatar-placeholder">
                      <i className="fa-solid fa-user" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="recentChatInfo">
                  <div className="chatNameContainer">
                    <div className="chatName">
                      <strong className="characterName">{chat.charName ?? 'Assistant'}</strong>
                      <span> &ndash; </span>
                      <span>{chat.chatName ?? chat.title ?? 'Temporary Chat'}</span>
                    </div>
                    <small className="chatDate">{chat.dateShort ?? chat.updatedAt ?? ''}</small>
                    <div className="chatActions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="menu_button menu_button_icon pinChat" onClick={() => onPinChat?.(chat.id)} title="Pin chat">
                        <i className="fa-solid fa-thumbtack fa-fw" aria-hidden="true" />
                      </button>
                      <button type="button" className="menu_button menu_button_icon renameChat" onClick={() => onRenameChat?.(chat.id)} title="Rename chat">
                        <i className="fa-solid fa-pen-to-square fa-fw" aria-hidden="true" />
                      </button>
                      <button type="button" className="menu_button menu_button_icon deleteChat" onClick={() => onDeleteChat?.(chat.id)} title="Delete chat">
                        <i className="fa-solid fa-trash fa-fw" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="chatMessageContainer">
                    <div className="chatMessage">{chat.lastMessage ?? 'No messages yet.'}</div>
                    <div className="chatStats">
                      <i className="fa-solid fa-comment fa-xs" aria-hidden="true" />
                      <small>{chat.messageCount ?? 0}</small>
                      {chat.fileSize !== undefined && <small className="fileSize">{chat.fileSize}</small>}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="welcomeEmptyHint">
                No recent chats yet. Pick a character to start, or import one.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── system-style welcome guide message ── */}
      <div className="mes mes_welcome_guide is-system" data-is-system="true">
        <div className="mesAvatarWrapper">
          <div className="avatar">
            <span className="avatar-placeholder">
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="mes_block">
          <div className="ch_name">
            <span className="name_text">Welcome</span>
          </div>
          <div className="mes_text">
            <h3>How to start chatting?</h3>
            <ol>
              <li>
                Click{' '}
                <button
                  type="button"
                  className="menu_button menu_button_icon drawer-opener inline-flex"
                  data-target="api-connections"
                  onClick={() => onOpenApiConnections?.()}
                >
                  <i className="fa-solid fa-plug" aria-hidden="true" />
                  {' '}API Connections
                </button>
                {' '}and connect to a model provider.
              </li>
              <li>
                Click{' '}
                <button
                  type="button"
                  className="menu_button menu_button_icon drawer-opener inline-flex"
                  data-target="characters"
                  onClick={() => onOpenCharacters?.()}
                >
                  <i className="fa-solid fa-address-card" aria-hidden="true" />
                  {' '}Character Management
                </button>
                {' '}and pick or import a character.
              </li>
              <li>
                (Optional) Click{' '}
                <button
                  type="button"
                  className="menu_button menu_button_icon drawer-opener inline-flex"
                  data-target="extensions"
                  onClick={() => onOpenExtensions?.()}
                >
                  <i className="fa-solid fa-cubes" aria-hidden="true" />
                  {' '}Extensions
                </button>
                {' '}to enable World Info, Quick Replies, and other tools.
              </li>
            </ol>
            <p className="welcomeCompatNote">
              Compatible with SillyTavern resources
            </p>
            <ul className="welcomeCompatList">
              <li>Character cards (V1/V2/V3 PNG and JSON)</li>
              <li>World Info / Lorebooks</li>
              <li>Presets and instruct templates</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
