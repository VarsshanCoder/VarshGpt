import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ dest: path.join(process.cwd(), 'uploads') });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 8787;

function systemPrompt() {
  return [
    {
      role: 'system',
      content: `
You are VarshGpt, a helpful AI assistant.
When the user asks for code:
- Always respond with a short explanation first.
- Then show the code in a separate Markdown code block using triple backticks.
- Use the correct language tag (e.g., \`\`\`python).
- Do not embed code inside paragraphs.
- Keep code clean, minimal, and ready to copy.
Example:

Here’s how to calculate a sum in Python:

\`\`\`python
def calculate_sum(a, b):
    return a + b

print(calculate_sum(10, 15))
\`\`\`
`
    }
  ];
}

// Chat endpoint — returns plain text
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [...systemPrompt(), ...(messages || [])],
    });
    const reply = completion.choices[0]?.message?.content || '';
    res.send(reply);
  } catch (err: any) {
    res.status(500).send(err.message || 'Chat error');
  }
});

// Image generation
app.post('/image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
    });
    res.json({ url: result.data?.[0]?.url || '' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// File upload + analysis
app.post('/file/analyze', upload.array('files'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const fileSummaries = (req.files as Express.Multer.File[]).map(f => `${f.originalname} uploaded`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        ...systemPrompt(),
        { role: 'user', content: `${prompt}\nFiles: ${fileSummaries.join(', ')}` }
      ]
    });
    const answer = completion.choices[0]?.message?.content || '';
    res.send(answer);
  } catch (err: any) {
    res.status(500).send(err.message || 'File analysis error');
  }
});

app.listen(PORT, () => console.log(`✅ VarshGpt backend running at http://localhost:${PORT}`));