import React from 'react';

const currentYear = new Date().getFullYear();

function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">About</h1>
    
      <footer>
      <p className='mt-5'>&copy; Copyright Budi Ariyanto WA 0895340710827 {currentYear}. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default About;
