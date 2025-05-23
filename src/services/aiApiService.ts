import { Message } from "@/components/chat/ChatMessage";
import { ApiProvider } from "@/components/layout/NavbarSettings";

interface ApiError {
  error: boolean;
  message: string;
}

// Get the API key and provider from localStorage
export const getApiSettings = (): { apiKey: string, provider: ApiProvider } => {
  const apiKey = localStorage.getItem('chat_api_key') || '';
  const provider = (localStorage.getItem('chat_api_provider') as ApiProvider) || 'openai';
  return { apiKey, provider };
};

// Check if API settings are configured
export const hasApiSettings = (): boolean => {
  const { apiKey } = getApiSettings();
  return !!apiKey;
};

// Send a message to the OpenAI API
const sendToOpenAI = async (messages: Message[], apiKey: string): Promise<string | ApiError> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        error: true,
        message: data.error?.message || 'Error connecting to OpenAI API'
      };
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    return {
      error: true,
      message: 'Failed to connect to OpenAI API'
    };
  }
};

// Send a message to the Anthropic API
const sendToAnthropic = async (messages: Message[], apiKey: string): Promise<string | ApiError> => {
  try {
    // Convert the message history to Anthropic's format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: anthropicMessages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        error: true,
        message: data.error?.message || 'Error connecting to Anthropic API'
      };
    }

    return data.content[0].text;
  } catch (error) {
    console.error('Error sending message to Anthropic:', error);
    return {
      error: true,
      message: 'Failed to connect to Anthropic API'
    };
  }
};

// Main function to send a message to the selected API provider
export const sendMessage = async (messages: Message[]): Promise<string | ApiError> => {
  const { apiKey, provider } = getApiSettings();
  
  if (!apiKey) {
    return {
      error: true,
      message: 'API key not found. Please configure your API settings.'
    };
  }
  
  return provider === 'openai' 
    ? sendToOpenAI(messages, apiKey) 
    : sendToAnthropic(messages, apiKey);
};