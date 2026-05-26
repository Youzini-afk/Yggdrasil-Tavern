import { useState, useCallback } from 'react';
export function useDrawers() {
    const [openId, setOpenId] = useState(null);
    const open = useCallback((id) => setOpenId(id), []);
    const close = useCallback(() => setOpenId(null), []);
    const toggle = useCallback((id) => setOpenId((prev) => (prev === id ? null : id)), []);
    return { openId, open, close, toggle };
}
//# sourceMappingURL=useDrawers.js.map