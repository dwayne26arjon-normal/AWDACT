import { useForm } from '@inertiajs/react';

const defaultValues = {
    title: '',
    slug: '',
    category: 'Web Development',
    difficulty: '',
    excerpt: '',
    description: '',
    tech_stack: '',
    completed_date: '',
    project_url: '',
    github_url: '',
    image_url: '',
    featured: false,
};

export default function ProjectForm({ project = null, errors = {} }) {
    const isEditing = Boolean(project);
    const { data, setData, post, put, processing } = useForm({
        ...defaultValues,
        ...(project ?? {}),
        completed_date: project?.completed_date?.slice(0, 10) ?? '',
        featured: Boolean(project?.featured ?? false),
    });

    const submit = (event) => {
        event.preventDefault();

        if (isEditing) {
            put(`/admin/projects/${project.id}`);
            return;
        }

        post('/admin/projects');
    };

    return (
        <form onSubmit={submit}>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="title">Project title</label>
                    <input
                        id="title"
                        value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                        placeholder="Northwind Analytics"
                    />
                    {errors.title ? <span className="error-message">{errors.title}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="slug">Slug</label>
                    <input
                        id="slug"
                        value={data.slug}
                        onChange={(event) => setData('slug', event.target.value)}
                        placeholder="northwind-analytics"
                    />
                    {errors.slug ? <span className="error-message">{errors.slug}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={data.category}
                        onChange={(event) => setData('category', event.target.value)}
                    >
                        <option value="Web Development">Web Development</option>
                        <option value="Creative">Creative</option>
                        <option value="Web App">Web App</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="Branding">Branding</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Data">Data</option>
                    </select>
                    {errors.category ? <span className="error-message">{errors.category}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        value={data.difficulty}
                        onChange={(event) => setData('difficulty', event.target.value)}
                    >
                        <option value="">Select difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    {errors.difficulty ? <span className="error-message">{errors.difficulty}</span> : null}
                </div>
               
               <div className="field">
                    <label htmlFor="tech_stack">Tech stack</label>
                    <input
                        id="tech_stack"
                        value={data.tech_stack}
                        onChange={(event) => setData('tech_stack', event.target.value)}
                        placeholder="Laravel, React, Tailwind"
                    />
                    {errors.tech_stack ? <span className="error-message">{errors.tech_stack}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="completed_date">Completion date</label>
                    <input
                        id="completed_date"
                        type="date"
                        value={data.completed_date}
                        onChange={(event) => setData('completed_date', event.target.value)}
                    />
                    {errors.completed_date ? <span className="error-message">{errors.completed_date}</span> : null}
                </div>

                <div className="field full-span">
                    <label htmlFor="excerpt">Excerpt</label>
                    <input
                        id="excerpt"
                        value={data.excerpt}
                        onChange={(event) => setData('excerpt', event.target.value)}
                        placeholder="A SaaS dashboard for modern operations teams."
                    />
                    {errors.excerpt ? <span className="error-message">{errors.excerpt}</span> : null}
                </div>

                <div className="field full-span">
                    <label htmlFor="description">Detailed description</label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        placeholder="Describe your solution, challenges, and impact..."
                    />
                    {errors.description ? <span className="error-message">{errors.description}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="project_url">Project URL</label>
                    <input
                        id="project_url"
                        type="text"
                        value={data.project_url}
                        onChange={(event) => setData('project_url', event.target.value)}
                        placeholder="https://example.com"
                    />
                    {errors.project_url ? <span className="error-message">{errors.project_url}</span> : null}
                </div>

                <div className="field">
                    <label htmlFor="github_url">GitHub URL</label>
                    <input
                        id="github_url"
                        value={data.github_url}
                        onChange={(event) => setData('github_url', event.target.value)}
                        placeholder="https://github.com/username/project"
                    />
                    {errors.github_url ? <span className="error-message">{errors.github_url}</span> : null}
                </div>

                <div className="field full-span">
                    <label htmlFor="image_url">Image URL</label>
                    <input
                        id="image_url"
                        value={data.image_url}
                        onChange={(event) => setData('image_url', event.target.value)}
                        placeholder="https://images.unsplash.com/..."
                    />
                    {errors.image_url ? <span className="error-message">{errors.image_url}</span> : null}
                </div>

                <div className="field full-span checkbox-field">
                    <input
                        id="featured"
                        type="checkbox"
                        checked={data.featured}
                        onChange={(event) => setData('featured', event.target.checked)}
                    />
                    <label htmlFor="featured">Mark as featured project</label>
                </div>
            </div>

            <div className="form-actions">
                {isEditing ? (
                    <button type="button" className="secondary-button" onClick={() => window.location.href = '/admin/projects'}>
                        Cancel
                    </button>
                ) : null}
                <button type="submit" className="submit-button" disabled={processing}>
                    {processing ? 'Saving...' : isEditing ? 'Update project' : 'Create project'}
                </button>
            </div>
        </form>
    );
}
