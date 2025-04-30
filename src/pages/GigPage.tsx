import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Clock, Star, User } from 'lucide-react';

type GigData = {
  title: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  deliveryTime: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
  };
}

const gigs: Record<string, GigData> = {
  "1": {
    title: "Professional Web Development",
    description: "Full-stack development with modern technologies. I specialize in creating responsive, scalable web applications using React, Node.js, and other cutting-edge technologies.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    price: "$500",
    rating: 4.9,
    deliveryTime: "5 days",
    seller: {
      name: "Alex Johnson",
      rating: 4.9,
      reviews: 150,
    },
  },
  "2": {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications. Expert in iOS and Android development using React Native and Flutter.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "$800",
    rating: 4.8,
    deliveryTime: "7 days",
    seller: {
      name: "Sarah Smith",
      rating: 4.8,
      reviews: 120,
    },
  },
  "3": {
    title: "UI/UX Design",
    description: "Beautiful and functional design solutions. Creating user-centered designs that drive engagement and conversion.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    price: "$400",
    rating: 5.0,
    deliveryTime: "4 days",
    seller: {
      name: "Mike Wilson",
      rating: 5.0,
      reviews: 200,
    },
  },
};

const GigPage = () => {
  const { id } = useParams<{ id: string }>();
  const gig = id ? gigs[id] : null;

  if (!gig) {
    return <div>Gig not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image and Description */}
            <div className="space-y-8 fade-in">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={gig.image} 
                  alt={gig.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                <p className="text-gray-600 leading-relaxed">{gig.description}</p>
              </div>
            </div>
            
            {/* Right Column - Pricing and Details */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border sticky top-24 fade-in">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">{gig.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{gig.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{gig.deliveryTime} delivery</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="w-5 h-5" />
                      <div>
                        <p className="font-medium text-gray-900">{gig.seller.name}</p>
                        <p className="text-sm">
                          {gig.seller.rating} ({gig.seller.reviews} reviews)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Continue ({gig.price})
                  </button>
                  
                  <button className="w-full py-3 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors">
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GigPage;