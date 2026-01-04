"use client"
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, HelpCircle } from 'lucide-react'

function Questions() {
    const commonQuestions = [
        {
            category: "Behavioral",
            questions: [
                { q: "Tell me about yourself.", a: "Focus on your professional journey, key achievements, and why you're a good fit for this role." },
                { q: "What is your greatest strength?", a: "Pick a strength relevant to the job and provide a specific example of how you've used it." },
                { q: "What is your greatest weakness?", a: "Share a real weakness you've worked to improve, demonstrating self-awareness and growth." }
            ]
        },
        {
            category: "Technical (Frontend)",
            questions: [
                { q: "What is React and how does it work?", a: "React is a JavaScript library for building user interfaces using components and a virtual DOM for efficient updates." },
                { q: "Explain the difference between state and props.", a: "State is internal to a component and can change, while props are passed from parent to child and are immutable." }
            ]
        },
        {
            category: "Technical (Backend)",
            questions: [
                { q: "What is a REST API?", a: "A REST API is an architectural style for designing networked applications based on HTTP methods and resources." },
                { q: "What is the difference between SQL and NoSQL?", a: "SQL databases are relational and structured, while NoSQL databases are non-relational and offer more flexibility." }
            ]
        }
    ]

    return (
        <div className='p-10 max-w-5xl mx-auto'>
            <h2 className='font-bold text-3xl text-primary'>Common Interview Questions</h2>
            <p className='text-gray-500 text-lg mt-2'>Master these frequently asked questions to boost your confidence.</p>

            <div className='mt-10 space-y-8'>
                {commonQuestions.map((cat, index) => (
                    <div key={index} className='bg-white p-6 rounded-2xl border shadow-sm'>
                        <h3 className='font-bold text-xl text-gray-800 mb-6 flex items-center gap-2'>
                            <HelpCircle className='text-primary' /> {cat.category}
                        </h3>
                        <div className='space-y-4'>
                            {cat.questions.map((item, qIndex) => (
                                <Collapsible key={qIndex} className='border rounded-xl overflow-hidden'>
                                    <CollapsibleTrigger className='flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-all font-medium text-left'>
                                        {item.q}
                                        <ChevronRight className='w-5 h-5 text-gray-400 group-data-[state=open]:rotate-90 transition-transform' />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className='p-4 bg-gray-50 text-gray-600 border-t'>
                                        <p className='font-semibold text-primary mb-1'>Suggested approach:</p>
                                        {item.a}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Questions
