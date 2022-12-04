import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primaryText: "black",
      secondaryText: "white",
      tertiaryText: "#808080",

      primary: "#1976d2",
      secondary: "#42a5f5",
      tertiary: "#1565c0",

      primaryContainer: "white",
      secondaryContainer: "white",
      onPrimaryContainer: "white",

      primaryButton: "#1976d2",
      background: "#F9F9F9",

      primaryIcon: "#1976d2",
    },
};
  
export const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
      primaryText: "white",
      secondaryText: "grey",
      tertiaryText: "#B0B0B0",

      primary: "#424549",
      secondary: "#36393F",

      primaryContainer: "#424549",
      secondaryContainer: "#36393F",
      onPrimaryContainer: "#616469",

      primaryButton: "#616469",
      background: "#23272a",

      primaryIcon: "white"
    },
};
