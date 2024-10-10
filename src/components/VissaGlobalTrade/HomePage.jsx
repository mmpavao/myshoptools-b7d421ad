import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HomePage = () => {
  const [settings, setSettings] = useState(null);
  const [chartData] = useState([
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const vissaSiteSettings = await firebaseOperations.getVissaSiteSettings();
        setSettings(vissaSiteSettings);
      } catch (error) {
        console.error("Erro ao buscar configurações do site Vissa:", error);
      }
    };
    fetchSettings();
  }, []);

  if (!settings) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="py-4 px-6 flex justify-between items-center">
        <img src={settings.logoUrl} alt="Vissa Logo" className="h-8" />
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <Button variant="outline">Get Started</Button>
      </header>

      <main>
        <section className="py-20 px-6 text-center">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {settings.title}
          </motion.h1>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {settings.subtitle}
          </motion.p>
          <Button size="lg">Learn More</Button>
        </section>

        <section className="py-20 px-6 bg-gray-900">
          <h2 className="text-3xl font-bold mb-8 text-center">Elevate your business with our high impact service</h2>
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <ul className="space-y-4">
                <li>✓ Mobile app management and access</li>
                <li>✓ Secure file and media sharing</li>
                <li>✓ Advanced analytics and reporting</li>
              </ul>
              <Button className="mt-8">Learn More</Button>
            </div>
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Top-Ranked Marketing Agency for Effective Online Marketing</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Perfect Strategy</h3>
              <p>Develop a tailored strategy to boost your online presence and drive results.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Expert Team Members</h3>
              <p>Our skilled professionals bring years of experience to elevate your marketing efforts.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p>Round-the-clock assistance to ensure your marketing campaigns run smoothly.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900">
          <h2 className="text-3xl font-bold mb-8 text-center">Appreciations from our satisfied customers</h2>
          <div className="grid grid-cols-3 gap-8">
            {/* Add testimonial cards here */}
          </div>
        </section>

        <section className="py-20 px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Connect with 300+ apps</h2>
          <div className="flex justify-center space-x-8">
            {Object.entries(settings.partnerLogos).map(([name, url]) => (
              <img key={name} src={url} alt={name} className="h-12" />
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900">
          <h2 className="text-3xl font-bold mb-8 text-center">Check our latest News and Update</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Add news cards here */}
          </div>
        </section>

        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Start your project today</h2>
          <div className="flex justify-center items-center space-x-4">
            <Input placeholder="Enter email address" className="w-64" />
            <Button>Get Started</Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 bg-gray-900">
        <div className="grid grid-cols-5 gap-8">
          {/* Add footer content here */}
        </div>
      </footer>
    </div>
  );
};

export default HomePage;