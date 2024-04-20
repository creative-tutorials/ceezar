import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // server: {
  //   DATABASE_URL: z.string().url(),
  //   OPEN_AI_API_KEY: z.string().min(1),
  // },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(), // Clerk publishable key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_NODE_API_KEY: z.string().min(1).max(37), // Node.js Express server API key
    NEXT_PUBLIC_PROJECT_URL: z.string().url(), // Supabase project URL
    NEXT_PUBLIC_CLIENT_API_KEY: z.string().min(1).max(208), // Supabase client API key
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_NODE_API_KEY: process.env.NEXT_PUBLIC_NODE_API_KEY,
    NEXT_PUBLIC_PROJECT_URL: process.env.NEXT_PUBLIC_PROJECT_URL,
    NEXT_PUBLIC_CLIENT_API_KEY: process.env.NEXT_PUBLIC_CLIENT_API_KEY,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
