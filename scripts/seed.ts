import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });
import { hashPassword } from "../src/lib/auth";
import { CATALOGUE_PRICES, PRODUCT_PRICES } from "../src/lib/product-pricing";
import { slugify } from "../src/lib/utils";
import { DEFAULT_ANNOUNCEMENT, DEFAULT_DISCLAIMER } from "../src/lib/constants";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const AdminUser = (await import("../src/models/AdminUser")).default;
  const ProductCategory = (await import("../src/models/ProductCategory")).default;
  const Product = (await import("../src/models/Product")).default;
  const Service = (await import("../src/models/Service")).default;
  const FAQ = (await import("../src/models/FAQ")).default;
  const SiteSettings = (await import("../src/models/SiteSettings")).default;

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fungtionalwellness.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await AdminUser.create({
      email: adminEmail,
      password: await hashPassword(adminPassword),
      name: "Admin",
      role: "admin",
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log("Admin already exists");
  }

  // Categories
  const categories = [
    { name: "Mushroom Capsules", slug: "mushroom-capsules", displayOrder: 1, image: "/images/capsules-jars.jpg" },
    { name: "Mushroom Oral Drops", slug: "mushroom-oral-drops", displayOrder: 2, image: "/images/oral-drops.jpg" },
    { name: "Mushroom Powders", slug: "mushroom-powders", displayOrder: 3, image: "/images/mushroom-powder.jpg" },
    { name: "Beverages", slug: "beverages", displayOrder: 4, image: "/images/myco-dose.jpg" },
    { name: "Myco Mist", slug: "myco-mist", displayOrder: 5, image: "/images/myco-mist.jpg" },
    { name: "Product Development", slug: "product-development", displayOrder: 6, image: "/images/mushrooms-macro.jpg" },
  ];

  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of categories) {
    const existing = await ProductCategory.findOne({ slug: cat.slug });
    if (existing) {
      categoryMap[cat.slug] = existing._id;
      await ProductCategory.findByIdAndUpdate(existing._id, { image: cat.image });
    } else {
      const created = await ProductCategory.create(cat);
      categoryMap[cat.slug] = created._id;
      console.log(`Category created: ${cat.name}`);
    }
  }

  // Products
  type ProductSeed = {
    name: string;
    category: string;
    price: number;
    size?: string;
    npn?: string;
    format: string;
    benefits: string[];
    suggestedUse?: string;
    status: "active" | "coming_soon";
    featured?: boolean;
    stock: number;
    trackInventory?: boolean;
    shortDescription?: string;
    ingredients?: string;
  };

  const categoryImages: Record<string, string> = {
    "mushroom-capsules": "/images/capsules-jars.jpg",
    "mushroom-oral-drops": "/images/oral-drops.jpg",
    "mushroom-powders": "/images/mushroom-powder.jpg",
    beverages: "/images/myco-dose.jpg",
    "myco-mist": "/images/myco-mist.jpg",
    "product-development": "/images/mushrooms-macro.jpg",
  };

  const products: ProductSeed[] = [
    // Capsules — $60 each
    { name: "Cordyceps Capsules", category: "mushroom-capsules", price: CATALOGUE_PRICES.capsules, size: "60 capsules", npn: "80124067", format: "Capsules", benefits: ["Energy", "Focus", "Recovery", "Overall Wellness"], suggestedUse: "Take two capsules daily", status: "active", featured: true, stock: 100 },
    { name: "Lion's Mane Capsules", category: "mushroom-capsules", price: CATALOGUE_PRICES.capsules, size: "60 capsules", npn: "80124066", format: "Capsules", benefits: ["Focus", "Gut Health", "Overall Wellness"], suggestedUse: "Take two capsules daily", status: "active", featured: true, stock: 100 },
    { name: "Turkey Tail Capsules", category: "mushroom-capsules", price: CATALOGUE_PRICES.capsules, size: "60 capsules", npn: "80124065", format: "Capsules", benefits: ["Immunity", "Gut Health", "Overall Wellness"], suggestedUse: "Take two capsules daily", status: "active", stock: 100 },
    { name: "My Gut+ Capsules", category: "mushroom-capsules", price: CATALOGUE_PRICES.capsules, size: "60 capsules", npn: "80123831", format: "Capsules", benefits: ["Gut Health", "Energy", "Immunity", "Overall Wellness"], ingredients: "Shiitake, Reishi and Turkey Tail mushroom blend", suggestedUse: "Take two capsules daily", status: "active", stock: 100 },
    // Oral Drops — $65 each
    { name: "My Focus Oral Drops", category: "mushroom-oral-drops", price: CATALOGUE_PRICES.oralDrops, size: "50 mL", format: "Oral Drops", benefits: ["Focus", "Energy", "Stress Support"], ingredients: "Lion's Mane, L-theanine, Ashwagandha Root, Holy Basil, Schisandra Berry, Korean Red Ginseng, Peppermint, Coconut MCT and Monk Fruit. Alcohol-free. Non-GMO. Vegan.", suggestedUse: "Take as directed on label", status: "active", featured: true, stock: 50 },
    { name: "My Fuel Oral Drops", category: "mushroom-oral-drops", price: CATALOGUE_PRICES.oralDrops, size: "50 mL", format: "Oral Drops", benefits: ["Energy", "Recovery", "Overall Wellness"], ingredients: "Cordyceps, Lion's Mane, Reishi, Ashwagandha Root, Holy Basil, Schisandra Berry, Korean Red Ginseng, Peppermint, Coconut MCT and Monk Fruit. Alcohol-free. Non-GMO. Vegan.", status: "active", stock: 50 },
    { name: "My Vitality Oral Drops", category: "mushroom-oral-drops", price: CATALOGUE_PRICES.oralDrops, size: "50 mL", format: "Oral Drops", benefits: ["Immunity", "Gut Health", "Energy", "Stress Support", "Overall Wellness"], ingredients: "Cordyceps, Lion's Mane, Shiitake, Reishi, Turkey Tail, Ashwagandha Root, Peppermint, Coconut MCT and Monk Fruit. Alcohol-free.", status: "active", stock: 50 },
    // Powders — $60 each
    { name: "Cordyceps Mushroom Powder", category: "mushroom-powders", price: CATALOGUE_PRICES.powders, size: "100 g", npn: "80124067", format: "Powder", benefits: ["Energy", "Recovery", "Overall Wellness"], status: "active", stock: 75 },
    { name: "Lion's Mane Mushroom Powder", category: "mushroom-powders", price: CATALOGUE_PRICES.powders, size: "100 g", npn: "80124066", format: "Powder", benefits: ["Focus", "Gut Health", "Overall Wellness"], status: "active", stock: 75 },
    { name: "Turkey Tail Mushroom Powder", category: "mushroom-powders", price: CATALOGUE_PRICES.powders, size: "100 g", npn: "80124065", format: "Powder", benefits: ["Immunity", "Gut Health", "Overall Wellness"], status: "active", stock: 75 },
    { name: "Function Mushroom Powder", category: "mushroom-powders", price: CATALOGUE_PRICES.powders, size: "100 g", npn: "80124065", format: "Powder", benefits: ["Overall Wellness", "Immunity", "Energy", "Gut Health", "Focus", "Stress Support"], ingredients: "Cordyceps, Lion's Mane, Shiitake, Reishi, Turkey Tail and Ashwagandha Root blend", status: "active", featured: true, stock: 75 },
    // Beverages — $54
    { name: "Myco Dose", category: "beverages", price: CATALOGUE_PRICES.mycoDose, size: "12 × 2 oz bottles", format: "Beverage", npn: "80138825", benefits: ["Energy", "Focus", "Stress Support", "Immunity", "Recovery"], shortDescription: "Orange Creamsicle flavored performance beverage.", status: "active", featured: true, stock: 60 },
    // Myco Mist Oral Sprays — $30 each
    { name: "Myco Mist Energy", category: "myco-mist", price: CATALOGUE_PRICES.mycoMist, format: "Oral Spray", benefits: ["Energy", "Overall Wellness"], shortDescription: "Concentrated oral spray for energy support.", status: "active", stock: 40 },
    { name: "Myco Mist Focus", category: "myco-mist", price: CATALOGUE_PRICES.mycoMist, format: "Oral Spray", benefits: ["Focus", "Overall Wellness"], shortDescription: "Concentrated oral spray for focus support.", status: "active", featured: true, stock: 40 },
    { name: "Myco Mist Calm", category: "myco-mist", price: CATALOGUE_PRICES.mycoMist, format: "Oral Spray", benefits: ["Stress Support", "Overall Wellness"], shortDescription: "Concentrated oral spray for calm support.", status: "active", stock: 40 },
    { name: "Myco Mist Immune", category: "myco-mist", price: CATALOGUE_PRICES.mycoMist, format: "Oral Spray", benefits: ["Immunity", "Overall Wellness"], shortDescription: "Concentrated oral spray for immune support.", status: "active", stock: 40 },
    { name: "Myco Mist Sleep", category: "myco-mist", price: CATALOGUE_PRICES.mycoMist, format: "Oral Spray", benefits: ["Stress Support", "Overall Wellness"], shortDescription: "Concentrated oral spray for sleep support.", status: "active", stock: 40 },
    // Products Under Development
    { name: "Mushroom Coffee", category: "product-development", price: 0, format: "Beverage", benefits: ["Energy", "Focus"], shortDescription: "Product under development", status: "coming_soon", stock: 0, trackInventory: false },
    { name: "Immune Plus+ Powder", category: "product-development", price: 0, format: "Powder", benefits: ["Immunity"], shortDescription: "Product under development", status: "coming_soon", stock: 0, trackInventory: false },
    { name: "Immune Plus+ Capsules", category: "product-development", price: 0, format: "Capsules", benefits: ["Immunity"], shortDescription: "Product under development", status: "coming_soon", stock: 0, trackInventory: false },
  ];

  let displayOrder = 1;
  for (const p of products) {
    const slug = slugify(p.name);
    const categoryId = categoryMap[p.category];
    const featuredImage = categoryImages[p.category];
    const payload = {
      ...p,
      slug,
      category: categoryId,
      featured: p.featured ?? false,
      featuredImage,
      images: [{ url: featuredImage, alt: p.name, order: 0 }],
      shortDescription: p.shortDescription || `${p.name} — premium functional mushroom wellness product.`,
      description: `${p.name} from Fungtional Wellness. ${p.shortDescription || "Crafted with 100% full fruiting body mushrooms. No mycelium. No fillers."}`,
      warnings: DEFAULT_DISCLAIMER,
      trackInventory: p.trackInventory ?? true,
      displayOrder,
    };

    const result = await Product.findOneAndUpdate({ slug }, payload, { upsert: true, returnDocument: "after" });
    console.log(result.createdAt?.getTime() === result.updatedAt?.getTime() ? `Product created: ${p.name}` : `Product updated: ${p.name}`);
    displayOrder += 1;
  }

  // Archive legacy combined Myco Mist listing if present
  await Product.updateOne(
    { slug: "myco-mist-concentrated-oral-spray" },
    { $set: { status: "archived" } }
  );

  // Force-sync catalogue prices on all active products
  for (const [slug, price] of Object.entries(PRODUCT_PRICES)) {
    await Product.updateOne({ slug }, { $set: { price } });
  }
  console.log("Product prices synced to catalogue");

  // Services
  const services = [
    {
      title: "Wellness Products",
      slug: "wellness-products",
      shortDescription: "Curated functional mushroom products designed for practical daily use.",
      fullDescription: "Explore our range of premium functional mushroom products including capsules, oral drops, powders, and beverages. Each product is crafted with 100% full fruiting body mushrooms for optimal wellness support.",
      benefits: ["Daily wellness support", "Clean formulations", "Convenient formats", "Quality-focused development"],
      displayOrder: 1,
      ctaText: "Shop Now",
      ctaLink: "/shop",
    },
    {
      title: "Wellness Assessment",
      slug: "wellness-assessment",
      shortDescription: "A consultation to understand wellness objectives, routines and areas of focus.",
      fullDescription: "Our wellness assessment is a personalized consultation designed to understand your wellness objectives, current routines, and areas of focus. This is not a medical diagnosis but a guided conversation to help identify suitable wellness approaches.",
      benefits: ["Personalized consultation", "Goal identification", "Routine evaluation", "Wellness roadmap"],
      displayOrder: 2,
      ctaText: "Book Assessment",
      ctaLink: "/booking",
      duration: "60 minutes",
    },
    {
      title: "Personal Optimization",
      slug: "personal-optimization",
      shortDescription: "A guided approach to selecting suitable wellness routines and products based on customer goals.",
      fullDescription: "Personal optimization is a guided approach to help you select suitable wellness routines and products based on your individual goals. Our team works with you to create a tailored wellness plan.",
      benefits: ["Tailored recommendations", "Product selection guidance", "Ongoing support", "Goal tracking"],
      displayOrder: 3,
      ctaText: "Get Started",
      ctaLink: "/booking",
      duration: "90 minutes",
    },
  ];

  for (const s of services) {
    const existing = await Service.findOne({ slug: s.slug });
    if (!existing) {
      await Service.create(s);
      console.log(`Service created: ${s.title}`);
    }
  }

  // FAQs
  const faqs = [
    {
      question: "What are functional mushrooms?",
      answer:
        "Functional mushrooms are mushroom species traditionally used and studied for their wellness-supporting properties. At Fungtional Wellness, we use 100% full fruiting body mushrooms in our capsules, powders, oral drops, beverages and sprays — never mycelium on grain or fillers.",
      category: "Products",
      displayOrder: 1,
    },
    {
      question: "Are your products made with full fruiting body mushrooms?",
      answer:
        "Yes. Every Fungtional Wellness product is made with 100% full fruiting body mushrooms. We do not use mycelium, grain fillers or artificial additives in our core mushroom formulations.",
      category: "Products",
      displayOrder: 2,
    },
    {
      question: "What's the difference between capsules, powders, and oral drops?",
      answer:
        "Capsules are the most convenient daily format — take two per day with water. Powders offer flexibility for smoothies, coffee or recipes at 100 g per jar. Oral drops are liquid, alcohol-free formulas in 50 mL bottles for those who prefer a fast-absorbing format. Choose based on your routine and preference.",
      category: "Products",
      displayOrder: 3,
    },
    {
      question: "Are Fungtional Wellness products vegan?",
      answer:
        "Most of our mushroom capsules, powders and oral drops are vegan. Our oral drops use coconut MCT and monk fruit rather than animal-derived ingredients. Check the individual product page for full ingredient and dietary details.",
      category: "Products",
      displayOrder: 4,
    },
    {
      question: "What is an NPN and do your products have one?",
      answer:
        "An NPN (Natural Product Number) is issued by Health Canada for natural health products sold in Canada. Several Fungtional Wellness products carry an NPN — including Cordyceps, Lion's Mane and Turkey Tail capsules and powders, My Gut+ Capsules, and Myco Dose. The NPN is listed on each product page where applicable.",
      category: "Products",
      displayOrder: 5,
    },
    {
      question: "How should I take mushroom capsules?",
      answer:
        "Most Fungtional Wellness capsule products suggest taking two capsules daily with water, preferably with food. Always follow the suggested use on the product label. If you are pregnant, nursing, taking medication or have a health condition, consult your healthcare provider before use.",
      category: "Usage",
      displayOrder: 6,
    },
    {
      question: "Can I take more than one Fungtional Wellness product at the same time?",
      answer:
        "Many customers combine products — for example, a capsule for daily mushroom support and oral drops for a targeted routine. Start with one product to see how your body responds, then introduce others gradually. For personalized guidance, book a wellness assessment through our site.",
      category: "Usage",
      displayOrder: 7,
    },
    {
      question: "How should I store mushroom powders and capsules?",
      answer:
        "Store in a cool, dry place away from direct sunlight. Keep the lid tightly closed on powders to maintain freshness. Oral drops and Myco Mist sprays should be stored at room temperature. Do not use if the seal is broken.",
      category: "Usage",
      displayOrder: 8,
    },
    {
      question: "When is the best time to take oral drops?",
      answer:
        "My Focus Oral Drops are commonly taken in the morning or early afternoon. My Fuel Oral Drops fit well before activity or mid-day. My Vitality Oral Drops can be taken any time of day. Follow the label directions and adjust timing to what works best for your schedule.",
      category: "Usage",
      displayOrder: 9,
    },
    {
      question: "What are Myco Mist oral sprays?",
      answer:
        "Myco Mist is a line of concentrated oral sprays available in five varieties: Energy, Focus, Calm, Immune and Sleep. Each spray is designed for quick, on-the-go use. They are priced at $30 each and can be used as a standalone product or alongside your daily mushroom routine.",
      category: "Products",
      displayOrder: 10,
    },
    {
      question: "How long does shipping take?",
      answer:
        "Orders are typically processed within 1–2 business days. Standard shipping within Canada and the United States usually arrives within 5–7 business days depending on your location. You will receive a tracking number once your order ships.",
      category: "Shipping",
      displayOrder: 11,
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "We offer free standard shipping on orders over $100 before tax. Orders below that threshold are charged a flat shipping rate at checkout. See our Shipping & Returns page for current rates and details.",
      category: "Shipping",
      displayOrder: 12,
    },
    {
      question: "Do you ship internationally?",
      answer:
        "International shipping is available on a case-by-case basis. Contact our sales team at sales@fungtionallabs.com with your location and order details, and we will confirm availability and shipping options.",
      category: "Shipping",
      displayOrder: 13,
    },
    {
      question: "What is your return policy?",
      answer:
        "Unopened products in original condition may be returned within 30 days of delivery for a refund or exchange. Opened supplement products cannot be returned for safety reasons. Visit our Shipping & Returns page for the full policy or email sales@fungtionallabs.com to start a return.",
      category: "Shipping",
      displayOrder: 14,
    },
    {
      question: "What is a wellness assessment?",
      answer:
        "A wellness assessment is a 60-minute consultation with our team to understand your goals, daily routines, sleep, nutrition and activity levels. It is a guided conversation — not a medical diagnosis — designed to help identify which Fungtional Wellness products and habits may fit your lifestyle.",
      category: "Services",
      displayOrder: 15,
    },
    {
      question: "How do I book a wellness assessment?",
      answer:
        "Visit our Booking page, fill in your details and preferred time, and submit your request. Our team will review your information and confirm your appointment by email. You can also reach us at rico@fungtionallabs.com or 702-826-7426.",
      category: "Services",
      displayOrder: 16,
    },
    {
      question: "What is personal optimization?",
      answer:
        "Personal optimization is a 90-minute guided session where we help you build a tailored wellness routine — selecting the right products, timing and habits based on your individual goals. It goes deeper than a standard assessment and includes ongoing product selection guidance.",
      category: "Services",
      displayOrder: 17,
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Reach us at rico@fungtionallabs.com for general inquiries or sales@fungtionallabs.com for orders and wholesale. You can also call 702-826-7426 or use the contact form on our website. We aim to respond within one business day.",
      category: "General",
      displayOrder: 18,
    },
  ];

  for (const f of faqs) {
    await FAQ.findOneAndUpdate(
      { question: f.question },
      { ...f, active: true },
      { upsert: true }
    );
    console.log(`FAQ seeded: ${f.question}`);
  }

  const testimonials = [
    {
      name: "Danielle R.",
      role: "Distance runner, Portland OR",
      content:
        "I added Cordyceps Capsules to my training routine and my afternoon energy feels steadier on long run days. No jitters, no crash — just a clean, consistent lift that fits my schedule.",
      rating: 5,
      active: true,
    },
    {
      name: "Marcus T.",
      role: "Software engineer",
      content:
        "Lion's Mane Capsules have become part of my morning ritual before deep work sessions. I feel sharper and less scattered during long coding blocks. The quality of the formulation is obvious.",
      rating: 5,
      active: true,
    },
    {
      name: "Priya K.",
      role: "Yoga instructor",
      content:
        "My Gut+ Capsules were exactly what I was looking for — a thoughtful mushroom blend without a laundry list of fillers. I've been taking them daily for two months and my digestion feels more balanced.",
      rating: 5,
      active: true,
    },
    {
      name: "James & Lauren H.",
      role: "Active couple, Denver CO",
      content:
        "Myco Dose is our go-to before weekend hikes. The Orange Creamsicle flavor is genuinely good, and we love having a functional beverage that isn't loaded with sugar or artificial stuff.",
      rating: 5,
      active: true,
    },
    {
      name: "Elena V.",
      role: "Creative director",
      content:
        "My Focus Oral Drops are in my bag everywhere I go. Fast, easy, alcohol-free — and I notice a real difference in how present I feel during client presentations and long creative sessions.",
      rating: 5,
      active: true,
    },
    {
      name: "Chris M.",
      role: "Wellness assessment client",
      content:
        "The wellness assessment helped me stop guessing which products to buy. The team mapped out a simple routine with Function Mushroom Powder and Myco Mist Focus that actually fits my busy schedule.",
      rating: 5,
      active: true,
    },
  ];

  // Site Settings
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      announcement: DEFAULT_ANNOUNCEMENT,
      medicalDisclaimer: DEFAULT_DISCLAIMER,
      testimonials,
    });
    console.log("Site settings created");
  } else {
    await SiteSettings.findByIdAndUpdate(existingSettings._id, { testimonials });
    console.log("Testimonials updated");
  }

  console.log("\nSeed completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
