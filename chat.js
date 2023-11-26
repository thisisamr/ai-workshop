import readline from 'node:readline';
import { openai } from './openai.js';

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to generate a new message
const generateMessage = async (history, message) => {
  const results = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
    temperature: 0,
  });
  return results.choices[0].message;
};

// Function to format user message
const formatUserMessage = (userMessage) => ({
  role: 'user',
  content: userMessage,
});

// Function to start the chat
export const startChat = async () => {
  const history = [
    {
      role: 'system',
      content: 'You are a AI agent',
    },
  ];
  while (true) {
    const userInput = await new Promise((resolve) => {
      rl.question('You:', (input) => {
        resolve(input);
      });
    });
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    const message = formatUserMessage(userInput);

    const response = await generateMessage(history, message);

    history.push(message, response);

    console.log(`\n\nAI: ${response.content}`);
  }
};
