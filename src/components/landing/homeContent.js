import {
  Music,
  GraduationCap,
  ShoppingCart,
  Package,
  Award,
  Users,
  Star,
  Headphones,
  Video,
  Shield,
  MapPin,
  Piano,
  Guitar,
  Mic2,
} from "lucide-react";

export const HOME_STATS = [
  { value: "500+", label: "Students trained", icon: Users },
  { value: "50+", label: "Quality instruments", icon: Music },
  { value: "30+", label: "Expert-led courses", icon: GraduationCap },
  { value: "4.9/5", label: "Learner satisfaction", icon: Star },
];

export const HOME_FEATURES = [
  {
    icon: Award,
    title: "Certified mentors",
    text: "Learn from experienced teachers across piano, guitar, vocals, and more.",
  },
  {
    icon: Headphones,
    title: "Premium instruments",
    text: "Shop curated gear with honest pricing and reliable quality checks.",
  },
  {
    icon: Video,
    title: "Structured courses",
    text: "Video lessons, clear progression, and practice-friendly pacing.",
  },
  {
    icon: Shield,
    title: "Secure checkout",
    text: "Safe payments, order tracking, and support when you need help.",
  },
];

export const HOME_STEPS = [
  { step: "01", title: "Explore catalog", text: "Browse instruments and courses matched to your level." },
  { step: "02", title: "Add to cart", text: "Pick your gear and lessons — bundle offers apply automatically." },
  { step: "03", title: "Start learning", text: "Access purchased courses and visit our Indore academy anytime." },
];

export const HOME_CATEGORIES = [
  { icon: Piano, label: "Piano & Keys" },
  { icon: Guitar, label: "Guitar" },
  { icon: Mic2, label: "Vocals" },
  { icon: Music, label: "Flute & Wind" },
  { icon: Headphones, label: "Studio Gear" },
];

export const HOME_TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Piano student",
    quote:
      "The course structure is clear and the instructors are patient. I played my first piece in five weeks!",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Guitar buyer",
    quote:
      "Bought a guitar here — great quality, fast delivery, and the free course bundle was a pleasant surprise.",
    rating: 5,
  },
  {
    name: "Ananya K.",
    role: "Vocal learner",
    quote:
      "Grammy feels professional online and in person. The Indore studio is welcoming and well equipped.",
    rating: 5,
  },
];

export const USER_QUICK_LINKS = [
  { to: "/user/instruments", label: "Instruments", desc: "Shop gear", icon: Music, color: "from-violet-500 to-indigo-600" },
  { to: "/user/courses", label: "Courses", desc: "Start learning", icon: GraduationCap, color: "from-sky-500 to-blue-600" },
  { to: "/user/cart", label: "Cart", desc: "Checkout", icon: ShoppingCart, color: "from-emerald-500 to-teal-600" },
  { to: "/user/myorders", label: "Orders", desc: "Track purchases", icon: Package, color: "from-amber-500 to-orange-600" },
];

export const GUEST_QUICK_LINKS = [
  { to: "/guest/guestinstruments", label: "Instruments", desc: "Browse catalog", icon: Music, color: "from-violet-500 to-indigo-600" },
  { to: "/guest/guestcourses", label: "Courses", desc: "See lessons", icon: GraduationCap, color: "from-sky-500 to-blue-600" },
  { to: "/login", label: "Sign in", desc: "Your account", icon: Users, color: "from-brand-600 to-brand-800" },
  { to: "/contact-us", label: "Contact", desc: "Get help", icon: MapPin, color: "from-slate-600 to-slate-800" },
];
