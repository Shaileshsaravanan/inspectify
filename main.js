javascript:(function(){
  const style = document.createElement('style');
  style.textContent = `
    #dev-tooltip {
      position: fixed; background: #333; color: #fff; font: 12px monospace;
      padding: 4px 6px; border-radius: 4px; pointer-events: none;
      z-index: 999999; display: none;
    }
    .z-index-label {
      position: absolute;
      background: yellow;
      color: black;
      font: 10px monospace;
      padding: 1px 3px;
      border: 1px solid #000;
      z-index: 999998;
      pointer-events: none;
    }`;
  document.head.appendChild(style);

  const tooltip = document.createElement('div');
  tooltip.id = 'dev-tooltip';
  document.body.appendChild(tooltip);

  document.addEventListener('mousemove', e => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el.id === 'dev-tooltip') return;
    const tag = el.tagName.toLowerCase();
    const cls = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : '';
    const id = el.id ? `#${el.id}` : '';
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const font = `${styles.fontFamily}, ${styles.fontSize}, ${styles.fontWeight}, ${styles.lineHeight}`;
    tooltip.textContent = `${tag}${id}${cls} [${Math.round(rect.width)}x${Math.round(rect.height)}] | Font: ${font}`;
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
    tooltip.style.display = 'block';
  });

  alert('Dev Mode: Hover for info, click to inspect, Esc to exit.');
  const onClick = e => {
    e.preventDefault(); e.stopPropagation();
    const el = e.target;
    const path = [];
    let node = el;
    while (node && node.nodeType === 1) {
      let id = node.id ? `#${node.id}` : '';
      let cls = node.className ? '.' + node.className.trim().replace(/\s+/g, '.') : '';
      path.unshift(node.tagName.toLowerCase() + id + cls);
      node = node.parentElement;
    }
    console.log('--- Element Inspection ---');
    console.log('Tag:', el.tagName);
    console.log('Classes:', el.className);
    console.log('ID:', el.id);
    console.log('Path:', path.join(' > '));
    console.log('BoundingRect:', el.getBoundingClientRect());

    try {
      const listeners = getEventListeners?.(el);
      if (listeners) console.log('Event Listeners:', listeners);
      else console.log('Event listener viewer not supported in this environment.');
    } catch (err) {
      console.log('Event listener viewer error:', err);
    }

    const js = prompt('Enter JavaScript to run on this element (use \"el\" as reference):');
    if (js) {
      try {
        eval(js);
      } catch (err) {
        console.error('Error in injected JS:', err);
      }
    }

    const eventType = prompt('Enter event to dispatch on this element (e.g., click, mouseover):');
    if (eventType) {
      try {
        const evt = new Event(eventType, { bubbles: true, cancelable: true });
        el.dispatchEvent(evt);
        console.log(`Dispatched '${eventType}' event on element.`);
      } catch (err) {
        console.error('Error dispatching event:', err);
      }
    }
  };
  document.addEventListener('click', onClick, true);

  const onEsc = e => {
    if (e.key === 'Escape') {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('mousemove', null);
      document.removeEventListener('keydown', onEsc);
      tooltip.remove();
      document.querySelectorAll('.z-index-label').forEach(l => l.remove());
      console.log('Dev overlay exited.');
    }
  };
  document.addEventListener('keydown', onEsc);

  document.querySelectorAll('*').forEach(el => {
    const z = window.getComputedStyle(el).zIndex;
    if (z && z !== 'auto' && parseInt(z) > 0) {
      const rect = el.getBoundingClientRect();
      const label = document.createElement('div');
      label.className = 'z-index-label';
      label.textContent = `z:${z}`;
      label.style.left = `${rect.left + window.scrollX}px`;
      label.style.top = `${rect.top + window.scrollY}px`;
      document.body.appendChild(label);
    }
  });
})();