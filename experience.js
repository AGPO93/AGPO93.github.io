function createExperiencePage(data) {
  // Set document title
  document.title = data.company + " — Experience";

  const terminal = document.getElementById('terminal');

  // Create and append title
  const h1 = document.createElement('h1');
  h1.className = 'line';
  h1.textContent = '> ' + data.title.toUpperCase();
  terminal.appendChild(h1);

  // Create and append media
  if (data.media.type === 'image') {
    const img = document.createElement('img');
    img.id = 'project-image';
    img.src = data.media.src;
    img.alt = data.media.alt;
    img.style = "max-width:420px; width:100%; height:auto; border:1px solid rgba(0,255,159,0.06); opacity: 0; transition: opacity 0.6s ease-out;";
    terminal.appendChild(img);
  } else if (data.media.type === 'video') {
    const div = document.createElement('div');
    div.className = 'video-container';
    div.id = 'project-video';
    const iframe = document.createElement('iframe');
    iframe.src = data.media.src;
    iframe.title = data.media.title || "YouTube video player";
    iframe.frameborder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerpolicy = "strict-origin-when-cross-origin";
    iframe.allowfullscreen = true;
    div.appendChild(iframe);
    terminal.appendChild(div);
  }

  // Create and append fields
  Object.entries(data.fields).forEach(([key, value]) => {
    const p = document.createElement('p');
    p.className = 'line';
    p.textContent = '> ' + key.toUpperCase() + ': ' + value;
    terminal.appendChild(p);
  });

  // Process sections
  data.sections.forEach(section => {
    if (section.type === 'line') {
      const p = document.createElement('p');
      p.className = 'line';
      p.textContent = section.text;
      terminal.appendChild(p);
    } else if (section.type === 'header') {
      const h3 = document.createElement('h3');
      h3.className = 'line';
      h3.textContent = section.text;
      terminal.appendChild(h3);
    } else if (section.type === 'cards') {
      const div = document.createElement('div');
      div.id = section.id;
      div.className = 'skills-container';
      terminal.appendChild(div);
    } else if (section.type === 'contributions') {
      section.items.forEach(item => {
        const p = document.createElement('p');
        p.className = 'line';
        p.textContent = item;
        terminal.appendChild(p);
      });
    } else if (section.type === 'back') {
      const h3 = document.createElement('h3');
      h3.className = 'line back-to-portfolio';
      const a = document.createElement('a');
      a.href = '../experience.html';
      a.textContent = '<--- BACK TO PORTFOLIO';
      h3.appendChild(a);
      terminal.appendChild(h3);
    }
  });

  // Handle media fade-in
  setTimeout(() => {
    if (data.media.type === 'image') {
      const img = document.getElementById('project-image');
      if (img) {
        img.style.opacity = '1';
      }
    } else if (data.media.type === 'video') {
      const videoContainer = document.getElementById('project-video');
      if (videoContainer) {
        videoContainer.style.opacity = '1';
      }
    }
  }, 100);

  // Create cards for skills and highlights
  data.sections.forEach(section => {
    if (section.type === 'cards') {
      createCards(section.id, section.items);
    }
  });
}