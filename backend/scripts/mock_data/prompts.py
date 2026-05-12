instructions = """
IMPORTANT INSTRUCTIONS:
1. All JSON field/key names must remain in English (e.g., "users", "projects", "skills", "open_positions", "tags").
2. ALL content values MUST be written IN POLISH - this includes all names, titles, descriptions, skills, areas, and tags.
3. No English words should appear in any value fields - translate everything to natural-sounding Polish.
4. User and project descriptions MAY include limited markdown formatting where appropriate - italics (*tekst*), bold (**tekst**), and bullet lists (- punkt). Use markdown sparingly and naturally, not in every description.
"""

prompts = [
    # Prompt 1: Detailed project descriptions with emoji-prefixed sentences
    # Creates a standard collaboration database with emojis at the beginning of each sentence in descriptions
    f"""
Generate JSON data for a simple interdisciplinary project collaboration database. {instructions}

1. Create 5 fake users, each with:
- `id` (starting from 1)
- `first_name`: realistic Polish first name
- `last_name`: realistic Polish surname
- `email`: realistic email address
- `description`: Personal description (3-4 sentences) about their background, interests, and career goals. You may occasionally use markdown like **bold** for a key skill or *italics* for specialization, but only where it feels natural.
- `skills`: a list of 3–5 realistic professional skills. These can be technical (e.g., Python, React), creative (e.g., projektowanie UX, copywriting), scientific (e.g., biologia molekularna), or humanistic (e.g., językoznawstwo, tłumaczenie).

2. Create 5 fake projects, each with:
- `id` (starting from 1)
- `title`: short project title (in Polish)
- `description`: For each project, create detailed descriptions (3-4 sentences) that include emojis at the beginning of each sentence. Some descriptions may optionally include **bold** or *italic* text for emphasis where appropriate.
- `areas`: a list of 2–4 Polish topic areas touched by the project (e.g., Rozwój Webowy, Neurobiologia, Projektowanie Graficzne, Filologia).
- `open_positions`: an array of 2-3 JSON objects, each representing a position the project is looking to fill. Each object should have:
  * `title`: job title in Polish (e.g., "Specjalista ds. OCR i analizy tekstu 💻🔍")
  * `description`: short description of responsibilities (1-2 sentences)
  * `tags`: array of 2-4 strings with relevant skill tags in Polish (e.g., ["Technologia", "Algorytmy", "OCR"])

3. Create a many-to-many mapping between users and projects:
- Each project should involve 1–5 users (referenced by user id)
- Each user should participate in 0–3 projects

Output a single JSON object with 3 keys:
- `users`: list of user objects
- `projects`: list of project objects
- `user_project_links`: list of objects with `user_id` and `project_id`
Return only valid JSON.
""",
    # Prompt 2: Bullet-point style descriptions with emojis
    # Creates a simpler format with emoji-prefixed bullet points for more scannable project descriptions
    f"""
Generate JSON data for an interdisciplinary project collaboration database. {instructions}

1. Create 5 fake users with:
- `id` (starting from 1)
- `first_name`: realistic Polish first name
- `last_name`: realistic Polish surname
- `email`: realistic email address
- `description`: Personal background in emoji-prefixed points. Some descriptions might use a markdown bullet list (using "- " prefix) or occasional **bold**/*italic* text for emphasis, but not all need to use markdown.
- `skills`: a list of 3–5 professional skills (technical, creative, scientific, or humanistic)

2. Create 5 fake projects with:
- `id` (starting from 1)
- `title`: creative and memorable project title
- `description`: Write short descriptions with emoji-prefixed points. Some may use markdown bullet lists (using "- " prefix) or occasional formatting for emphasis, but vary the style across projects.
- `areas`: a list of 2–4 topic areas relevant to the project
- `open_positions`: an array of 2-3 JSON objects representing positions needed for the project. Each object should have:
  * `title`: descriptive job title with relevant emoji (e.g., "🔍 Specjalista ds. analizy danych")
  * `description`: bullet-point style description with emoji prefix
  * `tags`: array of 2-4 strings with specialized skills or domains in Polish

3. Create a many-to-many mapping between users and projects:
- Each project should involve 1–5 users
- Each user should participate in 0–3 projects

Output a single JSON object with users, projects, and user_project_links.
    """,
    # Prompt 3: Academic collaboration with narrative storytelling
    # Focuses on research projects with rich, metaphorical language in descriptions
    f"""
Generate JSON data for a Polish academic collaboration platform. {instructions}

1. Create 5 users with:
- `id` (numbers 1-5)
- `first_name` & `last_name`: authentic Polish names
- `email`: professional email address
- `description`: Narrative biography using rich academic language that tells the story of their research journey and scholarly interests. Occasionally, you may use **bold** or *italics* to highlight a key research area or method, but keep markup minimal.
- `skills`: 3-5 specialized skills in Polish

2. Create 5 research projects with:
- `id` (numbers 1-5)
- `title`: concise academic project title in Polish
- `description`: For each project, create narrative descriptions that tell a story about the project's impact using metaphors and vivid language. Optional light markdown formatting may be used in some cases to emphasize key points.
- `areas`: 2-4 relevant fields of study
- `open_positions`: an array of 2-3 JSON objects representing academic positions needed. Each object should have:
  * `title`: formal academic position title in Polish
  * `description`: narrative description of the role using rich, academic language
  * `tags`: array of 2-4 strings with specialized academic competencies or research areas

3. Create connections between users and projects with:
- At least 8 user-project relationships
- Variety in how many users work on each project

Return this as a valid JSON object with users, projects, and user_project_links arrays.
    """,
    # Prompt 4: Startup incubator with symbol-marked key features
    # Business-oriented data with descriptions formatted as key features marked by special symbols
    f"""
Generate JSON data for a Polish startup incubator database. {instructions}

1. Create 5 entrepreneurs with:
- `id` (1-5)
- `first_name` & `last_name`: modern Polish names
- `email`: business email
- `description`: Professional background and entrepreneurial vision formatted with key features marked by symbols like ★, ✓, or →. Some may use a bullet list format or occasional **bold**/*italic* text for emphasis, but varies by individual.
- `skills`: contemporary business and technical skills

2. Create 5 innovative startups with:
- `id` (1-5)
- `title`: catchy startup name
- `description`: Write descriptions formatted as key features, with each point marked by symbols like ★, ✓, or →. Some descriptions may include bullet lists or occasional **bold**/*italic* formatting, but vary the style across projects.
- `areas`: trending business sectors in Poland
- `open_positions`: an array of 2-3 JSON objects representing roles the startup needs to fill. Each object should have:
  * `title`: business-oriented job title with symbol prefix (e.g., "★ CTO z doświadczeniem w AI")
  * `description`: role description using the same symbol-marked format as the project description
  * `tags`: array of 2-4 strings with business or technical competencies required

3. Map entrepreneurs to startups:
- Realistic distribution of talent across projects
- Some entrepreneurs involved in multiple startups

Output a single JSON object with users, projects, and user_project_links.
    """,
    # Prompt 5: Cultural projects with quotes and Polish cultural references
    # Arts-focused data with passionate descriptions including quotes and cultural elements
    f"""
Generate JSON data for a Polish cultural projects network. {instructions}

1. Create 5 artists/cultural workers with:
- `id` (1-5)
- `first_name` & `last_name`: authentic Polish names
- `email`: professional contact
- `description`: Passionate personal biography that includes quotes about their artistic philosophy and references to Polish cultural elements. Some may use **bold**, *italics*, or bullet lists where it adds meaning, but vary the formatting styles across users.
- `skills`: artistic and cultural competencies

2. Create 5 cultural initiatives with:
- `id` (1-5)
- `title`: evocative cultural project name
- `description`: For each project, write passionate descriptions that include quotes from fictional participants and reference Polish cultural elements. Use markdown formatting like *italics* for quotes or **bold** for emphasis occasionally, but not in every description.
- `areas`: domains of art and culture
- `open_positions`: an array of 2-3 JSON objects representing creative roles needed for the initiative. Each object should have:
  * `title`: artistic or cultural position title in Polish
  * `description`: description that includes quotes or cultural references consistent with the project style
  * `tags`: array of 2-4 strings with artistic competencies or cultural domains

3. Create collaborations between people and projects:
- Diverse participation patterns
- Realistic cultural sector relationships

Return as a clean JSON object with users, projects, and user_project_links.
    """
]