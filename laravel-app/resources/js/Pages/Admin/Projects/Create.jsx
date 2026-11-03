import { Head, Link } from '@inertiajs/react';
import ProjectForm from '../../../Components/ProjectForm';

export default function Create({ errors = {} }) {
    return (
        <>
            <Head title="Create project" />

            <div className="admin-page">
                <div className="admin-ambient" aria-hidden="true" />
                <div className="admin-shell">
                    <header className="admin-header">
                        <div className="admin-intro">
                            <span className="admin-eyebrow"><span aria-hidden="true" />PORTFOLIO CONTROL ROOM</span>
                            <h1>Create project</h1>
                            <p>Add a project to your public portfolio.</p>
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
                            <h2>Project details</h2>
                        </div>
                        <ProjectForm errors={errors} />
                    </section>
                </div>
            </div>
        </>
    );
}
