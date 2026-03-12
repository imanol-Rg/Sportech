/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskStatus = 'SAFE' | 'CAUTION' | 'OVERLOAD';

export interface Athlete {
  id: string;
  name: string;
  squad: string;
  availabilityStatus: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  availabilityReason?: string;
  riskStatus: RiskStatus;
  hrv: number;
  trainingLoad: number;
  recoveryScore: number;
  wellness: number;
  recentSpike: number; // percentage
  atRiskAreas: string[];
  lastSessionsLoad: number[];
}

export interface Alert {
  id: string;
  athleteId: string;
  athleteName: string;
  type: 'SPIKE' | 'WELLNESS' | 'RECOVERY';
  severity: 'HIGH' | 'MEDIUM';
  message: string;
  recommendation: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  squad: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  riskReasons?: string[];
  matches?: { date: string; opponent: string }[];
  players?: { athleteId: string; status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'; reason: string }[];
  recommendations?: { title: string; description: string }[];
  predictedFatigue?: number;
}

export interface CommunicationLog {
  id: string;
  athleteId: string;
  athleteName: string;
  parentName: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  message: string;
  timestamp: string;
}

export interface RecoveryPrescription {
  id: string;
  title: string;
  category: 'MOBILITY' | 'NUTRITION' | 'SLEEP' | 'HYDRO';
  duration: string;
  intensity: 'LOW' | 'MEDIUM';
  description: string;
}
