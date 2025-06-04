// app/layout.tsx
import './globals.css';
import { ChakraProvider } from '@chakra-ui/react';

export const metadata = {
  title: 'Enterprise HRMS',
  description: 'Empower Your Workforce with our Enterprise HRMS solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
