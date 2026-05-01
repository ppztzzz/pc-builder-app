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
    { id: 1, name: "ซีพียู", icon: "🧠" },
    { id: 2, name: "แรม", icon: "💾" },
    { id: 3, name: "เมนบอร์ด", icon: "🖥️" },
    { id: 4, name: "การ์ดจอ", icon: "🎮" },
    { id: 5, name: "พื้นที่เก็บข้อมูล", icon: "💿" },
    { id: 6, name: "พาวเวอร์ซัพพลาย", icon: "⚡" },
    { id: 7, name: "ชุดระบายความร้อน", icon: "❄️" },
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
  // COMPONENTS (basic set สำหรับทดสอบ simulator)
  // ========================
  await prisma.component.deleteMany()

  const components = [
    // CPUs
    {
      name: "Intel Core i5-13400",
      type: "CPU",
      socket: "LGA1700",
      specs: JSON.stringify({ cores: 10, threads: 16, tdp: 65, ramType: "DDR5" }),
      imageUrl: "/components/cpu-intel-i5.png",
      description: "CPU 10 cores เหมาะสำหรับงานทั่วไปและเล่นเกม",
      price: 7500,
      categoryId: 1,
      articleId: 1,
    },
    {
      name: "AMD Ryzen 5 7600X",
      type: "CPU",
      socket: "AM5",
      specs: JSON.stringify({ cores: 6, threads: 12, tdp: 105, ramType: "DDR5" }),
      imageUrl: "/components/cpu-amd-r5.png",
      description: "CPU AMD 6 cores ราคาคุ้มค่า",
      price: 8200,
      categoryId: 1,
      articleId: 1,
    },
    // Mainboards
    {
      name: "ASUS PRIME B760M",
      type: "MB",
      socket: "LGA1700",
      specs: JSON.stringify({ ramType: "DDR5", maxRam: 128 }),
      imageUrl: "/components/mb-asus.png",
      description: "Mainboard Intel B760 chipset",
      price: 4500,
      categoryId: 3,
      articleId: 5,
    },
    {
      name: "MSI B650M PRO",
      type: "MB",
      socket: "AM5",
      specs: JSON.stringify({ ramType: "DDR5", maxRam: 128 }),
      imageUrl: "/components/mb-msi.png",
      description: "Mainboard AMD B650 chipset",
      price: 4800,
      categoryId: 3,
      articleId: 5,
    },
    // RAM
    {
      name: "Kingston Fury 16GB DDR5",
      type: "RAM",
      specs: JSON.stringify({ size: 16, type: "DDR5", speed: 5600 }),
      imageUrl: "/components/ram-kingston.png",
      description: "RAM DDR5 16GB ความเร็ว 5600MHz",
      price: 2200,
      categoryId: 2,
      articleId: 2,
    },
    // GPU
    {
      name: "NVIDIA RTX 4060",
      type: "GPU",
      specs: JSON.stringify({ vram: 8, tdp: 115 }),
      imageUrl: "/components/gpu-rtx4060.png",
      description: "การ์ดจอเล่นเกม 1080p ลื่นๆ",
      price: 11500,
      categoryId: 4,
    },
    // PSU
    {
      name: "Corsair RM650",
      type: "PSU",
      specs: JSON.stringify({ watt: 650, efficiency: "80+ Gold" }),
      imageUrl: "/components/psu-corsair.png",
      description: "พาวเวอร์ 650W 80+ Gold",
      price: 3500,
      categoryId: 6,
    },
    // Storage
    {
      name: "Samsung 980 1TB NVMe",
      type: "STORAGE",
      specs: JSON.stringify({ size: 1000, type: "NVMe" }),
      imageUrl: "/components/ssd-samsung.png",
      description: "SSD NVMe 1TB อ่านเร็ว 3500MB/s",
      price: 2800,
      categoryId: 5,
    },
    // Cooler
    {
      name: "DeepCool AK400",
      type: "COOLER",
      specs: JSON.stringify({ tdpSupport: 220, height: 155 }),
      imageUrl: "/components/cooler-deepcool.png",
      description: "ชุดระบายความร้อน CPU air cooler",
      price: 1200,
      categoryId: 7,
    },
  ]

  for (const c of components) {
    await prisma.component.create({ data: c })
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
