
import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Logos from '../components/landing/Logos';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light">
            <Header />
            <main className="flex-grow">
                <Hero />
                <Logos />
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <FAQ />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
