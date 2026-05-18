import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import DesktopWarning from "@/components/common/DesktopWarning";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "MFA CANDIDATE",
    template: "MFA CANDIDATE | %s",
  },
  description: "MFA Candidate Portal",
  icons: {
    icon: "/Thumbnail.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#111827]">
        <div className="md:hidden flex flex-col min-h-full flex-1">
          <ReduxProvider>{children}</ReduxProvider>
        </div>
        <DesktopWarning />
      </body>
    </html>
  );
}
