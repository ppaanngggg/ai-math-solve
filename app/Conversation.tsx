'use client';

import { useState } from 'react';
import { generate } from '@/utils/ai/generate';
import { readStreamableValue } from 'ai/rsc';
import { CoreMessage } from 'ai';
import {
  MdAddCircleOutline,
  MdDelete,
  MdEdit,
  MdOutlineSend
} from 'react-icons/md';
import { MathpixLoader, MathpixMarkdown } from 'mathpix-markdown-it';

function InputMessages(props: {
  messages: CoreMessage[];
  setMessages: (messages: CoreMessage[]) => void;
  editable: boolean;
}) {
  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <div className="flex flex-col w-full space-y-3">
      {props.messages.map((message, index) => (
        <div
          key={index}
          className="relative w-full max-w-full bg-base-100 p-2 rounded-lg shadow-lg"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(-1)}
        >
          {
            // if it's string, just show it, else if it is image, preview image, if it is text, show the text
            typeof message.content === 'string' ? (
              message.content
            ) : message.content[0].type === 'image' ? (
              <img
                alt=""
                src={
                  ('data:image;base64,' + message.content[0].image) as string
                }
                className="object-scale-down"
              />
            ) : message.content[0].type === 'text' ? (
              message.content[0].text
            ) : (
              ''
            )
          }
          {props.editable && hoverIndex === index && (
            <button
              className="absolute -bottom-1.5 -right-2 rounded-full shadow-md bg-base-100 text-error/50 hover:scale-110 hover:text-error"
              onClick={() => {
                props.setMessages(props.messages.filter((_, i) => i !== index));
              }}
            >
              <MdDelete size={24} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

async function getBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
  });
}

function Inputs(props: {
  textInput: string;
  setTextInput: (text: string) => void;
  messages: CoreMessage[];
  setMessages: (messages: CoreMessage[]) => void;
}) {
  return (
    <div className="w-full relative">
      <label className="flex items-center justify-center w-full h-16 space-x-1 bg-white border-2 border-base-300 border-dashed rounded-lg cursor-pointer hover:border-base-content/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-base-content"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="text-base-content">Drop files to Attach, or</span>
        <span className="text-info underline">browse</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              const file = event.target.files[0];
              getBase64(file).then((result) => {
                result = result.replace(/^data:image\/\w+;base64,/, '');
                props.setMessages([
                  ...props.messages,
                  { role: 'user', content: [{ type: 'image', image: result }] }
                ]);
              });
            }
          }}
        />
      </label>
      <textarea
        placeholder="Type your message here..."
        rows={Math.max(3, props.textInput.split(/\r\n|\r|\n/).length)}
        className="mt-4 textarea w-full rounded-lg shadow-lg bg-white"
        value={props.textInput}
        onChange={(event) => {
          props.setTextInput(event.target.value);
        }}
      />
      <button
        className="absolute -bottom-1.5 -right-2 rounded-full shadow-md bg-white text-success/50 hover:scale-110 hover:text-success"
        onClick={() => {
          if (props.textInput === '') {
            return;
          }
          props.setMessages([
            ...props.messages,
            { role: 'user', content: props.textInput }
          ]);
          props.setTextInput('');
        }}
      >
        <MdAddCircleOutline size={24} />
      </button>
    </div>
  );
}

export default function Conversation() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [textOutput, setTextOutput] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);

  const editable = !generating && textOutput === '';

  return (
    <div className="flex flex-col w-[60rem] max-w-full items-center p-2 mt-5">
      <InputMessages
        messages={messages}
        setMessages={setMessages}
        editable={editable}
      />
      {messages.length > 0 && (
        <div className="divider text-gray-500 font-medium">
          {editable ? 'Edit' : 'Answer'}
        </div>
      )}
      {editable ? (
        <>
          <Inputs
            textInput={textInput}
            setTextInput={setTextInput}
            messages={messages}
            setMessages={setMessages}
          />
          <button
            className="bg-primary/60 text-base-100 rounded-full p-1.5 m-10 shadow-lg hover:scale-110 hover:bg-primary"
            onClick={async () => {
              let finalMessages = messages;
              if (textInput != '') {
                finalMessages = [
                  ...finalMessages,
                  { role: 'user', content: textInput }
                ];
                setMessages(finalMessages);
                setTextInput('');
              }
              if (finalMessages.length === 0) {
                return;
              }
              finalMessages = [
                {
                  role: 'system',
                  content:
                    'You are an professional and patient math teacher. ' +
                    'Help user solve the following math problem. ' +
                    'Thinking step by step and give the answer finally. ' +
                    'Print as markdown and latex. ' +
                    'If no math problem found, refuse to answer.'
                },
                ...finalMessages
              ];
              setGenerating(true);
              const outputStream = await generate(finalMessages);
              let buf = '';
              for await (const delta of readStreamableValue(outputStream)) {
                buf += delta;
                setTextOutput(buf);
              }
              setGenerating(false);
            }}
          >
            <MdOutlineSend size={36} />
          </button>
        </>
      ) : (
        <>
          {textOutput === '' ? (
            <span className="loading loading-ring loading-md"></span>
          ) : (
            <div className="w-full max-w-full bg-base-100 p-2 rounded-lg shadow-lg">
              <MathpixLoader>
                <MathpixMarkdown text={textOutput} />
              </MathpixLoader>
            </div>
          )}
          {generating ? (
            <></>
          ) : (
            <button
              className="bg-success/50 text-base-100 rounded-full p-1.5 m-10 shadow-lg hover:scale-110 hover:bg-success"
              onClick={() => {
                setTextOutput('');
              }}
            >
              <MdEdit size={36} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
