import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Do I need prior experience to join a program?",
    answer: "For most of our beginner programs, no prior experience is required. We start from the basics and build up. Some advanced programs may require prerequisites, which will be clearly stated on the program page."
  },
  {
    question: "Are your programs online or physical?",
    answer: "We offer a mix of both. Many of our core digital skills programs are delivered online via live sessions, while some specialized bootcamps and school partnership programs are conducted physically. Check the specific program details for delivery format."
  },
  {
    question: "Do you build websites for small businesses?",
    answer: "Yes, we work with businesses of all sizes. Whether you need a simple landing page or a complex web application, our digital services team can help you build it."
  },
  {
    question: "How long does a typical web project take?",
    answer: "A standard business website typically takes 2-4 weeks from design to launch. More complex web applications can take 2-3 months. We will provide a specific timeline when you request a quote."
  },
  {
    question: "Do you offer certificates for your programs?",
    answer: "Yes, upon successful completion of our programs and submission of the final project, you will receive a verifiable certificate of completion."
  },
  {
    question: "Can I hire your students?",
    answer: "Absolutely. We are proud of the talent we develop. If you are looking to hire junior developers, designers, or digital marketers, please contact us."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Find answers to common questions about our programs, services, and how we work.
          </p>
        </div>
      </div>

      <div className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-bold text-gray-900 dark:text-white pr-8">{faq.question}</span>
                  <ChevronDown 
                    className={`text-brand-red shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">Still have questions?</p>
            <Link to="/contact" className="inline-flex items-center justify-center bg-brand-slate text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default FAQ;
