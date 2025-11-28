import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="font-sans text-base md:text-lg font-medium pr-8">{question}</span>
                <span className="flex-shrink-0 text-gray-400 group-hover:text-black transition-colors">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-5' : 'max-h-0 opacity-0'}`}
            >
                <p className="font-mono text-xs md:text-sm text-gray-600 leading-relaxed pr-8">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    return (
        <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
            <div className="mb-12">
                 <h2 className="text-3xl md:text-4xl font-sans font-medium mb-3">Frequently Asked Questions</h2>
                 <p className="font-mono text-gray-500 text-xs md:text-sm">Learn more about how Esprit can secure your infrastructure</p>
            </div>

            <div className="border-t border-gray-200">
                <FAQItem 
                    question="How does Esprit differ from traditional penetration testing?"
                    answer="Traditional pentesting is manual, infrequent (often annually), and expensive. Esprit provides continuous, autonomous testing that evolves with your codebase, offering real-time insights at a fraction of the cost."
                />
                <FAQItem 
                    question="What types of vulnerabilities can Esprit detect?"
                    answer="Esprit detects a wide range of OWASP Top 10 vulnerabilities including SQL Injection, XSS, SSRF, IDOR, Auth bypasses, and misconfigurations across cloud infrastructure and application code."
                />
                <FAQItem 
                    question="How quickly can I see results?"
                    answer="You can see initial results in minutes. A full comprehensive scan typically takes a few hours depending on the size of your infrastructure, compared to weeks for manual pentesting."
                />
                <FAQItem 
                    question="Does Esprit work with my existing infrastructure?"
                    answer="Yes. Esprit connects to your cloud providers (AWS, GCP, Azure), code repositories (GitHub, GitLab), and internal networks via secure connectors or VPNs."
                />
                <FAQItem 
                    question="How are false positives handled?"
                    answer="Esprit uses a multi-agent validation system. When a potential vulnerability is found, a secondary specialized agent attempts to exploit it (safely) to confirm it is a true positive before reporting."
                />
                <FAQItem 
                    question="Can Esprit integrate with our CI/CD pipeline?"
                    answer="Absolutely. Esprit provides native integrations with popular CI/CD tools and can be triggered automatically on code commits, pull requests, or scheduled intervals. Security testing becomes part of your development workflow without slowing down releases."
                />
            </div>
        </section>
    );
};

export default FAQ;