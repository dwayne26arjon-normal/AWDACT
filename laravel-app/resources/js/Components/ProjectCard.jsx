export default function ProjectCard({ project }) {
    const technologies = (project.tech_stack || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4);

    return (
        <article className="project-card">
            <div
                className="project-card__media"
                style={{
                    backgroundImage: project.image_url ? `url(${project.image_url})` : 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(167, 139, 250, 0.2))',
                }}
            >
                <span className="project-card__badge">{project.category}</span>
                {project.featured ? <span className="project-card__featured">Featured</span> : null}
            </div>

            <div className="project-card__body">
                <h3>{project.title}</h3>
                <p className="project-card__excerpt">{project.excerpt}</p>

                <div className="project-card__chips">
                    {technologies.map((tech) => (
                        <span key={`${project.id}-${tech}`} className="project-card__chip">
                            {tech}
                        </span>
                    ))}
                </div>

                <p className="project-card__meta">{project.description}</p>

                <div className="project-card__links">
                    {project.project_url ? (
                        <a href={project.project_url} target="_blank" rel="noreferrer">
                            Live Demo
                        </a>
                    ) : null}
                    {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
