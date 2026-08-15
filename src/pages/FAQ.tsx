import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

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

      <div className="py-24 bg-brand-neutral dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-0 ring-1 ring-slate-200 dark:ring-slate-800"
              >
                <button
                  className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-bold text-lg text-brand-slate dark:text-white pr-8">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-brand-red/10 text-brand-red' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <ChevronDown 
                      className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                      size={20} 
                    />
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-8 pb-8 pt-2 text-brand-slate/70 dark:text-gray-400 font-medium leading-relaxed bg-white dark:bg-slate-900">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-brand-slate/70 dark:text-gray-400 mb-6 font-bold tracking-wide uppercase text-sm">Still have questions?</p>
            <Button to="/contact" variant="secondary" size="lg" className="shadow-lg">
              CONTACT US
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
