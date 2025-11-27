import { GoogleGenAI, Content, Part } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBPOuJt4kUbnWc0QGN1WpTUZmWv-2f073o' });

export const streamResponse = async (
  history: Message[],
  newMessage: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    // Transform internal message format to Gemini API format
    // We slice(0, -1) to exclude the current new message from the history, 
    // as it will be sent via sendMessageStream.
    const contents: Content[] = history
      .slice(0, -1)
      .filter((msg) => !msg.isError)
      .map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text } as Part],
      }));

    // Create the chat session
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // High temperature for maximum creativity/stupidity
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking as requested
      },
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    let fullText = "";
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};