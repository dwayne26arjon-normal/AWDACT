import { Head, Link } from '@inertiajs/react';
import ProjectForm from '../../../Components/ProjectForm';

export default function Edit({ project, errors = {} }) {
    return (
        <>
            <Head title={`Edit ${project.title}`} />

            <div className="admin-page">
                <div className="admin-ambient" aria-hidden="true" />
                <div className="admin-shell">
                    <header className="admin-header">
                        <div className="admin-intro">
                            <span className="admin-eyebrow"><span aria-hidden="true" />PORTFOLIO CONTROL ROOM</span>
                            <h1>Edit project</h1>
                            <p>Update the details shown on your public portfolio.</p>
                        </div>
                        <div className="admin-actions">
                            <Link href="/admin/projects" className="button-secondary">Back to projects</Link>
                            <Link href="/" className="button-secondary admin-portfolio-link">
                                <span aria-hidden="true">↗</span> View public portfolio
                            </Link>
                        </div>
                    </header>

                    <section className="glass-panel admin-panel admin-panel--form">
                        <div className="list-header admin-panel-heading">
                            <span className="admin-panel-index">01 / CONTENT</span>
                            <h2>{project.title}</h2>
                        </div>
                        <ProjectForm project={project} errors={errors} />
                    </section>
                </div>
            </div>
        </>
    );
}
