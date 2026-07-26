import type { Preview } from "@storybook/react-vite";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1440px",
            height: "900px",
          },
        },
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock Next.js modules
      if (typeof window !== "undefined") {
        // @ts-expect-error Storybook mock for legacy next router on window
        window.next = {
          router: {
            push: () => {},
            replace: () => {},
            pathname: "/",
            query: {},
            asPath: "/",
          },
        };
      }
      return <Story />;
    },
  ],
};

export default preview;
