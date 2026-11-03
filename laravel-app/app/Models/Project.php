<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'difficulty',
        'excerpt',
        'description',
        'tech_stack',
        'project_url',
        'github_url',
        'image_url',
        'completed_date',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'completed_date' => 'date:Y-m-d',
    ];
}
