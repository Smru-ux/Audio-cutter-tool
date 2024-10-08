// app/providers.tsx
"use client";

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
    {children}
  </MantineProvider>
  
  );
}
