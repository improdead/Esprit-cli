import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LogoGrid from './components/LogoGrid';
import AboutSection from './components/AboutSection';
import UseCasesSection from './components/UseCasesSection';
import PrinciplesSection from './components/PrinciplesSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-text antialiased selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-[1440px] mx-auto bg-background/50 border-x border-white/50 shadow-2xl min-h-screen relative">
        <Header />
        <main>
          <Hero />
          <LogoGrid />
          <AboutSection />
          <UseCasesSection />
          <PrinciplesSection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;

