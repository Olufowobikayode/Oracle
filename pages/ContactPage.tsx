
import React from 'react';

const ContactPage: React.FC = () => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would dispatch an action or call an API.
    alert("Thank you for your message! As this is a demo, your message has not been sent.");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Get In Touch</h1>
        <p className="text-lg text-gray-400 mt-2">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your message..."
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
