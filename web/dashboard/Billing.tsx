import React, { useState } from 'react';
import { Check, Zap, Building2, CreditCard, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'For trying out Esprit',
    features: [
      '5 scans per month',
      '100K LLM tokens',
      '1 concurrent scan',
      'Community support',
      'Basic vulnerability reports',
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    description: 'For professional security testing',
    features: [
      '50 scans per month',
      '1M LLM tokens',
      '3 concurrent scans',
      'Priority support',
      'Detailed reports with remediation',
      'API access',
      'CI/CD integration',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 199,
    description: 'For security teams',
    features: [
      'Unlimited scans',
      '10M LLM tokens',
      '10 concurrent scans',
      'Dedicated support',
      'Advanced reporting & analytics',
      'Team collaboration',
      'Custom integrations',
      'SSO & SAML',
    ],
    cta: 'Contact Sales',
  },
];

const Billing: React.FC = () => {
  const { profile } = useAuth();
  const currentPlan = profile?.plan || 'free';

  const handleUpgrade = (planId: string) => {
    // In production, this would redirect to Stripe checkout
    if (planId === 'team') {
      window.open('mailto:sales@esprit.dev?subject=Team Plan Inquiry', '_blank');
    } else {
      alert(`Stripe checkout would open for ${planId} plan. This is a demo.`);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-sans font-medium text-gray-900 mb-2">Billing & Plans</h1>
        <p className="text-gray-600 font-mono text-sm">Manage your subscription and billing</p>
      </div>

      {/* Current Plan Summary */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <p className="text-gray-500 mt-1">
              You are on the{' '}
              <span className="font-medium text-gray-900 uppercase">{currentPlan}</span> plan
            </p>
          </div>
          {currentPlan !== 'free' && (
            <div className="text-right">
              <p className="text-2xl font-medium text-gray-900">
                ${plans.find((p) => p.id === currentPlan)?.price || 0}
                <span className="text-sm text-gray-500">/mo</span>
              </p>
              <p className="text-sm text-gray-500">Next billing: Jan 1, 2025</p>
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded shadow-sm relative ${
              plan.popular ? 'border-orange-500 border-2' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-medium text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.disabled || currentPlan === plan.id}
                className={`w-full mt-6 py-3 px-4 rounded font-medium text-sm transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      {currentPlan !== 'free' && (
        <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              Update <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes, you can cancel your subscription at any time. You'll retain access until the end
              of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">What happens if I exceed my limits?</h3>
            <p className="text-sm text-gray-600 mt-1">
              You'll be notified when approaching limits. Scans will pause until the next billing
              cycle or until you upgrade.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Do you offer annual billing?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes! Annual billing saves you 20%. Contact us to switch to annual billing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Billing;
