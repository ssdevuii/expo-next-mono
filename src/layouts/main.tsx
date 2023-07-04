import Footer from "~/components/footer/footer";
import Header from "~/components/header/header";
import SkipToContent from "~/components/skipToContent/skipToContent";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipToContent />
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
