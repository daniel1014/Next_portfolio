"use client";

import React from "react";
import { Bug } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { getFeedback } from "../sentry.client.config";

const FeedbackButton: React.FC = () => {
  const handleClick = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    console.log("FeedbackButton clicked");

    try {
      // Proactively blur the trigger to avoid autofocus conflicts in the dialog
      if (event?.currentTarget) {
        event.currentTarget.blur();
      }

      // Try to get the feedback integration instance
      const feedbackInstance = getFeedback();
      
      if (feedbackInstance) {
        console.log("Found feedback instance:", feedbackInstance);
        
        // Prefer opening the dialog form directly when available
        if (typeof feedbackInstance.createForm === "function") {
          console.log("Using createForm method...");
          const form = await feedbackInstance.createForm();
          console.log("Form object:", form);
          if (typeof form.appendToDom === "function") {
            form.appendToDom();
          }
          if (typeof form.open === "function") {
            form.open();
          }
          return;
        }

        // Fallback to widget actor (shows a floating button which then opens the form on click)
        if (typeof feedbackInstance.createWidget === "function") {
          console.log("Using createWidget method...");
          const widget = feedbackInstance.createWidget();
          if (typeof widget.appendToDom === "function") {
            widget.appendToDom();
          }
          if (typeof widget.show === "function") {
            widget.show();
          }
          return;
        }
        
        if (typeof feedbackInstance.show === "function") {
          console.log("Using show method directly...");
          feedbackInstance.show();
          return;
        }
      }

      // Fallback: Try to use the feedback integration directly
      const anySentry = Sentry as unknown as {
        feedbackIntegration?: (options?: Record<string, unknown>) => any;
        captureFeedback?: (options?: Record<string, unknown>) => void;
        showReportDialog?: (options?: Record<string, unknown>) => void;
      };

      if (typeof anySentry.feedbackIntegration === "function") {
        console.log("Creating feedback integration...");
        const feedback = anySentry.feedbackIntegration({
          autoInject: false,
        });
        
        if (typeof feedback.createForm === "function") {
          const form = await feedback.createForm();
          if (typeof form.appendToDom === "function") {
            form.appendToDom();
          }
          if (typeof form.open === "function") {
            form.open();
          }
          return;
        }

        if (typeof feedback.createWidget === "function") {
          const widget = feedback.createWidget();
          if (typeof widget.appendToDom === "function") {
            widget.appendToDom();
          }
          if (typeof widget.show === "function") {
            widget.show();
          }
          return;
        }
        return;
      }

      if (typeof anySentry.captureFeedback === "function") {
        console.log("Calling captureFeedback...");
        anySentry.captureFeedback({});
        return;
      }

      if (typeof anySentry.showReportDialog === "function") {
        console.log("Calling showReportDialog...");
        anySentry.showReportDialog({
          title: "Report a bug or share feedback",
          subtitle: "Please describe what happened. A screenshot is optional.",
          labelName: "Name",
          labelEmail: "Email",
          labelComments: "Feedback",
          submitLabel: "Send feedback",
        });
        return;
      }

      // Final fallback if SDK methods are unavailable
      console.log("No Sentry feedback methods available, showing alert");
      // eslint-disable-next-line no-alert
      alert("Feedback dialog is unavailable. Please check your ad blocker or Sentry config.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to open Sentry feedback dialog:", error);
      // eslint-disable-next-line no-alert
      alert("Sorry, something went wrong opening the feedback dialog.");
    }
  };

  return (
    <button
      type="button"
      aria-label="Report a bug"
      onClick={handleClick}
      className="p-2 rounded-md bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30 text-gray-200 transition-colors"
    >
      <Bug className="h-5 w-5" />
    </button>
  );
};

export default FeedbackButton;
