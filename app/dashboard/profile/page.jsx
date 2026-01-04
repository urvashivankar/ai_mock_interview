import React from 'react'

function Profile() {
    return (
        <div className='p-10'>
            <h2 className='font-bold text-2xl'>User Profile</h2>
            <div className='mt-5 p-5 border rounded-lg bg-gray-50'>
                <p><strong>Name:</strong> Demo User</p>
                <p><strong>Email:</strong> demo@example.com</p>
            </div>
            <p className='text-gray-500 mt-5'>This is a mock profile page used in demo mode.</p>
        </div>
    )
}

export default Profile
