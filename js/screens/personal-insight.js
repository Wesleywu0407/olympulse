const heights = [20, 35, 15, 52, 18, 30, 10];
heights.forEach((h, i) => {
  const el = document.getElementById('b' + (i + 1));
  if (el) el.style.height = h + 'px';
});
