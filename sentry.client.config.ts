// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // Disable SDK debug logs to avoid non-debug bundle warning in browser
  debug: false,
  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  // We add integrations conditionally to avoid runtime errors across Sentry SDK versions
  integrations: (() => {
    const integrations: any[] = [];
    const anySentry = Sentry as unknown as {
      replayIntegration?: (opts?: Record<string, unknown>) => unknown;
      feedbackIntegration?: (opts?: Record<string, unknown>) => unknown;
    };

    if (typeof anySentry.replayIntegration === "function") {
      integrations.push(
        anySentry.replayIntegration({
          // Additional Replay configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        })
      );
    }

    if (typeof anySentry.feedbackIntegration === "function") {
      integrations.push(
        anySentry.feedbackIntegration({
          colorScheme: "system",
          // prevent the default floating widget; we'll trigger it ourselves
          autoInject: false,
        })
      );
    }

    return integrations;
  })(),
});

// Export a helper function to get the feedback integration
export const getFeedback = () => {
  const anySentry = Sentry as unknown as {
    getFeedback?: () => any;
  };
  return anySentry.getFeedback?.();
};
