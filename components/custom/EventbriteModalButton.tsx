"use client";

import { useEffect } from "react";

const EventbriteButton = () => {
  const eventId = process.env.NEXT_PUBLIC_EVENTBRITE_EVENT_ID || "";

  useEffect(() => {
    const loadEventbriteScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          "script[src='https://www.eventbrite.com/static/widgets/eb_widgets.js']",
        );
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://www.eventbrite.com/static/widgets/eb_widgets.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Eventbrite script."));
        document.body.appendChild(script);
      });
    };

    loadEventbriteScript()
      .then(() => {
        if (window.EBWidgets) {
          window.EBWidgets.createWidget({
            widgetType: "checkout",
            eventId: eventId,
            modal: true,
            modalTriggerElementId: "EventbriteButton",
            onOrderComplete: () => {
              console.log("Order complete!");
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error loading Eventbrite script:", error);
      });
  }, [eventId]);

  return (
    <button
      id="EventbriteButton"
      className="border-4 border-hackomania-red p-3 px-5 text-base font-bold text-hackomania-red transition-all hover:bg-hackomania-red hover:text-white md:text-2xl"
    >
      REGISTER NOW
    </button>
  );
};

export default EventbriteButton;
