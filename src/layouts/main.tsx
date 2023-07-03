import Footer from "~/components/footer/footer";
import Header from "~/components/header/header";
import SkipToContent from "~/components/skipToContent/skipToContent";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <SkipToContent />
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
