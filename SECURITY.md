# Security Policy

## Supported Versions

Security updates are currently prioritized for the latest development branch and the latest published release. Older versions may not receive active support unless explicitly stated.

## Reporting a Vulnerability

If you discover a security vulnerability in Ordo, please report it privately and responsibly.

Do not open a public GitHub issue for security-sensitive problems.

Please email the maintainers at: security@oriva.dev

When reporting, include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact and affected components
- Any suggested mitigation or fix
- Your contact details for follow-up

## What to Expect

After you report a vulnerability:

- We will acknowledge receipt within 3 business days
- We will assess the issue and determine severity
- We will work toward a fix and coordinated disclosure
- We will keep you informed of progress where appropriate

## Responsible Disclosure Guidelines

Please:

- Do not exploit the vulnerability beyond what is necessary to demonstrate it
- Do not access or exfiltrate data beyond the minimum required for validation
- Do not disclose the issue publicly before we have had a reasonable opportunity to address it
- Avoid testing against production environments where possible

## Sensitive Data Considerations

Ordo may handle sensitive information such as Google OAuth tokens, calendar data, email metadata, and personal productivity data. Please treat all such information as highly sensitive and report any issues that could lead to unauthorized access, token leakage, or data exposure.

## Scope

This policy covers:

- Authentication and authorization issues
- Token storage or handling flaws
- Insecure data transmission or persistence
- Cross-site scripting, injection, or privilege escalation concerns
- Misconfiguration that could expose user or organizational data
