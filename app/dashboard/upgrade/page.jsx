"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

function Upgrade() {
    const plans = [
        {
            name: "Free",
            price: "0",
            features: [
                "3 Mock Interviews / month",
                "Basic AI Feedback",
                "Standard Questions",
                "History up to 7 days"
            ],
            current: true
        },
        {
            name: "Pro",
            price: "29",
            features: [
                "Unlimited Mock Interviews",
                "Advanced AI Analysis",
                "Custom Question Sets",
                "Lifetime History",
                "Priority Support"
            ],
            current: false,
            recommended: true
        }
    ]

    return (
        <div className='p-10 max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
                <h2 className='font-bold text-4xl text-primary mb-4'>Upgrade Your Potential</h2>
                <p className='text-gray-500 text-xl'>Choose the plan that's right for your career growth.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col ${plan.recommended ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-gray-100 shadow-xl'
                            } bg-white`}
                    >
                        {plan.recommended && (
                            <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider'>
                                Most Popular
                            </span>
                        )}

                        <div className='mb-8'>
                            <h3 className='font-bold text-2xl text-gray-800 mb-2'>{plan.name}</h3>
                            <div className='flex items-baseline gap-1'>
                                <span className='text-4xl font-bold'>${plan.price}</span>
                                <span className='text-gray-500'>/month</span>
                            </div>
                        </div>

                        <ul className='space-y-4 mb-10 flex-grow'>
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className='flex items-center gap-3 text-gray-600'>
                                    <div className='bg-primary/10 p-1 rounded-full'>
                                        <Check className='w-4 h-4 text-primary' />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={plan.recommended ? 'default' : 'outline'}
                            className={`w-full py-6 rounded-xl text-lg font-bold ${plan.recommended ? 'shadow-lg shadow-primary/30' : ''}`}
                            disabled={plan.current}
                        >
                            {plan.current ? 'Current Plan' : 'Upgrade Now'}
                        </Button>
                    </div>
                ))}
            </div>

            <p className='text-center text-gray-400 mt-12 text-sm'>
                Secure payments powered by Stripe. Cancel anytime.
            </p>
        </div>
    )
}

export default Upgrade
