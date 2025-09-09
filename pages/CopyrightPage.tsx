
import React from 'react';

const CopyrightPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Copyright Policy</h1>
      
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>This Copyright Policy outlines the policy of Goddess Saga ("we", "us", or "our") on copyright infringement regarding the content on our application (the "Service").</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Ownership of Content</h2>
        <p>All content created by and presented on the Service, including but not limited to text, graphics, logos, images, and software, is the property of Goddess Saga or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of Goddess Saga.</p>

        <h2 className="text-xl font-bold text-white pt-4">User-Generated Content</h2>
        <p>The Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness. By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Copyright Infringement Claims</h2>
        <p>If you are a copyright owner or an agent thereof and believe that any Content infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the following information in writing:</p>
        <ul className="list-disc list-inside pl-4">
            <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest;</li>
            <li>A description of the copyrighted work that you claim has been infringed;</li>
            <li>A description of where the material that you claim is infringing is located on the Service;</li>
            <li>Your address, telephone number, and email address;</li>
            <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
            <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4">Contacting Us</h2>
        <p>If you have any questions about this Copyright Policy, please contact us through our contact page.</p>
      </div>
    </div>
  );
};

export default CopyrightPage;
