'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log('Form submitted:', { email, message });
    // Handle form submission
  };

  const socialLinks = [
    {
      name: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      icon: 'line-md:phone'
    },
    {
      name: 'LinkedIn',
      value: 'rafi alifianto',
      href: 'https://linkedin.com',
      icon: 'mdi:linkedin'

    },
    {
      name: 'Instagram',
      value: '@ralfiantz',
      href: 'https://instagram.com',
      icon: 'line-md:instagram'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Mouse cursor coordinates - Creative Web Manual style */}
      <div className="fixed bottom-4 left-4 text-xs font-mono text-gray-600 z-50">
        [X].0px [Y].0px
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Call me anytime,<br />
            <span className="text-gray-500">babygirl</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            or maybe just send me a message. Let's create something extraordinary together.
          </p>
        </motion.div>

        {/* Main grid section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side - Chat section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <span className="text-sm font-mono text-gray-500 mb-4 block">03 — GET IN TOUCH</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's start a conversation</h2>
            </div>
            <div className='w-full shadow-2xl rounded  bg-zinc-100 p-2'>
              <div className='w-full  border rounded h-[50vh]'>

              </div>
              <div className='mt-3 flex justify-between items-center gap-2'>
                <input type='text' id='message' className='input-field w-full'/>
              <button className='bg-[#222222] cursor-pointer p-4 rounded text-zinc-50'><Icon icon="streamline-sharp:mail-send-email-message" /></button>
              </div>

            </div>

          </motion.div>

          {/* Right side - Contact list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-8">
              <span className="text-sm font-mono text-gray-500 mb-4 block">04 — CONNECT</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find me elsewhere</h2>
            </div>

            <div className="space-y-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target={link.name !== 'Phone' ? '_blank' : undefined}
                  rel={link.name !== 'Phone' ? 'noopener noreferrer' : undefined}
       
                  className="group flex items-center justify-start gap-2 p-2 rounded border border-gray-800 bg-[#222222]/0 hover:bg-[#222222] transition-colors"
                >
                  <Icon icon={link.icon} className="text-2xl text-gray-500 group-hover:text-zinc-50 transition-colors" />
                  <p className='font-medium text-[#222222] group-hover:text-[#ffffff]'>{link.value}</p>
                </motion.a>
              ))}
            </div>

            {/* Additional info */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-4">Based in</p>
              <p className="text-xl font-medium">Surabaya, East Java, ID</p>
            </div>
          </motion.div>
        </div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-32 pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <span>©2025 — All rights reserved</span>
            <a href="#" className="hover:text-zinc-50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-50 transition-colors">Terms of Use</a>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Crafted with</span>
            <div className="flex gap-3 text-zinc-50">
              <span className="px-3 py-1 bg-gray-900 border border-gray-800 text-xs font-mono">
               Next JS
              </span>
              <span className="px-3 py-1 bg-gray-900 border border-gray-800 text-xs font-mono">
                Framer Motion
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}