# Change Logs Directory Structure

## Directory Layout
```
logs/
├── CHANGES/     # Chronological changes with fantasy names
├── ROLLBACKS/   # Rollback history and recovery points
├── API/         # API-specific changes
├── SECURITY/    # Security-related changes
├── UI/          # UI/Frontend changes (when permitted)
└── FEATURES/    # New feature additions
```

## Naming Convention
Files follow the format: DD-XXX-[FantasyName].log

Examples:
- 28-001-Dragon.log
- 28-002-Phoenix.log
- 28-003-Griffon.log

## Fantasy Name Categories
- Dragons: Major system changes
- Phoenix: Recovery and fixes
- Griffon: Security updates
- Unicorn: UI/UX changes
- Basilisk: Database changes
- Hydra: Multi-component changes
- Kraken: API changes
- Chimera: Hybrid/mixed changes

## Log Format
```json
{
  "metadata": {
    "id": "string",
    "timestamp": "ISO-8601 date",
    "fantasyName": "string",
    "category": "string",
    "author": "string"
  },
  "changes": {
    "files": [{
      "path": "string",
      "diff": "string",
      "checksum": "string"
    }],
    "dependencies": ["string"],
    "rollbackSteps": ["string"]
  },
  "context": {
    "description": "string",
    "motivation": "string",
    "relatedLogs": ["string"]
  }
}
```

## Rollback Feature
To rollback to a specific point:
1. Use fantasy name: `yarn rollback dragon`
2. Use full log name: `yarn rollback 28-001-Dragon`
3. Use date: `yarn rollback 2024-03-28`

## Size Limit
Each log file must not exceed 1MB in size.