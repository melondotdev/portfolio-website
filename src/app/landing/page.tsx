'use client';

import { ArrowRight, Sparkles, Target, Users } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Career Planning',
    description: 'Set clear goals and create actionable plans for your career journey'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Learn from industry professionals with years of experience'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Learning',
    description: 'Personalized learning experience adapted to your needs'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-blue">
      <nav className="border-b border-gray-800 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-neon-blue">Career Coaching</div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="neon-text">Transform</span> Your Career Path
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Expert guidance, personalized learning, and AI-powered tools to help you achieve your career goals
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="course-card p-6">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-neon-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
} 