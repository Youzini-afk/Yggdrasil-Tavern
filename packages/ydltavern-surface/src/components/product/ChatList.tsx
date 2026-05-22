import { Virtuoso } from 'react-virtuoso';
import { TurnView } from '../TurnView.js';
import { useTavern } from '../../app/TavernProvider.js';

/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function ChatList(): JSX.Element {
  const { liveChat } = useTavern();
  return (
    <Virtuoso
      className="tavern-chat-list"
      data={liveChat.turns}
      itemContent={(_index, turn) => <TurnView key={turn.id} turn={turn} />}
      followOutput="auto"
      overscan={{ main: 200, reverse: 200 }}
    />
  );
}
