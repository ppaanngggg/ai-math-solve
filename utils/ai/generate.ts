'use server';

import { google } from '@ai-sdk/google';
import { CoreMessage, LanguageModel, streamText } from 'ai';
import { createStreamableValue, StreamableValue } from 'ai/rsc';
import * as process from 'node:process';
import { ollama } from 'ollama-ai-provider';

export async function generate(
  inputMessages: CoreMessage[]
): Promise<StreamableValue<string>> {
  'use server';

  const stream = createStreamableValue();
  let model: LanguageModel;
  if (process.env.AI_PROVIDER === 'google') {
    model = google.chat('models/gemini-1.5-pro-latest');
  } else if (process.env.AI_PROVIDER === 'ollama') {
    model = ollama.chat('llava');
  } else {
    throw new Error('AI_PROVIDER not set');
  }

  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: inputMessages
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })().then(() => {});

  return stream.value;
}
