import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const navigation = [
    ['about', 'About'],
    ['services', 'Services'],
    ['skills', 'Skills'],
    ['journey', 'Journey'],
    ['projects', 'Projects'],
    ['youtube-performance', 'YouTube Analytics'],
    ['education', 'Education'],
    ['contact', 'Contact'],
];

const journeyStages = [
    ['Student', "I'm a BSIT student at Urdaneta City University, building a base in programming, networks and systems."],
    ['Learning', 'I study backend concepts, web fundamentals and security topics like HTTPS/TLS, and practice them in class.'],
    ['Building Projects', 'I turn what I learn into working projects, such as a staff dashboard concept and this portfolio.'],
    ['Developing Technical Skills', 'With every project I go deeper into JavaScript, backend development and responsive design.'],
    ['Future IT Professional', 'My goal is to join an IT team as a developer who can build reliable systems and explain them clearly.'],
];

const portraitImages = {
    center: '/images/profile.jpg',
    left: '/images/portrait-left.jpg',
    right: '/images/portrait-right.jpg',
    up: '/images/portrait-up.jpg',
    down: '/images/portrait-down.jpg',
};

const titleClass =
    'bg-gradient-to-b from-ink to-mute bg-clip-text font-display text-[15vw] font-black uppercase leading-none text-transparent sm:text-8xl xl:text-9xl';
const fieldClass =
    'w-full rounded-sm border-2 border-mute bg-bg px-4 py-3 text-ink transition focus:border-brand focus:shadow-[0_0_0_3px_rgb(96_150_255/0.35)]';
const buttonClass =
    'rounded-sm border-2 border-line px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgb(96_150_255/0.5)]';

export default function Index({ projects = [] }) {
    const [theme, setTheme] = useState('midnight');
    const [motionEnabled, setMotionEnabled] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [activeStage, setActiveStage] = useState(null);
    const [portraitDirection, setPortraitDirection] = useState('center');
    const [filter, setFilter] = useState('all');
    const [progress, setProgress] = useState(0);
    const [statsVisible, setStatsVisible] = useState(false);
    const [displayCounts, setDisplayCounts] = useState([0, 0, 0, 0]);
    const [cursorHover, setCursorHover] = useState(false);
    const [contact, setContact] = useState({ name: '', email: '', message: '' });
    const [contactErrors, setContactErrors] = useState({});
    const [contactSuccess, setContactSuccess] = useState('');
    const cursorRef = useRef(null);
    const portraitFrameRef = useRef(null);
    const cursorPosition = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    const visibleProjects = useMemo(
        () =>
            projects.filter((project) => {
                if (filter === 'all') return true;
                if (filter === 'web') return project.category === 'Web Development';
                return project.category === 'Creative';
            }),
        [filter, projects],
    );

    useEffect(() => {
        try {
            setTheme(localStorage.getItem('theme') || 'midnight');
            setMotionEnabled(
                localStorage.getItem('motion')
                    ? localStorage.getItem('motion') !== 'off'
                    : !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            );
        } catch {
            setMotionEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('theme-charcoal', theme === 'charcoal');
        document.documentElement.classList.toggle('reduce-motion', !motionEnabled);
    }, [motionEnabled, theme]);

    useEffect(() => {
        const updateProgress = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll('main section[id]');
        if (!('IntersectionObserver' in window)) return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px' },
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!motionEnabled || !('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
            return undefined;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15 },
        );
        document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [motionEnabled, projects.length]);

    useEffect(() => {
        const stats = document.getElementById('about-stats');
        if (!stats || !motionEnabled || !('IntersectionObserver' in window)) {
            setStatsVisible(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setStatsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.6 },
        );
        observer.observe(stats);
        return () => observer.disconnect();
    }, [motionEnabled]);

    useEffect(() => {
        if (!statsVisible) return undefined;
        const targets = [3, 3, 70, 3];
        if (!motionEnabled) {
            setDisplayCounts(targets);
            return undefined;
        }

        let frame;
        let startTime;
        const animateCounts = (time) => {
            if (startTime === undefined) startTime = time;
            const progress = Math.min((time - startTime) / 1000, 1);
            setDisplayCounts(targets.map((target) => Math.floor(target * progress)));
            if (progress < 1) frame = requestAnimationFrame(animateCounts);
        };
        frame = requestAnimationFrame(animateCounts);
        return () => cancelAnimationFrame(frame);
    }, [motionEnabled, statsVisible]);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor || !motionEnabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            return undefined;
        }

        let frame;
        const onMouseMove = (event) => {
            cursorPosition.current.targetX = event.clientX;
            cursorPosition.current.targetY = event.clientY;
        };
        const onMouseOver = (event) => {
            setCursorHover(Boolean(event.target.closest('a, button, input, textarea')));
        };
        const followCursor = () => {
            const position = cursorPosition.current;
            position.x += (position.targetX - position.x) * 0.2;
            position.y += (position.targetY - position.y) * 0.2;
            cursor.style.transform = `translate(${position.x}px, ${position.y}px)`;
            frame = requestAnimationFrame(followCursor);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        frame = requestAnimationFrame(followCursor);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(frame);
        };
    }, [motionEnabled]);

    const changeTheme = () => {
        const nextTheme = theme === 'charcoal' ? 'midnight' : 'charcoal';
        setTheme(nextTheme);
        try {
            localStorage.setItem('theme', nextTheme);
        } catch {
            // The visual preference still applies for this page view.
        }
    };

    const changeMotion = () => {
        const nextMotion = !motionEnabled;
        setMotionEnabled(nextMotion);
        if (!nextMotion) setPortraitDirection('center');
        try {
            localStorage.setItem('motion', nextMotion ? 'on' : 'off');
        } catch {
            // The visual preference still applies for this page view.
        }
    };

    const timecode = Math.round(progress * 180);
    const timecodeLabel = `${String(Math.floor(timecode / 60)).padStart(2, '0')}:${String(timecode % 60).padStart(2, '0')}:${String(Math.floor((progress * 180 * 30) % 30)).padStart(2, '0')}`;

    const submitContact = (event) => {
        event.preventDefault();
        const errors = {};
        if (contact.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
            errors.email = 'Please enter a valid email, like name@example.com.';
        }
        if (contact.message.trim().length < 10) errors.message = 'Please write a message of at least 10 characters.';
        setContactErrors(errors);
        setContactSuccess('');
        if (Object.keys(errors).length === 0) {
            setContactSuccess(`Thanks, ${contact.name.trim()}. Your message passed validation. (This demo form does not send messages.)`);
            setContact({ name: '', email: '', message: '' });
        }
    };

    const moveHeroSpotlight = (event) => {
        if (!motionEnabled) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        event.currentTarget.style.setProperty('--spotlight-x', `${x}%`);
        event.currentTarget.style.setProperty('--spotlight-y', `${y}%`);

        if (
            !['mouse', 'pen'].includes(event.pointerType) ||
            !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
            !portraitFrameRef.current
        ) return;

        const portraitBounds = portraitFrameRef.current.getBoundingClientRect();
        const offsetX = (event.clientX - (portraitBounds.left + portraitBounds.width / 2)) / portraitBounds.width;
        const offsetY = (event.clientY - (portraitBounds.top + portraitBounds.height / 2)) / portraitBounds.height;
        const horizontalDistance = Math.abs(offsetX);
        const verticalDistance = Math.abs(offsetY);

        if (Math.max(horizontalDistance, verticalDistance) < 0.2) {
            setPortraitDirection('center');
        } else if (horizontalDistance >= verticalDistance) {
            setPortraitDirection(offsetX < 0 ? 'left' : 'right');
        } else {
            setPortraitDirection(offsetY < 0 ? 'up' : 'down');
        }
    };

    const moveProjectCard = (event) => {
        if (!motionEnabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
        event.currentTarget.style.setProperty('--shine-x', `${x * 100}%`);
        event.currentTarget.style.setProperty('--shine-y', `${y * 100}%`);
    };

    const resetProjectCard = (event) => {
        event.currentTarget.style.removeProperty('--tilt-x');
        event.currentTarget.style.removeProperty('--tilt-y');
        event.currentTarget.style.removeProperty('--shine-x');
        event.currentTarget.style.removeProperty('--shine-y');
    };

    const renderProject = (project) => {
        const technologies = (project.tech_stack || '').split(',').map((tech) => tech.trim()).filter(Boolean);
        const completedDate = project.completed_date
            ? new Date(`${project.completed_date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
            : 'Date not set';
        const opensNewTab = project.project_url?.startsWith('http');

        return (
            <article
                key={project.id}
                className="project-card reveal group grid gap-5 border-t-2 border-line border-l-4 border-l-transparent py-6 transition-colors hover:border-l-brand hover:bg-gradient-to-r hover:from-solid hover:to-blue-900/70 hover:text-white md:-mx-4 md:grid-cols-[1fr_15rem] md:px-4"
                data-category={project.category}
                onPointerMove={moveProjectCard}
                onPointerLeave={resetProjectCard}
            >
                <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
                            {project.title}
                        </h3>
                        <span className="rounded-sm border-2 border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                            {project.category}
                        </span>
                    </div>
                    <p className="mt-3 max-w-prose text-mute group-hover:text-white">{project.excerpt}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 font-mono text-sm text-brand group-hover:text-white">
                        {technologies.map((tech) => <li key={`${project.id}-${tech}`}>{tech}</li>)}
                    </ul>
                    {project.description !== project.excerpt ? (
                        <p className="mt-3 max-w-prose text-sm text-mute group-hover:text-white">{project.description}</p>
                    ) : null}
                    <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-mute">
                        <span>Completed: {completedDate}</span>
                        <span>Difficulty:{project.difficulty}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {project.project_url ? (
                            <a
                                href={project.project_url}
                                target={opensNewTab ? '_blank' : undefined}
                                rel={opensNewTab ? 'noopener noreferrer' : undefined}
                                className="inline-block rounded-sm border-2 border-current px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white hover:text-solid"
                            >
                                View Project
                            </a>
                        ) : null}
                        {project.github_url ? (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded-sm border-2 border-current px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white hover:text-solid"
                            >
                                Repository
                            </a>
                        ) : null}
                    </div>
                </div>
                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={`Project preview for ${project.title}`}
                        className="aspect-video w-full rounded-sm border-2 border-line object-cover transition duration-300 group-hover:rotate-2 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="aspect-video w-full rounded-sm border-2 border-line bg-gradient-to-br from-solid to-blue-900" aria-hidden="true" />
                )}
            </article>
        );
    };

    return (
        <>
            <Head title="Dwayne Arjon T. Santiago | IT Student Portfolio">
                <meta
                    name="description"
                    content="Portfolio of Dwayne Arjon T. Santiago, a BSIT student focused on backend development, web development and video editing."
                />
            </Head>
            <div className={`min-h-screen overflow-x-hidden bg-bg font-sans text-ink antialiased transition-colors duration-300 ${motionEnabled ? '' : 'reduce-motion'}`}>
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-rec focus:px-4 focus:py-2 focus:text-white">
                    Skip to content
                </a>

                <header className="sticky top-0 z-40 border-b-2 border-line bg-bg/95 backdrop-blur">
                    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8" aria-label="Main navigation">
                        <a href="#home" aria-label="Dwayne Santiago, back to top" className="font-display text-2xl font-black uppercase tracking-wide">
                            <span aria-hidden="true" className="sm:hidden">DS</span>
                            <span aria-hidden="true" className="hidden sm:inline">D. Santiago</span>
                        </a>
                        <ul className="hidden items-center gap-6 xl:flex">
                            {navigation.map(([id, label]) => (
                                <li key={id}>
                                    <a
                                        className="nav-link border-b-2 border-transparent py-1 text-sm text-mute transition hover:border-brand hover:text-ink aria-[current=true]:border-rec aria-[current=true]:font-bold aria-[current=true]:text-ink"
                                        href={`#${id}`}
                                        aria-current={activeSection === id ? 'true' : 'false'}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2">
                            <span aria-hidden="true" className="hidden font-mono text-sm sm:inline">{timecodeLabel}</span>
                            <button
                                type="button"
                                aria-label={`Switch color theme (current: ${theme === 'charcoal' ? 'Charcoal' : 'Midnight'})`}
                                onClick={changeTheme}
                                className="rounded-sm border-2 border-line px-2 py-1.5 text-xs font-medium transition hover:border-brand hover:shadow-[0_0_16px_rgb(96_150_255/0.5)] sm:px-3 sm:text-sm"
                            >
                                {theme === 'charcoal' ? 'Charcoal' : 'Midnight'}
                            </button>
                            <button
                                type="button"
                                aria-pressed={motionEnabled}
                                onClick={changeMotion}
                                className="rounded-sm border-2 border-line px-2 py-1.5 text-xs font-medium transition hover:border-brand sm:px-3 sm:text-sm"
                            >
                                Motion {motionEnabled ? 'On' : 'Off'}
                            </button>
                            <button
                                type="button"
                                className="rounded-sm border-2 border-line px-3 py-1.5 text-sm font-medium xl:hidden"
                                aria-expanded={mobileOpen}
                                aria-controls="mobile-menu"
                                onClick={() => setMobileOpen((open) => !open)}
                            >
                                Menu
                            </button>
                        </div>
                    </nav>
                    <ul id="mobile-menu" className={`${mobileOpen ? 'grid' : 'hidden'} grid-cols-2 border-t-2 border-line px-5 pb-3 xl:hidden`}>
                        {navigation.map(([id, label]) => (
                            <li key={id}>
                                <a className="block py-3 text-lg font-medium" href={`#${id}`} onClick={() => setMobileOpen(false)}>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div
                        className="absolute -bottom-0.5 left-0 h-[3px] bg-gradient-to-r from-brand to-rec"
                        style={{ width: `${progress * 100}%` }}
                        aria-hidden="true"
                    />
                </header>

                <main id="main">
                    <section
                        id="home"
                        className="portfolio-hero relative flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-hidden bg-gradient-to-br from-bg via-solid to-blue-900 pt-8 text-white"
                        aria-labelledby="hero-title"
                        onPointerMove={moveHeroSpotlight}
                        onPointerLeave={() => setPortraitDirection('center')}
                    >
                        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-brand/20 blur-3xl" />
                        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
                            <p className="flex flex-wrap items-center gap-x-4 font-mono text-sm">
                                <span className="flex items-center gap-2"><span className="h-2 w-2 animate-blink rounded-full bg-rec" />OPEN TO OPPORTUNITIES</span>
                                <span>BSIT 3</span>
                                <span>Urdaneta City University</span>
                            </p>
                            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:gap-10">
                                <h1 id="hero-title" className="min-w-0 font-display text-[12vw] font-black uppercase leading-[0.9] tracking-tight sm:text-[8vw] lg:text-8xl xl:text-9xl">
                                    <span className="block overflow-hidden"><span className="block animate-up [animation-delay:.05s]">Dwayne Arjon T.</span></span>
                                    <span className="block overflow-hidden"><span className="block animate-up [animation-delay:.2s]">Santiago</span></span>
                                </h1>
                                <figure className="order-first shrink-0 self-start animate-float sm:order-last sm:self-auto">
                                    <div ref={portraitFrameRef} className="portrait-frame w-32 rounded-md bg-gradient-to-br from-brand via-solid to-rec bg-[length:300%_300%] p-[3px] sm:w-40 md:w-48 lg:w-60 xl:w-72">
                                        <div className="portrait-frame__stage relative aspect-[4/5] overflow-hidden rounded-sm">
                                            {Object.entries(portraitImages).map(([direction, src]) => (
                                                <img
                                                    key={direction}
                                                    src={src}
                                                    alt={direction === portraitDirection ? 'Portrait of Dwayne Arjon T. Santiago' : ''}
                                                    aria-hidden={direction !== portraitDirection}
                                                    className={`portrait-frame__image absolute inset-0 h-full w-full object-cover object-top ${direction === portraitDirection ? 'is-active' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </figure>
                            </div>
                            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
                                <div>
                                    <p className="font-display text-4xl font-black uppercase leading-none sm:text-5xl">Code by day, edits by night.</p>
                                    <p className="mt-3 font-display text-xl font-extrabold uppercase tracking-wide text-brand sm:text-2xl">IT Student • Backend Developer • Creative Editor</p>
                                    <p className="mt-3 max-w-3xl text-lg text-white">Based in Urdaneta City, Pangasinan. I build the logic behind web apps and cut the videos that go with them. Third-year BSIT student, 70 videos in the bag and counting.</p>
                                </div>
                                <div className="flex flex-wrap gap-3 xl:justify-end">
                                    <a href="#projects" className="animate-pulsering rounded-sm bg-gradient-to-r from-brand to-cyan-300 bg-[length:200%_100%] px-6 py-3 font-bold text-bg transition-all duration-500 hover:-translate-y-1 hover:bg-right hover:shadow-[0_10px_30px_-8px_rgb(96_150_255/0.8)]">View My Work</a>
                                    <a href="#contact" className="rounded-sm border-2 border-slate-500 px-6 py-3 font-bold transition hover:-translate-y-1 hover:border-brand hover:text-brand">Contact Me</a>
                                </div>
                            </div>
                        </div>
                        <a
                            href="#about"
                            className="hero-scroll-cue absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 transition hover:text-white sm:flex"
                            aria-label="Scroll to About me"
                        >
                            <span>Scroll to explore</span>
                            <span aria-hidden="true" className="text-xl">↓</span>
                        </a>
                        <div className="relative mt-10 overflow-hidden border-t-2 border-white/40 py-3" aria-hidden="true">
                            <div className="flex w-max animate-ticker gap-10 whitespace-nowrap font-display text-2xl font-extrabold uppercase hover:[animation-play-state:paused]">
                                <span>Code by day / Edits by night / Backend Development / Web Development / Video Editing / HTML CSS JavaScript /</span>
                                <span>Code by day / Edits by night / Backend Development / Web Development / Video Editing / HTML CSS JavaScript /</span>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="about-section relative isolate overflow-hidden py-20" aria-labelledby="about-title">
                        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
                            <h2 id="about-title" className={titleClass}>About me</h2>
                            <div className="about-layout mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-stretch">
                                <div>
                                    <div className="reveal mb-8 flex items-center gap-4">
                                        <div role="img" aria-label="Avatar placeholder with the initials DS" className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-line bg-gradient-to-br from-panel to-solid font-display text-3xl font-black text-brand about-avatar">DS</div>
                                        <div>
                                            <p className="font-display text-2xl font-extrabold uppercase">Dwayne Arjon T. Santiago</p>
                                            <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-brand">IT student · backend · creative</p>
                                        </div>
                                    </div>
                                    <div className="reveal">
                                        <p className="max-w-prose text-xl">I'm a third-year IT student interested in backend and web development. I also have experience and interest in video editing and digital content creation. I want to keep improving my technical skills by building useful, functional and creative projects.</p>
                                        <div className="about-info-card mt-8 border-2 border-line bg-gradient-to-br from-panel to-bg transition duration-300 hover:border-brand hover:shadow-[0_0_0_1px_rgb(96_150_255),0_14px_40px_-12px_rgb(96_150_255/0.55)]">
                                            <div className="about-info-bar h-9 border-b-2 border-line bg-[repeating-linear-gradient(135deg,rgb(var(--line))_0_18px,rgb(var(--bg))_18px_36px)]" />
                                            <dl className="grid divide-y-2 divide-line sm:grid-cols-2 sm:divide-y-0">
                                                <div className="p-4 sm:border-b-2 sm:border-r-2 sm:border-line"><dt className="font-mono text-xs text-mute">PROGRAM</dt><dd className="font-bold">BS Information Technology, 3rd Year</dd></div>
                                                <div className="p-4 sm:border-b-2 sm:border-line"><dt className="font-mono text-xs text-mute">SCHOOL</dt><dd className="font-bold">Urdaneta City University</dd></div>
                                                <div className="p-4 sm:border-r-2 sm:border-line"><dt className="font-mono text-xs text-mute">CAREER GOAL</dt><dd className="font-bold">Backend and web developer with creative content skills</dd></div>
                                                <div className="p-4"><dt className="font-mono text-xs text-mute">STRENGTHS</dt><dd className="font-bold">Problem solving, adaptability, learning by building</dd></div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <aside className="about-showcase reveal" aria-label="About Dwayne">
                                    <div className="about-orbit" aria-hidden="true">
                                        <span className="about-orbit__ring about-orbit__ring--outer" />
                                        <span className="about-orbit__ring about-orbit__ring--inner" />
                                        <span className="about-orbit__core">DS</span>
                                        <span className="about-orbit__satellite" />
                                    </div>
                                    <p className="about-showcase__eyebrow">ABOUT / 001</p>
                                    <p className="about-showcase__title">Curious by nature.<br /><span>Building with purpose.</span></p>
                                    <div className="about-showcase__rule" />
                                    <div className="about-showcase__footer">
                                        <span>URDANETA CITY</span>
                                        <span>PHILIPPINES · BSIT 03</span>
                                    </div>
                                </aside>
                            </div>
                        </div>
                        <div id="about-stats" className="relative z-10 mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 px-5 sm:px-8 lg:grid-cols-4">
                            {[
                                ['rd', 'Year level', 'BS Information Technology'],
                                ['', 'Years editing videos', 'and still hitting export'],
                                ['', 'Videos edited', 'give or take a few retakes'],
                                ['', 'Core technologies', 'HTML, CSS and JavaScript'],
                            ].map(([suffix, label, detail], index) => (
                                <div key={label} className="about-stats-card reveal rounded-sm border-2 border-line bg-gradient-to-br from-panel to-bg p-5 transition hover:-translate-y-1 hover:border-brand hover:shadow-[0_0_0_1px_rgb(96_150_255),0_14px_40px_-12px_rgb(96_150_255/0.55)]">
                                    <p className="font-display text-6xl font-black leading-none"><span>{displayCounts[index]}</span><span>{suffix}</span></p>
                                    <p className="mt-2 font-bold">{label}</p><p className="text-sm text-mute">{detail}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="services" className="detail-section detail-section--services mx-auto max-w-7xl px-5 pb-20 sm:px-8" aria-labelledby="services-title">
                        <h2 id="services-title" className={titleClass}>Services</h2>
                        <div className="service-grid mt-12 grid gap-5 md:grid-cols-2">
                            {[
                                ['Video editing', 'I edit videos and create digital content, from cutting and pacing to polishing the final result.', ['CapCut', 'Content editing']],
                                ['Simple websites', 'I build responsive, clean websites using HTML5, Tailwind CSS and vanilla JavaScript.', ['HTML5', 'Tailwind CSS', 'JavaScript']],
                            ].map(([heading, description, tools], index) => (
                                <article key={heading} className="service-card reveal group border-2 border-line bg-gradient-to-br from-panel to-bg p-6 transition hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_0_0_1px_rgb(96_150_255),0_14px_40px_-12px_rgb(96_150_255/0.55)]">
                                    <div className="service-card__top">
                                        <span className="service-card__number">0{index + 1}</span>
                                        <span className="service-card__type">{index === 0 ? 'CREATIVE' : 'WEB DEVELOPMENT'}</span>
                                    </div>
                                    <h3 className="service-card__title font-display text-4xl font-extrabold uppercase leading-none">{heading}</h3>
                                    <p className="mt-3 max-w-xl text-mute">{description}</p>
                                    <ul className="service-card__tools mt-6 flex flex-wrap gap-2 font-mono text-sm text-brand">{tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="skills" className="detail-section detail-section--skills mx-auto max-w-7xl px-5 pb-20 sm:px-8" aria-labelledby="skills-title">
                        <h2 id="skills-title" className={titleClass}>Skills</h2>
                        <div className="skill-groups mt-12 grid gap-4 sm:grid-cols-2">
                            {[
                                ['V1', 'Technical', ['HTML5', 'CSS', 'JavaScript', 'Tailwind CSS', 'Backend Development', 'Responsive Web Design']],
                                ['V2', 'Creative', ['Video Editing', 'Content Editing', 'Visual Design']],
                                ['T1', 'Tools', ['VS Code', 'CapCut', 'Canva', 'Photoshop']],
                                ['A1', 'Soft skills', ['Problem Solving', 'Communication', 'Adaptability', 'Continuous Learning']],
                            ].map(([code, heading, skills]) => (
                                <article key={code} className="skill-card reveal">
                                    <div className="skill-card__heading">
                                        <span className="skill-card__code">{code}</span>
                                        <h3 className="font-display text-3xl font-extrabold uppercase">{heading}</h3>
                                    </div>
                                    <ul className="skill-card__list flex flex-wrap gap-2">
                                        {skills.map((skill) => <li key={skill} className="skill-chip rounded-sm border-2 border-line px-3 py-1 text-sm font-medium transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-bg hover:shadow-[0_0_16px_rgb(96_150_255/0.5)]">{skill}</li>)}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="journey" className="journey-section relative isolate overflow-hidden px-5 py-20 sm:px-8" aria-labelledby="journey-title">
                        <div className="mx-auto max-w-7xl">
                            <div className="journey-heading">
                                <div>
                                    <p className="journey-kicker">LEARNING IN PROGRESS / 01—05</p>
                                    <h2 id="journey-title" className={titleClass}>Developer Journey</h2>
                                </div>
                                <p className="journey-instruction">Select a stage to explore the path.</p>
                            </div>
                            <div className="journey-timeline relative mt-12">
                                <div className="journey-rail absolute left-[10%] right-[10%] top-3 h-1 bg-line">
                                    <div className="h-full bg-gradient-to-r from-brand to-rec transition-[width] duration-500" style={{ width: activeStage === null ? 0 : `${(activeStage / 4) * 100}%` }} />
                                </div>
                                <ol className="journey-stage-list grid grid-cols-5 gap-1 max-[639px]:grid-cols-1">
                                    {journeyStages.map(([heading], index) => (
                                        <li key={heading} className="journey-stage">
                                            <button type="button" className="journey-stage__button group flex w-full flex-col items-center gap-3 text-center max-[639px]:flex-row max-[639px]:justify-start max-[639px]:gap-4" aria-pressed={activeStage === index} aria-controls="journey-stage-detail" onClick={() => setActiveStage(index)}>
                                                <span className={`journey-stage__marker relative z-10 h-6 w-6 rounded-full border-2 bg-bg transition group-hover:scale-125 max-[639px]:h-4 max-[639px]:w-4 max-[639px]:shrink-0 ${activeStage === index ? 'scale-125 border-rec bg-rec shadow-[0_0_0_6px_rgb(239_83_80/0.3)]' : 'border-mute'}`} />
                                                <span className={`journey-stage__label break-words text-[11px] leading-tight sm:text-sm ${activeStage === index ? 'font-bold' : 'font-medium'}`}>{heading}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div id="journey-stage-detail" className="journey-detail mt-10" aria-live="polite">
                                <span className="journey-detail__index">{activeStage === null ? 'SELECT A STAGE' : `STAGE 0${activeStage + 1}`}</span>
                                <p className="journey-detail__text text-xl text-mute">{activeStage === null ? 'Choose a point on the timeline to see what I am learning and working toward.' : journeyStages[activeStage][1]}</p>
                            </div>
                        </div>
                    </section>

                    <section id="projects" className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-labelledby="projects-title">
                        <div>
                            <h2 id="projects-title" className={titleClass}>Projects</h2>
                        </div>
                        <p className="mt-4 max-w-2xl text-lg text-mute">Selected web and creative work. Projects are managed through the Laravel admin dashboard.</p>
                        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
                            {[
                                ['all', 'All'],
                                ['web', 'Web Development'],
                                ['creative', 'Creative'],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`${buttonClass} ${filter === value ? 'border-brand bg-brand font-bold text-bg' : ''}`}
                                    aria-pressed={filter === value}
                                    onClick={() => setFilter(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-10 border-b-2 border-line">
                            {visibleProjects.map(renderProject)}
                            {visibleProjects.length === 0 ? (
                                <p className="mt-6 border-2 border-dashed border-line p-5" role="status">
                                    {projects.length === 0 ? 'No projects have been added yet.' : 'No projects in this category yet. Try another filter.'}
                                </p>
                            ) : null}
                        </div>
                    </section>

                    <section id="youtube-performance" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8" aria-labelledby="youtube-performance-title">
                        <h2 id="youtube-performance-title" className={titleClass}>YouTube Performance</h2>
                        <p className="mt-4 max-w-2xl text-lg text-mute">A snapshot of my YouTube channel analytics and video content performance.</p>
                        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                            <figure className="overflow-hidden rounded-sm border-2 border-line bg-panel p-2 transition duration-300 hover:border-brand hover:shadow-[0_0_0_1px_rgb(96_150_255),0_14px_40px_-12px_rgb(96_150_255/0.35)]">
                                <img src="/images/ytchannel.png" alt="Screenshot of my YouTube Studio channel analytics" className="w-full rounded-sm object-contain" loading="lazy" />
                                <figcaption className="mt-2 px-2 pb-1 text-sm text-mute">YouTube Studio analytics screenshot</figcaption>
                            </figure>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {[
                                    ['VIEWS', '279K+', 'Views shown in the analytics screenshot'],
                                    ['WATCH TIME', '605.2', 'Hours of watch time'],
                                    ['SUBSCRIBERS', '+394', 'Subscribers gained in the shown period'],
                                ].map(([label, amount, description], index) => (
                                    <article key={label} className={`reveal rounded-sm border-2 border-line bg-gradient-to-br from-panel to-bg p-6 transition hover:-translate-y-1 hover:border-brand ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                                        <p className="font-mono text-xs text-mute">{label}</p>
                                        <p className="mt-2 font-display text-5xl font-black text-brand">{amount}</p>
                                        <p className="mt-1 text-sm text-mute">{description}</p>
                                    </article>
                                ))}
                                <a href="https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q" target="_blank" rel="noopener noreferrer" className="inline-block rounded-sm bg-gradient-to-r from-brand to-cyan-300 px-6 py-3 text-center font-bold text-bg transition hover:-translate-y-1 hover:shadow-[0_10px_30px_-8px_rgb(96_150_255/0.8)]">Visit My YouTube Channel ↗</a>
                            </div>
                        </div>
                    </section>

                    <section id="education" className="detail-section detail-section--education mx-auto max-w-7xl px-5 pb-20 sm:px-8" aria-labelledby="edu-title">
                        <h2 id="edu-title" className={titleClass}>Education</h2>
                        <ol className="education-list mt-12 grid gap-4 md:grid-cols-3">
                            {[
                                ['Education', <><strong className="text-ink">BS Information Technology</strong>, Urdaneta City University, 3rd Year</>],
                                ['Coursework', <><strong className="text-ink">Advanced Web Development (IT ELEC01)</strong> and a Cryptography Protocols Laboratory covering HTTPS/TLS and VPN concepts.</>],
                                ['Experience', <><strong className="text-ink">Video editing and digital content creation</strong>, about 3 years and around 70 videos edited using CapCut.</>],
                            ].map(([heading, description], index) => (
                                <li key={heading} className="education-card reveal">
                                    <span className="education-card__index" aria-hidden="true">0{index + 1}</span>
                                    <h3 className="education-card__title font-display text-2xl font-extrabold uppercase">{heading}</h3>
                                    <p className="education-card__description text-mute">{description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section id="contact" className="bg-gradient-to-tr from-blue-900 via-solid to-bg px-5 py-20 text-white sm:px-8" aria-labelledby="contact-title">
                        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
                            <div>
                                <h2 id="contact-title" className={titleClass}>Let's work together</h2>
                                <p className="mt-6 max-w-md text-lg">Got a video to cut or a site to build? Say hi.</p>
                                <ul className="mt-6 space-y-3 font-medium">
                                    <li><a className="underline underline-offset-4 hover:no-underline" href="mailto:dwayne26arjon@gmail.com">Email: dwayne26arjon@gmail.com</a></li>
                                    <li><a href="https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">YouTube channel (opens in new tab)</a></li>
                                    <li>Based in Urdaneta City, Pangasinan, Philippines</li>
                                </ul>
                            </div>
                            <form noValidate className="space-y-4 self-end" onSubmit={submitContact}>
                                {[
                                    ['name', 'Name', 'text', 'name'],
                                    ['email', 'Email', 'email', 'email'],
                                ].map(([name, label, type, autocomplete]) => (
                                    <div key={name}>
                                        <label htmlFor={`contact-${name}`} className="mb-1 block text-sm font-bold">{label}</label>
                                        <input
                                            id={`contact-${name}`}
                                            type={type}
                                            autoComplete={autocomplete}
                                            aria-describedby={`${name}-error`}
                                            aria-invalid={Boolean(contactErrors[name])}
                                            value={contact[name]}
                                            onChange={(event) => setContact({ ...contact, [name]: event.target.value })}
                                            className={fieldClass}
                                        />
                                        <p id={`${name}-error`} className="mt-1 text-sm font-semibold text-red-300">{contactErrors[name] || ''}</p>
                                    </div>
                                ))}
                                <div>
                                    <label htmlFor="contact-message" className="mb-1 block text-sm font-bold">Message</label>
                                    <textarea
                                        id="contact-message"
                                        rows="5"
                                        aria-describedby="message-error"
                                        aria-invalid={Boolean(contactErrors.message)}
                                        value={contact.message}
                                        onChange={(event) => setContact({ ...contact, message: event.target.value })}
                                        className={fieldClass}
                                    />
                                    <p id="message-error" className="mt-1 text-sm font-semibold text-red-300">{contactErrors.message || ''}</p>
                                </div>
                                <button type="submit" className="rounded-sm bg-gradient-to-r from-brand to-cyan-300 bg-[length:200%_100%] px-8 py-3 font-bold text-bg transition-all duration-500 hover:-translate-y-1 hover:bg-right hover:shadow-[0_10px_30px_-8px_rgb(96_150_255/0.8)]">Send message</button>
                                {contactSuccess ? <p role="status" className="rounded-sm border-2 border-brand bg-panel p-4 font-semibold text-ink">{contactSuccess}</p> : null}
                            </form>
                        </div>
                    </section>
                </main>

                <footer className="bg-gradient-to-b from-bg to-slate-950 text-slate-300">
                    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
                        <div>
                            <p className="font-display text-2xl font-black uppercase text-white">Dwayne Arjon T. Santiago</p>
                            <p className="mt-2 text-sm">Aspiring IT professional building useful, functional and creative projects.</p>
                        </div>
                        <nav aria-label="Footer navigation">
                            <ul className="space-y-2 text-sm">
                                {['about', 'projects', 'youtube-performance', 'contact'].map((id) => (
                                    <li key={id}><a className="hover:text-white hover:underline" href={`#${id}`}>{navigation.find(([navId]) => navId === id)?.[1]}</a></li>
                                ))}
                            </ul>
                        </nav>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:text-white hover:underline" href="mailto:dwayne26arjon@gmail.com">dwayne26arjon@gmail.com</a></li>
                            <li><a className="hover:text-white hover:underline" href="https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                            <li>Urdaneta City, Philippines</li>
                        </ul>
                    </div>
                    <p className="border-t border-slate-800 px-5 py-4 text-center text-sm">© {new Date().getFullYear()} Dwayne Arjon T. Santiago. Designed and built with Laravel, React &amp; Inertia.</p>
                </footer>
                <div ref={cursorRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block">
                    <div className={`h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand transition duration-200 ${cursorHover ? 'scale-150 bg-brand/20' : ''}`} />
                </div>
            </div>
        </>
    );
}
