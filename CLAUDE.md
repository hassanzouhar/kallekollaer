# CLAUDE.md - AI Assistant Guide

## Project Overview

**Iskalde Kæller (Nordic Puck '98)** - Retro hockey management sim for Norwegian U18 Elite League with CRT terminal aesthetic.

**Tech Stack:** React 19.2 + TypeScript, Vite 6.2, TailwindCSS CDN, Groq AI, Lucide Icons, VT323 Font

---

## Core Principles

### AI Assistant Role
- **You are the technical lead** - Make implementation decisions directly
- **Work in iterations, not timelines** - No "weeks" or "days", only task completion
- **Optimize ruthlessly** - Simple solutions over abstractions
- **Maintain aesthetic** - Retro CRT is non-negotiable

### Code Quality
- **TypeScript strict mode** - No `any` types
- **Read before modifying** - Understand patterns first
- **Test manually** - Run game after changes
- **Preserve theme** - 90s Norwegian hockey culture

---

## Critical Game Balance Issues

### Match Simulation (MatchSimulator.tsx:188-189)
**Problem:** Goal threshold too high (2.5% base = 150% over 60min), skill差异 impact too low (0.15x)
**Fix:** Reduce base to 1.2%, increase skill multiplier to 0.4x, clamp 0.3-3.5%

### Training Economy (App.tsx:539)
**Problem:** Only 3 TP/week but drills cost 2-3 TP, players "slack off" and lose morale
**Fix:** Increase to 5 TP/week, show TP forecast in UI

### Economy Inflation (App.tsx:30-38)
**Problem:** 2 PØKKS/win over 22 weeks = 44+ income, upgrades only 10-50 total
**Fix:** Reduce income (1.5/1.5/0.5), add weekly expenses (2 PØKKS rent), scale upgrade costs

### Scouting Opacity (ScoutingAndDeals.tsx:32-58)
**Problem:** Success % shown after attempt, not before; scout skill effects hidden
**Fix:** Show deal % before attempt, preview player attributes, make mishaps skill-based

### Progression Gap (App.tsx:177-227)
**Problem:** Weeks 8-20 identical, no mid-season events, stats reset each season
**Fix:** Add random events every 3-5 weeks, track career stats, championship legacy

---

## Architecture

### File Structure
```
components/          # React views (MatchSimulator, TrainingCamp, etc.)
utils/              # playerGenerator, teamBuilder, scheduleGenerator
data/               # teams.json, players.json, goalies.json, gameConstants.ts
services/           # groqService (AI match recaps)
types.ts            # All type definitions
App.tsx             # Main game state & routing
```

### Key State (App.tsx)
- `gameState` - ONBOARDING | SEASON | OFFSEASON
- `teams` - All league teams with rosters
- `currentWeek` - 1-22 (regular), 23-24 (playoffs)
- `phase` - REGULAR_SEASON | PLAYOFFS
- `playerUpdates` - Match stat accumulation

### Game Loop
1. Dashboard → Locker Room (tactics) → Match → Process Results
2. Weekly: TP regen, training effects, scout reports, wage deduction
3. Week 22: Playoffs setup (top 4, single elimination)
4. Season end: Job offers, roster replenishment

---

## Styling Standards

**Colors:** `#33ff00` (green), `#0a0a0a` (black), `text-[#33ff00]`
**Font:** VT323 monospace
**Effects:** Scanlines, text glow, CRT vignette
**Layout:** All views wrap in `<RetroLayout>`, buttons use `<RetroButton>`

---

## Type Safety

```typescript
// Enums for type safety
Position: G | D | F | C
TrainingFocus: GENERAL | TECHNICAL | PHYSICAL | TACTICAL | REST
TacticStyle: BALANCED | DUMP_AND_CHASE | SKILL_CYCLE | COUNTER_ATTACK | TRAP
AggressionLevel: LOW | MEDIUM | HIGH | ENFORCER

// Always use interfaces for props
interface ComponentProps { ... }
export const Component: React.FC<ComponentProps> = ({ ... }) => { ... }
```

---

## Quick Reference

### Critical Files
1. `types.ts` - All data structures
2. `App.tsx` - Game state management
3. `components/MatchSimulator.tsx` - Match engine
4. `utils/playerGenerator.ts` - Player creation
5. `data/gameConstants.ts` - Balance values

### Common Tasks
- **Add feature:** Update types.ts → Modify App.tsx state → Create/update component
- **Balance change:** Edit constants in gameConstants.ts or component logic
- **AI prompts:** Edit services/groqService.ts, update fallbacks
- **New component:** Create in components/, import types, wrap in RetroLayout

### Git Workflow
- Branch: `claude/review-game-logic-012XiBE6pFK7keutDQQh5376`
- Commit style: Concise, focus on "why"
- Push: `git push -u origin <branch>`

---

## Testing Checklist
- Match scores realistic (2-4 goals/game)
- Training TP economy functional
- Economy has resource tension
- Scouting decisions feel strategic
- Season progression engaging

---

## AI Integration
- **Service:** Groq `llama-3.3-70b-versatile`
- **Uses:** Match recaps, coaching advice
- **Fallbacks:** Always provide hardcoded alternatives
- **Caching:** Weekly advice cached to reduce API calls
- **Env:** `GROQ_API_KEY` in `.env.local`

---

## Notes
- localStorage save system implemented
- No time estimates - tasks complete when done
- Simple > clever
- Retro aesthetic is identity
- 90s hockey culture theming
