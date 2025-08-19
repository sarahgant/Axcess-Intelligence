import React from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    attachedDocuments?: Array<{
        id: string;
        name: string;
        type: string;
    }>;
    isStreaming?: boolean;
}

interface MessageDebuggerProps {
    messages: Message[];
}

export const MessageDebugger: React.FC<MessageDebuggerProps> = ({ messages }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    if (!isVisible) {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    zIndex: 9999
                }}
                onClick={() => setIsVisible(true)}
            >
                Debug Messages ({messages.length})
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '400px',
                maxHeight: '300px',
                overflow: 'auto',
                fontSize: '12px',
                zIndex: 9999,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong>Message Debug Info</strong>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                >
                    ×
                </button>
            </div>

            {messages.length === 0 ? (
                <p style={{ color: '#666' }}>No messages found</p>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={message.id}
                        style={{
                            marginBottom: '12px',
                            padding: '8px',
                            backgroundColor: message.sender === 'ai' ? '#e8f5e8' : '#e8f0ff',
                            borderRadius: '4px',
                            border: `2px solid ${message.sender === 'ai' ? '#4caf50' : '#2196f3'}`
                        }}
                    >
                        <div><strong>#{index + 1} - {message.sender.toUpperCase()}</strong></div>
                        <div><strong>ID:</strong> {message.id}</div>
                        <div><strong>Text:</strong> {message.text.substring(0, 50)}...</div>
                        <div><strong>Timestamp:</strong> {message.timestamp.toLocaleTimeString()}</div>
                        <div><strong>Streaming:</strong> {message.isStreaming ? 'Yes' : 'No'}</div>
                        <div style={{
                            marginTop: '4px',
                            padding: '4px',
                            backgroundColor: message.sender === 'ai' ? '#c8e6c9' : '#bbdefb',
                            borderRadius: '2px',
                            fontSize: '11px'
                        }}>
                            {message.sender === 'ai' ? '✅ Should show action buttons' : '❌ No action buttons (user message)'}
                        </div>
                    </div>
                ))
            )}

            <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div><strong>Total Messages:</strong> {messages.length}</div>
                <div><strong>AI Messages:</strong> {messages.filter(m => m.sender === 'ai').length}</div>
                <div><strong>User Messages:</strong> {messages.filter(m => m.sender === 'user').length}</div>
            </div>
        </div>
    );
};
