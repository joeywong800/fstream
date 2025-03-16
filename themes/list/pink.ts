import { createTheme } from "../types";

const tokens = {
  black: "#000000",
  white: "#FFFFFF",
  text: {
    c50: '#fee6f7',
    c100: '#fdceee',
    c200: '#9c5c87',
    c300: '#fa6bcd',
    c400: '#f939bc',
    c500: '#f708ab',
    c600: '#c60689',
    c700: '#940567',
    c800: '#630345',
    c900: '#310222',
    c950: '#190111',
  },
  background: {
    c50: '#f5eff3',
    c100: '#ecdfe8',
    c200: '#d8c0d0',
    c300: '#c5a0b9',
    c400: '#b181a1',
    c500: '#9e618a',
    c600: '#7e4e6e',
    c700: '#5f3a53',
    c800: '#3f2737',
    c900: '#20131c',
    c950: '#100a0e',
  },
  primary: {
    c50: '#fee6f7',
    c100: '#fecdef',
    c200: '#fd9be0',
    c300: '#fc69d0',
    c400: '#fb37c0',
    c500: '#fa05b0',
    c600: '#c8048d',
    c700: '#96036a',
    c800: '#640247',
    c900: '#320123',
    c950: '#190112',
  },
  secondary: {
    c50: '#f3e6fe',
    c100: '#e8cdfe',
    c200: '#d19bfd',
    c300: '#ba69fc',
    c400: '#a337fb',
    c500: '#8c05fa',
    c600: '#7004c8',
    c700: '#540396',
    c800: '#380264',
    c900: '#1c0132',
    c950: '#0e0119',
  },
  accent: {
    c50: '#e9f6fb',
    c100: '#d4eef7',
    c200: '#a8ddf0',
    c300: '#7dcbe8',
    c400: '#52bae0',
    c500: '#26a9d9',
    c600: '#1f87ad',
    c700: '#176582',
    c800: '#0f4457',
    c900: '#08222b',
    c950: '#041116',
  },
  semantic: {
    red: {
      c100: "#F46E6E",
      c200: "#E44F4F",
      c300: "#D74747",
      c400: "#B43434",
    },
    green: {
      c100: "#60D26A",
      c200: "#40B44B",
      c300: "#31A33C",
      c400: "#237A2B",
    },
    silver: {
      c100: "#DEDEDE",
      c200: "#B6CAD7",
      c300: "#8EA3B0",
      c400: "#617A8A",
    },
    yellow: {
      c100: "#FFF599",
      c200: "#FCEC61",
      c300: "#D8C947",
      c400: "#AFA349",
    },
    rose: {
      c100: "#DB3D61",
      c200: "#8A293B",
      c300: "#812435",
      c400: "#701B2B",
    },
  }
}

export default createTheme({
  name: "pink",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.primary.c300,
        secondary: tokens.secondary.c200,
        ghost: tokens.white,
      },

      // Branding
      pill: {
        background: tokens.background.c700,
        backgroundHover: tokens.primary.c800,
        highlight: tokens.primary.c300,
        activeBackground: tokens.background.c700,
      },

      // meta data for the theme itself
      global: {
        accentA: tokens.primary.c400,
        accentB: tokens.primary.c600,
      },

      // light bar
      lightBar: {
        light: tokens.primary.c500,
      },

      // Buttons
      buttons: {
        toggle: tokens.primary.c400,
        toggleDisabled: tokens.background.c600,
        danger: tokens.semantic.rose.c300,
        dangerHover: tokens.semantic.rose.c200,

        secondary: tokens.background.c800,
        secondaryText: tokens.semantic.silver.c300,
        secondaryHover: tokens.background.c700,
        primary: tokens.white,
        primaryText: tokens.black,
        primaryHover: tokens.semantic.silver.c100,
        purple: tokens.secondary.c500,
        purpleHover: tokens.secondary.c400,
        cancel: tokens.secondary.c700,
        cancelHover: tokens.background.c500,
      },

      // only used for body colors/textures
      background: {
        main: tokens.background.c950,
        secondary: tokens.background.c800,
        secondaryHover: tokens.background.c700,
        accentA: tokens.primary.c700,
        accentB: tokens.secondary.c700,
      },

      // Modals
      modal: {
        background: tokens.background.c900,
      },

      // typography
      type: {
        logo: tokens.primary.c200,
        emphasis: tokens.white,
        text: tokens.text.c200,
        dimmed: tokens.background.c500,
        divider: tokens.background.c600,
        secondary: tokens.text.c300,
        danger: tokens.semantic.red.c100,
        success: tokens.semantic.green.c100,
        link: tokens.primary.c200,
        linkHover: tokens.primary.c100,
      },

      // search bar
      search: {
        background: tokens.background.c800,
        hoverBackground: tokens.background.c700,
        focused: tokens.primary.c800,
        placeholder: tokens.text.c600,
        icon: tokens.primary.c300,
        text: tokens.white,
      },

      // media cards
      mediaCard: {
        hoverBackground: tokens.background.c800,
        hoverAccent: tokens.primary.c300,
        hoverShadow: tokens.background.c950,
        shadow: tokens.background.c900,
        barColor: tokens.background.c700,
        barFillColor: tokens.primary.c300,
        badge: tokens.background.c800,
        badgeText: tokens.text.c200,
      },

      // Large card
      largeCard: {
        background: tokens.background.c800,
        icon: tokens.primary.c300,
      },

      // Dropdown
      dropdown: {
        background: tokens.background.c900,
        altBackground: tokens.background.c900,
        hoverBackground: tokens.primary.c800,
        highlight: tokens.semantic.yellow.c400,
        highlightHover: tokens.semantic.yellow.c200,
        text: tokens.text.c200,
        secondary: tokens.text.c300,
        border: tokens.primary.c800,
        contentBackground: tokens.background.c800,
      },

      // Passphrase
      authentication: {
        border: tokens.background.c600,
        inputBg: tokens.background.c900,
        inputBgHover: tokens.background.c700,
        wordBackground: tokens.background.c700,
        copyText: tokens.text.c300,
        copyTextHover: tokens.text.c200,
        errorText: tokens.semantic.rose.c100,
      },

      // Settings page
      settings: {
        sidebar: {
          activeLink: tokens.background.c800,
          badge: tokens.background.c900,

          type: {
            secondary: tokens.text.c300,
            inactive: tokens.text.c400,
            icon: tokens.text.c300,
            iconActivated: tokens.primary.c300,
            activated: tokens.primary.c200,
          },
        },

        card: {
          border: tokens.primary.c800,
          background: tokens.background.c800,
          altBackground: tokens.background.c900,
        },

        saveBar: {
          background: tokens.background.c900,
        },
      },

      // Utilities
      utils: {
        divider: tokens.background.c600,
      },

      // Onboarding
      onboarding: {
        bar: tokens.background.c700,
        barFilled: tokens.primary.c400,
        divider: tokens.background.c600,
        card: tokens.background.c900,
        cardHover: tokens.background.c800,
        border: tokens.background.c700,
        good: tokens.primary.c200,
        best: tokens.semantic.yellow.c100,
        link: tokens.primary.c200,
      },

      // Error page
      errors: {
        card: tokens.background.c900,
        border: tokens.background.c700,

        type: {
          secondary: tokens.text.c300,
        },
      },

      // About page
      about: {
        circle: tokens.background.c700,
        circleText: tokens.text.c200,
      },

      // Edit badge
      editBadge: {
        bg: tokens.background.c700,
        bgHover: tokens.background.c600,
        text: tokens.text.c200,
      },

      progress: {
        background: tokens.background.c700,
        preloaded: tokens.background.c600,
        filled: tokens.primary.c300,
      },

      // video player
      video: {
        buttonBackground: tokens.background.c700,

        autoPlay: {
          background: tokens.background.c800,
          hover: tokens.background.c700,
        },

        scraping: {
          card: tokens.background.c800,
          error: tokens.semantic.red.c200,
          success: tokens.semantic.green.c200,
          loading: tokens.primary.c300,
          noresult: tokens.text.c300,
        },

        audio: {
          set: tokens.primary.c300,
        },

        context: {
          background: tokens.background.c900,
          light: tokens.text.c200,
          border: tokens.background.c700,
          hoverColor: tokens.background.c700,
          buttonFocus: tokens.background.c600,
          flagBg: tokens.background.c700,
          inputBg: tokens.background.c800,
          buttonOverInputHover: tokens.background.c700,
          inputPlaceholder: tokens.text.c400,
          cardBorder: tokens.background.c800,
          slider: tokens.text.c300,
          sliderFilled: tokens.primary.c300,
          error: tokens.semantic.red.c200,

          buttons: {
            list: tokens.background.c800,
            active: tokens.background.c900,
          },

          closeHover: tokens.background.c800,

          type: {
            main: tokens.semantic.silver.c400,
            secondary: tokens.text.c300,
            accent: tokens.primary.c300,
          },
        },
      },
    },
  },
});
