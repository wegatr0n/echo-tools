// JavaScript for AI assistant tool
// This page provides a simple chat interface for an AI assistant. It uses the OpenAI
// Chat Completion API. To enable this tool, you must supply your own API key.
// Warning: embedding your API key in client-side code will expose it to users. You may
// want to implement a proxy or serverless function to handle requests instead.

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const messagesContainer = document.getElementById('messages');

  // Maintain conversation history for context
  let conversation = [];

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;
    // Append user message to conversation and display it
    conversation.push({ role: 'user', content: userMessage });
    appendMessage('You', userMessage);
    userInput.value = '';
    // Fetch API key from input
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      appendMessage('Assistant', 'Please provide your OpenAI API key.');
      return;
    }
    try {
      // Make request to OpenAI Chat API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: conversation,
          max_tokens: 150,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      const reply = data.choices[0].message.content.trim();
      conversation.push({ role: 'assistant', content: reply });
      appendMessage('Assistant', reply);
    } catch (err) {
      console.error(err);
      appendMessage('Assistant', 'Sorry, there was an error contacting the AI service.');
    }
  });

  function appendMessage(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.className = sender === 'You' ? 'message user' : 'message ai';
    messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
