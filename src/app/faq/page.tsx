"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does it take to complete a custom artwork?",
      answer: "The timeline varies depending on the size, complexity, and medium of the piece. Typically, a custom artwork takes between 4-8 weeks from concept approval to completion. Rush orders can be accommodated for an additional fee. I'll provide you with a detailed timeline and regular progress updates throughout the creative process."
    },
    {
      question: "What is your commission process?",
      answer: "My commission process begins with an initial consultation where we discuss your vision, preferred style, size, and budget. Once we align on the concept, I'll provide a detailed proposal and 50% deposit is required to begin. I'll share progress photos at key milestones, and final payment is due upon completion before shipping or delivery."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, I ship artwork worldwide! All pieces are professionally packaged with museum-quality materials to ensure safe delivery. Shipping costs vary based on size, destination, and insurance value. International shipments typically take 7-14 business days and include full insurance coverage and tracking."
    },
    {
      question: "Can I visit your studio in person?",
      answer: "Absolutely! Studio visits are available by appointment. This is a wonderful opportunity to see works in progress, discuss commissions in detail, and view available pieces in person. Please contact me at least 48 hours in advance to schedule your visit. The studio is located in New York City."
    },
    {
      question: "What payment methods do you accept?",
      answer: "I accept various payment methods including bank transfers, credit cards (Visa, Mastercard, American Express), PayPal, and for larger commissions, installment plans can be arranged. For international clients, I also accept wire transfers. All transactions are secure and a detailed invoice will be provided."
    },
    {
      question: "Do you offer certificates of authenticity?",
      answer: "Yes, every original artwork comes with a signed certificate of authenticity that includes the title, year of creation, dimensions, medium, and a unique registration number. This certificate ensures the provenance of your piece and is important for insurance and resale purposes."
    },
    {
      question: "What if I'm not satisfied with the commissioned piece?",
      answer: "Client satisfaction is my top priority. That's why I include multiple review stages during the commission process. If adjustments are needed, I'm happy to make reasonable modifications. However, once you've approved the final design and work has begun, significant changes may require additional fees. I stand behind the quality of my work 100%."
    },
    {
      question: "Can you create artwork based on a photograph or concept?",
      answer: "Yes! Many of my commissions are inspired by client-provided photographs, memories, or abstract concepts. I can work in various styles—from realistic to abstract—to bring your vision to life. During our consultation, we'll discuss how to best translate your idea into a unique piece of art."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-6 md:py-24 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-20">
            <h1 className="md:text-5xl text-3xl font-extralight tracking-tight leading-none italic mb-4 md:mb-6 text-zinc-900 px-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-xl text-neutral-400 max-w-2xl mx-auto px-4">
              Everything you need to know about working with me and my art. 
              Can&apos;t find the answer you&apos;re looking for? Feel free to reach out.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group relative bg-white overflow-hidden transition-all duration-500"
                style={{
                  boxShadow: openIndex === index 
                    ? '0 10px 30px rgba(0,0,0,0.1)' 
                    : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {/* Decorative side bar */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 md:w-2 transition-all duration-500 ${
                    openIndex === index ? 'bg-zinc-900' : 'bg-zinc-300'
                  }`}
                ></div>

                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-4 md:px-10 py-5 md:py-8 flex items-center justify-between gap-3 md:gap-6 hover:bg-zinc-50 transition-colors duration-300"
                >
                  <div className="flex items-start gap-3 md:gap-6 flex-1">
                    <div className={`flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center text-sm md:text-lg font-bold transition-all duration-300 ${
                      openIndex === index 
                        ? 'border-zinc-900 bg-zinc-900 text-white scale-110' 
                        : 'border-zinc-300 text-zinc-400'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className={`text-base md:text-xl lg:text-2xl font-semibold transition-colors duration-300 pt-1 md:pt-2 pr-2 ${
                      openIndex === index ? 'text-zinc-900' : 'text-zinc-700'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>
                  
                  <div className={`flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-zinc-900 flex items-center justify-center transition-all duration-500 ${
                    openIndex === index ? 'rotate-180 bg-zinc-900' : 'bg-white'
                  }`}>
                    {openIndex === index ? (
                      <Minus className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    ) : (
                      <Plus className="h-4 w-4 md:h-6 md:w-6 text-zinc-900" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0',
                    opacity: openIndex === index ? 1 : 0
                  }}
                >
                  <div className="px-4 md:px-10 pb-5 md:pb-8 pl-12 md:pl-28">
                    <div className="pt-3 md:pt-4 border-t border-zinc-200">
                      <p className="text-sm md:text-base lg:text-lg text-zinc-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="bg-zinc-900 text-white p-12 md:p-16 relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
                <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                  I&apos;m here to help! Reach out and I&apos;ll get back to you within 24 hours.
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-zinc-900 md:px-10 md:py-5 py-3 px-6 text-sm font-bold tracking-widest hover:bg-zinc-100 transition-all duration-300 transform hover:scale-105"
                >
                  CONTACT ME
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white">
              <div className="text-4xl font-bold text-zinc-900 mb-2">24h</div>
              <div className="text-sm text-zinc-600 uppercase tracking-wider">Response Time</div>
            </div>
            <div className="text-center p-6 bg-white">
              <div className="text-4xl font-bold text-zinc-900 mb-2">100%</div>
              <div className="text-sm text-zinc-600 uppercase tracking-wider">Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-white">
              <div className="text-4xl font-bold text-zinc-900 mb-2">15+</div>
              <div className="text-sm text-zinc-600 uppercase tracking-wider">Years Exp</div>
            </div>
            <div className="text-center p-6 bg-white">
              <div className="text-4xl font-bold text-zinc-900 mb-2">1000+</div>
              <div className="text-sm text-zinc-600 uppercase tracking-wider">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}