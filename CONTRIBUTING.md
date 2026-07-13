# Contributing to Ordo

Thank you for your interest in contributing to Ordo. This project is built to be a high-quality, maintainable productivity platform, and we welcome thoughtful contributions from developers, designers, and reviewers.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating in the project.

## Ways to Contribute

You can contribute by:

- Reporting bugs and usability issues
- Suggesting product or technical improvements
- Improving documentation
- Writing or refactoring code
- Reviewing pull requests
- Helping triage issues and maintain quality standards

## Development Setup

### Prerequisites

- Node.js 20.x or newer
- npm 10.x or newer
- Git

### Local setup

```bash
git clone <your-fork-url>
cd ordo
npm install
npm run dev
```

### Available scripts

```bash
npm run dev      # start local development server
npm run build    # verify production build
npm run lint     # run ESLint checks
```

## Contribution Workflow

1. Fork the repository and create your branch from main.
2. Make focused, well-scoped changes.
3. Run linting and build verification locally.
4. Update documentation when behavior or setup changes.
5. Submit a pull request using the provided template.

## Branching Model

Use descriptive branch names following this convention:

- `feat/short-description`
- `fix/short-description`
- `docs/short-description`
- `chore/short-description`
- `refactor/short-description`
- `perf/short-description`
- `test/short-description`

Example:

```bash
git checkout -b feat/add-google-calendar-sync
```

## Commit Message Guidelines

We follow Conventional Commits for clarity and changelog readability.

Format:

```text
<type>(<scope>): <short summary>
```

### Recommended types

- `feat`: a new feature
- `fix`: a bug fix
- `docs`: documentation updates
- `style`: formatting and whitespace-only changes
- `refactor`: code restructuring without behavior changes
- `perf`: performance improvements
- `test`: adding or updating tests
- `chore`: tooling, maintenance, or repository tasks

### Examples

```text
feat(inbox): add smart email prioritization
fix(calendar): resolve drag-and-drop time block overlap
docs(readme): document environment setup
refactor(board): simplify kanban state handling
```

## Coding Standards

Please keep contributions aligned with the project’s quality bar:

- Prefer clear, readable, and maintainable code
- Keep changes focused and avoid unrelated edits
- Follow existing patterns and architecture conventions
- Use meaningful names for variables, functions, and components
- Avoid introducing unnecessary dependencies
- Preserve accessibility and responsive behavior
- Handle sensitive data with care and avoid logging secrets

## Testing and Verification

Before submitting a pull request:

- Ensure the project builds successfully
- Ensure linting passes
- Verify the affected UI or behavior locally
- Include manual verification steps when needed
- Add or update tests when feasible

If you are changing authentication, data handling, or integrations, please document the verification steps clearly.

## Pull Request Requirements

All pull requests must:

- Target the `main` branch
- Include a clear summary of the change
- Explain the motivation and context
- Link any relevant issue numbers
- Include testing or verification information
- Be reviewed by at least one maintainer

### Review expectations

A pull request may be merged only when:

- The change is technically sound and scoped appropriately
- The implementation follows project conventions
- The code is readable and maintainable
- No unresolved review comments remain
- Relevant documentation is updated
- Security-sensitive changes have been reviewed carefully

## Review Process

We use a strict review process to preserve maintainability and long-term quality.

1. A maintainer will review the pull request for correctness, clarity, and architecture fit.
2. Feedback may be requested for improvements, refactoring, or edge cases.
3. Contributors should respond promptly and professionally to review comments.
4. Once approved and validated, the pull request may be merged by a maintainer.

## Questions?

If you are unsure whether your contribution fits the project, open a discussion or contact a maintainer before beginning significant work.
