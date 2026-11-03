<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Oversmoke Admin Dashboard',
                'slug' => 'oversmoke-dashboard',
                'category' => 'Web Development',
                'excerpt' => 'An admin dashboard design for an online store, showing product and stock totals, low stock alerts, top selling products and a sales report.',
                'description' => 'An admin dashboard design for an online store, showing product and stock totals, low stock alerts, top selling products and a sales report.',
                'tech_stack' => 'Figma, UI Design, Laravel',
                'completed_date' => '2026-08-05',
                'project_url' => 'https://www.figma.com/design/muIBtk8NovFcZ84t9hHcSW/demo2?node-id=67-826&t=CjJ1eKMq6PXP9IZT-1',
                'github_url' => 'https://github.com/',
                'image_url' => '/images/oversmoke-dashboard.png',
            ],
            [
                'title' => 'Oversmoke Store UI Design',
                'slug' => 'oversmoke-store',
                'category' => 'Creative',
                'excerpt' => 'A Figma homepage design for an online shop, with a category and brand filter sidebar, a featured banner, a sortable product grid and an add-to-cart flow.',
                'description' => 'A Figma homepage design for an online shop, with a category and brand filter sidebar, a featured banner, a sortable product grid and an add-to-cart flow.',
                'tech_stack' => 'Figma, UI Design, Wireframing',
                'completed_date' => '2026-07-14',
                'project_url' => 'https://www.figma.com/design/muIBtk8NovFcZ84t9hHcSW/demo2?node-id=67-826&t=CjJ1eKMq6PXP9IZT-1',
                'github_url' => 'https://github.com/',
                'image_url' => '/images/figma-design.png',
            ],
            [
                'title' => 'Personal Portfolio Website',
                'slug' => 'portfolio-website',
                'category' => 'Web Development',
                'excerpt' => 'A responsive portfolio that showcases my technical skills, projects, education and creative work.',
                'description' => 'A responsive portfolio that showcases my technical skills, projects, education and creative work.',
                'tech_stack' => 'HTML, Tailwind CSS, JavaScript',
                'completed_date' => '2026-09-02',
                'project_url' => '#home',
                'github_url' => 'https://github.com/',
                'image_url' => '/images/placeholder.svg',
            ],
            [
                'title' => 'Video Editing on YouTube',
                'slug' => 'youtube-editing',
                'category' => 'Creative',
                'excerpt' => 'My YouTube channel, where my video work lives. I share edited content and visual storytelling projects.',
                'description' => 'My YouTube channel, where my video work lives. I share edited content and visual storytelling projects.',
                'tech_stack' => 'CapCut',
                'completed_date' => '2026-06-30',
                'project_url' => 'https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q',
                'github_url' => 'https://www.youtube.com/channel/UCuOyhQLtnnMiJHZPuaZqA3Q',
                'image_url' => '/images/ytchannel.png',
            ],
        ];

        Project::whereIn('slug', ['northwind-insights', 'aster-studio', 'harbor-commerce'])->delete();

        foreach ($projects as $project) {
            Project::updateOrCreate(
                ['slug' => $project['slug']],
                [...$project, 'featured' => false],
            );
        }
    }
}
