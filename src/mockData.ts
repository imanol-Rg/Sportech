/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Athlete, Alert, CalendarEvent, CommunicationLog, RecoveryPrescription } from './types';

export const MOCK_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    squad: 'U16 Academy',
    availabilityStatus: 'LIMITED',
    availabilityReason: 'load spike +42%, reduced sprint volume recommended',
    riskStatus: 'OVERLOAD',
    hrv: 42,
    trainingLoad: 850,
    recoveryScore: 45,
    wellness: 3,
    recentSpike: 42,
    atRiskAreas: ['Hamstring', 'Lower Back'],
    lastSessionsLoad: [620, 710, 850, 900, 920],
  },
  {
    id: '2',
    name: 'Leo Silva',
    squad: 'U16 Academy',
    availabilityStatus: 'AVAILABLE',
    availabilityReason: 'recovery 88%, no load spike detected',
    riskStatus: 'SAFE',
    hrv: 68,
    trainingLoad: 420,
    recoveryScore: 88,
    wellness: 9,
    recentSpike: 5,
    atRiskAreas: [],
    lastSessionsLoad: [400, 410, 420, 415, 420],
  },
  {
    id: '3',
    name: 'Sarah Chen',
    squad: 'U18 Elite',
    availabilityStatus: 'AVAILABLE',
    availabilityReason: 'recovery 62%, monitoring ankle caution',
    riskStatus: 'CAUTION',
    hrv: 55,
    trainingLoad: 610,
    recoveryScore: 62,
    wellness: 6,
    recentSpike: 18,
    atRiskAreas: ['Ankle'],
    lastSessionsLoad: [500, 520, 550, 580, 610],
  },
  {
    id: '4',
    name: 'David Okafor',
    squad: 'U18 Elite',
    availabilityStatus: 'UNAVAILABLE',
    availabilityReason: 'recovery deficit 35%, mandatory rest required',
    riskStatus: 'OVERLOAD',
    hrv: 38,
    trainingLoad: 920,
    recoveryScore: 35,
    wellness: 2,
    recentSpike: 55,
    atRiskAreas: ['Knee', 'Quadriceps'],
    lastSessionsLoad: [700, 750, 820, 880, 920],
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    athleteId: '1',
    athleteName: 'Marcus Johnson',
    type: 'SPIKE',
    severity: 'HIGH',
    message: 'High risk of hamstring strain.',
    recommendation: 'Reduce sprint volume by 20% next session.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'a2',
    athleteId: '4',
    athleteName: 'David Okafor',
    type: 'RECOVERY',
    severity: 'HIGH',
    message: 'Critical recovery deficit detected.',
    recommendation: 'Mandatory rest day. Hydrotherapy prescribed.',
    timestamp: new Date().toISOString(),
  },
];

export const MOCK_CALENDAR: CalendarEvent[] = [
  // February 2026
  {
    id: 'c_feb_1',
    date: '2026-02-10',
    endDate: '2026-02-12',
    title: 'Pre-Season Scrimmages',
    squad: 'U16 Academy',
    riskLevel: 'MEDIUM',
    description: 'Back-to-back friendly matches.',
    riskReasons: ['Early season load', 'Low fitness base'],
    matches: [
      { date: '2026-02-10', opponent: 'Local Club A' },
      { date: '2026-02-12', opponent: 'Local Club B' }
    ],
    players: [
      { athleteId: '1', status: 'AVAILABLE', reason: 'Base fitness stable' },
      { athleteId: '2', status: 'AVAILABLE', reason: 'Full clearance' }
    ],
    recommendations: [
      { title: 'Minute Caps', description: 'Limit all players to 45 mins per match.' }
    ],
    predictedFatigue: 15
  },
  // March 2026
  {
    id: 'c1',
    date: '2026-03-13',
    endDate: '2026-03-21',
    title: 'Regional Tournament',
    squad: 'U16 Academy',
    riskLevel: 'HIGH',
    description: '4 matches in 9 days. High overload risk.',
    riskReasons: [
      '4 matches in 9 days',
      '2 travel days',
      '1 athlete in overload',
      '2 athletes in caution',
      'Short recovery window'
    ],
    matches: [
      { date: '2026-03-13', opponent: 'LA Galaxy Academy' },
      { date: '2026-03-16', opponent: 'San Jose Earthquakes Academy' },
      { date: '2026-03-19', opponent: 'Sacramento Republic Academy' },
      { date: '2026-03-21', opponent: 'De Anza Force' }
    ],
    players: [
      { athleteId: '1', status: 'LIMITED', reason: 'load spike +42%, reduced sprint volume recommended' },
      { athleteId: '2', status: 'AVAILABLE', reason: 'recovery 88%, no load spike detected' },
      { athleteId: '4', status: 'UNAVAILABLE', reason: 'recovery deficit 35%, mandatory rest required' },
      { athleteId: '3', status: 'LIMITED', reason: 'Ankle caution, monitor closely' }
    ],
    recommendations: [
      { title: 'Rotate Starting XI', description: 'Rotate starting XI by at least 40% for match 2 and 3.' },
      { title: 'Cap Training', description: 'Cap training sessions at 45 minutes between matches.' },
      { title: 'Hydrotherapy', description: 'Mandatory hydrotherapy on Mar 15 and 17.' }
    ],
    predictedFatigue: 35
  },
  {
    id: 'c2',
    date: '2026-03-18',
    title: 'Intensive Training Block',
    squad: 'U18 Elite',
    riskLevel: 'MEDIUM',
    description: 'Double sessions scheduled.',
    riskReasons: ['Double sessions', 'High intensity focus'],
    recommendations: [
      { title: 'Sleep Monitoring', description: 'Ensure 9+ hours of sleep during this block.' }
    ],
    predictedFatigue: 20
  },
  // April 2026
  {
    id: 'c_apr_1',
    date: '2026-04-05',
    endDate: '2026-04-12',
    title: 'Spring Break Cup',
    squad: 'U18 Elite',
    riskLevel: 'HIGH',
    description: 'Intense tournament schedule.',
    riskReasons: ['3 matches in 7 days', 'Travel to East Coast'],
    matches: [
      { date: '2026-04-05', opponent: 'NY Red Bulls Academy' },
      { date: '2026-04-08', opponent: 'NYCFC Academy' },
      { date: '2026-04-12', opponent: 'Philadelphia Union Academy' }
    ],
    players: [
      { athleteId: '3', status: 'AVAILABLE', reason: 'Fully recovered' },
      { athleteId: '4', status: 'LIMITED', reason: 'Post-injury load management' }
    ],
    recommendations: [
      { title: 'Hydration Focus', description: 'Increased electrolyte intake due to travel.' }
    ],
    predictedFatigue: 28
  }
];

export const MOCK_COMM_LOGS: CommunicationLog[] = [
  {
    id: 'l1',
    athleteId: '1',
    athleteName: 'Marcus Johnson',
    parentName: 'Robert Johnson',
    status: 'READ',
    message: 'Overload risk alert: Marcus has entered RED status. Training load spike detected.',
    timestamp: new Date().toISOString(),
  },
];

export const MOCK_PRESCRIPTIONS: RecoveryPrescription[] = [
  {
    id: 'p1',
    title: 'Lower Body Mobility',
    category: 'MOBILITY',
    duration: '15 min',
    intensity: 'LOW',
    description: 'Focus on hip flexors and hamstring active stretching.',
  },
  {
    id: 'p2',
    title: 'Contrast Bath Protocol',
    category: 'HYDRO',
    duration: '20 min',
    intensity: 'MEDIUM',
    description: '3 min cold / 1 min hot. Repeat 5 times.',
  },
];
