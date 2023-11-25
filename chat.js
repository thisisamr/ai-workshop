import readline from 'node:readline';
import { openai } from './openai.js';

// readline interface
const rl = new readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Creating a new message
const newMessage = async (history, message) => {
  const results = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
    temperature: 0,
  });
  return results.choices[0].message;
};

const format_user_message = (userMessage) => ({
  role: 'user',
  content: userMessage,
});

export const chat = () => {
  const history = [
    {
      role: 'system',
      content: 'You are a AI agent',
    },
  ];
  const start = () => {
    rl.question('You:', async (userinput) => {
      if (userinput.toLowerCase() == 'exit') {
        rl.close();
        return;
      }
      const message = format_user_message(userinput);

      const response = await newMessage(history, message);

      history.push(message, response);

      console.log(`\n\nAI: ${response.content}`);
      start();
    });
  };

  start();
};
