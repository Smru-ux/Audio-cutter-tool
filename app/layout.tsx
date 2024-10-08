// app/layout.tsx
"use client";

import "./globals.css";
import Providers from "./providers";
import { Container } from "@mantine/core";

export const metadata = {
  title: "Audio Cutter Tool",
  description: "A serverless audio cutter tool built with Next.js and Mantine UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Container size="md" my="xl">
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}

