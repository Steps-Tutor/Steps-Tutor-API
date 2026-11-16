# Security Policy

We take the security of the STEPS-Tutor API seriously. Thank you for helping us keep the API and its users safe.

## Reporting A Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues, Discussions, or any other public channel.**

Instead, report them privately using GitHub's Private Vulnerability Reporting:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Fill in the advisory form with as much detail as you can.

Only the maintainers of this repository can see your report.

## What To Include

To help us triage quickly, please include:

- A description of the vulnerability and its potential impact
- The affected endpoint(s), API version, or component
- Step-by-step instructions to reproduce the issue
- Proof-of-concept requests/responses (with any real credentials or personal data removed)
- Any suggested mitigation, if you have one

## What To Expect

- **Acknowledgement:** within [3] business days of your report
- **Initial assessment:** within [10] business days, including whether we consider the report in scope and its severity
- **Updates:** we will keep you informed of progress through the private advisory thread
- **Resolution:** once a fix is deployed, we will let you know and, with your permission, credit you in the published advisory

## Scope

In scope:
- The STEPS-Tutor production API at [GitHub](https://github.com/Steps-Tutor/Steps-Tutor-API)
- Authentication and authorization flows
- Official documentation and examples in this repository

Out of scope:
- Denial-of-service or volumetric/load testing
- Social engineering or phishing of our staff or users
- Findings from automated scanners without a demonstrated, exploitable impact
- Vulnerabilities in third-party services we do not control
- Missing best-practice headers or configurations without a demonstrated security impact

## Safe Harbor

We will not pursue action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service disruption
- Only access data that belongs to them or test accounts they control
- Report the vulnerability privately and give us reasonable time to fix it before any public disclosure

## Supported Versions

| Version | Supported |
| ------- | --------- |
| [v1]    | ✅        |
