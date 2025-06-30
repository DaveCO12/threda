export default async function handler(req, res) {
  try {
    const { input, tone } = req.body;

    const prompt = `
You're a viral ghostwriter. Turn the input into a high-engagement thread for X (Twitter).
Style: ${tone}

Input: ${input}

Output:
- Start with a bold hook (Post 1)
- Use 5–8 posts to deliver value clearly
- End with a strong CTA
- Format each post with spacing for readability
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    // 👇 LOG THE RAW RESPONSE
    console.log("GPT Response Raw:", JSON.stringify(data, null, 2));

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        error: "Malformed response from GPT",
        raw: data,
      });
    }

    const thread = data.choices[0].message.content.trim();
    res.status(200).json({ thread });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
