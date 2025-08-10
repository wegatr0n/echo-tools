(async () => {
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  const loadFF = async () => {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
  };
  const button = document.getElementById('clip-process-button');
  button.addEventListener('click', async () => {
    const file = document.getElementById('clip-video-input').files[0];
    if (!file) {
      alert('Please select a video.');
      return;
    }
    const start = parseFloat(document.getElementById('start-time').value) || 0;
    const end = parseFloat(document.getElementById('end-time').value);
    const orientation = document.getElementById('orientation').value;
    await loadFF();
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
    const filters = [];
    if (orientation === 'vertical') {
      filters.push('scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2');
    } else {
      filters.push('scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2');
    }
    const args = ['-i','input.mp4'];
    if (end && end > start) {
      args.push('-ss', String(start), '-t', String(end - start));
    } else if (start) {
      args.push('-ss', String(start));
    }
    args.push('-vf', filters.join(','), '-c:v','libx264','-preset','veryfast','-crf','28','output.mp4');
    await ffmpeg.run(...args);
    const data = ffmpeg.FS('readFile','output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], {type:'video/mp4'}));
    const results = document.getElementById('clip-results');
    results.innerHTML = '';
    const video = document.createElement('video');
    video.controls = true;
    video.src = url;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clip.mp4';
    link.textContent = 'Download Clip';
    results.appendChild(video);
    results.appendChild(link);
  });
})();
