import { useState } from 'react';

export function useMessageInline() {
    const [messageInline, setMessageInline] = useState(null);

    const showMessageInline = (message) => {
        setMessageInline(message);
    }

    const handleClearMessageInline = () => {
        setMessageInline(null);
    }

    return {
        messageInline,
        showMessageInline,
    }
}