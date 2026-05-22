import { useTavern } from '../../app/TavernProvider.js';

export function GenerationControls(): JSX.Element {
  const tavern = useTavern();
  return <section className="product-control-card"><h3>Generation</h3><button type="button" onClick={tavern.generateReply}>Generate</button><button type="button" onClick={tavern.regenerateReply}>Regenerate</button><button type="button" onClick={tavern.swipeReply}>Swipe</button><button type="button" onClick={tavern.editFirstMessage}>Edit first</button><p>Controls call the live ST context. Real model routing lands later through Yggdrasil public protocol.</p></section>;
}
