# Inspectify

**Inspectify** is a powerful, lightweight bookmarklet for web developers, designed to help you inspect elements, view z-index values, and get detailed information on any DOM element directly in the browser. It displays useful information on hover, logs full element details on click, and highlights elements with `z-index` values.

## Features

* **Element Info Tooltip**: On hover, displays tag, class, ID, and element dimensions.
* **Click-to-Inspect**: Click any element to log detailed information, including the full DOM path, tag, class, ID, and bounding rectangle.
* **Z-Index Visualizer**: Highlights elements with a `z-index` set and shows their values in floating labels.

## Usage

1. **Add Inspectify to your browser**:

   * Drag and drop the bookmarklet code into your browser's bookmarks bar, or manually create a new bookmark and paste the code as the URL.

2. **Activate Inspectify**:

   * Click the **Inspectify** bookmarklet whenever you're on a webpage you want to inspect.

3. **Hover over elements**:

   * A tooltip will display the tag, class, ID, and size of the hovered element.

4. **Click on an element**:

   * The full DOM path, tag, class, ID, and bounding box details of the clicked element will be logged to the browser console.

5. **Visualize Z-Index**:

   * Any element with a `z-index` greater than 0 will be highlighted with a floating label showing its value.

6. **Exit Inspectify**:

   * Press **Esc** to remove tooltips, labels, and stop logging, returning the page to its normal state.

## Installation

1. **Create a bookmark** in your browser.
2. Copy and paste the following code into the bookmark's URL field:

```js
javascript:(function(){ const style = document.createElement('style'); style.textContent = `
    #dev-tooltip { position: fixed; background: #333; color: #fff; font: 12px monospace; padding: 4px 6px; border-radius: 4px; pointer-events: none; z-index: 999999; display: none; }
    .z-index-label { position: absolute; background: yellow; color: black; font: 10px monospace; padding: 1px 3px; border: 1px solid #000; z-index: 999998; pointer-events: none; }`;
  document.head.appendChild(style);

  const tooltip = document.createElement('div'); tooltip.id = 'dev-tooltip'; document.body.appendChild(tooltip);

  document.addEventListener('mousemove', e => { const el = document.elementFromPoint(e.clientX, e.clientY); if (!el || el.id === 'dev-tooltip') return; const tag = el.tagName.toLowerCase(); const cls = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : ''; const id = el.id ? `#${el.id}` : ''; const rect = el.getBoundingClientRect(); tooltip.textContent = `${tag}${id}${cls} [${Math.round(rect.width)}x${Math.round(rect.height)}]`; tooltip.style.left = (e.pageX + 10) + 'px'; tooltip.style.top = (e.pageY + 10) + 'px'; tooltip.style.display = 'block'; });

  alert('Dev Mode: Hover for info, click to inspect, Esc to exit.');
  const onClick = e => { e.preventDefault(); e.stopPropagation(); const el = e.target; const path = []; let node = el; while (node && node.nodeType === 1) { let id = node.id ? `#${node.id}` : ''; let cls = node.className ? '.' + node.className.trim().replace(/\s+/g, '.') : ''; path.unshift(node.tagName.toLowerCase() + id + cls); node = node.parentElement; } console.log('--- Element Inspection ---'); console.log('Tag:', el.tagName); console.log('Classes:', el.className); console.log('ID:', el.id); console.log('Path:', path.join(' > ')); console.log('BoundingRect:', el.getBoundingClientRect()); };
  document.addEventListener('click', onClick, true);

  const onEsc = e => { if (e.key === 'Escape') { document.removeEventListener('click', onClick, true); document.removeEventListener('mousemove', null); document.removeEventListener('keydown', onEsc); tooltip.remove(); document.querySelectorAll('.z-index-label').forEach(l => l.remove()); console.log('Dev overlay exited.'); } };
  document.addEventListener('keydown', onEsc);

  document.querySelectorAll('*').forEach(el => { const z = window.getComputedStyle(el).zIndex; if (z && z !== 'auto' && parseInt(z) > 0) { const rect = el.getBoundingClientRect(); const label = document.createElement('div'); label.className = 'z-index-label'; label.textContent = `z:${z}`; label.style.left = `${rect.left + window.scrollX}px`; label.style.top = `${rect.top + window.scrollY}px`; document.body.appendChild(label); } }); })();
```