import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import HeroSection from '../../components/common/HeroSection';
import {
  ShoppingBag,
  Shield,
  Truck,
  Award,
  Heart,
  ArrowRight,
  Users,
  Globe,
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  ShoppingCart,
  Star,
  ThumbsUp,
  TrendingUp,
  Zap,
  Box,
  CreditCard,
  Headphones,
} from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'David Kimani',
      role: 'Co-Founder & CEO',
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      bio: 'Serial entrepreneur with 15+ years in African tech. Founded MarketHub to solve real e-commerce challenges in East Africa.',
      social: {
        twitter: 'https://twitter.com/techdave',
        linkedin: 'https://linkedin.com/in/techdave',
      },
      expertise: ['E-commerce', 'Fintech', 'Startup Growth'],
    },
    {
      name: 'Amina Hassan',
      role: 'Chief Operations Officer',
      image:
        'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
      bio: 'Supply chain specialist with extensive experience in East African logistics and last-mile delivery solutions. Leads our operations across 5 countries.',
      social: {
        twitter: '#',
        linkedin: '#',
      },
      expertise: ['Supply Chain', 'Logistics', 'Operations'],
    },
    {
      name: 'James Omondi',
      role: 'Chief Technology Officer',
      image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      bio: "Former Google engineer leading our tech team to build scalable solutions for Africa's unique e-commerce challenges.",
      social: {
        twitter: '#',
        linkedin: '#',
      },
      expertise: ['Software Architecture', 'AI/ML', 'Cloud Computing'],
    },
  ];

  const features = [
    {
      icon: <Shield className='h-6 w-6' />,
      title: 'Secure Shopping',
      description: 'Your security is our priority with 256-bit SSL encryption.',
    },
    {
      icon: <Truck className='h-6 w-6' />,
      title: 'Fast Delivery',
      description: 'Free and fast shipping on all orders over KSh 5,000.',
    },
    {
      icon: <RefreshCw className='h-6 w-6' />,
      title: 'Easy Returns',
      description: '30-day return policy for a worry-free shopping experience.',
    },
    {
      icon: <CreditCard className='h-6 w-6' />,
      title: 'Multiple Payment Options',
      description: 'We accept all major credit cards and digital wallets.',
    },
  ];

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <HeroSection
        badgeText='Pioneering E-commerce in East Africa Since 2018'
        title="Empowering East Africa's"
        highlightText='Digital Economy'
        description='MarketHub is revolutionizing online shopping across East Africa by connecting millions of customers with trusted sellers and quality products.'
      />

      {/* Our Story */}
      <section className='py-16 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-flex items-center px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6'>
                Our Journey
              </div>
              <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                Redefining E-commerce in East Africa
              </h2>
              <div className='space-y-6 text-gray-600 dark:text-gray-300'>
                <p className='text-lg'>
                  In 2018, a group of East African entrepreneurs recognized the
                  need for a homegrown e-commerce solution that truly understood
                  the region's unique challenges and opportunities. What started
                  as a small team in Nairobi has grown into East Africa's most
                  trusted online marketplace, serving customers in Kenya,
                  Uganda, Tanzania, Rwanda, and beyond.
                </p>
                <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                  <p className='font-medium text-gray-700 dark:text-gray-200 mb-2'>
                    Our mission is simple:
                  </p>
                  <p className='text-primary-600 dark:text-primary-400 font-medium'>
                    To make online shopping accessible, reliable, and rewarding
                    for every East African.
                  </p>
                </div>
                <p>
                  We've built our platform with the East African consumer in
                  mind – from multiple payment options including M-Pesa and
                  Airtel Money, to last-mile delivery solutions that reach even
                  the most remote areas. Our commitment to local partnerships
                  means we're not just selling products; we're helping to build
                  the region's digital economy, one transaction at a time.
                </p>
                <p>
                  Today, MarketHub stands as a testament to what's possible when
                  innovation meets deep market understanding. We've created
                  thousands of jobs, empowered local businesses to reach new
                  markets, and brought the convenience of online shopping to
                  millions of East Africans.
                </p>
              </div>
            </div>
            <div className='relative w-full max-w-2xl mx-auto'>
              <div className='relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl'>
                <img
                  src='https://media.istockphoto.com/id/1763699642/photo/shopping-bag-studio-phone-call-and-happy-black-woman-consulting-on-discount-promotion-market.jpg?s=2048x2048&w=is&k=20&c=wKg0_bN4cNTMVE3Q5S0BVxC9r7UfssTKcfAtcOsTCSQ='
                  alt='Happy customer shopping with MarketHub'
                  className='w-full h-full object-cover transition-transform duration-700 hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8'>
                  <div className='text-white max-w-md'>
                    <p className='text-sm font-medium text-primary-300 mb-2'>
                      Our Customers Love Us
                    </p>
                    <h3 className='text-3xl font-bold mb-3 leading-tight'>
                      Exceptional Shopping Experience
                    </h3>
                    <p className='text-base text-gray-100 leading-relaxed'>
                      Join thousands of satisfied customers enjoying seamless
                      online shopping across East Africa
                    </p>
                  </div>
                </div>
              </div>
              <div className='absolute -bottom-6 -right-6 w-40 h-40 bg-primary-100 dark:bg-primary-900/30 rounded-2xl -z-10'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - Full Width */}
      <section className='py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden'>
        <div className='w-full px-4 sm:px-6 lg:px-8 mx-auto'>
          <div className='max-w-7xl mx-auto text-center mb-20'>
            <span className='inline-block px-5 py-2.5 text-sm font-medium tracking-wide text-primary-700 dark:text-primary-300 bg-primary-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full mb-5'>
              What We Stand For
            </span>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Our Core Values
            </h2>
            <div className='w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mb-6 rounded-full'></div>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto'>
              These principles guide everything we do and help us deliver
              exceptional value to our customers.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {[
              {
                icon: <Shield className='h-6 w-6' />,
                title: 'Integrity',
                description:
                  'We believe in transparency and honesty in all our dealings with customers and partners, building trust through ethical business practices.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: <Heart className='h-6 w-6' />,
                title: 'Customer First',
                description:
                  'Your satisfaction is our top priority. We go above and beyond to exceed your expectations at every touchpoint.',
                color: 'from-rose-500 to-rose-600',
              },
              {
                icon: <Globe className='h-6 w-6' />,
                title: 'Sustainability',
                description:
                  "We're committed to eco-friendly practices and responsible sourcing to minimize our environmental impact.",
                color: 'from-teal-500 to-teal-600',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700/50 h-full flex flex-col'>
                <div
                  className={`absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-all duration-500`}></div>
                <div
                  className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {React.cloneElement(item.icon, { className: 'h-6 w-6' })}
                </div>
                <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white relative z-10'>
                  {item.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 relative z-10 text-sm leading-relaxed mb-4'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-20 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <div>
                <span className='inline-block px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4'>
                  Why Choose Us
                </span>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                  The Best Shopping Experience
                </h2>
                <div className='w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mb-6 rounded-full'></div>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-8'>
                  We&apos;re committed to providing you with an exceptional
                  shopping experience from start to finish.
                </p>
              </div>
              <div className='space-y-6'>
                {features.map((feature, index) => (
                  <div key={index} className='flex items-start space-x-4'>
                    <div className='flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400'>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-1'>
                        {feature.title}
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='pt-4'>
                <Button size='lg'>
                  Shop Now
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
            <div className='relative w-full max-w-3xl mx-auto'>
              <div className='relative h-[500px] rounded-2xl overflow-hidden shadow-xl'>
                <img
                  src='https://cioafrica.co/wp-content/uploads/2024/09/Iopped.jpg'
                  alt='Modern e-commerce technology and shopping experience'
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8'>
                  <div className='text-white max-w-2xl'>
                    <h3 className='text-3xl font-bold mb-3 leading-tight'>
                      Cutting-Edge Technology
                    </h3>
                    <p className='text-gray-100 text-base'>
                      Powering seamless shopping experiences across East Africa
                      with our innovative platform
                    </p>
                  </div>
                </div>
              </div>
              <div className='absolute -z-10 -bottom-6 -left-6 w-56 h-56 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl'></div>
              <div className='absolute -z-10 -top-6 -right-6 w-56 h-56 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full'></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
