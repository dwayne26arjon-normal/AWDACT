<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:120'],
            'slug' => ['required', 'string', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:100', 'unique:projects,slug'],
            'category' => ['required', 'string', 'in:Web Development,Creative,Web App,UI/UX,Branding,Mobile,Data'],
            'difficulty' => ['required', 'string', 'in:Easy,Medium,Hard'],
            'excerpt' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string', 'min:30'],
            'tech_stack' => ['required', 'string', 'max:255'],
            'completed_date' => ['nullable', 'date'],
            'project_url' => ['nullable', 'string', 'max:2048', 'regex:/^(https?:\/\/\S+|#[a-zA-Z0-9_-]+)$/'],
            'github_url' => ['nullable', 'url:http,https'],
            'image_url' => ['nullable', 'string', 'max:2048', 'regex:/^(https?:\/\/\S+|\/images\/[A-Za-z0-9._-]+)$/'],
            'featured' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            'project_url.regex' => 'The public project link must be a valid URL or a page anchor.',
            'github_url.url' => 'The GitHub link must be a valid URL.',
            'image_url.regex' => 'Use an http(s) URL or an image stored in /images.',
        ];
    }
}
