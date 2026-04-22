const labels = [
  { text: 'Very calm', bg: '#e3f7ee', color: '#1a7a50' },
  { text: 'Calm — manageable', bg: '#e3f7ee', color: '#1a7a50' },
  { text: 'Slightly busy', bg: '#fff3e0', color: '#9a5c00' },
  { text: 'Quite crowded', bg: '#fff3e0', color: '#9a5c00' },
  { text: 'Very crowded', bg: '#ffe3e0', color: '#b83a2b' },
  { text: 'Overwhelming', bg: '#ffe3e0', color: '#b83a2b' },
];

function updateSlider(val) {
  const idx = Math.min(Math.floor(Number(val) / 17), 5);
  const label = labels[idx];
  const mood = document.getElementById('feel-label');
  const slider = document.getElementById('feel-slider');

  mood.textContent = label.text;
  mood.style.background = label.bg;
  mood.style.color = label.color;
  slider.style.accentColor = Number(val) < 45 ? '#1DB87A' : Number(val) < 70 ? '#FF8C00' : '#FF5032';
}

function toggleTag(tag) {
  tag.classList.toggle('active');
}

function submitFeedback() {
  sendPrompt('Feedback shared. Continue to personal insight.');
}

window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('feel-slider');
  slider?.addEventListener('input', (event) => updateSlider(event.target.value));
  updateSlider(slider?.value || 35);

  document.querySelectorAll('.tag').forEach((tag) => {
    tag.addEventListener('click', () => toggleTag(tag));
  });

  document.getElementById('feedback-submit')?.addEventListener('click', submitFeedback);
});
