let chosen = 'local';

function selectIdentity(id) {
  chosen = id;

  document.querySelectorAll('.identity-card').forEach((card) => {
    const isSelected = card.dataset.identity === id;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
  });

  const cta = document.getElementById('cta');
  cta.disabled = !chosen;
}

function proceed() {
  if (!chosen) return;
  sendPrompt('I selected ' + chosen + '. Continue to the main map.');
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.identity-card').forEach((card) => {
    card.addEventListener('click', () => selectIdentity(card.dataset.identity));
  });

  document.getElementById('cta')?.addEventListener('click', proceed);
  selectIdentity(chosen);
});
