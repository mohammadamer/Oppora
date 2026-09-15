/**
 * Notification boundary. The underlying delivery mechanism (push, email, SMS) can be replaced
 * without changing the domain rule that governs when a reminder is eligible to be sent.
 *
 * Behavior that MUST remain stable across any replacement implementation:
 * - No reminder is sent for an unknown or invalid deadline.
 * - No reminder is sent when the user's NotificationPreference is disabled.
 * - Only supported lead times (30, 14, 7, 3, 1 day) trigger a reminder.
 */
export interface NotificationProvider {
  // Method signatures are defined during implementation of packages/notifications;
  // this interface documents the replacement boundary for Phase 1.
  readonly name: string;
}
