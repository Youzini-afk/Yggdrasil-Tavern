import { useTavern } from '../../app/TavernProvider.js';

/**
 * @deprecated W4: replaced by SendForm + StreamingIndicator. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function MessageComposer(): JSX.Element {
  const tavern = useTavern();
  return <section className="product-composer"><textarea value={tavern.input} onChange={(event) => tavern.setInput(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') tavern.sendMessage(); }} placeholder="Type a message. Ctrl/⌘ + Enter sends." /><div className="composer-actions"><button type="button" onClick={tavern.sendMessage}>Send</button><button type="button" onClick={tavern.generateReply}>Generate</button></div></section>;
}
