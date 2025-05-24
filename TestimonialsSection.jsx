import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "DeFiAI has completely transformed my crypto investment strategy on BSC. The AI trading bot has consistently outperformed my manual trading by over 30%.",
      author: "Alex Thompson",
      role: "Crypto Investor",
      rating: 5,
    },
    {
      content: "The sentiment analysis feature alone is worth the investment. Being able to trade based on social media trends before they affect the BSC market has been game-changing.",
      author: "Sarah Chen",
      role: "DeFi Enthusiast",
      rating: 5,
    },
    {
      content: "As a full-time professional, I don't have time to monitor BSC markets 24/7. DeFiAI's automated strategies have allowed me to participate in DeFi without sacrificing my career.",
      author: "Michael Rodriguez",
      role: "Software Engineer",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied users maximizing their DeFi returns on BSC
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;