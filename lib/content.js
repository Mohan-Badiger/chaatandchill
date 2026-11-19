/**
 * Chaat & Chill Café — Content Configuration
 * All site copy in one place for easy editing / CMS migration.
 */

export const siteConfig = {
  name: "Chaat & Chill Café",
  tagline: "Sip. Snack. Smile.",
  description:
    "Where India's vibrant street food culture meets modern café vibes. Every bite tells a story, every sip sparks a smile.",
  url: "https://chaatandchill.cafe",
  ogImage: "/images/hero-luxury.jpg",
  socials: {
    instagram: "https://instagram.com/chaatandchill",
    twitter: "https://twitter.com/chaatandchill",
    facebook: "https://facebook.com/chaatandchill",
    youtube: "https://youtube.com/@chaatandchill",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Menu", href: "/menu" },
  { label: "Contact", href: "/contact" },
];

export const heroContent = {
  eyebrow: "Welcome to",
  headline: "Chaat & Chill Café",
  subheadline: "Sip. Snack. Smile.",
  description:
    "Where India's street food soul meets modern café culture. Discover flavors that make you feel at home.",
  cta: { label: "Reserve a Table", href: "#locations" },
  scrollText: "SCROLL TO EXPLORE",
};

export const brandStory = {
  eyebrow: "OUR STORY",
  headline: "Tradition on a Plate, Joy in Every Bite.",
  description:
    "Chaat & Chill Café was born from a simple dream — to bring the electric energy of India's street food culture to a warm, welcoming space. We started with a tiny stall, a family recipe for the perfect pani puri, and an unshakeable belief that great food brings people together. Today, every dish we serve carries that same fire — crafted with love, served with a smile, and spiced with memories of bustling bazaars and evening chai with friends.",
  cta: { label: "About Us", href: "#philosophy" },
  image: "/images/brand-story.jpg",
};

export const philosophy = {
  eyebrow: "OUR PHILOSOPHY",
  statement:
    "We believe food is not just nourishment — it is connection, celebration, and culture. Every chaat we craft, every chai we pour, carries the spirit of India's streets — vibrant, generous, and alive. We don't just serve food. We serve memories.",
  backgroundImage: "/images/philosophy-spices.jpg",
};

export const menuItems = [
  {
    id: 1,
    title: "Margherita Classica Pizza",
    description:
      "Hand-stretched sourdough crust with San Marzano tomato sauce, fresh buffalo mozzarella, and aromatic basil leaves.",
    price: "₹260",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Classic Crispy Veggie Burger",
    description:
      "Crispy golden herb patty, crunchy lettuce, tomatoes, and secret cafe sauce inside a toasted brioche bun.",
    price: "₹180",
    tag: "House Favorite",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Peri-Peri Masala Finger Chips",
    description:
      "Crispy potato finger chips tossed in fiery African peri-peri spices. Served piping hot with creamy garlic mayo.",
    price: "₹150",
    tag: "Crowd Favorite",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Belgian Chocolate Fudge Sundae",
    description:
      "Double scoops of dark Belgian chocolate ice cream, warm brownie crumble, and rich hot fudge drizzle.",
    price: "₹195",
    tag: "Decadent",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Cheesy Garlic Breadsticks",
    description:
      "Artisanal baguette slathered in roasted garlic butter and crowned with pull-apart mozzarella.",
    price: "₹170",
    tag: "Comfort Food",
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Classic Cold Coffee with Ice Cream",
    description:
      "Double shot of espresso blended thick with chilled milk and crowned with a scoop of vanilla bean ice cream.",
    price: "₹160",
    tag: "Signature Brew",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
  },
];

export const awards = [
  "Best Street Food Café 2024",
  "Zomato Top Rated",
  "Times Food Award",
  "Swiggy Super Star",
  "India Today Best Café",
  "CNN Travel's Must-Try",
  "National Restaurant Award",
  "Culinary Excellence 2025",
];

export const pressMentions = [
  {
    publication: "The Times of India",
    date: "March 2026",
    headline: "Chaat & Chill: Redefining India's Street Food Scene",
    excerpt:
      "A café that transforms humble street food into an elevated dining experience without losing its soul.",
    link: "#",
  },
  {
    publication: "Food & Travel Magazine",
    date: "January 2026",
    headline: "The Café That Made Pani Puri Premium",
    excerpt:
      "Walking into Chaat & Chill feels like stepping into a modern bazaar — warm, aromatic, and irresistibly inviting.",
    link: "#",
  },
  {
    publication: "Hindustan Times",
    date: "November 2025",
    headline: "From Street Stall to Style Statement",
    excerpt:
      "What started as a passion project has become one of India's most loved café chains, one chaat at a time.",
    link: "#",
  },
  {
    publication: "Condé Nast Traveller",
    date: "August 2025",
    headline: "10 Cafés That Are Changing Indian Food Culture",
    excerpt:
      "Chaat & Chill makes the list for its bold reimagining of classic Indian street food in a stunning setting.",
    link: "#",
  },
];

export const timeline = [
  {
    year: "2024",
    title: "Award Season",
    description:
      "Recognized with national culinary awards and featured in top food publications. Our masala chai became the most Instagrammed drink in India.",
  },
  {
    year: "2025",
    title: "Culinary Innovation",
    description:
      "Launched our fusion street food menu, introducing dishes like Cheese Pav Bhaji Sliders and Samosa Chaat Tacos, bridging the gap between traditional spices and modern formats.",
  },
  {
    year: "2026",
    title: "The Movement",
    description:
      "Today, Chaat & Chill is more than a café — it's a movement. With 12 outlets and counting, we continue to celebrate the soul of Indian street food.",
  },
];

export const locations = [
  {
    name: "Chaat and Chill, Jamakhandi",
    address: "Near KSRTC Bus Stand, Jamakhandi, Karnataka 587301",
    hours: "10:00 AM – 10:30 PM",
    phone: "+91 8353 220123",
    mapLink: "https://maps.google.com/?q=Jamakhandi",
  },
  {
    name: "The Shreeshailam Cafe, Rabakavi",
    address: "Main Road, Rabakavi Banhatti, Karnataka 587311",
    hours: "11:00 AM – 11:00 PM",
    phone: "+91 8351 230456",
    mapLink: "https://maps.google.com/?q=Rabakavi",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 5,
    text: "The papdi chaat here is a religious experience. I've tried chaat all over India, and nothing comes close to Chaat & Chill. The ambiance is the cherry on top!",
  },
  {
    name: "Rahul Verma",
    location: "Mumbai",
    rating: 5,
    text: "Finally, a place that takes street food seriously. The vada pav tastes like it was made by a Mumbai street vendor who also happens to be a Michelin chef.",
  },
  {
    name: "Ananya Krishnan",
    location: "Delhi",
    rating: 5,
    text: "The masala chai alone is worth the trip. But stay for the pani puri — it's an explosion of flavors that will leave you speechless.",
  },
  {
    name: "Vikram Desai",
    location: "Hyderabad",
    rating: 4,
    text: "Brought my parents here — they said the dahi vada reminded them of their childhood. That's the highest compliment any food can get.",
  },
  {
    name: "Sneha Patel",
    location: "Bangalore",
    rating: 5,
    text: "The interiors are gorgeous, the staff is warm, and the food? Absolutely divine. This is my happy place.",
  },
];

/* ==========================================================================
   ABOUT PAGE CONTENT
   ========================================================================== */
/* ==========================================================================
   ABOUT PAGE CONTENT — THE RAMESHWARAM CAFE HERITAGE
   ========================================================================== */
export const aboutPageContent = {
  hero: {
    eyebrow: "A STORY OF PASSION & HERITAGE",
    headline: "South Indian Soul, Modern Bite",
    subheadline:
      "Our Cafe is our Temple, Our Customers are Gods, & What we serve, is Prasadam.",
    description:
      "The Rameshwaram Cafe, a premium South Indian culinary tradition, serves authentic cuisine that’s fresh, piping hot, and true to timeless heritage. From early risers catching dawn to midnight cravings, we operate round the clock with food that feels like home — made with pure Nandini cow ghee, unmatched hygiene, and abundant heart.",
    image: "/images/outlet-ambiance.jpg",
    stats: [
      { number: "100%", label: "Pure Nandini Ghee" },
      { number: "0", label: "Refrigeration / Freezers" },
      { number: "24/7", label: "Heartfelt Energy" },
      { number: "9+", label: "Iconic Addas" },
    ],
  },
  founders: {
    eyebrow: "THE MINDS BEHIND THE MAGIC",
    headline: "Driven by Tradition, Engineered for Perfection",
    lead:
      "Meet the founders who transformed a simple South Indian meal into an unforgettable sensory celebration. Rooted in tradition, inspired by innovation, and fuelled by endless cups of filter coffee, they’re the reason every plate feels like home — just with a little extra ghee and a lot more love.",
    image: "/images/founders-portrait.jpg",
    members: [
      {
        name: "Raghavendra Rao",
        role: "Co-Founder & Chief Executive Officer",
        badge: "Mechanical Engineer • 20+ Years Food Industry Mastery",
        quote:
          "Operational precision, live kitchen visibility, and relentless speed are the heartbeats of our café. When food is served within seconds of leaving the tawa, laden with unadulterated ghee, dining transcends into prasadam.",
        bio: "A mechanical engineering graduate with more than two decades immersed in culinary operations, Raghavendra Rao is the engine behind our frictionless high-volume kitchen workflows, zero-compromise ingredient sourcing, and the iconic sizzling ghee drizzle that greets every patron.",
      },
      {
        name: "Divya Raghavendra Rao",
        role: "Co-Founder & Managing Director",
        badge: "Chartered Accountant • IIM-Ahmedabad Alumna",
        quote:
          "Preserving the soulful flavours of South India while scaling across cities requires visionary discipline, financial excellence, and an uncompromising commitment to our guests.",
        bio: "An accomplished Chartered Accountant and alumna of IIM Ahmedabad with over 12 years of corporate strategy leadership, Divya spearheads the brand’s strategic expansion, standard operating disciplines, and our steadfast commitment to women-led entrepreneurship.",
      },
    ],
  },
  ideology: {
    eyebrow: "SACRED IDEOLOGY & HISTORY",
    headline: "An Homage to Dr. A.P.J. Abdul Kalam",
    kalamQuote: "“You have to dream before your dreams can come true.”",
    kalamAuthor: "— Dr. A.P.J. Abdul Kalam, Former President of India",
    storyParagraphs: [
      "The idea of The Rameshwaram Cafe was born out of a deep reverence for Indian culture and a vision ignited by the inspiring philosophy of Dr. A.P.J. Abdul Kalam. His words taught us that authentic national pride begins with celebrating our roots.",
      "The name “Rameshwaram” was chosen as a heartfelt tribute to Dr. Kalam’s sacred birthplace in Tamil Nadu. It reflects our unshakeable desire to root the brand in integrity, pristine vegetarian culinary values, and warm hospitality that welcomes every citizen with open arms.",
      "In 2021, this dream took tangible form in Bengaluru. Today, each outlet stands as an energetic temple of taste where students, tech founders, families, and travelers gather side by side at our standing counters.",
    ],
  },
  values: {
    eyebrow: "SERVING YESTERDAY, TODAY & TOMORROW",
    headline: "Our Four Guiding Values",
    subheadline:
      "From dawn to midnight, serving authentic flavours with a heart that never clocks out.",
    items: [
      {
        id: "extended-hours",
        title: "Extended Operating Hours",
        tag: "24/7 Haven",
        description:
          "Operating round the clock through synchronized team rotations has endeared our café to patrons, offering a warm late-night sanctuary for crisp dosas and frothy filter coffee.",
      },
      {
        id: "guest-centric",
        title: "Guest-Centric Culture",
        tag: "Atithi Devo Bhava",
        description:
          "Our café is our temple, our customers are gods. Every team member serves with folded hands and heartfelt warmth, actively engaging with guest feedback to perfect every plate.",
      },
      {
        id: "authenticity",
        title: "100% Organic Authenticity",
        tag: "Word of Mouth",
        description:
          "Our meteoric acclaim is entirely organic — driven by the genuine love, aroma, and viral enthusiasm of satisfied patrons rather than paid influencer marketing campaigns.",
      },
      {
        id: "freshness",
        title: "Zero Chillers Freshness",
        tag: "Made Every 2 Hours",
        description:
          "Refrigeration and deep freezers are eliminated entirely. Stone-ground batters, coconut chutneys, and sambhar are brewed fresh in small batches continuously throughout the day.",
      },
    ],
  },
  sustainability: {
    eyebrow: "SUSTAINABILITY PLEDGE",
    headline: "Fresh. Local. Legendary.",
    tagline: "Green Inside, Ghee Outside.",
    description:
      "At The Rameshwaram Cafe, sustainability isn’t just a buzzword — it’s our sacred way of life. From sourcing Karnataka’s finest farm produce to eliminating food preservatives and using natural building stones, every choice reflects mindful stewardship.",
    pillars: [
      {
        title: "KMF Nandini Pure Cow Ghee",
        tag: "Dairy Partner",
        description:
          "Karnataka Cooperative Milk Producers’ Federation (KMF) is our exclusive dairy partner, guaranteeing authentic, unadulterated cow ghee and fresh milk for every coffee and dosa.",
      },
      {
        title: "Natural Granite & Stone Craft",
        tag: "Eco Architecture",
        description:
          "Our cafés utilize natural regional stone and granite. Naturally cooling, VOC-free, highly durable, and requiring minimal carbon embodied energy.",
      },
      {
        title: "Upcycled Hardwood Furniture",
        tag: "Mindful Living",
        description:
          "Standing counters and wooden details are upcycled from reclaimed teak and seasoned woods, preserving heritage aesthetics while eliminating waste.",
      },
      {
        title: "Energy Efficient Lighting",
        tag: "Low Carbon Footprint",
        description:
          "100% warm-spectrum low-energy LED fixtures cut power consumption by over 60%, casting an inviting golden ambient glow across the adda.",
      },
    ],
  },
  timeline: [
    {
      year: "2021",
      title: "The Genesis in Bengaluru",
      location: "JP Nagar 2nd Phase & Indiranagar",
      description:
        "The first doors opened, pioneering the high-speed standing adda concept with overflowing ghee and stone-ground podi idlis.",
    },
    {
      year: "2022",
      title: "Expanding the Adda",
      location: "Rajajinagar & Western Hub",
      description:
        "Patrons queued in hundreds daily as our ghee roast dosas became a citywide cultural phenomenon.",
    },
    {
      year: "2023",
      title: "Interstate Milestone",
      location: "Madhapur, Hyderabad",
      description:
        "Launched our sprawling multi-counter outlet in Telangana’s tech corridor, serving 15,000+ guests every single day.",
    },
    {
      year: "2024",
      title: "Silicon Plateau Footprint",
      location: "Whitefield & Outer Ring Road",
      description:
        "Bringing the comforting sizzle of ghee and freshly aerated filter coffee to Bengaluru’s global IT corridors.",
    },
    {
      year: "2025",
      title: "Global Gateway Launch",
      location: "Bangalore International Airport T1 & 100ft Road",
      description:
        "Opened at Gate 34, Terminal 1, greeting worldwide travelers with piping-hot South Indian prasadam before departure.",
    },
    {
      year: "2026",
      title: "New Horizons & Regional Pride",
      location: "Jamakhandi Flagship, Pune, Mumbai & Dubai",
      description:
        "Taking Karnataka’s legendary breakfast heritage to premier national cities and global shores.",
    },
  ],
};

/* ==========================================================================
   MENU PAGE CONTENT — RAMESHWARAM CAFE REPERTOIRE
   ========================================================================== */
export const fullMenuCategories = [
  "All",
  "Stars of the Morning Show",
  "Bite-Sized Blockbusters",
  "Grand Finale & Comfort Classics",
  "Liquid Gold & Chais",
];

export const fullMenuItems = [
  {
    id: 101,
    title: "Ghee Pudi Masala Dosa",
    category: "Stars of the Morning Show",
    description:
      "Crisp, paper-thin golden fermented crepe roasted in generous ladles of pure Nandini cow ghee, generously sprinkled with fiery spiced gunpowder podi and filled with spiced potato palya. Served with signature coconut & tomato chutneys.",
    price: "₹160",
    tag: "Crowd Bestseller",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Pure Ghee", "Signature", "Fiery Podi", "Crisp"],
    image: "/images/food-dosa.jpg",
  },
  {
    id: 102,
    title: "Butter Thatte Idli with Gunpowder",
    category: "Stars of the Morning Show",
    description:
      "Plate-sized steaming thatte idli, featherlight and cloud-soft, crowned with a dollop of churned butter and drenched in warm spiced lentil podi with hot aromatic sambhar.",
    price: "₹95",
    tag: "Morning Star",
    spiceLevel: 1,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Steaming Soft", "Thatte Size", "Melt in Mouth"],
    image: "/images/food-idli.jpg",
  },
  {
    id: 103,
    title: "Open Butter Masala Dosa",
    category: "Stars of the Morning Show",
    description:
      "Thick, spongy golden-brown dosa roasted open-faced with creamy dollops of white butter, topped with vibrant red chutney, podi dust, and tender spiced potato mash.",
    price: "₹170",
    tag: "Chef's Special",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Open Faced", "Rich Butter", "Karnataka Pride"],
    image: "/images/food-dosa.jpg",
  },
  {
    id: 104,
    title: "Steaming Button Ghee Podi Idlis (14 Pcs)",
    category: "Stars of the Morning Show",
    description:
      "Fourteen bite-sized button idlis tossed live on a smoking pan with golden Nandini ghee, fragrant curry leaves, roasted mustard, and Rameshwaram special milagai podi.",
    price: "₹135",
    tag: "Patron Obsession",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Button Idlis", "Golden Ghee", "Addictive"],
    image: "/images/food-idli.jpg",
  },
  {
    id: 105,
    title: "Ghee Khali Dosa (Set of 2)",
    category: "Stars of the Morning Show",
    description:
      "Double cloud-soft spongy dosas roasted delicately with pure ghee. Featherlight, porous, and designed to soak up copious amounts of coconut chutney and vegetable kurma.",
    price: "₹140",
    tag: "Homestyle Comfort",
    spiceLevel: 1,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Cloud Soft", "Set Dosa", "Comfort Classic"],
    image: "/images/food-dosa.jpg",
  },
  {
    id: 106,
    title: "Crisp Ghee Onion Masala Dosa",
    category: "Stars of the Morning Show",
    description:
      "Golden crispy fermented crepe crusted with finely diced caramelized shallots, fresh green chilies, and coriander, folded over spiced potato filling.",
    price: "₹165",
    tag: "Caramelized Crunch",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Shallot Crunch", "Golden Crisp", "Pure Ghee"],
    image: "/images/food-dosa.jpg",
  },
  {
    id: 107,
    title: "Crispy Medu Vada (2 Pcs) with Hot Sambhar",
    category: "Bite-Sized Blockbusters",
    description:
      "Golden-brown, donut-shaped crisp urad dal fritters seasoned with cracked black peppercorns, crushed cumin, and ginger. Served with hot lentil drumstick sambhar.",
    price: "₹90",
    tag: "Golden Crunch",
    spiceLevel: 1,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Fresh Fried", "Cracked Pepper", "Piping Hot"],
    image: "/images/food-vada.jpg",
  },
  {
    id: 108,
    title: "Crunchy Karnataka Ambode (3 Pcs)",
    category: "Bite-Sized Blockbusters",
    description:
      "Traditional coarse-ground chana dal patties infused with fresh dill leaves (sabbakki soppu), green chilies, and shallots, fried to an irresistible rustic crunch.",
    price: "₹95",
    tag: "Festival Classic",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Dill Leaves", "Rustic Crunch", "Tea Time"],
    image: "/images/food-vada.jpg",
  },
  {
    id: 109,
    title: "Spicy Karnataka Mirchi Bhajji",
    category: "Bite-Sized Blockbusters",
    description:
      "Large mild Bhavnagri chilies slit, stuffed with ajwain spiced gram flour, dip-fried in batter, and sliced open with raw onions, roasted peanuts, and lemon squeeze.",
    price: "₹100",
    tag: "Street Legend",
    spiceLevel: 3,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Fiery Kick", "Crisp Batter", "Local Favorite"],
    image: "/images/food-vada.jpg",
  },
  {
    id: 110,
    title: "Mysore Aloo Bonda (2 Pcs)",
    category: "Bite-Sized Blockbusters",
    description:
      "Golden turmeric-infused chickpea batter globes enveloping a piping hot core of mustard-tempered mashed potatoes, curry leaves, and green chili.",
    price: "₹85",
    tag: "Afternoon Snack",
    spiceLevel: 1,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Savory", "Mustard Tempering", "Soft Core"],
    image: "/images/food-vada.jpg",
  },
  {
    id: 111,
    title: "Spicy Khara Bath (Chow Chow Bath Part 1)",
    category: "Grand Finale & Comfort Classics",
    description:
      "Coarse semolina roasted in pure ghee and slow-cooked with garden vegetables, fresh ginger, mustard seeds, and heirloom vangi masala spice blend.",
    price: "₹85",
    tag: "Breakfast Staple",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Semolina Upma", "Pure Ghee", "Spiced Veggies"],
    image: "/images/food-kesaribath.jpg",
  },
  {
    id: 112,
    title: "Royal Karnataka Kesari Bath (Chow Chow Bath Part 2)",
    category: "Grand Finale & Comfort Classics",
    description:
      "Silken saffron-infused semolina halwa glistening with pure Nandini cow ghee, generously loaded with golden roasted cashew nuts, plump raisins, and green cardamom.",
    price: "₹90",
    tag: "Sweet Perfection",
    spiceLevel: 0,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Kashmiri Saffron", "Cashews & Raisins", "Sweet Heaven"],
    image: "/images/food-kesaribath.jpg",
  },
  {
    id: 113,
    title: "Traditional Bisi Bele Bath",
    category: "Grand Finale & Comfort Classics",
    description:
      "Wholesome rice, toor dal, and seasonal vegetables simmered together in an elaborate 30-spice blend, garnished with ghee-fried cashews and crunchy boondi.",
    price: "₹130",
    tag: "Royal Karnataka",
    spiceLevel: 2,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["30 Spices", "Comfort Bowl", "Ghee Fried Cashews"],
    image: "/images/food-kesaribath.jpg",
  },
  {
    id: 114,
    title: "Temple-Style Curd Rice & Puliyogare Duo",
    category: "Grand Finale & Comfort Classics",
    description:
      "A harmonious pairing of tangy tamarind rice spiced with roasted peanuts, paired with cooling creamy curd rice tempered with mustard, ginger, and pomegranate pearls.",
    price: "₹120",
    tag: "Prasadam Soul",
    spiceLevel: 1,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Tangy & Cool", "Temple Prasadam", "Digestive"],
    image: "/images/food-kesaribath.jpg",
  },
  {
    id: 115,
    title: "Melt-in-Mouth Shahi Gulab Jamun (2 Pcs)",
    category: "Grand Finale & Comfort Classics",
    description:
      "Fresh khoya spheres fried slow and deep, resting in hot green cardamom sugar elixir, topped with slivered almonds and fragrant saffron strands.",
    price: "₹90",
    tag: "Sweet Finale",
    spiceLevel: 0,
    dietary: "Pure Veg",
    gheeSpecial: true,
    tags: ["Hot & Sweet", "Khoya Delight", "Rich Syrup"],
    image: "/images/food-kesaribath.jpg",
  },
  {
    id: 116,
    title: "Signature Degree Filter Coffee",
    category: "Liquid Gold & Chais",
    description:
      "Piping hot decoction brewed from high-elevation Chikmagalur Arabica and Robusta peaberry beans, blended with frothy boiled whole milk, served in a traditional South Indian brass dabara tumbler.",
    price: "₹55",
    tag: "Liquid Gold",
    spiceLevel: 0,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Brass Tumbler", "Frothy Head", "Chikmagalur Roast"],
    image: "/images/food-filtercoffee.jpg",
  },
  {
    id: 117,
    title: "Kullad Masala Chai",
    category: "Liquid Gold & Chais",
    description:
      "Strong mountain ginger and crushed green cardamom slow-simmered in whole milk with Assam CTC tea leaves, poured steaming into an unglazed rustic clay kullad.",
    price: "₹60",
    tag: "Clay Cup Soul",
    spiceLevel: 0,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Earthen Kullad", "Mountain Ginger", "Kadak"],
    image: "/images/food-masalachai.jpg",
  },
  {
    id: 118,
    title: "Royal Kesar Badam Milk",
    category: "Liquid Gold & Chais",
    description:
      "Piping hot rich milk slow-simmered with crushed almond paste, whole Kashmiri saffron threads, and green cardamom, topped with pistachio flakes.",
    price: "₹110",
    tag: "Royal Elixir",
    spiceLevel: 0,
    dietary: "Pure Veg",
    gheeSpecial: false,
    tags: ["Kashmiri Saffron", "Rich Almonds", "Nourishing"],
    image: "/images/food-filtercoffee.jpg",
  },
];

export const chefPairings = [
  {
    id: "chow-chow",
    title: "The Iconic Chow Chow Bath",
    subtitle: "Spicy Khara Bath + Golden Kesari Bath",
    description:
      "Karnataka's legendary sweet and spicy combination. One spoonful of aromatic fiery upma followed immediately by velvety saffron halwa.",
    saving: "Special Combo ₹165",
    tag: "Karnataka Soul",
  },
  {
    id: "ghee-roast-ritual",
    title: "The Ultimate Adda Ritual",
    subtitle: "Ghee Pudi Masala Dosa + Degree Filter Coffee",
    description:
      "Crisp buttery dosa filled with spiced potato palya and gunpowder podi, washed down with a frothy brass dabara filter coffee.",
    saving: "Special Combo ₹205",
    tag: "All-Day Bestseller",
  },
  {
    id: "morning-power",
    title: "The Morning Power Breakfast",
    subtitle: "Butter Thatte Idli + Crisp Medu Vada",
    description:
      "Steaming soft plate idli soaked in hot sambhar and butter paired with a crunchy, peppery golden medu vada.",
    saving: "Special Combo ₹175",
    tag: "Dawn Champion",
  },
];

/* ==========================================================================
   CONTACT PAGE CONTENT — THE RAMESHWARAM CAFE OUTLETS & INQUIRIES
   ========================================================================== */
export const contactPageContent = {
  hero: {
    eyebrow: "GOT QUESTIONS? WE'VE GOT CHUTNEY",
    headline: "We’d Love to Hear From You",
    subheadline:
      "Reach out to us for feedback, franchise opportunities, event catering, or simply to share your love for dosas.",
    description:
      "From dawn risers craving that first sip of filter coffee to late-night dosa lovers, our doors and lines are always open. Connect with our guest concierge or locate your nearest adda below.",
  },
  pillars: [
    {
      id: "general",
      title: "General Enquiries",
      tag: "Guest Concierge",
      description: "Have a question about our menu, timings, or your recent dining experience?",
      contact: "hello@therameshwaramcafe.org",
      phone: "+91 80 4567 8900",
      cta: "Email Us",
    },
    {
      id: "franchise",
      title: "Franchise & Expansion",
      tag: "Partner With Us",
      description: "Explore culinary partnerships to bring the Rameshwaram magic to new cities.",
      contact: "franchise@therameshwaramcafe.org",
      phone: "+91 99000 12345",
      cta: "Partner Inquiry",
    },
    {
      id: "catering",
      title: "Catering & Bulk Orders",
      tag: "Weddings & Corporate",
      description: "Book our live tawa & filter coffee counters for auspicious gatherings and events.",
      contact: "catering@therameshwaramcafe.org",
      phone: "+91 98800 54321",
      cta: "Book Catering",
    },
  ],
  promise:
    "Our team will get back to you within 48 hours, faster than your dosa arrives at our café, Coz' there's always 'The Rush', right?",
  outlets: [
    {
      id: "jamakhandi",
      name: "Chaat and Chill, Jamakhandi",
      address:
        "Navanagar Main Road, Near KSRTC Bus Stand, Jamakhandi, Karnataka 587301",
      phone: "+91 8353 220123",
      hours: "10:00 AM – 10:30 PM (Open Everyday)",
      timingTag: "Northern Karnataka Hub",
      mapLink: "https://maps.google.com/?q=Jamakhandi",
      isOpen: true,
      city: "Jamakhandi",
      features: "Artisanal Chaats • Live Tawas • Modern Café Seating • Fresh Morning Chutneys",
    },
    {
      id: "rabakavi",
      name: "The Shreeshailam Cafe, Rabakavi",
      address: "Main Market Road, Rabakavi Banhatti, Karnataka 587311",
      phone: "+91 8351 230456",
      hours: "11:00 AM – 11:00 PM (Open Everyday)",
      timingTag: "Heritage Town Adda",
      mapLink: "https://maps.google.com/?q=Rabakavi",
      isOpen: true,
      city: "Rabakavi",
      features: "Authentic South Indian • Brass Filter Coffee • Live Dosa Counter",
    },
  ],
  mediaBuzz: {
    eyebrow: "MEDIA & TELEVISION SPOTLIGHT",
    headline: "Because Words Aren’t Always Enough",
    lead:
      "Sometimes, you just need to witness the golden sizzle of pure ghee on a red-hot tawa or the frothy waterfall of filter coffee. See how India’s premier food storytellers describe the Rameshwaram phenomenon.",
    coverage: [
      {
        source: "Curly Tales • Kamiya Jani",
        title: "How Rameshwaram Cafe Built a 60 Crore Dosa Empire!",
        subtitle: "Stories From Bharat Episode 44",
        highlight: "“The uncompromised quality of Nandini ghee and the sheer lightning speed of service is unlike anything else in India.”",
        views: "4.8M+ Views",
      },
      {
        source: "HISTORY TV18 • Rocky & Mayur",
        title: "The #1 Breakfast Spot in South India",
        subtitle: "Road Trippin' with Rocky & Mayur Season 10",
        highlight: "“Crispy, loaded with podi, dripping in pure golden ghee. This is breakfast royalty.”",
        views: "2.5M+ Views",
      },
      {
        source: "This Week India",
        title: "A Culinary Tribute to Dr. A.P.J. Abdul Kalam",
        subtitle: "National Business & Culinary Special",
        highlight: "“From humble beginnings in Bengaluru to a national benchmark for pure vegetarian speed and hospitality.”",
        views: "1.2M+ Views",
      },
    ],
  },
  faqs: [
    {
      question: "Do you accept advance table reservations?",
      answer:
        "The Rameshwaram Cafe operates predominantly on an authentic high-velocity quick-service standing format — true to Bengaluru’s darshini heritage! Guests walk in, place their order at the token counter, and enjoy hot food within minutes. For private catering and massive family celebrations, advance bookings can be arranged.",
    },
    {
      question: "Is all your food 100% pure vegetarian and made with pure cow ghee?",
      answer:
        "Yes, absolutely. We maintain an uncompromising 100% pure vegetarian kitchen with zero egg, animal fat, or artificial colorants. Every ghee roast dosa, thatte idli, and kesari bath is prepared exclusively with KMF Nandini pure cow ghee.",
    },
    {
      question: "What are your standard opening and closing hours?",
      answer:
        "Most of our city addas (Indiranagar, JP Nagar, Madhapur, Jamakhandi) open early at 6:00 AM to greet morning joggers and commuters, and remain open until 1:00 AM past midnight! Our Bengaluru International Airport Terminal 1 outlet is open 24 hours a day, 7 days a week.",
    },
    {
      question: "Do you cater for weddings, corporate breakfasts, and festivals?",
      answer:
        "Yes! Our mobile live catering team brings live tawas, steaming thatte idli steamers, and brass filter coffee stations directly to your venue across Karnataka, Telangana, and Maharashtra. Submit an inquiry through the form above or call our catering team.",
    },
    {
      question: "Why do you not use refrigerators or cold storage?",
      answer:
        "In accordance with our founder's core principle of zero compromise, food should be made and consumed fresh. Our batters are stone-ground small-batch throughout the day, and all chutneys and sambhars are brewed every two hours. Zero chillers means maximum taste, nutrition, and soulful digestion.",
    },
    {
      question: "Can I order takeaway or parcel for my family?",
      answer:
        "Yes! Every outlet has an express takeaway counter where dosas and idlis are packed in food-grade thermal containers and banana leaves to retain heat and crispness during travel.",
    },
  ],
};

