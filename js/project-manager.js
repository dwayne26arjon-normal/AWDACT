// 4. PROJECT CRUD: dynamic project list with create, update and delete actions
const STORAGE_KEY = 'portfolio-projects-v1';
const defaultProjects = [
  {
    id: 'oversmoke-dashboard',
    title: 'Oversmoke Admin Dashboard',
    description: 'An admin dashboard design for an online store, showing product and stock totals, low stock alerts, top selling products and a sales report.',
    category: 'web',
    techStack: ['Figma', 'UI Design', 'Laravel'],
    projectUrl: 'https://www.figma.com/design/muIBtk8NovFcZ84t9hHcSW/demo2?node-id=67-826&t=CjJ1eKMq6PXP9IZT-1',
    repoUrl: 'https://github.com/',
    image: 'images/oversmoke-dashboard.png',
    date: '2026-08-05'
  },
  {
    id: 'oversmoke-store',
    title: 'Oversmoke Store UI Design',
    description: 'A Figma homepage design for an online shop, with a category and brand filter sidebar, a featured banner, a sortable product grid and an add-to-cart flow.',
    category: 'creative',
    techStack: ['Figma', 'UI Design', 'Wireframing'],
    projectUrl: 'https://www.figma.com/design/muIBtk8NovFcZ84t9hHcSW/demo2?node-id=67-826&t=CjJ1eKMq6PXP9IZT-1',
    repoUrl: 'https://github.com/',
    image: 'images/figma-design.png',
    date: '2026-07-14'
  },
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    description: 'A responsive portfolio that showcases my technical skills, projects, education and creative work.',
    category: 'web',
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    projectUrl: '#home',
    repoUrl: 'https://github.com/',
    image: 'images/placeholder.svg',
    date: '2026-09-02'
  },
  {
    id: 'youtube-editing',
    title: 'Video Editing on YouTube',
    description: 'My YouTube channel, where my video work lives. I share edited content and visual storytelling projects.',
    category: 'creative',
    techStack: ['CapCut'],
    projectUrl: 'https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q',
    repoUrl: 'https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q',
    image: 'images/ytchannel.png',
    date: '2026-06-30'
  }
];

function readProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProjects.slice();
  } catch (e) {
    return defaultProjects.slice();
  }
}

function writeProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    // ignore storage issues in restricted environments
  }
}

const filterButtons = document.querySelectorAll('.filter-btn');
const noProjects = document.getElementById('no-projects');
const projectList = document.getElementById('project-list');
const projectForm = document.getElementById('project-form');
const projectSuccess = document.getElementById('project-success');
const projectIdInput = document.getElementById('project-id');
const cancelEditButton = document.getElementById('cancel-edit-project');
const projectSummary = {
  total: document.getElementById('record-count'),
  web: document.getElementById('web-count'),
  creative: document.getElementById('creative-count')
};

function getProjectFilter() {
  const active = document.querySelector('.filter-btn[aria-pressed="true"]');
  return active ? active.dataset.filter : 'all';
}

function setProjectFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function clearProjectFieldErrors() {
  ['project-title', 'project-category', 'project-description', 'project-stack', 'project-date', 'project-url', 'project-repo', 'project-image'].forEach((fieldId) => {
    setProjectFieldError(fieldId, '');
  });
}

function formatDate(value) {
  if (!value) return 'Not set';
  const date = new Date(value + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderProjectCards() {
  const projects = readProjects();
  const filter = getProjectFilter();
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.category === filter);

  projectSummary.total.textContent = String(projects.length);
  projectSummary.web.textContent = String(projects.filter((project) => project.category === 'web').length);
  projectSummary.creative.textContent = String(projects.filter((project) => project.category === 'creative').length);

  if (!projectList) return;
  projectList.innerHTML = visibleProjects.map((project) => {
    const techTags = project.techStack.map((tech) => '<li>' + tech + '</li>').join('');
    const projectLink = project.projectUrl && project.projectUrl !== '#home' ? project.projectUrl : '#';
    return `
      <article class="project-card reveal group grid gap-5 border-t-2 border-line py-6 border-l-4 border-l-transparent transition-colors hover:border-l-brand hover:bg-gradient-to-r hover:from-solid hover:to-blue-900/70 hover:text-white md:-mx-4 md:grid-cols-[1fr_15rem] md:px-4" data-category="${project.category}">
        <div>
          <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h3 class="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">${project.title}</h3>
            <div class="flex gap-2">
              <button type="button" data-action="edit" data-id="${project.id}" class="rounded-sm border-2 border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:border-brand hover:text-brand">Edit</button>
              <button type="button" data-action="delete" data-id="${project.id}" class="rounded-sm border-2 border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:border-rec hover:text-rec">Delete</button>
            </div>
          </div>
          <p class="mt-3 max-w-prose text-mute group-hover:text-white">${project.description}</p>
          <ul class="mt-3 flex flex-wrap gap-x-4 font-mono text-sm text-brand group-hover:text-white">${techTags}</ul>
          <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-mute">
            <span>Completed: ${formatDate(project.date)}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="inline-block rounded-sm border-2 border-current px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white hover:text-solid">View Project</a>
            <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="inline-block rounded-sm border-2 border-current px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white hover:text-solid">Repository</a>
          </div>
        </div>
        <img src="${project.image}" alt="Project preview for ${project.title}" class="aspect-video w-full rounded-sm border-2 border-line object-cover transition duration-300 group-hover:rotate-2 group-hover:scale-105">
      </article>
    `;
  }).join('');

  noProjects.classList.toggle('hidden', visibleProjects.length > 0);
  setupRevealObserver();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    renderProjectCards();
    document.getElementById('project-success').classList.add('hidden');
    document.getElementById('project-success').textContent = '';
    if (filter === 'all' || filter === 'web' || filter === 'creative') {
      return;
    }
  });
});

function resetProjectForm() {
  projectForm.reset();
  projectIdInput.value = '';
  cancelEditButton.classList.add('hidden');
  clearProjectFieldErrors();
  projectSuccess.classList.add('hidden');
  projectSuccess.textContent = '';
}

function fillProjectForm(project) {
  projectIdInput.value = project.id;
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-category').value = project.category;
  document.getElementById('project-description').value = project.description;
  document.getElementById('project-stack').value = project.techStack.join(', ');
  document.getElementById('project-date').value = project.date;
  document.getElementById('project-url').value = project.projectUrl;
  document.getElementById('project-repo').value = project.repoUrl;
  document.getElementById('project-image').value = project.image;
  cancelEditButton.classList.remove('hidden');
  clearProjectFieldErrors();
  projectSuccess.classList.add('hidden');
  projectSuccess.textContent = '';
  window.scrollTo({ top: document.getElementById('projects').offsetTop - 70, behavior: 'smooth' });
}

function validateProjectForm() {
  clearProjectFieldErrors();
  const title = document.getElementById('project-title').value.trim();
  const category = document.getElementById('project-category').value;
  const description = document.getElementById('project-description').value.trim();
  const techStack = document.getElementById('project-stack').value.split(',').map((item) => item.trim()).filter(Boolean);
  const date = document.getElementById('project-date').value;
  const projectUrl = document.getElementById('project-url').value.trim();
  const repoUrl = document.getElementById('project-repo').value.trim();
  const image = document.getElementById('project-image').value.trim();

  let valid = true;

  if (!title || title.length < 2) { setProjectFieldError('project-title', 'Title is required and must be at least 2 characters.'); valid = false; }
  if (!category || !['web', 'creative'].includes(category)) { setProjectFieldError('project-category', 'Please select a valid category.'); valid = false; }
  if (!description || description.length < 20) { setProjectFieldError('project-description', 'Description must be at least 20 characters.'); valid = false; }
  if (techStack.length === 0) { setProjectFieldError('project-stack', 'Add at least one tech stack item.'); valid = false; }
  if (!date) { setProjectFieldError('project-date', 'Completion date is required.'); valid = false; }
  if (!projectUrl || !/^https?:\/\//i.test(projectUrl)) { setProjectFieldError('project-url', 'Please enter a valid project URL starting with http:// or https://'); valid = false; }
  if (!repoUrl || !/^https?:\/\//i.test(repoUrl)) { setProjectFieldError('project-repo', 'Please enter a valid repository URL.'); valid = false; }
  if (!image || !/^https?:\/\//i.test(image)) { setProjectFieldError('project-image', 'Please provide an image URL.'); valid = false; }

  return valid;
}

projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateProjectForm()) {
    projectSuccess.classList.add('hidden');
    projectSuccess.textContent = '';
    return;
  }

  const projects = readProjects();
  const projectData = {
    id: projectIdInput.value || 'project-' + Date.now(),
    title: document.getElementById('project-title').value.trim(),
    category: document.getElementById('project-category').value,
    description: document.getElementById('project-description').value.trim(),
    techStack: document.getElementById('project-stack').value.split(',').map((item) => item.trim()).filter(Boolean),
    date: document.getElementById('project-date').value,
    projectUrl: document.getElementById('project-url').value.trim(),
    repoUrl: document.getElementById('project-repo').value.trim(),
    image: document.getElementById('project-image').value.trim()
  };

  const existingIndex = projects.findIndex((project) => project.id === projectData.id);
  if (existingIndex >= 0) {
    projects.splice(existingIndex, 1, projectData);
    projectSuccess.textContent = 'Project updated successfully.';
  } else {
    projects.unshift(projectData);
    projectSuccess.textContent = 'Project created successfully.';
  }

  writeProjects(projects);
  renderProjectCards();
  resetProjectForm();
  projectSuccess.classList.remove('hidden');
  projectSuccess.textContent = existingIndex >= 0 ? 'Project updated successfully.' : 'Project created successfully.';
});

projectList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const projectId = button.dataset.id;
  const projects = readProjects();
  const project = projects.find((item) => item.id === projectId);

  if (!project) return;

  if (button.dataset.action === 'edit') {
    fillProjectForm(project);
    return;
  }

  if (button.dataset.action === 'delete') {
    const confirmed = window.confirm('Delete this project from the portfolio?');
    if (!confirmed) return;
    const updated = projects.filter((item) => item.id !== projectId);
    writeProjects(updated);
    renderProjectCards();
    resetProjectForm();
    projectSuccess.classList.remove('hidden');
    projectSuccess.textContent = 'Project deleted successfully.';
  }
});

cancelEditButton.addEventListener('click', resetProjectForm);
document.getElementById('reset-project-form').addEventListener('click', resetProjectForm);

if (projectForm && projectList && noProjects && filterButtons.length) {
  renderProjectCards();
}

