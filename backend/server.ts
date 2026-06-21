import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model";
import { Order } from "./models/order.model";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const DB_FILE = path.join(process.cwd(), "database.json");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anvaa";
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
    seedMongoVIPUser();
  })
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

async function seedMongoVIPUser() {
  try {
    const vipEmail = "codewithvibe64@gmail.com";
    const existing = await User.findOne({ email: vipEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("vip123", salt);
      const vipUser = new User({
        email: vipEmail,
        password: hashedPassword,
        name: "VASANTIKA SEN",
        phone: "+91 98765 43210",
        role: "customer",
        wishlist: [],
        savedAddresses: [
          {
            name: "Vasantika Sen",
            street: "Flat 402, Royal Residency, Juhu Tara Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400049",
            phone: "+91 98765 43210"
          }
        ]
      });
      await vipUser.save();
      console.log("VIP User seeded successfully in MongoDB Atlas.");
    } else {
      // Force reset role and empty wishlist in the DB for clean verification
      existing.role = "customer";
      existing.wishlist = [];
      await existing.save();
      console.log("VIP User wishlist and role reset in MongoDB Atlas.");
    }
  } catch (err) {
    console.error("Error seeding VIP User in MongoDB:", err);
  }
}

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
      }
    }
  }
  return aiClient;
}

// Ensure database.json exists and is seeded with gorgeous luxury items
function initializeDatabase() {
  // Always execute seeding to ensure newest mock data, beautiful past order history, and elegant wedding presets are up to date

  // Beautiful luxury Indian fashion designers
  const designers = [
    {
      id: "aditi_deshmukh",
      name: "Aditi Deshmukh",
      city: "Mumbai",
      specialty: "Royal Banarasi & Bridal Couture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
      bio: "Aditi Deshmukh celebrates the pristine beauty of Banarasi weave. Based in Mumbai, she is a revivalist of handloom heritages, transforming ancient Indian artistry into highly contemporary, dramatic bridal and wedding silhouettes with gold zardozi.",
      achievements: [
        "Vogue India Designer of the Year (Heritage Revival) 2024",
        "Showcased at India Couture Week 2025",
        "Costume Designer for National Award-winning Period Film",
        "Empaneled with the Craft Council of India Artisans Guild"
      ],
      history: [
        { year: "2018", event: "Launched flagship luxury atelier in Colaba, Mumbai." },
        { year: "2020", event: "Designed the acclaimed 'Benares Royals' bridal line featured in Harper's Bazaar." },
        { year: "2022", event: "Established India's first silk weaver-collaborative fair-trade initiative." },
        { year: "2025", event: "Selected to present the cultural opening showcase at Mumbai Fashion Week." }
      ],
      rating: 4.9,
      reviewsCount: 142,
      consultationFee: 4500
    },
    {
      id: "meera_khanna",
      name: "Meera Khanna",
      city: "New Delhi",
      specialty: "Minimal Luxury & Structural Office Wear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=800",
      bio: "Meera Khanna defines modern structure for the dynamic young professional woman. From her studio in New Delhi, her focus is pristine tailoring, sculptural linen, fine crepes, and elegant workwear and sharp drapes with smart custom adjustments.",
      achievements: [
        "Elle India 'Power dressing' Design Award 2023",
        "Designed the 'Nouveau Boardroom' series for Global Leaders Summit",
        "Pioneer of ultra-high-thread-count anti-crease linen blend patent"
      ],
      history: [
        { year: "2019", event: "Graduated with top honors from NIFT Delhi and launched 'KHANNA' minimal line." },
        { year: "2021", event: "Launched structural power blazer dresses that went viral among India's tech co-founders." },
        { year: "2024", event: "Collaborated with standard business icons for sustainable workwear lines." }
      ],
      rating: 4.8,
      reviewsCount: 96,
      consultationFee: 3500
    },
    {
      id: "pooja_nair",
      name: "Pooja Nair",
      city: "Bengaluru",
      specialty: "Sustainable Resort & Premium Casuals",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800",
      bio: "Pooja Nair blends southern Indian weaves with fluid, elegant casual geometry. Her Bengaluru atelier works exclusively with local weavers, organic colors, and relaxed silks, catering to young Indian women who seek effortless, elevated elegance everyday.",
      achievements: [
        "National Green Fashion Catalyst Award 2024",
        "Featured globally in Eco-Fashion London showcase",
        "Collaborated on signature hand-block patterns with Mysore organic mills"
      ],
      history: [
        { year: "2017", event: "Started with a boutique capsule in Indiranagar, Bengaluru." },
        { year: "2021", event: "Introduced the 'Elysiana' hand-loomed luxury kaftan series." },
        { year: "2023", event: "Awarded top eco-impact luxury status by India Clean-Fashion consortium." }
      ],
      rating: 4.7,
      reviewsCount: 110,
      consultationFee: 3000
    }
  ];

  // Beautiful high-end Indian luxury fashion products
  const products = [
    // Wedding Collection
    {
      id: "prod_wedding_01",
      name: "The Gilded Marigold Lehenga",
      price: 185000,
      category: "Wedding Collection",
      description: "A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders. Comes with a pure silk organza dupatta in royal marigold. Inspired by ancient heritage patterns.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL", "Custom Measure"],
      stock: 4,
      rating: 4.9,
      isTrending: true
    },
    {
      id: "prod_wedding_02",
      name: "Rose Quartz Zardozi Anarkali",
      price: 125000,
      category: "Wedding Collection",
      description: "Crafted in ultra-premium raw silk, this heavy flared Anarkali features stunning rose gold hand-embroidery along the chest, cuffs, and floor-sweeping hem. Imbued with Indian craftsmanship.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "XL", "Custom Measure"],
      stock: 6,
      rating: 4.8
    },

    // Office Wear
    {
      id: "prod_office_01",
      name: "The Ivory Power Crepe Blazer Suit",
      price: 42000,
      category: "Office Wear",
      description: "A tailored double-breasted power blazer paired with matching straight-leg trousers, styled for ambitious women. Crafted with Italian luxury crepe, structured shoulder pads, and discreet luxury gold buttons. Full satin lining.",
      designerId: "meera_khanna",
      designerName: "Meera Khanna",
      images: [
        "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 12,
      rating: 4.7,
      isTrending: true
    },
    {
      id: "prod_office_02",
      name: "Midnight Structural Linen Jumpsuit",
      price: 28500,
      category: "Office Wear",
      description: "A sharp, breathable, high-thread-count linen jumpsuit with sharp collars, structured waist belt, and deep pleats. Handcrafted to deliver effortless transition from high-stakes board meetings to premium dining.",
      designerId: "meera_khanna",
      designerName: "Meera Khanna",
      images: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"
      ],
      sizes: ["S", "M", "L"],
      stock: 15,
      rating: 4.6
    },

    // Casual Wear
    {
      id: "prod_casual_01",
      name: "The Monsoon Breeze Silk Kaftan",
      price: 24000,
      category: "Casual Wear",
      description: "A floating casual masterpiece created from pure hand-blocked mulberry silk, showcasing organic hand-drawn Indian motifs, and subtle gold thread stitching along the dynamic high-low hemline. Comfortable yet luxurious.",
      designerId: "pooja_nair",
      designerName: "Pooja Nair",
      images: [
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600"
      ],
      sizes: ["XS/S", "M/L", "XL", "Free Size"],
      stock: 18,
      rating: 4.8,
      isTrending: true
    },
    {
      id: "prod_casual_02",
      name: "Champagne Organic Cotton Midi",
      price: 18500,
      category: "Casual Wear",
      description: "Woven in high-quality organic cotton with a soft champagne tint, this flared daily dress features structured gathers, delicate back ribbon closures, and internal pockets. Simple, luxurious, everyday dressing.",
      designerId: "pooja_nair",
      designerName: "Pooja Nair",
      images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      rating: 4.5
    },

    // Designer Collections
    {
      id: "prod_designer_01",
      name: "The Crimson Empress Cape Gown",
      price: 160000,
      category: "Designer Collections",
      description: "Designed in collaboration with Aditi Deshmukh, this masterpiece is a modern floor-length hand-loomed silk gown draped with an over-the-shoulder Crimson Silk organza cape entirely hand-embroidered with classic motif beads.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "Custom Measure"],
      stock: 3,
      rating: 5.0,
      isTrending: true
    },

    // Premium Limited Editions
    {
      id: "prod_limited_01",
      name: "Banarasi Gold Thread Heirloom Saree",
      price: 245000,
      category: "Premium Limited Editions",
      description: "An authentic, serial-numbered legacy saree hand-loomed over 3 months using genuine silver-plated zari threads dipped in premium 24k gold. Highly exclusive collectors item. Number 07 of 15 produced.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600"
      ],
      sizes: ["One Size (Saree) + Custom Blouse"],
      stock: 2,
      rating: 5.0,
      isTrending: true
    }
  ];

  const defaultUsers = [
    {
      id: "user_01",
      email: "codewithvibe64@gmail.com",
      name: "Vasantika Sen",
      role: "customer",
      phone: "+91 98765 43210",
      savedAddresses: [
        {
          id: "addr_01",
          name: "Vasantika Sen",
          street: "Flat 402, Royal Residency, Juhu Tara Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400049",
          phone: "+91 98765 43210"
        }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const defaultOrders = [
    {
      id: "ANVAA-827419",
      userId: "user_01",
      items: [
        {
          product: {
            id: "prod_wedding_01",
            name: "The Gilded Marigold Lehenga",
            price: 185000,
            category: "Wedding Collection",
            description: "A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders. Comes with a pure silk organza dupatta in royal marigold.",
            designerId: "aditi_deshmukh",
            designerName: "Aditi Deshmukh",
            images: [
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"
            ],
            sizes: ["XS", "S", "M", "L", "XL", "Custom Measure"],
            stock: 4,
            rating: 4.9,
            isTrending: true
          },
          quantity: 1,
          selectedSize: "Custom Measure"
        }
      ],
      subtotal: 185000,
      discount: 18500,
      shipping: 0,
      total: 166500,
      address: {
        id: "addr_01",
        name: "Vasantika Sen",
        street: "Flat 402, Royal Residency, Juhu Tara Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400049",
        phone: "+91 98765 43210"
      },
      paymentMethod: "UPI Block Secure",
      status: "Delivered",
      createdAt: "2026-02-14T11:20:00.000Z",
      trackingTimeline: [
        { status: "Order Placed", date: "14/02/2026, 11:20:00 AM", description: "Your premium order has been recorded at the central salon.", done: true },
        { status: "In Crafting", date: "16/02/2026, 2:15:00 PM", description: "Artisans commencing precise weaving and drape alignment.", done: true },
        { status: "Quality Check", date: "22/02/2026, 4:40:00 PM", description: "Micro inspect for fit and gold thread perfection.", done: true },
        { status: "Dispatched", date: "24/02/2026, 10:00:00 AM", description: "Placed in luxury premium boxes with custom notes.", done: true },
        { status: "Delivered", date: "27/02/2026, 3:30:00 PM", description: "Pristine physical handover complete.", done: true }
      ]
    },
    {
      id: "ANVAA-195821",
      userId: "user_01",
      items: [
        {
          product: {
            id: "prod_office_01",
            name: "The Ivory Power Crepe Blazer Suit",
            price: 42000,
            category: "Office Wear",
            description: "A tailored double-breasted power blazer paired with matching straight-leg trousers, styled for ambitious women. Crafted with Italian luxury crepe, structured shoulder pads, and gold accents.",
            designerId: "meera_khanna",
            designerName: "Meera Khanna",
            images: [
              "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600"
            ],
            sizes: ["XS", "S", "M", "L", "XL"],
            stock: 12,
            rating: 4.7,
            isTrending: true
          },
          quantity: 1,
          selectedSize: "S"
        }
      ],
      subtotal: 42000,
      discount: 4200,
      shipping: 0,
      total: 37800,
      address: {
        id: "addr_01",
        name: "Vasantika Sen",
        street: "Flat 402, Royal Residency, Juhu Tara Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400049",
        phone: "+91 98765 43210"
      },
      paymentMethod: "Credit Card Elite",
      status: "Delivered",
      createdAt: "2026-04-05T09:12:00.000Z",
      trackingTimeline: [
        { status: "Order Placed", date: "05/04/2026, 09:12:00 AM", description: "Your premium order has been recorded at the central salon.", done: true },
        { status: "In Crafting", date: "06/04/2026, 11:30:00 AM", description: "Artisans commencing precise weaving and drape alignment.", done: true },
        { status: "Quality Check", date: "08/04/2026, 4:10:00 PM", description: "Micro inspect for fit and gold thread perfection.", done: true },
        { status: "Dispatched", date: "09/04/2026, 02:00:00 PM", description: "Placed in luxury premium boxes with custom notes.", done: true },
        { status: "Delivered", date: "11/04/2026, 1:15:00 PM", description: "Pristine physical handover complete.", done: true }
      ]
    }
  ];
  const defaultChats = [
    {
      id: "chat_thread_aditi",
      customerId: "user_01",
      customerName: "Vasantika Sen",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      messages: [
        {
          id: "msg_init_1",
          sender: "designer",
          content: "Welcome to ANVAA, Vasantika. I am Aditi. I look forward to telling premium stories through your attire. How can I guide you today? Would you like a wedding design consultation or custom sizing advice?",
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    }
  ];
  
  const defaultConsultations = [];

  const initialDB = {
    users: defaultUsers,
    designers: designers,
    products: products,
    orders: defaultOrders,
    chats: defaultChats,
    consultations: defaultConsultations,
    reviews: [
      {
        id: "rev_1",
        productId: "prod_wedding_01",
        userName: "Preeti Sharma",
        rating: 5,
        comment: "An absolute masterpiece! Wore this for my sangeet and received hundreds of compliments. The gold thread is gorgeous.",
        date: "2026-05-12"
      }
    ],
    wishlist: []
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf-8");
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

initializeDatabase();

// Load local database helper
function getDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database", err);
    return null;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database", err);
  }
}

// REST end-points
app.get("/api/products", (req, res) => {
  const db = getDB();
  res.json(db ? db.products : []);
});

app.get("/api/products/:id", (req, res) => {
  const db = getDB();
  const product = db ? db.products.find((p: any) => p.id === req.params.id) : null;
  if (product) {
    // Attach reviews
    const reviews = db.reviews ? db.reviews.filter((r: any) => r.productId === product.id) : [];
    res.json({ ...product, reviews });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});



app.get("/api/designers", (req, res) => {
  const db = getDB();
  res.json(db ? db.designers : []);
});



// POST Review
app.post("/api/products/:id/review", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database error" });

  const { rating, comment, userName } = req.body;
  const newReview = {
    id: "rev_" + Date.now(),
    productId: req.params.id,
    userName: userName || "Anonymous Guest",
    rating: Number(rating) || 5,
    comment: comment || "",
    date: new Date().toISOString().substring(0, 10)
  };

  db.reviews.push(newReview);

  // Recount average product rating
  const pReviews = db.reviews.filter((r: any) => r.productId === req.params.id);
  const avg = pReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / pReviews.length;
  const prodIndex = db.products.findIndex((p: any) => p.id === req.params.id);
  if (prodIndex !== -1) {
    db.products[prodIndex].rating = parseFloat(avg.toFixed(1));
  }

  saveDB(db);
  res.json({ success: true, reviews: pReviews, rating: db.products[prodIndex]?.rating });
});

// Chats
app.get("/api/chats/:customerId", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const custId = req.params.customerId;
  const userChats = db.chats.filter((c: any) => c.customerId === custId);
  res.json(userChats);
});

// Send Chat message and use Gemini for AI automated Stylist replies!
app.post("/api/chats/message", async (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { customerId, customerName, designerId, designerName, content, sender } = req.body;
  
  let thread = db.chats.find((c: any) => c.customerId === customerId && c.designerId === designerId);

  if (!thread) {
    thread = {
      id: `chat_${customerId}_${designerId}`,
      customerId,
      customerName,
      designerId,
      designerName,
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    db.chats.push(thread);
  }

  const userMessage = {
    id: "msg_" + Date.now(),
    sender: sender || "customer",
    content: content,
    timestamp: new Date().toISOString()
  };

  thread.messages.push(userMessage);
  thread.lastUpdated = new Date().toISOString();
  saveDB(db);

  // Auto response logic using Gemini API or dynamic elegant responses
  const gemini = getGeminiClient();
  const designerObj = db.designers.find((d: any) => d.id === designerId);
  const designerBio = designerObj ? designerObj.bio : `${designerName} is an elite premium haute couture designer at ANVAA.`;
  const designerStyle = designerObj ? designerObj.specialty : "Luxury Premium Attire";

  if (sender === "customer") {
    let responseText = "";

    if (gemini) {
      try {
        const systemPrompt = `
You are the elite fashion designer "${designerName}" at the luxury women-fashion e-commerce brand "ANVAA".
Your bio: ${designerBio}.
Your structural expertise: ${designerStyle}.
You are interacting with a highly valued customer named "${customerName}" who is exploring your custom-fit designer collections.
Respond elegantly in a super-premium, supportive, professional, warm and respectful tone. Inject Indian fashion heritage terminology when appropriate (like silhouettes, drapes, zardozi embroidery, weaves, custom curation).
Ensure the reply feels personal, premium, inspirational, and modern Gen Z compatible.
Keep the reply brief (around 2-4 sentences max), guiding them to either checkout their premium collections, make a customized fit consultation request, or answer their specific fit issue.
No markdown or emojis that feel cheap. Use only premium typography phrasing.
`;

        const responseObj = await gemini.models.generateContent({
          model: "gemini-3.5-flash",
          contents: content,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        responseText = responseObj.text || "";
      } catch (gemError) {
        console.error("Gemini stylist generation failed:", gemError);
      }
    }

    // Default high-fashion fallback response if Gemini is not initialized
    if (!responseText) {
      const fallbacks = [
        `Dear ${customerName}, I adore your taste! The texture of our custom weaves has been refined specifically to match such elegant standards. Shall we schedule a virtual design fit-test?`,
        `Ah, ${customerName}. For this specific style, I definitely recommend pairing it with a customized organza drape. It maintains structure while flowing beautifully.`,
        `Greetings ${customerName}. An exquisite query. Every thread in this premium design is selected meticulously over 14 craftsmanship days. We would love to alter the length exactly to your waistline specifications.`
      ];
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Create a delayed response from the designer
    const designerMessage = {
      id: "msg_" + (Date.now() + 10),
      sender: "designer",
      content: responseText.trim(),
      timestamp: new Date().toISOString()
    };

    thread.messages.push(designerMessage);
    thread.lastUpdated = new Date().toISOString();
    saveDB(db);
  }

  res.json(thread);
});



// Consultations
app.get("/api/consultations/:userId", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const userConsultations = db.consultations.filter((c: any) => c.userId === req.params.userId);
  res.json(userConsultations);
});



app.post("/api/consultations", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { userId, userName, designerId, designerName, date, timeSlot, notes, amount } = req.body;

  const newConsultation = {
    id: "consult_" + Date.now(),
    userId,
    userName,
    designerId,
    designerName,
    date,
    timeSlot,
    status: "Requested",
    notes: notes || "",
    amount: Number(amount) || 3000,
    createdAt: new Date().toISOString()
  };

  db.consultations.push(newConsultation);

  // Auto initialize a chat thread when booking a consultation
  let thread = db.chats.find((c: any) => c.customerId === userId && c.designerId === designerId);
  if (!thread) {
    thread = {
      id: `chat_${userId}_${designerId}`,
      customerId: userId,
      customerName: userName,
      designerId,
      designerName,
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    db.chats.push(thread);
  }

  thread.messages.push({
    id: "msg_cons_" + Date.now(),
    sender: "designer",
    content: `I received your custom luxury consultation booking for ${date} at ${timeSlot}. Warm greetings! Our atelier is already preparing beautiful visual inspiration panels to show you.`,
    timestamp: new Date().toISOString()
  });
  thread.lastUpdated = new Date().toISOString();

  saveDB(db);
  res.json({ success: true, consultation: newConsultation });
});

// Wishlists
app.get("/api/wishlist", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.json([]);
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.json([]);
    }
    res.json(user.wishlist || []);
  } catch (err) {
    console.error("Fetch wishlist error:", err);
    res.status(500).json({ error: "Failed to fetch wishlist." });
  }
});

app.post("/api/wishlist/toggle", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.wishlist) user.wishlist = [];
    const idx = user.wishlist.indexOf(productId);
    if (idx !== -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    res.status(500).json({ error: "Failed to toggle wishlist." });
  }
});

// Authentication (Stateful MongoDB database integration)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: "Missing required registration parameters." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered. Please login." });
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone: phone || "",
      avatar: "",
      role: "customer",
      savedAddresses: []
    });

    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration process failed. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required to access your VIP Atelier account." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ error: "No account exists with this email in the ANVAA registry. Please sign up first." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect security password credentials. Please verify." });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Authentication failed. Try again." });
  }
});
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Missing Google authentication credential." });
    }

    // Verify token using Google tokeninfo API (clean, dependency-free verification)
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) {
      return res.status(400).json({ error: "Invalid Google credential token." });
    }

    const payload = await verifyRes.json();
    const { email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ error: "Google account does not provide an email address." });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user for Google Sign-in with a secure dummy password
      const dummyPassword = await bcrypt.hash("google-oauth-user-" + Date.now(), 10);
      user = new User({
        email: email.toLowerCase(),
        password: dummyPassword,
        name: name || "Google User",
        phone: "",
        avatar: picture || "",
        role: "customer",
        savedAddresses: []
      });
      await user.save();
      console.log(`New user registered via Google Sign-In: ${email}`);
    } else {
      // User exists, update avatar if empty
      if (!user.avatar && picture) {
        user.avatar = picture;
        await user.save();
      }
      console.log(`Existing user logged in via Google Sign-In: ${email}`);
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (err: any) {
    console.error("Google authentication error:", err);
    res.status(500).json({ error: "Google Sign-In failed. Please try again." });
  }
});

app.post("/api/auth/update-profile", async (req, res) => {
  try {
    const { userId, name, phone, password, address, avatar } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "VIP user session not found." });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar; // Supports base64 profile image

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (address && address.street && address.city && address.pincode) {
      const parsedAddress = {
        name: address.name || name || user.name,
        street: address.street,
        city: address.city,
        state: address.state || "Delhi",
        pincode: address.pincode,
        phone: address.phone || phone || user.phone
      };

      if (!user.savedAddresses || user.savedAddresses.length === 0) {
        user.savedAddresses.push(parsedAddress as any);
      } else {
        const existingAddr = user.savedAddresses[0];
        existingAddr.name = parsedAddress.name;
        existingAddr.street = parsedAddress.street;
        existingAddr.city = parsedAddress.city;
        existingAddr.state = parsedAddress.state;
        existingAddr.pincode = parsedAddress.pincode;
        existingAddr.phone = parsedAddress.phone;
      }
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (err: any) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile details." });
  }
});

app.post("/api/auth/save-address", async (req, res) => {
  try {
    const { userId, address } = req.body;
    
    // Find user either by Mongo _id or standard id
    let user = await User.findById(userId);
    if (!user) {
      user = await User.findOne({ email: userId });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!address.id) {
      address.id = "addr_" + Date.now();
    }

    const addrIdx = user.savedAddresses.findIndex((a: any) => a.id === address.id || a._id?.toString() === address.id);
    if (addrIdx !== -1) {
      const existingAddr = user.savedAddresses[addrIdx];
      existingAddr.name = address.name;
      existingAddr.street = address.street;
      existingAddr.city = address.city;
      existingAddr.state = address.state || "Delhi";
      existingAddr.pincode = address.pincode;
      existingAddr.phone = address.phone;
    } else {
      user.savedAddresses.push(address as any);
    }
    
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ success: true, address, user: userObj });
  } catch (err: any) {
    console.error("Save address error:", err);
    res.status(500).json({ error: "Failed to save address" });
  }
});

// Orders & Payments
app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err: any) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});



app.post("/api/orders", async (req, res) => {
  try {
    const { userId, items, subtotal, discount, shipping, total, address, paymentMethod } = req.body;

    const orderId = "ANVAA-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = new Order({
      id: orderId,
      userId,
      items,
      subtotal,
      discount,
      shipping,
      total,
      address,
      paymentMethod,
      status: "Order Placed",
      trackingTimeline: [
        { status: "Order Placed", date: new Date().toLocaleString(), description: "Your premium order has been recorded at the central salon.", done: true },
        { status: "In Crafting", date: "--", description: "Artisans commencing precise weaving and drape alignment.", done: false },
        { status: "Quality Check", date: "--", description: "Micro inspect for fit and gold thread perfection.", done: false },
        { status: "Dispatched", date: "--", description: "Placed in luxury premium boxes with custom notes.", done: false },
        { status: "Delivered", date: "--", description: "Pristine physical handover complete.", done: false }
      ]
    });

    await newOrder.save();

    // Decrement stock levels
    const db = getDB();
    if (db) {
      items.forEach((item: any) => {
        const prodIndex = db.products.findIndex((p: any) => p.id === item.product.id);
        if (prodIndex !== -1) {
          db.products[prodIndex].stock = Math.max(0, db.products[prodIndex].stock - item.quantity);
        }
      });
      saveDB(db);
    }

    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to place order." });
  }
});

// Serve frontend build or dev mode with Vite server
async function start() {
  const isBackendOnly = process.argv.includes("--backend-only") || process.env.BACKEND_ONLY === "true";

  if (isBackendOnly) {
    console.log("Starting backend in standalone API mode (--backend-only).");
  } else {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
        root: path.join(process.cwd(), "frontend"),
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ANVAA backend luxury server is running at http://127.0.0.1:${PORT}`);
  });
}

start();
