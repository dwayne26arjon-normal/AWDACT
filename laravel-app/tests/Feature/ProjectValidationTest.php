<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_and_edit_routes_render_dedicated_pages(): void
    {
        $this->get('/admin/projects')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Index'));

        $this->get('/admin/projects/create')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Create'));

        $project = Project::create($this->validProjectData());

        $this->get("/admin/projects/{$project->id}/edit")
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Edit')
                ->where('project.id', $project->id));
    }

    public function test_empty_project_form_reports_required_field_errors(): void
    {
        $this->from('/admin/projects/create')
            ->post('/admin/projects', [])
            ->assertSessionHasErrors([
                'title',
                'slug',
                'category',
                'difficulty',
                'excerpt',
                'description',
                'tech_stack',
            ]);
    }

  public function test_invalid_difficulty_is_rejected(): void
   {
       $this->from('/admin/projects/create')
           ->post('/admin/projects', [
               ...$this->validProjectData(),
               'difficulty' => 'Very hard',
           ])
           ->assertSessionHasErrors('difficulty');
   }


    public function test_title_cannot_exceed_its_maximum_length(): void
    {
        $this->from('/admin/projects/create')
            ->post('/admin/projects', [
                ...$this->validProjectData(),
                'title' => str_repeat('a', 121),
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_slug_format_error_uses_a_custom_message(): void
    {
        $this->from('/admin/projects/create')
            ->post('/admin/projects', [
                ...$this->validProjectData(),
                'slug' => 'Not a valid slug',
            ])
            ->assertSessionHasErrors([
                'slug' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            ]);
    }

    public function test_invalid_github_url_reports_error_and_retains_input(): void
    {
        $projectData = [
            ...$this->validProjectData(),
            'github_url' => 'not-a-url',
        ];

        $this->from('/admin/projects/create')
            ->post('/admin/projects', $projectData)
            ->assertSessionHasErrors([
                'github_url' => 'The GitHub link must be a valid URL.',
            ])
            ->assertSessionHas('_old_input', fn (array $input): bool => ($input['title'] ?? null) === $projectData['title']
                && ($input['github_url'] ?? null) === $projectData['github_url']);
    }

    public function test_duplicate_slug_is_rejected(): void
    {
        Project::create($this->validProjectData());

        $this->from('/admin/projects/create')
            ->post('/admin/projects', [
                ...$this->validProjectData(),
                'title' => 'Another Project',
            ])
            ->assertSessionHasErrors('slug');
    }

    public function test_update_allows_keeping_the_projects_existing_slug(): void
    {
        $project = Project::create($this->validProjectData());

        $this->put("/admin/projects/{$project->id}", [
            ...$this->validProjectData(),
            'difficulty' => 'Hard',
        ])
            ->assertRedirect('/admin/projects')
            ->assertSessionHasNoErrors();

        $this->assertSame('Hard', $project->refresh()->difficulty);
    }

    private function validProjectData(): array
    {
        return [
            'title' => 'Validation Test Project',
            'slug' => 'validation-test-project',
            'category' => 'Web Development',
            'difficulty' => 'Medium',
            'excerpt' => 'A project used for checking validation rules.',
            'description' => 'A detailed project description that satisfies the minimum length rule.',
            'tech_stack' => 'Laravel, React',
            'project_url' => 'https://example.com/project',
            'github_url' => 'https://github.com/example/project',
            'image_url' => '/images/placeholder.svg',
            'featured' => false,
        ];
    }
}
