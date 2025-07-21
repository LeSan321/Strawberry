"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Music, Heart, Shield, Zap, Download, Star, Users, Palette, TrendingUp } from "lucide-react";
export interface PricingPageProps {
  onNavigate?: (page: 'home' | 'upload' | 'friends' | 'playlists' | 'signin' | 'myriffs' | 'about' | 'profile-setup' | 'pricing') => void;
}

// Simple Button component
const Button = ({
  children,
  className = "",
  onClick,
  ...props
}: any) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`} onClick={onClick} {...props}>
    {children}
  </button>;

// Simple Card components
const Card = ({
  children,
  className = "",
  ...props
}: any) => <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>;
const CardContent = ({
  children,
  className = "",
  ...props
}: any) => <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>;
const CardDescription = ({
  children,
  className = "",
  ...props
}: any) => <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>;
const CardHeader = ({
  children,
  className = "",
  ...props
}: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>;
const CardTitle = ({
  children,
  className = "",
  ...props
}: any) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>;

// Simple Badge component
const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}: any) => <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === "secondary" ? "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80" : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"} ${className}`} {...props}>
    {children}
  </div>;
export default function PricingPage({
  onNavigate
}: PricingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const features = [{
    name: "Uploads",
    free: "5/month",
    premium: "Unlimited",
    icon: <Music className="w-4 h-4" />
  }, {
    name: "Streaming",
    free: "High-quality",
    premium: "High-quality",
    icon: <Zap className="w-4 h-4" />
  }, {
    name: "Sharing Options",
    free: "Public & Friends",
    premium: "Private, Inner Circle, Public",
    icon: <Users className="w-4 h-4" />
  }, {
    name: "Playlists",
    free: "Yes",
    premium: "Yes + Custom Covers",
    icon: <Heart className="w-4 h-4" />
  }, {
    name: "Profile Styling",
    free: "Basic",
    premium: "Custom styling (emoji, colors, tags)",
    icon: <Palette className="w-4 h-4" />
  }, {
    name: "Feedback Tools",
    free: "Basic",
    premium: "Real-time insights (non-metric based)",
    icon: <TrendingUp className="w-4 h-4" />
  }, {
    name: "Track Downloads",
    free: "No",
    premium: "Download archive enabled",
    icon: <Download className="w-4 h-4" />
  }, {
    name: "Early Access",
    free: "No",
    premium: "Yes",
    icon: <Star className="w-4 h-4" />
  }, {
    name: "Tipping Eligibility",
    free: "No",
    premium: "Yes",
    icon: <Heart className="w-4 h-4" />
  }] as any[];
  const faqs = [{
    question: "Can I switch plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
  }, {
    question: "Can I try Premium before committing?",
    answer: "We'll be offering trials soon. For now, you can start with our generous free tier and upgrade when you're ready."
  }, {
    question: "Is my music mine?",
    answer: "Always. You retain full ownership and rights to all your music. We're just the platform that helps you share it."
  }] as any[];
  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent mb-6">
            Your Sound, Your Way
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Strawberry Riff is free to try, with premium features when you're ready for more room to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3" onClick={() => onNavigate?.('signin')}>
              Start Free
            </Button>
            <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3" onClick={() => setSelectedPlan('premium')}>
              Upgrade to Premium
            </Button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Tier */}
          <Card className={`relative overflow-hidden transition-all duration-300 ${selectedPlan === 'free' ? 'ring-2 ring-purple-400 shadow-lg' : 'hover:shadow-md'}`}>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-800">Free Tier</CardTitle>
              <div className="text-4xl font-bold text-purple-600 mt-4">$0</div>
              <CardDescription className="text-gray-600 mt-2">Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-6 bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={() => {
              setSelectedPlan('free');
              onNavigate?.('signin');
            }}>
                Get Started Free
              </Button>
              <div className="space-y-3">
                {features.map((feature, index) => <div key={index} className="flex items-center gap-3">
                    <div className="text-purple-500">{feature.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{feature.name}:</span>
                    <span className="text-sm text-gray-600">{feature.free}</span>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className={`relative overflow-hidden transition-all duration-300 ${selectedPlan === 'premium' ? 'ring-2 ring-pink-400 shadow-lg' : 'hover:shadow-md'}`}>
            <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-purple-500 text-white px-4 py-1 text-sm font-medium">
              Popular
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-800">Premium Tier</CardTitle>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-4">
                $5<span className="text-lg text-gray-600">/month</span>
              </div>
              <CardDescription className="text-gray-600 mt-2">For creators ready to grow</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" onClick={() => {
              setSelectedPlan('premium');
              // Handle premium upgrade logic here
            }}>
                Upgrade to Premium
              </Button>
              <div className="space-y-3">
                {features.map((feature, index) => <div key={index} className="flex items-center gap-3">
                    <div className="text-pink-500">{feature.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{feature.name}:</span>
                    <span className="text-sm text-gray-600">{feature.premium}</span>
                    {feature.premium !== feature.free && <Badge variant="secondary" className="ml-auto text-xs bg-pink-100 text-pink-700">
                        Enhanced
                      </Badge>}
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tipping Module */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="mb-16">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Support creators who move you</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Premium users can receive tips from their listeners—no clout, no pressure, just gratitude.
              </p>
              <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                Learn More About Tipping
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="mb-16">
          <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Why We Charge</h3>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Strawberry Riff runs on support, not surveillance. We don't sell your data or feed you ads. 
                We charge a small fee so you can share freely, without judgment or algorithms.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }} className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => <Card key={index} className="overflow-hidden">
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowFAQ(showFAQ === index ? null : index)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-800">{faq.question}</CardTitle>
                    <motion.div animate={{
                  rotate: showFAQ === index ? 180 : 0
                }} transition={{
                  duration: 0.2
                }}>
                      <Check className="w-5 h-5 text-purple-500" />
                    </motion.div>
                  </div>
                </CardHeader>
                <motion.div initial={false} animate={{
              height: showFAQ === index ? 'auto' : 0
            }} transition={{
              duration: 0.3
            }} className="overflow-hidden">
                  <CardContent className="pt-0 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </motion.div>
              </Card>)}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 1.0
      }} className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Join the (not-so) quiet revolution</h3>
              <p className="text-purple-100 mb-6 text-lg">
                Your sonic space is waiting. Start sharing your sound today.
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3" onClick={() => onNavigate?.('signin')}>
                Claim Your Sonic Space
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>;
}