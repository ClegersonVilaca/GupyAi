
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
    React.useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light scroll-smooth">
            <Header />
            <main className="flex-grow space-y-0 overflow-hidden">
                <section className="reveal"><Hero /></section>
                <section className="reveal"><Logos /></section>
                <div id="como-funciona" className="reveal"><HowItWorks /></div>
                <div id="depoimentos" className="reveal-left"><Testimonials /></div>
                <div id="precos" className="reveal"><Pricing /></div>
                <div className="reveal-right"><FAQ /></div>
                <section className="reveal"><FinalCTA /></section>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
