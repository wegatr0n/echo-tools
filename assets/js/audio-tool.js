// JavaScript for audio converter tool using FFmpeg.js
// Converts uploaded audio into MP3 format with a fixed bitrate.

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('audio-input');
  const processButton = document.getElementById('audio-process-button');
  const results = document.getElementById('audio-results');

  processButton.addEventListener('click', async () => {
    if (!input.files || input.files.length === 0) {
      alert('Please select an audio file first.');
      return;
    }
    const file = input.files[0];
    processButton.disabled = true;
    processButton.textContent = 'Processing…';
    results.innerHTML = '<p>Loading FFmpeg & converting audio…</p>';

    try {
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({ log: true });
      await ffmpeg.load();
      ffmpeg.FS('writeFile', 'input', await fetchFile(file));
      const outputName = 'output.mp3';
      // Run FFmpeg to convert to mp3 with 192k bitrate
      await ffmpeg.run('-i', 'input', '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', outputName);
      const data = ffmpeg.FS('readFile', outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
      results.innerHTML = '';
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${file.name.replace(/\.[^/.]+$/, '')}-converted.mp3`;
      downloadLink.textContent = 'Download converted audio';
      downloadLink.className = 'block text-blue-600 underline mt-4';
      const audioEl = document.createElement('audio');
      audioEl.src = url;
      audioEl.controls = true;
      audioEl.className = 'w-full mt-4';
      results.appendChild(audioEl);
      results.appendChild(downloadLink);
    } catch (err) {
      console.error(err);
      results.innerHTML = `<p class="text-red-600">Error processing audio: ${err.message}</p>`;
    } finally {
      processButton.disabled = false;
      processButton.textContent = 'Process';
    }
  });
});
