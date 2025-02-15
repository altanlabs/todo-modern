import { useTheme } from "@/theme/use-theme";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme}`}>
      {children}
    </div>
  );
}

export default Layout;