# Security Specification: Kisan AI Dost Authentication & Firestore Rules

## 1. Data Invariants
- **Identity Lock**: A user's profile documents (`/users/{userId}`) can only be created, read, updated, or deleted by the exact authenticated user whose UID matches the document ID ({userId}).
- **Strict Size Bounds**: Text fields like `name`, `email`, `state`, `district`, and `village` must adhere to strict size boundaries to protect against payload massive expansion / denial-of-wallet attacks.
- **Immortal Fields**: Once written on profile registration, `uid` and `createdAt` must be immutable.
- **Server Timestamp Guard**: Payload `createdAt` and `updatedAt` must be set via server-generated timestamps (`request.time`) instead of trusting client dates.

## 2. The "Dirty Dozen" Payloads
The following payloads must be blocked with `PERMISSION_DENIED` by the rules:
1. **Unauthenticated Write**: Creating a profile when not signed in (`request.auth == null`).
2. **Identity Spoofing**: Signed-in user `id_alice` attempting to write to document `/users/id_bob`.
3. **Ghost Fields Injection**: Injecting a custom permission like `role: "admin"` or `isAdmin: true` into the profile document.
4. **Huge String Attack**: Sending a `name` parameter with a 2MB size string.
5. **Junk Document ID**: Injecting an invalid character or bloated string as the parent document ID.
6. **Missing Required Fields**: Submitting a profile without `mobileNumber` or `village`.
7. **Bypassing Server Timestamps**: Client providing a manual date for `createdAt` instead of `request.time`.
8. **Modifying Immortal Fields**: Authenticated user trying to update their own `createdAt` timestamp.
9. **Tampering original UID**: Authenticated user trying to change their document's `uid` property to a another user's UID.
10. **Type Mismatch on String**: Setting `village` to a boolean value (`true`).
11. **Type Mismatch on Array representation**: Passing an array for state when a string is required.
12. **PII Blanket Leak Read**: An authenticated user trying to fetch another user's private location parameters.

## 3. Test Runner Execution Spec
Security assertions must enforce that all the above 12 scenarios fail securely with permission denied, whilst valid creations with true matching UID and proper parameters return success.
