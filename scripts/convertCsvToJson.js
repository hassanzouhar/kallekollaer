#!/usr/bin/env node
/**
 * CSV to JSON Converter for Iskalde Kæller
 * Converts CSV files from sampledata/ to JSON format in data/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV with quote handling
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const row = {};
    let currentStr = '';
    let inQuotes = false;
    let colIndex = 0;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row[headers[colIndex]] = currentStr.trim();
        currentStr = '';
        colIndex++;
      } else {
        currentStr += char;
      }
    }
    row[headers[colIndex]] = currentStr.trim();

    // Clean up names (remove quotes)
    if (row['Name']) {
      row['Name'] = row['Name'].replace(/"/g, '');
      // Format "Last, First" -> "First Last"
      if (row['Name'].includes(',')) {
        const [last, first] = row['Name'].split(',').map(s => s.trim());
        row['Name'] = `${first} ${last}`;
      }
    }

    return row;
  });
}

// Team mapping
const teamMapping = {
  'Frisk Asker/NTG': { id: 'frisk', code: 'FRI', colors: ['#FFA500', '#000000'] },
  'Jar/Jutul': { id: 'jar', code: 'JAR', colors: ['#0000FF', '#FF0000'] },
  'Kongsvinger': { id: 'kongsvinger', code: 'KON', colors: ['#FF0000', '#FFFFFF'] },
  'Lillehammer Elite/NTG': { id: 'lillehammer', code: 'LIL', colors: ['#FF0000', '#0000FF'] },
  'Lørenskog/Furuset': { id: 'lorenskog', code: 'LØR', colors: ['#FF0000', '#0000FF'] },
  'Manglerud Star': { id: 'manglerud', code: 'MAN', colors: ['#00FF00', '#000000'] },
  'Nidaros': { id: 'nidaros', code: 'NID', colors: ['#000000', '#0000FF'] },
  'Sparta Sarp': { id: 'sparta', code: 'SPA', colors: ['#0000FF', '#FFFFFF'] },
  'Stavanger': { id: 'oilers', code: 'STA', colors: ['#000000', '#FFFFFF'] },
  'Stjernen': { id: 'stjernen', code: 'STJ', colors: ['#FF0000', '#FFFFFF'] },
  'Storhamar YA/Stange': { id: 'storhamar', code: 'STO', colors: ['#FFFF00', '#0000FF'] },
  'Vålerenga': { id: 'valerenga', code: 'VÅL', colors: ['#0000FF', '#FF0000'] }
};

// Convert Teams CSV
function convertTeams() {
  const csvPath = path.join(__dirname, '../sampledata/Teams.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvData);

  const teams = rows.map(row => {
    const teamName = row.TEAM;
    const mapping = teamMapping[teamName];

    return {
      id: mapping?.id || 'unknown',
      name: teamName,
      code: mapping?.code || teamName.substring(0, 3).toUpperCase(),
      city: teamName.split(' ')[0],
      colors: mapping?.colors || ['#CCCCCC', '#000000'],
      stats: {
        gamesPlayed: parseInt(row.GP) || 0,
        powerPlayGoalsFor: parseInt(row.PPGF) || 0,
        powerPlayAdvantages: parseInt(row.ADV) || 0,
        powerPlayPercent: parseFloat(row['PP%']) || 0,
        shortHandedGoalsAgainst: parseInt(row.SHGA) || 0,
        powerPlayGoalsAgainst: parseInt(row.PPGA) || 0,
        timesShortHanded: parseInt(row.TSH) || 0,
        penaltyKillPercent: parseFloat(row['PK%']) || 0,
        shortHandedGoalsFor: parseInt(row.SHGF) || 0,
        faceOffPercent: parseFloat(row['FO%']) || 0
      }
    };
  });

  const outputPath = path.join(__dirname, '../data/teams.json');
  fs.writeFileSync(outputPath, JSON.stringify(teams, null, 2));
  console.log(`✓ Converted ${teams.length} teams to ${outputPath}`);
}

// Convert Players CSV
function convertPlayers() {
  const csvPath = path.join(__dirname, '../sampledata/Players.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvData);

  const players = rows.map(row => {
    // Find team mapping
    const teamCode = row.Team;
    let teamId = 'unknown';
    for (const [name, data] of Object.entries(teamMapping)) {
      if (data.code === teamCode) {
        teamId = data.id;
        break;
      }
    }

    return {
      name: row.Name,
      team: teamId,
      teamCode: teamCode,
      stats: {
        rank: parseInt(row.RK) || 0,
        gamesPlayed: parseInt(row.GP) || 0,
        goals: parseInt(row.G) || 0,
        assists: parseInt(row.A) || 0,
        points: parseInt(row.PTS) || 0,
        plusMinus: parseInt(row['+-']) || 0,
        penaltyMinutes: parseInt(row.PIM) || 0,
        powerPlayGoals: parseInt(row.PP) || 0,
        powerPlayAssists: parseInt(row.PPA) || 0,
        shortHandedGoals: parseInt(row.SH) || 0,
        shortHandedAssists: parseInt(row.SHA) || 0,
        gameWinningGoals: parseInt(row.GWG) || 0,
        shotsOnGoal: parseInt(row.SOG) || 0,
        shootingPercent: parseFloat(row['S%']) || 0,
        faceOffs: parseInt(row.FO) || 0,
        faceOffPercent: parseFloat(row['FO%']) || 0
      }
    };
  });

  const outputPath = path.join(__dirname, '../data/players.json');
  fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
  console.log(`✓ Converted ${players.length} players to ${outputPath}`);
}

// Convert Goalies CSV
function convertGoalies() {
  const csvPath = path.join(__dirname, '../sampledata/Goalies.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvData);

  const goalies = rows.map(row => {
    // Find team mapping
    const teamCode = row.TEAM;
    let teamId = 'unknown';
    for (const [name, data] of Object.entries(teamMapping)) {
      if (data.code === teamCode) {
        teamId = data.id;
        break;
      }
    }

    return {
      name: row.Name,
      team: teamId,
      teamCode: teamCode,
      stats: {
        rank: parseInt(row.RK) || 0,
        gamesPlayed: parseInt(row.GP) || 0,
        timeOnIce: parseInt(row.TOI) || 0,
        wins: parseInt(row.W) || 0,
        losses: parseInt(row.L) || 0,
        shutouts: parseInt(row.SO) || 0,
        goalsAgainst: parseInt(row.GA) || 0,
        goalsAgainstAverage: parseFloat(row.GAA) || 0,
        saves: parseInt(row.SV) || 0,
        savePercent: parseFloat(row['SV%']) || 0
      }
    };
  });

  const outputPath = path.join(__dirname, '../data/goalies.json');
  fs.writeFileSync(outputPath, JSON.stringify(goalies, null, 2));
  console.log(`✓ Converted ${goalies.length} goalies to ${outputPath}`);
}

// Convert Standings CSV
function convertStandings() {
  const csvPath = path.join(__dirname, '../sampledata/Standings.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvData);

  const standings = rows.map(row => {
    const teamName = row.TEAM;
    const mapping = teamMapping[teamName];

    return {
      rank: parseInt(row['']) || 0,
      teamId: mapping?.id || 'unknown',
      teamName: teamName,
      gamesPlayed: parseInt(row.GP) || 0,
      wins: parseInt(row.W) || 0,
      overtimeWins: parseInt(row.OTW) || 0,
      shootoutWins: parseInt(row.SOW) || 0,
      overtimeLosses: parseInt(row.OTL) || 0,
      shootoutLosses: parseInt(row.SOL) || 0,
      losses: parseInt(row.L) || 0,
      points: parseInt(row.PTS) || 0,
      goalsFor: parseInt(row.GF) || 0,
      goalsAgainst: parseInt(row.GA) || 0,
      penaltyMinutes: parseInt(row.PIM) || 0,
      pointPercent: parseFloat(row.PCT) || 0
    };
  });

  const outputPath = path.join(__dirname, '../data/standings.json');
  fs.writeFileSync(outputPath, JSON.stringify(standings, null, 2));
  console.log(`✓ Converted ${standings.length} standings entries to ${outputPath}`);
}

// Run all conversions
console.log('Converting CSV files to JSON...\n');
convertTeams();
convertPlayers();
convertGoalies();
convertStandings();
console.log('\n✓ All conversions complete!');
