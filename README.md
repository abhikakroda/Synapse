# Openzara

Openzara is a career-acceleration and internship platform for Indian college students. It presents mentor-led AI, machine-learning, cybersecurity, and placement-focused programs through a responsive web experience.

## Live website

**[openzara.online](https://openzara.online)**

The root domain redirects to the canonical `www.openzara.online` deployment.

## Features

- Internship and course catalogue
- Workshop listings and supporting resources
- Student authentication with Clerk
- Student dashboard and enrollment history
- Supabase-backed users, purchases, leads, courses, workshops, coupons, resources, and certificate verification
- Course and workshop administration interface
- Responsive desktop and mobile layouts
- Search-engine metadata, sitemap, robots file, and `llms.txt`

## Technology

- HTML, CSS, and vanilla JavaScript
- Clerk authentication
- Supabase database and storage
- Vercel hosting

## Local development

The project does not require a compilation step. Serve the repository root with any static web server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Configuration

The browser uses publishable Clerk and Supabase client configuration. Administrative secrets and service-role credentials must never be added to client-side files or committed to this repository. Database access must be protected with appropriate Supabase row-level-security policies.

## Deployment

The repository is linked to Vercel. Changes pushed to the configured production branch can be deployed through the associated Vercel project.
