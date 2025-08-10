// image-tool.js
// Handles client-side image compression and optional resizing using browser-image-compression

document.getElementById('process-button').addEventListener('click', async () => {
  const fileInput = document.getElementById('image-input');
  const presetValue = document.getElementById('preset').value;
  const quality = parseFloat(document.getElementById('quality').value) || 0.8;
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (!fileInput.files.length) {
    alert('Please select at least one image to process.');
    return;
  }

  // Determine preset size
  let maxWidth;
  let maxHeight;
  if (presetValue) {
    const [w, h] = presetValue.split('x').map(Number);
    maxWidth = w;
    maxHeight = h;
  }

  for (const file of fileInput.files) {
    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: undefined,
        initialQuality: quality,
        useWebWorker: true
      };
      if (maxWidth && maxHeight) {
        // When both width and height specified, use the larger dimension for resizing while maintaining aspect ratio
        options.maxWidthOrHeight = Math.max(maxWidth, maxHeight);
      }
      const compressedFile = await imageCompression(file, options);
      const blobUrl = URL.createObjectURL(compressedFile);
      // Create preview image
      const img = document.createElement('img');
      img.src = blobUrl;
      img.alt = file.name;
      img.className = 'max-w-xs border rounded mt-4';
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'compressed-' + file.name;
      link.textContent = 'Download ' + file.name;
      link.className = 'text-blue-600 hover:underline block mt-2';
      const wrapper = document.createElement('div');
      wrapper.appendChild(img);
      wrapper.appendChild(link);
      results.appendChild(wrapper);
    } catch (err) {
      console.error(err);
      const errorMsg = document.createElement('p');
      errorMsg.textContent = 'Error processing ' + file.name + ': ' + err.message;
      errorMsg.className = 'text-red-600';
      results.appendChild(errorMsg);
    }
  }
});
