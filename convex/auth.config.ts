/**
 * Clerk ↔ Convex auth. The RN app sends a Clerk JWT (template "convex"); Convex
 * validates it against this domain so `ctx.auth.getUserIdentity()` is populated.
 *
 * `domain` is the Clerk Frontend API URL (== the JWT issuer for Clerk instances).
 * Prefers CLERK_FRONTEND_API_URL (current Convex+Clerk convention), falling back
 * to CLERK_JWT_ISSUER_DOMAIN. Set either on the deployment via `npx convex env
 * set` (both are set here). See SETUP.md.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL ?? process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
