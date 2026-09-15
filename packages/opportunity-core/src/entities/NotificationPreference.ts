import type { UnknownOr } from '@oppora/shared';

/** Supported reminder lead times, in days before a known deadline. */
export const SUPPORTED_LEAD_TIMES = [30, 14, 7, 3, 1] as const;
export type LeadTimeDays = (typeof SUPPORTED_LEAD_TIMES)[number];

/**
 * Represents user-controlled reminder settings.
 *
 * Rules: supported lead times are 30, 14, 7, 3, and 1 day; reminders require a valid known
 * deadline; no notification is sent when disabled.
 */
export interface NotificationPreference {
  userId: string;
  enabled: boolean;
  leadTimes: LeadTimeDays[];
  updatedAt: Date;
}

export function isSupportedLeadTime(days: number): days is LeadTimeDays {
  return (SUPPORTED_LEAD_TIMES as readonly number[]).includes(days);
}

/**
 * Determines whether a reminder should be sent for a given opportunity deadline, lead time, and
 * user preference. Returns false when the deadline is unknown/invalid, when notifications are
 * disabled, or when the lead time is unsupported.
 */
export function shouldSendReminder(
  deadline: UnknownOr<Date>,
  leadTimeDays: number,
  preference: NotificationPreference,
): boolean {
  if (!preference.enabled) return false;
  if (!deadline.known) return false;
  if (!isSupportedLeadTime(leadTimeDays)) return false;
  return preference.leadTimes.includes(leadTimeDays);
}
