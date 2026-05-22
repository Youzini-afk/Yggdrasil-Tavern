import { TurnView } from '../TurnView.js';
import { useTavern } from '../../app/TavernProvider.js';

export function MessageList(): JSX.Element {
  const { liveChat } = useTavern();
  return <section className="product-message-list">{liveChat.turns.map((turn) => <TurnView key={turn.id} turn={turn} />)}</section>;
}
