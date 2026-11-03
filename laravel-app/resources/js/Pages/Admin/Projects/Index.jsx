import { Head, Link, router } from '@inertiajs/react';

export default function Index({ projects = [], success = null }) {
    const handleDelete = (project) => {
        const confirmed = window.confirm(`Delete "${project.title}"? This action cannot be undone.`);

        if (confirmed) {
            router.delete(`/admin/projects/${project.id}`);
        }
    };

    return (
        <>
            <Head title="Project Manager" />

            <div className="admin-page">
                <div className="admin-ambient" aria-hidden="true" />
                <div className="admin-shell">
                    <header className="admin-header">
                        <div className="admin-intro">
                            <span className="admin-eyebrow"><span aria-hidden="true" />PORTFOLIO CONTROL ROOM</span>
                            <h1>Project manager</h1>
                            <p>Manage the work shown on your public portfolio.</p>
                        </div>
                        <div className="admin-actions">
                            <Link href="/admin/projects/create" className="button-primary">Add project</Link>
                            <Link href="/" className="button-secondary admin-portfolio-link">
                                <span aria-hidden="true">↗</span> View public portfolio
                            </Link>
                        </div>
                    </header>

                    {success ? <div className="flash-success" role="status">{success}</div> : null}

                    <section className="glass-panel admin-panel admin-panel--list">
                        <div className="list-header admin-panel-heading">
                            <div>
                                <span className="admin-panel-index">01 / LIBRARY</span>
                                <h2>Project list</h2>
                            </div>
                            <span className="admin-count"><strong>{String(projects.length).padStart(2, '0')}</strong> ITEMS</span>
                        </div>

                        <div className="project-list">
                            {projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <div key={project.id} className="admin-project-item" style={{ '--item-index': index }}>
                                        <div>
                                            <strong>{project.title}</strong>
                                            <small>
                                                {project.difficulty} • {project.featured ? 'Featured' : 'Standard'}
                                            </small>
                                        </div>

                                        <div className="admin-actions">
                                            <Link href={`/admin/projects/${project.id}/edit`} className="button-secondary">
                                                Edit
                                            </Link>
                                            <button type="button" className="delete-button" onClick={() => handleDelete(project)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No projects created yet. Add one to get started.</div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
