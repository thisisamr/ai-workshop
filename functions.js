import 'dotenv/config';
import { openai } from './openai.js';
const QUESTION = process.argv[2] || 'hi';
import math from 'advanced-calculator';

const messages = [
  {
    role: 'user',
    content: QUESTION,
  },
];

const functions = {
  calculate: async ({ expression }) => {
    return math.evaluate(expression);
  },
  generateImage: async ({ prompt }) => {
    const result = await openai.images.generate({ prompt });
    console.log(result);
    return result.data[0].url;
  },
};
const getCompletion = async (messages) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages,
    functions: [
      {
        name: 'calculate',
        description: 'Run a math expression',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description:
                'Then math expression to evaluate like "2 * 3 + (21 / 2) ^ 2"',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'generateImage',
        description: 'Generate an image based on description.',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'the description of the image to generate',
            },
          },
          required: ['prompt'],
        },
      },
    ],
    temperature: 0,
  });

  return response;
};

while (true) {
  let response = await getCompletion(messages);
  if (response.choices[0].finish_reason == 'stop') {
    console.log(response.choices[0].message.content);
    break;
  } else if (response.choices[0].finish_reason === 'function_call') {
  }
}
