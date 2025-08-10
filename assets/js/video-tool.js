// JavaScript for video converter tool using FFmpeg.js
// This script allows users to convert a video to MP4 and optionally change resolution.
// Note: FFmpeg.js is a large library (~25 MB) and may take some time to load in the browser.
// The API call is entirely client‑side and does not upload any files to a server.

// Wait until the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('video-input');
  const resolutionSelect = document.getElementById('resolution');
  const processButton = document.getElementById('video-process-button');
  const results = document.getElementById('video-results');

  // Lazy load the FFmpeg library only when the user clicks process
  processButton.addEventListener('click', async () => {
    if (!input.files || input.files.length === 0) {
      alert('Please select a video file first.');
      return;
    }
    const file = input.files[0];
    processButton.disabled = true;
    processButton.textContent = 'Processing…';
    results.innerHTML = '<p>Loading FFmpeg & processing video. This may take a few moments…</p>';

    try {
      // Dynamically import FFmpeg (the bundle is large so we import only when needed)
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({ log: true });
      await ffmpeg.load();
      // Write the uploaded file into FFmpeg’s virtual filesystem
      ffmpeg.FS('writeFile', 'input', await fetchFile(file));
      const resolution = resolutionSelect.value;
      const outputName = 'output.mp4';
      // Build arguments: if a resolution is selected, scale the video; otherwise keep original size
      const args = ['-i', 'input'];
      if (resolution) {
        const [width, height] = resolution.split('x');
        args.push('-vf', `scale=${width}:${height}`);
      }
      args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23', outputName);
      await ffmpeg.run(...args);
      const data = ffmpeg.FS('readFile', outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      results.innerHTML = '';
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${file.name.replace(/\.[^/.]+$/, '')}-converted.mp4`;
      downloadLink.textContent = 'Download converted video';
      downloadLink.className = 'block text-blue-600 underline mt-4';
      const videoEl = document.createElement('video');
      videoEl.src = url;
      videoEl.controls = true;
      videoEl.className = 'w-full mt-4';
      results.appendChild(videoEl);
      results.appendChild(downloadLink);
    } catch (err) {
      console.error(err);
      results.innerHTML = `<p class="text-red-600">Error processing video: ${err.message}</p>`;
    } finally {
      processButton.disabled = false;
      processButton.textContent = 'Process';
    }
  });
});
