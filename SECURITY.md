# Stasis AI security

Do not include health data, API keys, bearer tokens, database exports, signing materials, or provisioning profiles in an issue or repository commit. Report vulnerabilities privately to the owner of your Stasis AI distribution and rotate any credential that may have been exposed.

The self-hosted backend and LLM are part of the deployment threat model: use authenticated HTTPS, restrict network access, disable request-body logs, encrypt storage/backups, and keep dependencies patched. Firebase remains disabled until a project controlled by the distributor is configured explicitly.

Protocol and analytics vulnerabilities may also affect the preserved upstream-compatible dependencies; coordinate disclosure with their maintainers without sharing user health data.
