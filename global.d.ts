// global.d.ts
export {};

declare global {
  interface Window {
    EBWidgets: {
      createWidget: (options: {
        widgetType: string;
        eventId: string;
        modal: boolean;
        modalTriggerElementId: string;
        onOrderComplete?: () => void;
      }) => void;
    };
  }
}
