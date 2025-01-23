import localFont from "next/font/local";

export const nexaRust = localFont({
    src: [
        {
            path: "../public/fonts/NexaRustSlab-Black.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/NexaRustSlab-Black.woff",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-nexa",
});

export const cheyenneSans = localFont({
    src: [
        {
            path: "../public/fonts/CheyenneSans-Light.otf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/CheyenneSans-Regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/CheyenneSans-Medium.otf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/CheyenneSans-Bold.otf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/CheyenneSans-LightItalic.otf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../public/fonts/CheyenneSans-Italic.otf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../public/fonts/CheyenneSans-MediumItalic.otf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../public/fonts/CheyenneSans-BoldItalic.otf",
            weight: "700",
            style: "italic",
        },
    ],
    variable: "--font-cheyenne",
});
