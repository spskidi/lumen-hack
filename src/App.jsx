import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { Features } from './components/home/Features';
import { Pricing } from './components/home/Pricing';
import { Testimonials } from './components/home/Testimonials';
import { CallToAction } from './components/home/CallToAction';

function Home() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ErrorBoundary>
            <Hero />
          </ErrorBoundary>
          <ErrorBoundary>
            <Features />
          </ErrorBoundary>
          <ErrorBoundary>
            <Pricing />
          </ErrorBoundary>
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
          <ErrorBoundary>
            <CallToAction />
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
