/**
 * Clerk ↔ Convex auth. The RN app sends a Clerk JWT (template "convex"); Convex
 * validates it against this issuer so `ctx.auth.getUserIdentity()` is populated.
 *
 * Set CLERK_JWT_ISSUER_DOMAIN on the Convex deployment (Convex dashboard → Env
 * Vars, or `npx convex env set`). See SETUP.md.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
