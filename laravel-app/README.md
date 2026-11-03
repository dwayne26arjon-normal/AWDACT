# Laravel Portfolio CRUD with Inertia + React

This project is a Laravel + Inertia.js + React portfolio app that follows the assignment requirements for a database-backed portfolio section with full CRUD management.

## Features

- Public portfolio page that reads project records from the database
- Admin dashboard for creating, editing, and deleting portfolio projects
- Server-side validation using Laravel Form Requests
- Delete confirmation before removal
- Reusable React form component for create/edit flows
- Portfolio front end keeps the original dark blue/red palette, typography, sections, and imagery

## Tech stack

- Laravel 12
- Inertia.js
- React
- SQLite for local database storage
- Vite for asset compilation

## Project structure

- `app/Http/Controllers/ProjectController.php` - CRUD logic
- `app/Http/Requests/StoreProjectRequest.php` - create validation rules
- `app/Http/Requests/UpdateProjectRequest.php` - update validation rules
- `app/Models/Project.php` - database model
- `database/migrations/2026_11_02_070137_create_projects_table.php` - projects table
- `resources/js/Components/ProjectForm.jsx` - reusable project form
- `resources/js/Pages/Portfolio/Index.jsx` - public portfolio page
- `resources/js/Pages/Admin/Projects/Index.jsx` - project list and delete actions
- `resources/js/Pages/Admin/Projects/Create.jsx` - create project page
- `resources/js/Pages/Admin/Projects/Edit.jsx` - edit project page

## Validation rules included

The project uses more than five validation types, including:

- required
- string
- min
- max
- regex
- unique
- in
- boolean
- nullable
- url

## Run locally

```bash
cd laravel-app
composer install
npm install
php artisan migrate --seed
php artisan serve
```

Then open:

- Portfolio page: http://127.0.0.1:8000/
- Admin CRUD page: http://127.0.0.1:8000/admin/projects


## Run tests

```bash
php artisan test
```

## Demo guidance

To create the required demonstration video:

1. Open the public portfolio page and show the project cards.
2. Open `/admin/projects` and create a new project.
3. Demonstrate validation by intentionally submitting invalid data.
4. Edit an existing project and confirm the changes appear live.
5. Delete a project with the confirmation prompt.

## Notes

This project is structured so the public portfolio and admin CRUD are separated into distinct React pages and reusable components rather than placing everything in a single file.
