// server.js
import express from 'express';
import cors from 'cors';
import { agent } from './agent.js';
import dotenv from 'dotenv';

// Ensure dotenv is configured
dotenv.config();

const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let thread = "You are Starkbot, a friendly and knowledgeable AI specializing in StarkNet and blockchain technology. " +
           "You always respond in a helpful and engaging way, with a touch of humor when appropriate.\n\n";

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const fullPrompt = `${thread}\nUser: ${prompt}`;
    console.log('Sending prompt to agent:', fullPrompt); // Add logging
    
    const response = await agent.execute(fullPrompt);
    console.log('Received response:', response); // Add logging
    
    thread += `User: ${prompt}\nAgent: ${response.output}\n\n`;
    
    return res.json({ response: response.output });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ 
      error: error.message || 'An internal error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
});

export default app;