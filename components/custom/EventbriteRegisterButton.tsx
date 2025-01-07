"use client";

import React from "react";
import useEventbrite from "react-eventbrite-popup-checkout";

const EventbriteButton = () => {
  const handleOrderCompleted = React.useCallback(() => {
    console.log("Order was completed successfully");
  }, []);

  const modalButtonCheckout = useEventbrite({
    eventId: process.env.NEXT_PUBLIC_EVENTBRITE_EVENT_ID || "",
    modal: true,
    onOrderComplete: handleOrderCompleted,
  });

  return (
    <div
      id="EventbriteButton"
      className="rounded-md border-4 border-hackomania-red p-5 py-3 text-center text-xl font-bold text-hackomania-red transition-all duration-300 hover:bg-hackomania-red hover:text-white"
    >
      {modalButtonCheckout && (
        <button id={modalButtonCheckout.id} type="button">
          REGISTER NOW!
        </button>
      )}
    </div>
  );
};

export default EventbriteButton;
