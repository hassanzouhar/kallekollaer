import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { Team, MatchResult } from '../types';

// Fallback phrases when API fails
const FALLBACK_RECAPS = [
    "A gritty display of hockey today. The ice was rough, the hits were hard, and the fans went home happy.",
    "Transmission fuzzy... but the scoreboard doesn't lie. A classic battle in the U18 Elite League.",
    "Both teams left everything on the ice. A true testament to Norwegian youth hockey.",
    "High tension, big saves, and waffle sales were through the roof. What a match.",
    "The Zamboni driver was the real MVP today, but the players did their best too."
];

const FALLBACK_ADVICE = [
    "Skate fast, shoot hard.",
    "Keep your stick on the ice.",
    "Get pucks deep, get pucks to the net.",
    "Play the body, not the puck.",
    "Focus on the fundamentals.",
    "Don't let them get in your head."
];

export const generateMatchRecap = async (
  homeTeam: Team,
  awayTeam: Team,
  result: MatchResult
): Promise<string> => {
  if (!process.env.GROQ_API_KEY) {
    return FALLBACK_RECAPS[0];
  }

  // Calculate average fatigue for context
  const homeAvgFatigue = homeTeam.roster.reduce((a, b) => a + b.fatigue, 0) / homeTeam.roster.length;
  const awayAvgFatigue = awayTeam.roster.reduce((a, b) => a + b.fatigue, 0) / awayTeam.roster.length;

  const prompt = `
    Write a short, intense, 1990s style sportscaster recap for a Norwegian U18 hockey match.
    Home Team: ${homeTeam.name} (Avg Fatigue: ${Math.round(homeAvgFatigue)}%)
    Away Team: ${awayTeam.name} (Avg Fatigue: ${Math.round(awayAvgFatigue)}%)
    Final Score: ${result.homeScore} - ${result.awayScore}

    Key events: ${result.events.filter(e => e.type === 'GOAL' || e.type === 'ROUGHING').map(e => `${e.minute}': ${e.description}`).join(', ')}.

    If fatigue levels are high (>40%), mention the tired legs.
    If there were fights (ROUGHING), mention the aggressive atmosphere.
    Tone: Enthusiastic, retro, slightly gritty. Keep it under 80 words.
  `;

  try {
    const response = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: prompt,
      temperature: 0.8,
      maxTokens: 150,
    });
    return response.text || FALLBACK_RECAPS[Math.floor(Math.random() * FALLBACK_RECAPS.length)];
  } catch (error) {
    console.warn("Groq API Error (Recap):", error);
    return FALLBACK_RECAPS[Math.floor(Math.random() * FALLBACK_RECAPS.length)];
  }
};

export const getAssistantAdvice = async (
  team: Team,
  nextOpponent: Team
): Promise<string> => {
  if (!process.env.GROQ_API_KEY) {
    return FALLBACK_ADVICE[0];
  }

  const prompt = `
    You are a grumpy but wise assistant hockey coach in the 90s.
    We (Vålerenga U18) are playing against ${nextOpponent.name}.
    Our top player has skill ${Math.max(...team.roster.map(p => p.skill))}.
    Their team city is ${nextOpponent.city}.

    Give me one short sentence of tactical advice, using hockey slang.
  `;

  try {
    const response = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: prompt,
      temperature: 0.9,
      maxTokens: 50,
    });
    return response.text || FALLBACK_ADVICE[Math.floor(Math.random() * FALLBACK_ADVICE.length)];
  } catch (error) {
    console.warn("Groq API Error (Advice):", error);
    return FALLBACK_ADVICE[Math.floor(Math.random() * FALLBACK_ADVICE.length)];
  }
}
