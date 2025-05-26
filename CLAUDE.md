# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a personal website/blog for Callum Webb built using Quarto, a scientific and technical publishing system that converts markdown files (.qmd) into a static website. The site includes:

- A blog section with interactive D3.js visualizations
- An about page with professional information
- Custom styling and navigation

## Development Environment

### Prerequisites
- Quarto CLI must be installed on the system
- Basic knowledge of markdown, HTML, CSS, and JavaScript (D3.js)

### Key Commands
```bash
# Preview the website (starts local development server)
quarto preview

# Render the website to static HTML (output in _site directory)
quarto render
```

## Project Structure
- `_quarto.yml`: Main configuration file for the site
- `index.qmd`: Blog listing page that displays posts from the posts directory
- `about.qmd`: About page with information about Callum
- `posts/`: Directory containing blog posts
  - `roc/`: ROC Curves blog post with interactive D3.js visualizations
  - `d3/`: Blog post about D3.js with interactive visualizations

## Working with JavaScript Visualizations
The blog posts use D3.js for interactive visualizations:

1. JavaScript files are stored in the corresponding post directory (e.g., `posts/roc/js/`)
2. Scripts are included in the `.qmd` files using standard HTML script tags
3. D3.js is imported via CDN using ES modules
4. Changes to JavaScript files will be reflected when previewing with `quarto preview`

## Adding New Content
1. Create a new `.qmd` file in the appropriate directory
2. Add front matter with title and date
3. Write content using Quarto markdown syntax
4. For interactive visualizations, include necessary JavaScript files
5. Preview changes with `quarto preview`

## Deployment
The site is rendered to static HTML in the `_site` directory which can then be deployed to any static hosting service.