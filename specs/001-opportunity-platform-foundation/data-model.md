# Data Model: Oppora Platform Foundation

## Modeling Rules

- Use stable identifiers for every persisted entity and consistent creation/update timestamps.
- Treat source-provided absence as `unknown` or `null`, never as a positive assertion.
- Keep original source values and normalized values distinguishable when normalization changes meaning or format.
- Preserve source relationships and historical records when deduplication or lifecycle processing is uncertain.
- Expose DTO-shaped public representations; persistence fields are not public API fields by default.

## Entities

### User

Represents an account that owns preferences, saved opportunities, applications, and notification settings. Anonymous browsing does not require this entity.

Key fields: `id`, `externalAuthSubject`, `email`, `createdAt`, `updatedAt`, `lastActiveAt`.

Rules: authentication identity is unique; email may be absent for privacy-preserving providers; secrets are never stored in this entity.

### UserPreference

Represents optional profile inputs used for filtering and future explainable matching.

Key fields: `userId`, `country`, `educationLevel`, `fieldsOfStudy`, `preferredCountries`, `fundingPreferences`, `languages`, `categories`, `remotePreference`, `updatedAt`.

Rules: all preference fields are optional; unsupported taxonomy values are rejected or retained as unmapped input for review; preferences never override opportunity eligibility evidence.

### Source

Represents an approved external provider or public data source.

Key fields: `id`, `name`, `website`, `baseUrl`, `sourceType`, `country`, `trustLevel`, `crawlEnabled`, `crawlFrequency`, `termsUrl`, `robotsUrl`, `lastSuccessfulRun`, `lastFailedRun`, `createdAt`, `updatedAt`.

Rules: automated access requires an explicit approved record; `baseUrl` and discovered URLs are validated against the source policy; disabled or prohibited sources cannot be scheduled.

### Category

Represents an extensible opportunity classification.

Key fields: `id`, `code`, `name`, `description`, `active`, `createdAt`, `updatedAt`.

Rules: `code` is stable and unique; adding a category does not require changing opportunity table shape.

### Opportunity

Represents a normalized educational or social-impact opportunity.

Key fields: `id`, `externalId`, `sourceId`, `sourceUrl`, `officialApplicationUrl`, `title`, `slug`, `description`, `shortDescription`, `organization`, `provider`, `categoryId`, `remoteAvailable`, `fundingType`, `fundingAmount`, `currency`, `benefits`, `eligibility`, `requirements`, `applicationProcess`, `startDate`, `endDate`, `deadline`, `deadlineTimezone`, `status`, `verified`, `verificationDate`, `publishedAt`, `lastSeenAt`, `createdAt`, `updatedAt`, and source metadata.

Rules: title, source, source URL, and category are required minimum identity fields; source URL is preserved; optional details may be unknown; `officialApplicationUrl` is validated and clearly labeled; deadline values require a timezone or an explicit unknown timezone state; expired records are retained.

### OpportunityCountry

Associates an opportunity with eligible or destination countries and records the relationship type.

Key fields: `opportunityId`, `countryCode`, `relationshipType`.

Rules: duplicate pairs are prohibited; relationship type distinguishes eligibility from destination.

### OpportunityField

Associates an opportunity with one or more fields of study.

Key fields: `opportunityId`, `fieldCode`, `sourceLabel`.

Rules: duplicate pairs are prohibited; original source labels can be retained when mapping is uncertain.

### SavedOpportunity

Represents a user's saved relationship to an opportunity.

Key fields: `userId`, `opportunityId`, `folder`, `notes`, `savedAt`, `updatedAt`.

Rules: one active saved relationship per user/opportunity pair; deleting an opportunity from public discovery does not silently erase the user's historical record.

### Application

Represents a user's progress tracking for an opportunity.

Key fields: `id`, `userId`, `opportunityId`, `status`, `notes`, `applicationDate`, `personalDeadline`, `documentMetadata`, `createdAt`, `updatedAt`.

Statuses: `WISHLIST`, `PLANNING`, `APPLIED`, `INTERVIEW`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.

Rules: document metadata contains no document contents; personal deadlines are user-owned; status changes are timestamped and auditable.

### NotificationPreference

Represents user-controlled reminder settings.

Key fields: `userId`, `enabled`, `leadTimes`, `updatedAt`.

Rules: supported lead times are 30, 14, 7, 3, and 1 day; reminders require a valid known deadline; no notification is sent when disabled.

### IngestionRun

Represents one processing attempt for one approved source.

Key fields: `id`, `sourceId`, `startedAt`, `completedAt`, `status`, `discoveredCount`, `parsedCount`, `validCount`, `duplicateCount`, `rejectedCount`, `updatedCount`, `newCount`.

Rules: one failed run does not invalidate other source runs; counts are internally consistent and retained for operational review.

### IngestionError

Represents a source-scoped failure or rejected record.

Key fields: `id`, `ingestionRunId`, `sourceId`, `stage`, `externalReference`, `message`, `severity`, `retryable`, `occurredAt`.

Rules: errors contain actionable diagnostics without secrets; a malformed source record is rejected or quarantined rather than silently stored.

## Relationships

```text
User 1──1 UserPreference
User 1──* SavedOpportunity *──1 Opportunity
User 1──* Application *──1 Opportunity
User 1──1 NotificationPreference
Source 1──* Opportunity
Source 1──* IngestionRun 1──* IngestionError
Category 1──* Opportunity
Opportunity 1──* OpportunityCountry
Opportunity 1──* OpportunityField
```

## Opportunity Lifecycle

```text
DISCOVERED -> ACTIVE -> EXPIRING -> EXPIRED -> ARCHIVED
DISCOVERED -> INVALID
ACTIVE -> INVALID
```

Transitions are driven by validation, source observations, deadline rules, and configurable stale-source policy. `ARCHIVED` and `INVALID` records remain available for audit/history but are excluded from default active discovery results.

## Index Requirements

- Unique source/external identifier when an external identifier exists.
- Unique canonical source URL where canonicalization is reliable.
- Opportunity status plus deadline for active and closing-soon queries.
- Category, funding type, remote availability, and publication date for filtering and browsing.
- Relationship-table foreign keys and composite uniqueness for country and field filters.
- Source identifier plus verification and last-seen timestamps for provenance and health views.
- User identifier plus saved timestamp for saved opportunities.
- User identifier plus application status and personal deadline for tracking views.
- Ingestion run source/status/start time and ingestion error source/stage/time for operational review.
- Searchable opportunity title, organization, description, and normalized labels through the selected relational search strategy.