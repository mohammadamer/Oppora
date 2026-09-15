# Notifications

**Responsibility**: Deliver deadline reminders to users according to their notification
preferences (`NotificationPreference` entity), using supported lead times of 30, 14, 7, 3, and 1
day before a known deadline.

**Boundary**: Exposed only through `NotificationProvider`
(`packages/notifications/src/NotificationProvider.ts`). No reminder is sent for an unknown or
invalid deadline, and no reminder is sent when notifications are disabled.

**Replacement point**: The underlying delivery mechanism (push, email, SMS) can be replaced
without changing the domain rule that governs when a reminder is eligible to be sent.
