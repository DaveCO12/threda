import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Casual');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateThread = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tone }),
      });

      const data = await res.json();

      if (data.thread) {
        setOutput(data.thread);
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput('No thread or error returned from the server.');
      }
    } catch (err) {
      setOutput(`Unexpected error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Threda</h1>
      <textarea
        rows="6"
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Paste your idea, blog intro, or bullets..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>Tone:</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Casual</option>
          <option>Authority</option>
          <option>Punchy</option>
          <option>Story-driven</option>
        </select>
      </div>
      <button onClick={generateThread} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Thread'}
      </button>

      <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
        <h3>Your Thread:</h3>
        {output}
      </div>
    </main>
  );
}
