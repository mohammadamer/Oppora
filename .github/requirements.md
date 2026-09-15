Act as a Principal Full-Stack Architect, Senior TypeScript Engineer,
Mobile Application Architect, Data Engineer, and AI-assisted development
expert.

Your task is to architect and incrementally implement a production-quality,
open-source, cross-platform mobile application called "Oppora".

Oppora is a global opportunity discovery platform that aggregates,
normalizes, indexes, and intelligently presents verified scholarships,
fellowships, internships, volunteering opportunities, exchange programs,
grants, and other educational or social-impact opportunities from trusted
external sources.

The goal is NOT to create another generic job board.

The goal is to build a trustworthy "opportunity search engine" where users
can discover relevant opportunities from many fragmented sources through
one clean mobile experience.

The application must be designed for long-term growth, maintainability,
data quality, extensibility, and open-source contribution.

============================================================
1. PRODUCT VISION
============================================================

Oppora should answer one simple question:

"What opportunities around the world are relevant to me?"

A user should be able to:

1. Open the app.
2. Search or browse opportunities.
3. Filter by their preferences.
4. Understand eligibility and benefits quickly.
5. Save interesting opportunities.
6. Track application status.
7. Receive deadline reminders.
8. Discover opportunities they may not have found otherwise.

Example:

User profile:

- Country: Egypt
- Education: Bachelor's student
- Field: Computer Science
- Preferred destinations: Europe, Canada
- Funding: Fully funded
- Languages: English

Oppora should be able to surface:

- Scholarships
- Fellowships
- Exchange programs
- Volunteering
- Internships
- Grants

that match the user's profile.

============================================================
2. PRODUCT PRINCIPLES
============================================================

Follow these principles throughout the project:

1. Mobile-first
2. API-first
3. Type-safe
4. Modular
5. Scalable
6. Secure by default
7. Data quality over data quantity
8. Source attribution
9. Transparent data provenance
10. Human-readable architecture
11. Testable business logic
12. Replaceable infrastructure
13. Open-source friendly
14. Privacy-conscious
15. Ethical data ingestion

Do not build a monolithic application.

Do not put business logic inside React Native screens.

Do not put scraping logic inside the API server.

Do not tightly couple search, database, crawling, or authentication
to the rest of the application.

============================================================
3. RECOMMENDED TECHNOLOGY STACK
============================================================

Use the following stack unless there is a strong technical reason not to.

MOBILE:

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand for lightweight client state where appropriate
- React Hook Form
- Zod
- NativeWind or another consistent styling solution
- Expo Notifications
- Secure storage for sensitive local data

BACKEND:

- Node.js
- TypeScript
- NestJS
- REST API
- Zod or class-validator for validation
- Prisma ORM

DATABASE:

- PostgreSQL
- pgvector when semantic search is actually required
- PostgreSQL full-text search initially
- Redis only where caching/queues genuinely require it

INGESTION:

- Python
- Scrapy for structured crawling
- Playwright only for JavaScript-heavy sources
- BeautifulSoup where simple HTML parsing is sufficient

JOB PROCESSING:

- Redis + BullMQ or another queue abstraction

AUTHENTICATION:

Prefer Supabase Auth unless there is a strong reason to use another
provider.

SEARCH:

Start with PostgreSQL full-text search + trigram/fuzzy matching.

Design a SearchProvider abstraction so Elasticsearch, OpenSearch,
Algolia, or another search engine can be introduced later without
rewriting the application.

AI / SEMANTIC SEARCH:

Treat semantic/vector search as an enhancement, not a requirement
for MVP.

Use pgvector only when it provides a measurable benefit.

============================================================
4. HIGH-LEVEL ARCHITECTURE
============================================================

Use a modular monorepo.

Conceptually:

                    ┌──────────────────┐
                    │  React Native    │
                    │   Mobile App     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    API Layer     │
                    │     NestJS       │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        PostgreSQL         Search          Auth
              │
              │
              ▼
      ┌────────────────┐
      │ Opportunity DB │
      └───────┬────────┘
              ▲
              │
      ┌───────┴────────┐
      │ Ingestion      │
      │ Pipeline       │
      └───────┬────────┘
              │
       ┌──────┼───────────────┐
       ▼      ▼               ▼
    Source A Source B       Source C
       │      │               │
       └──────┴───────────────┘

The ingestion pipeline must be independent from the API.

The API reads normalized opportunity data.

The mobile application NEVER scrapes external websites directly.

============================================================
5. MONOREPO STRUCTURE
============================================================

Create a structure similar to:

apps/
  mobile/
  api/
  ingestion/

packages/
  database/
  contracts/
  search/
  opportunity-core/
  config/
  shared/
  ui/

  ingestion-core/
  source-adapters/

  notifications/

  testing/

docs/

infra/

scripts/

.github/
  workflows/

Use shared TypeScript contracts where appropriate.

Do not force Python code into the TypeScript packages.

The Python ingestion system should communicate with the backend/database
through clearly defined interfaces.

============================================================
6. DOMAIN MODEL
============================================================

The core domain is the Opportunity.

An opportunity may represent:

- Scholarship
- Fellowship
- Internship
- Volunteering
- Exchange
- Grant
- Competition
- Conference
- Research opportunity
- Other educational/social-impact opportunities

Design the domain so new categories can be added without schema rewrites.

Important Opportunity fields:

- id
- externalId
- sourceId
- sourceUrl
- officialApplicationUrl
- title
- slug
- description
- shortDescription
- organization
- provider
- category
- subcategory
- countries
- destinationCountries
- remoteAvailable
- studyLevels
- fieldsOfStudy
- fundingType
- fundingAmount
- currency
- benefits
- eligibility
- requirements
- languages
- applicationProcess
- startDate
- endDate
- deadline
- deadlineTimezone
- status
- verified
- verificationDate
- publishedAt
- lastSeenAt
- createdAt
- updatedAt

Do not assume all sources provide every field.

Fields should support:

- nullability
- unknown values
- multiple values
- source-specific metadata

============================================================
7. DATA PROVENANCE
============================================================

Trust is a core feature.

Every opportunity must retain information about where the data came from.

Create a Source entity.

Example:

Source:

- id
- name
- website
- baseUrl
- sourceType
- country
- trustLevel
- crawlEnabled
- crawlFrequency
- termsUrl
- robotsUrl
- lastSuccessfulRun
- lastFailedRun
- createdAt
- updatedAt

Opportunity records should reference their source.

Users should be able to see:

"Source: University of X"

"Last verified: 2 days ago"

"Official application"

Always preserve the original source URL.

Never make the platform appear to be the original provider.

============================================================
8. INGESTION ARCHITECTURE
============================================================

Do NOT build a generic crawler that blindly crawls the internet.

Use an explicit source-adapter architecture.

Example:

    SourceAdapter
       │
       ├── ErasmusAdapter
       ├── UniversityAdapter
       ├── ScholarshipDatabaseAdapter
       ├── VolunteerPlatformAdapter
       └── GenericAdapter

Every adapter should implement a common interface:

    discover()
    fetch()
    parse()
    normalize()
    validate()

Conceptually:

    interface OpportunitySourceAdapter {
        getSource(): SourceDefinition
        discover(): Promise<SourceListing[]>
        fetch(listing): Promise<RawOpportunity>
        parse(raw): Promise<ParsedOpportunity>
        normalize(parsed): NormalizedOpportunity
        validate(opportunity): ValidationResult
    }

The ingestion pipeline:

    Discover
       ↓
    Fetch
       ↓
    Parse
       ↓
    Normalize
       ↓
    Validate
       ↓
    Deduplicate
       ↓
    Enrich
       ↓
    Store
       ↓
    Index
       ↓
    Report

============================================================
9. ETHICAL CRAWLING
============================================================

The crawler must be designed responsibly.

Never attempt to bypass:

- authentication
- CAPTCHAs
- rate limits
- robots.txt restrictions
- access controls
- paywalls
- anti-bot protections

Respect source terms and applicable laws.

Use:

- rate limiting
- exponential backoff
- caching
- conditional requests where possible
- reasonable concurrency
- descriptive user agent
- source-specific crawl policies

If a source explicitly prohibits automated access, do not crawl it.

Prefer:

- official APIs
- RSS feeds
- public datasets
- sitemap feeds
- structured public pages

over scraping whenever possible.

============================================================
10. NORMALIZATION
============================================================

Different sources will represent the same information differently.

Create normalization pipelines.

Examples:

"Fully Funded"
"Full scholarship"
"100% funded"

should normalize into:

    fundingType = FULLY_FUNDED

Examples:

"Masters"
"Master's"
"MSc"
"MA"

should normalize into:

    studyLevel = MASTERS

Create enums/taxonomies for:

- category
- study level
- funding type
- destination
- field of study
- language
- eligibility type

Do not hard-code normalization logic throughout the application.

Create dedicated normalization services.

============================================================
11. DEDUPLICATION
============================================================

Duplicate opportunities are unacceptable.

Implement multiple levels of deduplication.

Potential matching signals:

- source + external ID
- canonical URL
- normalized title
- organization
- deadline
- similarity score

Create a DeduplicationService.

Support:

- exact duplicate
- probable duplicate
- possible duplicate

Do not automatically merge uncertain records without a safe strategy.

Preserve source relationships.

============================================================
12. DATA QUALITY
============================================================

Every ingestion run should produce metrics.

Example:

    Source: Example University

    Discovered: 120
    Parsed: 113
    Valid: 108
    Duplicates: 7
    Rejected: 5
    Updated: 82
    New: 26

Track errors by source.

A bad source should not bring down the entire ingestion system.

One failed adapter must not stop other adapters.

============================================================
13. OPPORTUNITY LIFECYCLE
============================================================

Opportunities should have lifecycle states:

    DISCOVERED
    ACTIVE
    EXPIRING
    EXPIRED
    ARCHIVED
    INVALID

Do not immediately delete expired opportunities.

Keep historical data where useful.

Automatically detect stale opportunities.

If a source no longer exposes an opportunity, mark it appropriately
after configurable verification rules.

============================================================
14. SEARCH
============================================================

The search experience should support:

- keyword search
- fuzzy matching
- category
- country
- destination
- study level
- field of study
- funding type
- remote availability
- deadline
- language
- eligibility
- organization

Example:

    "fully funded computer science masters in Europe"

The search architecture should be provider-independent.

Create:

    SearchProvider

with an initial implementation:

    PostgreSQLSearchProvider

Future implementations can include:

    OpenSearchProvider
    ElasticsearchProvider
    AlgoliaProvider

============================================================
15. SMART MATCHING
============================================================

Users should optionally create a profile.

Example:

    educationLevel
    country
    fieldsOfStudy
    preferredCountries
    fundingPreferences
    languages
    categories
    remotePreference

Create a matching service.

Example:

    MatchScore =

      eligibility match
      + study-level match
      + field match
      + funding match
      + destination match
      + deadline relevance

Do NOT initially rely on an opaque AI score.

Make the scoring explainable.

Example:

    92% match

    ✓ Master's eligible
    ✓ Computer Science
    ✓ Fully funded
    ✓ Germany preferred
    ✓ English program

AI/embeddings can be introduced later for semantic matching.

============================================================
16. MOBILE APPLICATION
============================================================

Create a polished, modern mobile experience.

Primary navigation:

    Home
    Explore
    Saved
    Applications
    Profile

Home should contain:

- personalized recommendations
- closing soon
- newly added
- fully funded
- popular
- volunteering
- scholarships

Explore should contain:

- search
- filters
- sorting
- results

Opportunity card:

- title
- organization
- category
- country
- funding badge
- deadline
- saved state

Opportunity detail screen:

- title
- organization
- source
- verified indicator
- deadline countdown
- location
- funding
- eligibility
- benefits
- requirements
- application process
- official application button
- save button
- share button

============================================================
17. APPLICATION TRACKING
============================================================

Allow users to track application progress.

Statuses:

    WISHLIST
    PLANNING
    APPLIED
    INTERVIEW
    ACCEPTED
    REJECTED
    WITHDRAWN

Users should be able to attach:

- notes
- application date
- personal deadline
- documents metadata

Do not upload sensitive documents unless a secure document-storage
architecture is explicitly implemented later.

============================================================
18. SAVED OPPORTUNITIES
============================================================

Users can:

- save
- unsave
- create folders
- move opportunities
- add notes
- mark application status

Example:

    Saved
      ├── Wishlist
      ├── Applying
      ├── Applied
      └── Favorites

============================================================
19. NOTIFICATIONS
============================================================

Support deadline notifications.

Examples:

"Your Erasmus application deadline is in 7 days."

"Your saved scholarship closes tomorrow."

Users must control notification preferences.

Never spam users.

Allow:

- 30 days
- 14 days
- 7 days
- 3 days
- 1 day

Notification scheduling should be resilient if the app is offline.

============================================================
20. AUTHENTICATION & PRIVACY
============================================================

Support:

- email authentication
- OAuth providers where appropriate
- anonymous browsing

Browsing opportunities should NOT require an account.

Require authentication only for:

- saving
- applications
- personalization
- notifications
- synchronization

Follow privacy-by-design principles.

Do not collect unnecessary personal information.

============================================================
21. API DESIGN
============================================================

Create versioned REST APIs.

Example:

    /api/v1/opportunities
    /api/v1/opportunities/:id
    /api/v1/search
    /api/v1/categories
    /api/v1/sources
    /api/v1/users/me
    /api/v1/users/me/preferences
    /api/v1/users/me/saved
    /api/v1/users/me/applications
    /api/v1/notifications

Support:

- pagination
- filtering
- sorting
- cursor pagination where appropriate
- consistent error responses
- request validation
- rate limiting

Never expose internal database models directly through the API.

Use DTOs/contracts.

============================================================
22. CACHING
============================================================

Use caching strategically.

Potential cached data:

- categories
- popular searches
- frequently requested opportunities
- recommendation results

Do not add Redis everywhere.

Only introduce caching where measurements demonstrate a benefit.

============================================================
23. ADMIN / OPERATIONS
============================================================

Build the architecture for an internal admin interface.

Admins should eventually be able to:

- inspect sources
- enable/disable adapters
- view crawl status
- inspect failed records
- approve suspicious records
- merge duplicates
- edit normalized data
- inspect source health

This can initially be API-only.

============================================================
24. OBSERVABILITY
============================================================

Add structured logging.

Track:

- API requests
- crawler runs
- adapter failures
- parsing failures
- validation failures
- duplicate detection
- search performance
- notification failures

Create a simple health system:

    /health
    /health/database
    /health/ingestion

============================================================
25. SECURITY
============================================================

Implement:

- input validation
- authentication
- authorization
- rate limiting
- secure secrets management
- SQL injection protection through ORM/parameterization
- SSRF protection for ingestion
- URL validation
- safe HTML parsing
- output sanitization
- dependency auditing

Never allow arbitrary user-provided URLs to become unrestricted crawler targets.

Crawler targets must come from an approved source registry.

============================================================
26. TESTING
============================================================

Testing is mandatory.

Mobile:

- component tests
- screen tests
- navigation tests

Backend:

- unit tests
- integration tests
- API tests

Ingestion:

- parser tests
- normalization tests
- deduplication tests
- fixture-based source tests

Create HTML fixtures for each source adapter.

A source website changing its HTML should cause a controlled adapter
failure, not silently corrupt the database.

============================================================
27. CI/CD
============================================================

Create GitHub Actions for:

- lint
- type checking
- unit tests
- integration tests
- Python tests
- database validation
- build
- dependency/security checks

Use separate workflows for:

    mobile
    api
    ingestion

Add pull request checks.

============================================================
28. DOCUMENTATION
============================================================

Create:

    README.md
    CONTRIBUTING.md
    SECURITY.md
    LICENSE

    docs/
      architecture.md
      database.md
      ingestion.md
      source-adapters.md
      search.md
      api.md
      mobile.md
      notifications.md
      development.md

Document how contributors can add a new opportunity source.

This is especially important for open-source growth.

Example:

    Adding a new source

    1. Create adapter
    2. Define source metadata
    3. Implement discovery
    4. Implement parser
    5. Add fixtures
    6. Add normalization tests
    7. Register adapter
    8. Run ingestion tests
    9. Submit PR

============================================================
29. OPEN-SOURCE ARCHITECTURE
============================================================

Design the project so external contributors can easily add:

- source adapters
- countries
- taxonomies
- normalization rules
- search providers
- notification providers
- UI components

Do not require contributors to understand the entire codebase to add
one new data source.

The source adapter API should be stable and documented.

============================================================
30. MVP SCOPE
============================================================

Do NOT build everything at once.

MVP should contain:

MOBILE:

- Home
- Explore
- Search
- Filters
- Opportunity details
- Save

BACKEND:

- authentication
- opportunities API
- search
- filters
- bookmarks
- basic user preferences

DATABASE:

- users
- sources
- opportunities
- categories
- saved opportunities

INGESTION:

Start with 3-5 high-quality, legally crawlable or API-accessible sources.

Implement:

- source adapter
- parser
- normalization
- validation
- deduplication
- scheduled ingestion

NOTIFICATIONS:

Basic saved-opportunity deadline reminders.

Do NOT build AI recommendations, Elasticsearch, complex analytics,
admin dashboard, or advanced personalization until the MVP is stable.

============================================================
31. FUTURE FEATURES
============================================================

Design extension points for:

- AI-powered semantic search
- personalized recommendations
- opportunity embeddings
- natural language search
- "find opportunities like this"
- automatic eligibility analysis
- application checklist generation
- deadline calendar
- email notifications
- Telegram/WhatsApp notifications
- browser extension
- web application
- university/provider dashboards
- community verification
- source reputation
- multilingual support
- opportunity quality scoring

Potential future query:

    "Find fully funded master's programs in AI in Europe
     that accept applicants from Egypt and have deadlines
     after January."

The architecture should eventually support this without rewriting
the entire system.

============================================================
32. DATABASE REQUIREMENTS
============================================================

Design a normalized PostgreSQL schema.

At minimum:

User
UserPreference
Opportunity
OpportunitySource
Category
FieldOfStudy
Country
OpportunityCountry
OpportunityField
SavedOpportunity
Application
NotificationPreference
IngestionRun
IngestionError

Use UUIDs.

Use timestamps consistently.

Use appropriate indexes.

Pay particular attention to:

- deadline queries
- filtering
- search
- source lookups
- duplicate detection
- saved opportunities
- user recommendations

Provide Prisma schema and explain important indexes.

============================================================
33. UI/UX REQUIREMENTS
============================================================

The UI should feel like a modern consumer application rather than
an academic database.

Design language:

- clean
- minimal
- modern
- accessible
- responsive
- card-based
- clear typography
- strong information hierarchy

Avoid excessive gradients, excessive glassmorphism, or unnecessary
animations.

Use meaningful visual indicators:

- funding
- deadline urgency
- category
- country
- verified source

Important states:

- loading
- empty
- error
- offline
- expired
- saved
- applying

Design skeleton loaders.

Support dark mode.

Follow accessibility guidelines.

============================================================
34. ARCHITECTURAL ABSTRACTIONS
============================================================

Use interfaces around replaceable infrastructure.

Examples:

    SearchProvider
    NotificationProvider
    AuthProvider
    OpportunityRepository
    SourceAdapter
    IngestionScheduler
    Git-like source versioning where applicable
    MatchingEngine

Business logic must depend on abstractions rather than concrete
infrastructure.

============================================================
35. ERROR HANDLING
============================================================

Errors must be explicit and actionable.

Do not silently swallow:

- crawler failures
- malformed records
- API errors
- database failures
- notification failures

Separate:

- user-facing errors
- operational errors
- developer diagnostics

============================================================
36. PERFORMANCE
============================================================

Optimize for:

- fast initial mobile load
- paginated APIs
- efficient database queries
- incremental ingestion
- incremental indexing
- background jobs
- minimal unnecessary network requests

Do not prematurely optimize.

Measure before introducing infrastructure.

============================================================
37. DEVELOPMENT WORKFLOW
============================================================

Implement incrementally.

Phase 1:
Architecture + monorepo + database

Phase 2:
Backend API + authentication

Phase 3:
Opportunity domain + search

Phase 4:
Ingestion framework

Phase 5:
First source adapters

Phase 6:
Mobile application

Phase 7:
Bookmarks + application tracking

Phase 8:
Notifications

Phase 9:
Search improvements

Phase 10:
AI-powered matching

After every phase:

1. Run tests.
2. Run lint.
3. Run type checking.
4. Run builds.
5. Review the architecture.
6. Review security implications.
7. Update documentation.
8. Inspect git diff.
9. Do not continue if the current phase is broken.

============================================================
38. FIRST TASK
============================================================

Do NOT immediately generate the entire application.

Start by producing:

1. System architecture
2. Architecture diagram
3. Monorepo directory structure
4. Domain model
5. PostgreSQL/Prisma schema
6. Database indexes
7. API boundary design
8. Ingestion architecture
9. SourceAdapter interface
10. SearchProvider interface
11. Key architectural decisions
12. MVP implementation plan

Explain the reasoning behind important architectural decisions.

Then implement Phase 1 only.

Do not implement Phase 2 until Phase 1 is complete, tested, and stable.

============================================================
39. QUALITY BAR
============================================================

Treat this as a real open-source product that could eventually support
millions of opportunities and a large developer/user community.

Do not create toy/demo architecture.

At the same time, avoid premature enterprise complexity.

Every architectural decision should answer:

- Is this needed now?
- Is it replaceable later?
- Is it testable?
- Is it understandable to contributors?
- Does it improve reliability?
- Does it improve developer experience?

Prefer simple, composable systems over large frameworks.

The final result should feel like a serious open-source product,
not an AI-generated prototype.