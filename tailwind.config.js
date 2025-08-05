module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-000000": "var(--black-000000)",
        "blueshade1-005b92": "var(--blueshade1-005b92)",
        "bluetint6-f2f8fc": "var(--bluetint6-f2f8fc)",
        "bluewkblue-007ac3": "var(--bluewkblue-007ac3)",
        "cg3-theme2023-lightinfobg": "var(--cg3-theme2023-lightinfobg)",
        "cg3-theme2023-lightneutraltextinverse":
          "var(--cg3-theme2023-lightneutraltextinverse)",
        "grayshade-1": "var(--grayshade-1)",
        "grayshade2-232323": "var(--grayshade2-232323)",
        "graytint1-757575": "var(--graytint1-757575)",
        "graytint2-a3a3a3": "var(--graytint2-a3a3a3)",
        "graytint4-dadada": "var(--graytint4-dadada)",
        "graytint5-ededed": "var(--graytint5-ededed)",
        "graytint6-f6f6f6": "var(--graytint6-f6f6f6)",
        "graywkgray-474747": "var(--graywkgray-474747)",
        "greenshade1-648d18": "var(--greenshade1-648d18)",
        "lightbackgroundbackground-1": "var(--lightbackgroundbackground-1)",
        "lightforegroundforeground-1": "var(--lightforegroundforeground-1)",
        "lightforegroundforeground-2": "var(--lightforegroundforeground-2)",
        "lightforegroundforeground-4": "var(--lightforegroundforeground-4)",
        "lightstrokestroke-1": "var(--lightstrokestroke-1)",
        "lightstrokestroke-2": "var(--lightstrokestroke-2)",
        "orangewkorange-ea8f00": "var(--orangewkorange-ea8f00)",
        "redwkred-e5202e": "var(--redwkred-e5202e)",
        "white-ffffff": "var(--white-ffffff)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "body-light-light-14px-default":
          "var(--body-light-light-14px-default-font-family)",
        "body-medium-medium-14px": "var(--body-medium-medium-14px-font-family)",
        "body-normal-regular": "var(--body-normal-regular-font-family)",
        "body-regular-regular-default-14px":
          "var(--body-regular-regular-default-14px-font-family)",
        "body-small-medium": "var(--body-small-medium-font-family)",
        "body-small-regular": "var(--body-small-regular-font-family)",
        "button-label": "var(--button-label-font-family)",
        "header-header-h4": "var(--header-header-h4-font-family)",
        "heading-EYEBROW-EYEBROW-step-1":
          "var(--heading-EYEBROW-EYEBROW-step-1-font-family)",
        "heading-normal-h3-step-5":
          "var(--heading-normal-h3-step-5-font-family)",
        "heading-normal-h5-step-3":
          "var(--heading-normal-h5-step-3-font-family)",
        "heading-small-medium-heading-step-2":
          "var(--heading-small-medium-heading-step-2-font-family)",
        "heading-small-regular-heading-step-2":
          "var(--heading-small-regular-heading-step-2-font-family)",
        "input-normal-input": "var(--input-normal-input-font-family)",
        "input-normal-placeholder":
          "var(--input-normal-placeholder-font-family)",
        "input-small-placeholder": "var(--input-small-placeholder-font-family)",
        "link-body-small": "var(--link-body-small-font-family)",
        "link-heading-small": "var(--link-heading-small-font-family)",
        "link-micro-micro-link": "var(--link-micro-micro-link-font-family)",
        "link-nav-medium-active": "var(--link-nav-medium-active-font-family)",
        "link-nav-regular": "var(--link-nav-regular-font-family)",
        "type-scale-12px-0-750rem":
          "var(--type-scale-12px-0-750rem-font-family)",
        "web-body-1-strong": "var(--web-body-1-strong-font-family)",
        "web-caption-1": "var(--web-caption-1-font-family)",
        "web-caption-2": "var(--web-caption-2-font-family)",
        "wk-cg3-ct-button-font-size-s-1-125-default":
          "var(--wk-cg3-ct-button-font-size-s-1-125-default-font-family)",
        "wk-cg3-ct-tag-font-size-tag":
          "var(--wk-cg3-ct-tag-font-size-tag-font-family)",
        "wk-cg3-st-body-font-size-s-1-125-normal":
          "var(--wk-cg3-st-body-font-size-s-1-125-normal-font-family)",
        "wk-cg3-st-body-font-size-s-1-25-normal":
          "var(--wk-cg3-st-body-font-size-s-1-25-normal-font-family)",
        "wk-cg3-st-body-font-size-xs-1-5-normal":
          "var(--wk-cg3-st-body-font-size-xs-1-5-normal-font-family)",
        "wk-cg3-st-heading-font-size-1-1-25-normal":
          "var(--wk-cg3-st-heading-font-size-1-1-25-normal-font-family)",
        "wk-cg3-st-heading-font-size-5-1-25-normal":
          "var(--wk-cg3-st-heading-font-size-5-1-25-normal-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "cg3-elevation-overlay": "var(--cg3-elevation-overlay)",
        "cg3-elevation-popout": "var(--cg3-elevation-popout)",
        "elevation-light-shadow-02": "var(--elevation-light-shadow-02)",
        "shadow-small": "var(--shadow-small)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
