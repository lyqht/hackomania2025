"use client";

import React from "react";
import useEventbrite from "react-eventbrite-popup-checkout";

const EventbriteButton = () => {
  const handleOrderCompleted = React.useCallback(() => {
    console.log("Order was completed successfully");
  }, []);
  const modalButtonCheckout = useEventbrite({
    eventId: "1048487924607",
    modal: true,
    onOrderComplete: handleOrderCompleted,
  });

  const buttonStyle: React.CSSProperties = {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "rgb(203, 166, 74)",
    borderRadius: "12px",
    padding: "10px 200px",
  };

  return (
    <div id="EventbriteButton">
      {/* guard for null - resolves when Eventbrite loads */}
      {modalButtonCheckout && (
        <button id={modalButtonCheckout.id} type="button" style={buttonStyle}>
          Register Now!
        </button>
      )}
    </div>
  );
};

export default EventbriteButton;
