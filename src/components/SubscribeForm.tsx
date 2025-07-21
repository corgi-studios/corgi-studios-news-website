'use client';
import { useState, FormEvent } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Success! Thank you for subscribing.');
        setEmail('');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h3>
      <p className="text-gray-600 mb-6">Get the latest news and updates delivered directly to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}