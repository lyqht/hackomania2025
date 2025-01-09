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
    <div
      id="EventbriteButton"
      className="cursor-pointer rounded-md border-4 border-hackomania-red p-5 py-3 text-center text-xl font-bold text-hackomania-red transition-all duration-300 hover:bg-hackomania-red hover:text-white"
    >
      REGISTER NOW
    </div>
  );
};

export default EventbriteButton;
