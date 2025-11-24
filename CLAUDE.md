# CLAUDE.md - AI Assistant Guide

## Project Overview

**Project Name:** Iskalde Kæller (Nordic Puck '98)
**Description:** A retro-styled hockey management simulation game for the Norwegian U18 Elite League. Players manage their roster, simulate matches, scout talent, and climb the ranks in a nostalgic CRT terminal aesthetic.

**Tech Stack:**
- **Frontend:** React 19.2 + TypeScript
- **Build Tool:** Vite 6.2
- **Styling:** TailwindCSS (via CDN) + Inline CSS
- **AI Integration:** Google Gemini API (@google/genai 1.30.0)
- **Icons:** Lucide React
- **Font:** VT323 (Google Fonts - retro terminal style)

---

## Codebase Structure

```
kallekollaer/
├── App.tsx                 # Main application component with game state management
├── index.tsx               # React app entry point
├── index.html              # HTML template with Tailwind CDN and VT323 font
├── vite.config.ts          # Vite configuration with path aliases
├── tsconfig.json           # TypeScript configuration (ES2022, React JSX)
├── package.json            # Dependencies and scripts
├── metadata.json           # App metadata for AI Studio
│
├── types.ts                # Main type definitions (Position, Player, Team, etc.)
├── types-1.ts              # Additional type definitions
├── constants.ts            # Game data (teams, players from CSV), generators
│
├── components/             # React components for different game views
│   ├── RetroLayout.tsx     # Main layout wrapper with CRT effects
│   ├── RetroButton.tsx     # Styled retro button component
│   ├── Onboarding.tsx      # Team selection and career start
│   ├── RosterView.tsx      # Player roster management
│   ├── MatchSimulator.tsx  # Match simulation engine
│   ├── LeagueView.tsx      # League standings and schedule
│   ├── ScoutingAndDeals.tsx # Scouting and transfer market
│   ├── ScoutingOffice.tsx  # Scout hiring and reports
│   ├── TransferMarket.tsx  # Player transfers
│   ├── TrainingCamp.tsx    # Player training management
│   ├── TacticsBoard.tsx    # Team tactics configuration
│   ├── FrontOffice.tsx     # Club upgrades and staff
│   ├── ContractDesk.tsx    # Contract negotiations
│   ├── PlayerModal.tsx     # Detailed player information
│   ├── PlayoffBracket.tsx  # Playoff bracket visualization
│   └── Standings.tsx       # League standings table
│
├── services/
│   └── geminiService.ts    # Google Gemini AI integration for match recaps/advice
│
├── sampledata/             # CSV source data
│   ├── Teams.csv           # Team statistics
│   ├── Players.csv         # Player statistics
│   ├── Goalies.csv         # Goalie statistics
│   └── Standings.csv       # League standings data
│
└── images/                 # Game assets (player images, screenshots)
```

---

## Key Technical Conventions

### TypeScript Patterns

1. **Strict Type Safety**
   - All components use TypeScript with explicit interfaces
   - Enum-based constants for positions, game states, tactics (see `types.ts`)
   - No implicit any types allowed

2. **Type Definitions**
   ```typescript
   // Example from types.ts
   export enum Position {
     GOALIE = 'G',
     DEFENDER = 'D',
     FORWARD = 'F',
     CENTER = 'C'
   }

   export interface Player {
     id: string;
     name: string;
     position: Position;
     skill: number;        // 0-100
     potential: number;    // 0-100
     // ... more properties
   }
   ```

3. **State Management**
   - Local state using `useState` for component-level state
   - Props drilling for shared state (no Redux/Context currently)
   - State lifting pattern for cross-component communication

### Component Architecture

1. **Layout Pattern**
   - All main views wrapped in `<RetroLayout>` component
   - Layout provides consistent CRT aesthetic and header/footer
   - Props: `title`, `wallet` (optional budget display)

2. **Component File Structure**
   ```typescript
   import React, { useState } from 'react';
   import { SomeType } from '../types';

   interface ComponentProps {
     // ... prop types
   }

   export const Component: React.FC<ComponentProps> = ({ props }) => {
     // State declarations
     // Event handlers
     // Return JSX
   };
   ```

3. **Naming Conventions**
   - Components: PascalCase (e.g., `RosterView.tsx`)
   - Files: Match component name (e.g., `RosterView.tsx`)
   - Interfaces: PascalCase with descriptive names
   - Functions: camelCase (e.g., `handleOnboardingComplete`)
   - Constants: UPPER_SNAKE_CASE (e.g., `INITIAL_TEAMS`)

### Styling Approach

1. **Retro CRT Aesthetic**
   - Primary color: `#33ff00` (bright green)
   - Background: `#0a0a0a` (near black)
   - Font: VT323 monospace
   - CRT effects: scanlines, vignette, text glow

2. **TailwindCSS Usage**
   - Utility-first approach
   - Inline classes for most styling
   - Custom colors: `text-[#33ff00]`, `bg-[#0a0a0a]`
   - Responsive breakpoints: `md:`, `lg:` prefixes

3. **Animation Guidelines**
   - Subtle scanline animations (reduced for UX)
   - Text glow effects on headers
   - Minimal flickering (intentionally reduced)

### AI Integration

1. **Gemini Service** (`services/geminiService.ts`)
   - **Purpose:** Generate match recaps and coaching advice
   - **Model:** `gemini-2.5-flash`
   - **Fallback Strategy:** Always provide hardcoded fallbacks if API fails
   - **Caching:** Advice cached per week to reduce API calls

2. **Environment Variables**
   - Required: `GEMINI_API_KEY` in `.env.local`
   - Accessed via `process.env.API_KEY` (defined in vite.config.ts)

3. **Error Handling**
   - All AI calls wrapped in try-catch
   - Silent failures with fallback content
   - Console warnings for debugging

### Data Management

1. **Constants File** (`constants.ts`)
   - Contains raw CSV data as template strings
   - Parser functions to convert CSV to typed objects
   - Team/player generators for new seasons
   - Schedule generation algorithms

2. **State Persistence**
   - Currently no localStorage implementation
   - State resets on page refresh (intentional for prototype)

3. **CSV Data Sources**
   - Real Norwegian U18 league statistics
   - Teams, players, goalies from `sampledata/` directory
   - Parsed and transformed into game objects

---

## Development Workflows

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
# Create .env.local and add: GEMINI_API_KEY=your_key_here

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Git Workflow

**Current Branch:** `claude/claude-md-micfftwt4sueyugz-011UhEuRsruNEXDMSjCu2MVH`

**Branch Naming Convention:**
- Feature branches: `claude/claude-md-{session-id}`
- Must start with `claude/` prefix for push permissions

**Commit Guidelines:**
- Clear, descriptive commit messages
- Focus on "why" rather than "what"
- Follow repository's existing commit style

### Testing Strategy

**Current Status:** No automated tests implemented

**Manual Testing Checklist:**
- Verify all game views render correctly
- Test match simulation logic
- Validate player stat calculations
- Check AI integration (match recaps, advice)
- Test responsive design (mobile/desktop)

---

## Key Game Systems

### 1. Career Mode
- Player selects starting team and dream team
- Progress through seasons
- Receive job offers based on performance
- Track accomplishments and titles

### 2. Match Simulation
- Real-time play-by-play simulation
- Events: Goals, saves, penalties, roughing
- Stats tracking: shots, goals, assists, PIM
- AI-generated match recaps

### 3. Roster Management
- Line assignments (L1-L4, G1-G2, BENCH)
- Player attributes: skill, stamina, morale, fatigue
- Injuries and recovery system
- Training focus options

### 4. Scouting & Transfers
- Scout hiring with different specialties
- Scouting reports on players
- Transfer market negotiations
- "Dirty deals" system (high-risk scouting)

### 5. Tactics & Strategy
- Tactic styles: Balanced, Dump and Chase, Skill Cycle, etc.
- Aggression levels: Low, Medium, High, Enforcer
- Line-specific strategies

### 6. Economy System
- Budget tracking (PØKKS currency)
- Club upgrades: Equipment, Swag, Facilities
- Staff hiring: Coaches, assistants, fixers
- Dugnad fundraisers (cooldown system)

---

## AI Assistant Guidelines

### When Making Changes

1. **Read Before Modifying**
   - Always read files before editing (required by tooling)
   - Understand existing patterns and conventions
   - Maintain consistency with codebase style

2. **Type Safety First**
   - Never use `any` types
   - Update type definitions when adding features
   - Ensure all props are properly typed

3. **Preserve Aesthetic**
   - Maintain retro CRT visual style
   - Use green monochrome color scheme
   - Keep VT323 font consistency
   - Preserve scanline and glow effects

4. **Component Structure**
   - Follow existing component patterns
   - Wrap new views in `<RetroLayout>`
   - Use `<RetroButton>` for interactive elements
   - Maintain responsive design patterns

5. **AI Integration**
   - Always implement fallback mechanisms
   - Handle API errors gracefully
   - Use caching to minimize API calls
   - Keep prompts concise and themed (90s hockey)

### Common Tasks

**Adding a New Component:**
1. Create file in `/components/` with PascalCase name
2. Define props interface
3. Export as named export: `export const ComponentName: React.FC<Props>`
4. Import types from `../types`
5. Wrap content in `<RetroLayout>` if it's a main view

**Adding Game Features:**
1. Update type definitions in `types.ts`
2. Modify App.tsx state if needed
3. Create/update relevant component
4. Test with manual playthrough
5. Ensure retro aesthetic is maintained

**Modifying AI Prompts:**
1. Edit `services/geminiService.ts`
2. Keep 90s hockey theme in prompts
3. Update fallback arrays accordingly
4. Test both success and failure paths

**Updating Game Data:**
1. Modify CSV strings in `constants.ts`
2. Update parser functions if schema changes
3. Verify data integrity after changes

### Code Quality Standards

1. **No Over-Engineering**
   - Keep solutions simple and direct
   - Don't add unnecessary abstractions
   - Avoid premature optimization
   - Three similar lines is better than a premature abstraction

2. **Documentation**
   - Comment complex game logic
   - Explain non-obvious calculations
   - Document edge cases
   - Keep comments concise

3. **Performance Considerations**
   - Minimize re-renders (React.memo where appropriate)
   - Cache expensive calculations
   - Limit AI API calls
   - Optimize large list rendering

4. **Error Handling**
   - Graceful degradation for AI failures
   - User-friendly error messages (in retro style)
   - Console warnings for debugging
   - Never crash the game on errors

### Theme and Tone

**Visual Identity:**
- 1990s CRT terminal aesthetic
- Green phosphor monochrome display
- Scanline effects (subtle)
- VT323 retro font
- Norwegian hockey culture references

**Writing Style:**
- Enthusiastic 90s sportscaster energy
- Hockey slang and terminology
- Norwegian team/city references
- Retro gaming UI language

**User Experience:**
- Nostalgic but functional
- Clear information hierarchy
- Responsive feedback
- Smooth transitions between views

---

## Environment Setup

### Required Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

### Port Configuration

- **Development Server:** http://localhost:3000
- **Host:** 0.0.0.0 (accessible on network)

### Path Aliases

```typescript
// Configured in tsconfig.json and vite.config.ts
import Component from '@/components/Component'  // '@/' maps to root
```

---

## Known Limitations & Future Considerations

### Current Limitations

1. **No State Persistence**
   - Game state resets on page refresh
   - Consider implementing localStorage for save system

2. **No Backend**
   - All data client-side only
   - No multiplayer or cloud saves

3. **Limited Testing**
   - No unit tests implemented
   - Manual testing only

4. **API Dependency**
   - Requires Gemini API key for full experience
   - Fallbacks work but reduce immersion

### Future Enhancement Ideas

1. **Save System**
   - localStorage-based save/load
   - Multiple save slots
   - Export/import save files

2. **Enhanced Features**
   - Player development arcs
   - More detailed scouting reports
   - Expanded tactics system
   - Playoff championship celebrations

3. **Technical Improvements**
   - State management library (if complexity grows)
   - Unit tests for game logic
   - E2E tests for critical flows
   - Performance profiling

---

## Quick Reference

### Important Files to Read First

1. `types.ts` - Understand all data structures
2. `App.tsx` - Main game state and view routing
3. `constants.ts` - Game data and generators
4. `services/geminiService.ts` - AI integration
5. `components/RetroLayout.tsx` - Layout wrapper

### Common State Variables in App.tsx

- `gameState` - Current game phase (ONBOARDING, SEASON)
- `view` - Current screen view (DASHBOARD, ROSTER, etc.)
- `teams` - All league teams
- `userTeamId` - Player's current team
- `schedule` - Season schedule
- `currentWeek` - Current week number
- `phase` - Season phase (REGULAR_SEASON, PLAYOFFS)

### Key Enums to Remember

- `Position`: GOALIE, DEFENDER, FORWARD, CENTER
- `GameView`: DASHBOARD, ROSTER, MATCH, LEAGUE, etc.
- `GameState`: ONBOARDING, SEASON
- `SeasonPhase`: REGULAR_SEASON, PLAYOFFS, OFFSEASON
- `TacticStyle`: BALANCED, DUMP_AND_CHASE, SKILL_CYCLE, etc.
- `AggressionLevel`: LOW, MEDIUM, HIGH, ENFORCER
- `TrainingFocus`: GENERAL, TECHNICAL, PHYSICAL, TACTICAL, REST

---

## Contact & Resources

- **AI Studio App:** https://ai.studio/apps/drive/1nWiq1u4Rv-nVO8xHSvsblvxsRxj6q3C1
- **Repository:** hassanzouhar/kallekollaer
- **Branch:** claude/claude-md-micfftwt4sueyugz-011UhEuRsruNEXDMSjCu2MVH

---

## Final Notes for AI Assistants

- **Always maintain the retro aesthetic** - It's core to the game's identity
- **Test changes manually** - Run the game and verify features work
- **Keep it simple** - Don't over-engineer solutions
- **Graceful degradation** - Handle errors without breaking the experience
- **Respect the theme** - 90s Norwegian hockey culture is part of the charm
- **Read existing code first** - Understand patterns before making changes
- **TypeScript is non-negotiable** - All code must be properly typed

Happy coding, and may your players always find the back of the net! 🏒
