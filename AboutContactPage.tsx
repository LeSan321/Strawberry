import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Mail, Send, CheckCircle, Heart, Users, Zap, ChevronDown, ChevronUp, Shield } from 'lucide-react';
const AboutContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const teamMembers = [{
    name: 'Jam the Drummer',
    role: 'Keeping the rhythm alive and kicking',
    avatar: '🥁',
    gradient: 'from-purple-400 to-pink-400'
  }, {
    name: 'Melody the Composer',
    role: 'Crafting beautiful harmonies and melodies',
    avatar: '🎵',
    gradient: 'from-blue-400 to-purple-400'
  }, {
    name: 'Bass the Foundation',
    role: 'Laying down the groove and foundation',
    avatar: '🎸',
    gradient: 'from-green-400 to-blue-400'
  }] as any[];
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };
  if (isSubmitted) {
    return <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div className="text-center max-w-md" initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6
      }}>
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <motion.button onClick={() => setIsSubmitted(false)} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            Send Another Message
          </motion.button>
        </motion.div>
      </div>;
  }
  return <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{
            fontFamily: "Space Grotesk"
          }}>Strawberry Riff</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of music creation and sharing, where AI meets human creativity
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <div className="space-y-4 text-gray-600">
              <p>Music begins with a heartbeat. From a kid drumming on a desk to a road-worn pro chasing fresh sparks, every dreamer deserves a stage. Strawberry Riff is that stage—a judgment-free sanctuary where the next great riff can rise from any corner of the world. .</p>
              <p>We reject gatekeepers and black-box algorithms. Instead, real people drive discovery, trading perfection for connection. Drop a lo-fi voice memo, a polished studio cut, or an AI-assisted experiment—our tools make sharing effortless and feedback human. Artificial intelligence here is a sidekick, never the star. It tidies, suggests, and accelerates, but the soul of every track stays yours. Whether you're sketching at 3 a.m. or uploading from a tour bus, creation should feel like breathing, not a technical obstacle course. </p>
              <p>If you believe music is more verb than product, you've already found your tribe. Plug in your courage, hit upload, and let the pulse we share carry your sound to ears that need it. Welcome to Strawberry Riff. </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Community First</h3>
                <p className="text-gray-600">Support over status. Feedback over follow-counts. Tribe over traffic..</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation Driven</h3>
                <p className="text-gray-600">Freedom from genre. Use all the tools, make all the sounds, your way.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Inclusive Platform</h3>
                <p className="text-gray-600">Zero gatekeeping. Infinite possibility.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Content, Your Control</h3>
                <p className="text-gray-600">Complete control over who sees your work. Share publicly, with friends, or keep it private—your choice, always.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div className="mb-20" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Strawberry Jam Session! 🍓</h2>
            <p className="text-gray-600 text-lg">Enter the club - check for upcoming shows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => <motion.div key={index} className="text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4 + index * 0.1
          }}>
                <div className={`w-24 h-24 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>)}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div className="max-w-2xl mx-auto" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }}>
          
          {/* Pricing CTA */}
          <div className="text-center mb-8">
            <motion.button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              See Our Pricing Plans
            </motion.button>
          </div>

          {/* Collapsible Header */}
          <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer" onClick={() => setIsContactExpanded(!isContactExpanded)} whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.99
        }}>
            <div className="p-6 flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">You can ring our bell.</h2>
                <p className="text-gray-600">Questions, feedback, or a simple hello—drop us a line. We read every note.</p>
              </div>
              <motion.div animate={{
              rotate: isContactExpanded ? 180 : 0
            }} transition={{
              duration: 0.3
            }} className="flex-shrink-0 ml-4">
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Collapsible Content */}
          <AnimatePresence>
            {isContactExpanded && <motion.div initial={{
            opacity: 0,
            height: 0,
            marginTop: 0
          }} animate={{
            opacity: 1,
            height: "auto",
            marginTop: 16
          }} exit={{
            opacity: 0,
            height: 0,
            marginTop: 0
          }} transition={{
            duration: 0.4,
            ease: "easeInOut"
          }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Your name" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300' : 'border-gray-300'}`} placeholder="your@email.com" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.subject ? 'border-red-300' : 'border-gray-300'}`} placeholder="What's this about?" />
                      {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-300' : 'border-gray-300'}`} placeholder="Tell us what's on your mind..." />
                      {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                    </div>

                    <motion.button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{
                  scale: isSubmitting ? 1 : 1.02
                }} whileTap={{
                  scale: isSubmitting ? 1 : 0.98
                }}>
                      {isSubmitting ? <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </> : <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>}
                    </motion.button>
                  </form>
                </div>
              </motion.div>}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>;
};
export default AboutContactPage;