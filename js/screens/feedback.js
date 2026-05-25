window.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.after-feedback-btn');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // If already selected, ignore
      if (btn.classList.contains('selected')) return;

      // Deselect all, select this one
      btns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Remove any existing confirmation
      const existing = document.querySelector('.after-feedback-confirmed');
      if (existing) existing.remove();

      // Insert confirmation message below the grid
      const grid = btn.closest('.after-feedback-grid');
      const confirmed = document.createElement('div');
      confirmed.className = 'after-feedback-confirmed';
      confirmed.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2.5 7l3 3 6-6" stroke="#5DCAA5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Thanks — your report helps everyone nearby
      `;
      grid.insertAdjacentElement('afterend', confirmed);
    });
  });
});
