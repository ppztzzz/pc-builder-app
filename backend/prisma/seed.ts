import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // ========================
  // ADMIN
  // ========================
  const username = process.env.ADMIN_USERNAME ?? "admin"
  const password = process.env.ADMIN_PASSWORD ?? "admin123"
  const hashed = await bcrypt.hash(password, 10)

  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, password: hashed },
  })
  console.log(`✅ Admin: ${username} / ${password}`)

  // ========================
  // CATEGORIES
  // ========================
  const categories = [
    { id: 1, name: "ซีพียู", icon: "Cpu" },
    { id: 2, name: "แรม", icon: "MemoryStick" },
    { id: 3, name: "เมนบอร์ด", icon: "CircuitBoard" },
    { id: 4, name: "การ์ดจอ", icon: "MonitorCog" },
    { id: 5, name: "พื้นที่เก็บข้อมูล", icon: "HardDrive" },
    { id: 6, name: "พาวเวอร์ซัพพลาย", icon: "Plug" },
    { id: 7, name: "ชุดระบายความร้อน", icon: "Fan" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    })
  }
  console.log(`✅ Categories: ${categories.length}`)

  // ========================
  // ARTICLES (3 จาก PHP เดิม + featured flag)
  // ========================
  await prisma.articleImage.deleteMany()
  await prisma.article.deleteMany()

  const articles = [
    {
      id: 1,
      title: "CPU คืออะไร",
      excerpt: "หน่วยประมวลผลกลาง สมองของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งทั้งหมด",
      content:
        "CPU มีชื่อเต็มๆ ว่า Central Processing Unit ถ้าแปลตามชื่อก็คือหน่วยประมวลผลกลาง ถ้าถามว่า CPU คืออะไร คำตอบอย่างง่ายคือ CPU คืออุปกรณ์ชิ้นเล็กๆ ที่ทำหน้าที่ประมวลผลข้อมูล หรือชุดคำสั่งต่างๆ ที่ได้รับส่งมา\n\nถ้าจะให้ยกตัวอย่างง่ายๆ เทียบกับร่างกายของคนเราแล้วล่ะก็ CPU ก็เปรียบเหมือนกับสมอง ที่เป็นศูนย์กลางในการควบคุมคำสั่งต่างๆ",
      isFeatured: true,
      categoryId: 1,
    },
    {
      id: 2,
      title: "แรม คืออะไร รู้จักเพิ่มเติมกันสักหน่อย",
      excerpt: "หน่วยความจำหลักของคอมพิวเตอร์ พื้นที่พักข้อมูลชั่วคราวระหว่างทำงาน",
      content:
        "แรม หรือ RAM เป็นหน่วยความจำหลักของคอมพิวเตอร์ มีหน้าที่รับชุดข้อมูลจากโปรแกรมต่างๆ เพื่อรอส่งไปประมวลผลไปยังซีพียู การทำงานของมันจะเป็นเสมือนที่พักชั่วคราว\n\nโดยแรมในปัจจุบันที่มีผู้ใช้งานจำนวนมากมีตั้งแต่ 4 GB จนถึง 32 GB",
      isFeatured: false,
      categoryId: 2,
    },
    {
      id: 5,
      title: "เมนบอร์ด คืออะไร",
      excerpt: "แผงวงจรหลักที่เชื่อมต่อทุกชิ้นส่วนของคอมพิวเตอร์เข้าด้วยกัน",
      content:
        "เมนบอร์ด เป็นแผงวงจรหลักของคอมพิวเตอร์ เป็นที่อยู่ของซีพียู แรม การ์ดจอ และอุปกรณ์จัดเก็บข้อมูลอย่าง HDD และ SSD\n\nหน้าที่ของมันเปรียบเสมือนเป็นบ้านของอุปกรณ์เหล่านี้ ให้ชิ้นส่วนต่างๆ ของคอมพิวเตอร์ทำงานประสานกันเป็นอย่างดี",
      isFeatured: false,
      categoryId: 3,
    },
  ]

  for (const a of articles) {
    await prisma.article.create({ data: a })
  }
  console.log(`✅ Articles: ${articles.length}`)

  // ========================
  // ARTICLE IMAGES (port จาก PHP)
  // ========================
  const images = [
    // Article 1 (CPU)
    { articleId: 1, image: "1776649979_1126_unnamed.jpg", isCover: true },
    { articleId: 1, image: "1776649979_3475_unnamed (1).jpg", isCover: false },
    { articleId: 1, image: "1776649979_5368_unnamed (2).jpg", isCover: false },
    // Article 2 (RAM)
    { articleId: 2, image: "1776668021_2799_175679759168b69a9787e51.jpg", isCover: true },
    { articleId: 2, image: "1776668021_9373_1756797521.jpg", isCover: false },
    { articleId: 2, image: "1776668021_4865_843591021340-content2.jpg", isCover: false },
    { articleId: 2, image: "1776668021_5019_001-show-ram.jpg", isCover: false },
    // Article 5 (Mainboard)
    { articleId: 5, image: "1776669916_1886_1761551329.jpg", isCover: true },
    { articleId: 5, image: "1776669916_2794_1761550624.jpg", isCover: false },
    { articleId: 5, image: "1776669916_1845_1761550625.jpg", isCover: false },
    { articleId: 5, image: "1776669916_7432_1761551320.jpg", isCover: false },
  ]
  for (const img of images) {
    await prisma.articleImage.create({ data: img })
  }
  console.log(`✅ ArticleImages: ${images.length}`)

  // ========================
  // COMPONENTS (catalog สำหรับ simulator)
  // ========================
  await prisma.component.deleteMany()

  const components = [
    // CPUs (4)
    { id: 101, name: "Intel Core i5-13400", type: "CPU", socket: "LGA1700",
      specs: { cores: 10, threads: 16, tdp: 65, ramType: "DDR5" },
      imageUrl: "/components/cpu-intel-i5.png",
      description: "10 cores 16 threads งานทั่วไป + เกม",
      price: 7500, categoryId: 1, articleId: 1 },
    { id: 102, name: "Intel Core i7-14700K", type: "CPU", socket: "LGA1700",
      specs: { cores: 20, threads: 28, tdp: 125, ramType: "DDR5" },
      imageUrl: "/components/cpu-intel-i7.png",
      description: "20 cores ตัวแรง สำหรับเกมและงานหนัก",
      price: 14900, categoryId: 1, articleId: 1 },
    { id: 103, name: "AMD Ryzen 5 7600X", type: "CPU", socket: "AM5",
      specs: { cores: 6, threads: 12, tdp: 105, ramType: "DDR5" },
      imageUrl: "/components/cpu-amd-r5.png",
      description: "6 cores ราคาคุ้มค่า สาย AMD",
      price: 8200, categoryId: 1, articleId: 1 },
    { id: 104, name: "AMD Ryzen 7 7800X3D", type: "CPU", socket: "AM5",
      specs: { cores: 8, threads: 16, tdp: 120, ramType: "DDR5" },
      imageUrl: "/components/cpu-amd-r7.png",
      description: "8 cores 3D V-Cache เกมเมอร์ตัวเลือกอันดับหนึ่ง",
      price: 16500, categoryId: 1, articleId: 1 },

    // Mainboards (4)
    { id: 201, name: "ASUS PRIME B760M-A", type: "MB", socket: "LGA1700",
      specs: { ramType: "DDR5", maxRam: 128 },
      imageUrl: "/components/mb-asus-b760.png",
      description: "Intel B760 chipset DDR5 mATX",
      price: 4500, categoryId: 3, articleId: 5 },
    { id: 202, name: "MSI MAG Z790 TOMAHAWK", type: "MB", socket: "LGA1700",
      specs: { ramType: "DDR5", maxRam: 192 },
      imageUrl: "/components/mb-msi-z790.png",
      description: "Intel Z790 chipset overclock ได้",
      price: 9800, categoryId: 3, articleId: 5 },
    { id: 203, name: "MSI B650M PRO", type: "MB", socket: "AM5",
      specs: { ramType: "DDR5", maxRam: 128 },
      imageUrl: "/components/mb-msi-b650.png",
      description: "AMD B650 chipset DDR5 mATX",
      price: 4800, categoryId: 3, articleId: 5 },
    { id: 204, name: "ASUS ROG STRIX X670E-E", type: "MB", socket: "AM5",
      specs: { ramType: "DDR5", maxRam: 192 },
      imageUrl: "/components/mb-asus-x670.png",
      description: "AMD X670E flagship Wi-Fi 6E",
      price: 14500, categoryId: 3, articleId: 5 },

    // RAM (3)
    { id: 301, name: "Kingston Fury Beast 16GB DDR5-5600", type: "RAM",
      specs: { size: 16, type: "DDR5", speed: 5600 },
      imageUrl: "/components/ram-kingston-16.png",
      description: "16GB (1×16) DDR5 5600MHz",
      price: 2200, categoryId: 2, articleId: 2 },
    { id: 302, name: "G.Skill Trident Z5 32GB DDR5-6000", type: "RAM",
      specs: { size: 32, type: "DDR5", speed: 6000 },
      imageUrl: "/components/ram-gskill-32.png",
      description: "32GB (2×16) DDR5 6000MHz CL30",
      price: 4500, categoryId: 2, articleId: 2 },
    { id: 303, name: "Corsair Vengeance 16GB DDR4-3200", type: "RAM",
      specs: { size: 16, type: "DDR4", speed: 3200 },
      imageUrl: "/components/ram-corsair-16.png",
      description: "16GB (2×8) DDR4 3200MHz — สำหรับ board รุ่นเก่า",
      price: 1500, categoryId: 2, articleId: 2 },

    // GPUs (4)
    { id: 401, name: "NVIDIA RTX 4060", type: "GPU",
      specs: { vram: 8, tdp: 115 },
      imageUrl: "/components/gpu-rtx-4060.png",
      description: "8GB VRAM เล่นเกม 1080p ลื่นๆ",
      price: 11500, categoryId: 4 },
    { id: 402, name: "NVIDIA RTX 4070", type: "GPU",
      specs: { vram: 12, tdp: 200 },
      imageUrl: "/components/gpu-rtx-4070.png",
      description: "12GB VRAM 1440p high settings",
      price: 22000, categoryId: 4 },
    { id: 403, name: "NVIDIA RTX 4080", type: "GPU",
      specs: { vram: 16, tdp: 320 },
      imageUrl: "/components/gpu-rtx-4080.png",
      description: "16GB VRAM 4K gaming",
      price: 42000, categoryId: 4 },
    { id: 404, name: "AMD Radeon RX 7600", type: "GPU",
      specs: { vram: 8, tdp: 165 },
      imageUrl: "/components/gpu-rx-7600.png",
      description: "8GB VRAM เกม 1080p — สาย AMD",
      price: 9800, categoryId: 4 },

    // PSUs (3)
    { id: 501, name: "Corsair RM650 80+ Gold", type: "PSU",
      specs: { watt: 650, efficiency: "80+ Gold" },
      imageUrl: "/components/psu-corsair-650.png",
      description: "650W 80+ Gold modular",
      price: 3500, categoryId: 6 },
    { id: 502, name: "Seasonic Focus GX-850", type: "PSU",
      specs: { watt: 850, efficiency: "80+ Gold" },
      imageUrl: "/components/psu-seasonic-850.png",
      description: "850W 80+ Gold สำหรับเครื่องตัวแรง",
      price: 5200, categoryId: 6 },
    { id: 503, name: "Antec NeoECO 500W", type: "PSU",
      specs: { watt: 500, efficiency: "80+ Bronze" },
      imageUrl: "/components/psu-antec-500.png",
      description: "500W 80+ Bronze สำหรับเครื่องไม่หนัก",
      price: 1900, categoryId: 6 },

    // Storage (3)
    { id: 601, name: "Samsung 980 1TB NVMe", type: "STORAGE",
      specs: { size: 1000, type: "NVMe" },
      imageUrl: "/components/storage-samsung-980.png",
      description: "1TB NVMe อ่านเร็ว 3500MB/s",
      price: 2800, categoryId: 5 },
    { id: 602, name: "WD Black SN850X 2TB", type: "STORAGE",
      specs: { size: 2000, type: "NVMe" },
      imageUrl: "/components/storage-wd-black-2tb.png",
      description: "2TB NVMe Gen4 7300MB/s — gaming",
      price: 6500, categoryId: 5 },
    { id: 603, name: "Crucial MX500 500GB SATA", type: "STORAGE",
      specs: { size: 500, type: "SATA" },
      imageUrl: "/components/storage-crucial-500.png",
      description: "500GB SATA — งบประหยัด",
      price: 1300, categoryId: 5 },

    // Coolers (3)
    { id: 701, name: "DeepCool AK400", type: "COOLER",
      specs: { tdpSupport: 220, height: 155 },
      imageUrl: "/components/cooler-deepcool-ak400.png",
      description: "Air cooler รับ TDP สูงสุด 220W",
      price: 1200, categoryId: 7 },
    { id: 702, name: "Noctua NH-D15", type: "COOLER",
      specs: { tdpSupport: 280, height: 165 },
      imageUrl: "/components/cooler-noctua-d15.png",
      description: "Tower flagship เงียบ + เย็น",
      price: 4500, categoryId: 7 },
    { id: 703, name: "ARCTIC Liquid Freezer II 280", type: "COOLER",
      specs: { tdpSupport: 350, height: 100 },
      imageUrl: "/components/cooler-arctic-280.png",
      description: "AIO 280mm รับ CPU แรงสูง",
      price: 4900, categoryId: 7 },
  ]

  for (const c of components) {
    await prisma.component.create({
      data: { ...c, specs: JSON.stringify(c.specs) },
    })
  }
  console.log(`✅ Components: ${components.length}`)

  console.log("✨ Seed complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
