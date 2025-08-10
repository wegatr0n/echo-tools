// trending.js
// This script fetches the list of trending topics from the trending.json file
// and populates the relevant list on pages where the element exists.
fetch('trending.json')
  .then(response => response.json())
  .then(topics => {
    const ul = document.getElementById('trending-list');
    if (!ul) return;
    topics.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item.topic;
      a.href = item.link || '#';
      a.className = 'text-blue-600 hover:underline';
      li.appendChild(a);
      if (item.description) {
        const span = document.createElement('span');
        span.textContent = ' – ' + item.description;
        span.className = 'text-gray-600 ml-2';
        li.appendChild(span);
      }
      ul.appendChild(li);
    });
  })
  .catch(err => {
    console.error('Failed to load trending topics:', err);
  });
