import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const sections = [
    {
      title: "Platform",
      links: ["Smart Trading", "AI Advisors", "Yield Farming", "Security", "API Documentation"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"],
    },
    {
      title: "Resources",
      links: ["Help Center", "Community", "FAQ", "Tutorials", "Newsletter"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
              <h3 className="text-xl font-bold">DeFiAI</h3>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered DeFi trading platform bringing institutional-grade algorithms to individual investors on BNB Smart Chain.
            </p>
            <div className="flex space-x-4">
              {['#', '#', '#'].map((href, index) => (
                <a key={index} href={href} className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </a>
              ))}
            </div>
          </div>
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 DeFiAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;