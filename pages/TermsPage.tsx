
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Goddess Saga application (the "Service") operated by us.</p>
        
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Accounts</h2>
        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

        <h2 className="text-xl font-bold text-white pt-4">Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Disclaimer</h2>
        <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>

        <h2 className="text-xl font-bold text-white pt-4">Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </div>
    </div>
  );
};

export default TermsPage;
