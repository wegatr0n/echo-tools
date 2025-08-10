(() => {
  const apiInput = document.getElementById('caption-api-key') || document.getElementById('api-key');
  const descInput = document.getElementById('caption-description');
  const btn = document.getElementById('caption-process-button');
  const resultEl = document.getElementById('caption-results');
  btn.addEventListener('click', async () => {
    const key = apiInput.value.trim();
    const desc = descInput.value.trim();
    if (!key) {
      alert('Please enter your OpenAI API key.');
      return;
    }
    if (!desc) {
      alert('Please enter a description.');
      return;
    }
    resultEl.textContent = 'Generating caption...';
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a creative assistant who writes catchy social media captions based on a brief description. Keep it under 50 words.' },
            { role: 'user', content: `Description: ${desc}\nCaption:` }
          ],
          max_tokens: 60,
          temperature: 0.8
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'Error from API');
      }
      const caption = data.choices[0].message.content.trim();
      resultEl.textContent = caption;
    } catch (err) {
      resultEl.textContent = 'Error generating caption: ' + err.message;
    }
  });
})();
