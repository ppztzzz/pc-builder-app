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
  // ARTICLES — 8 deep guides + 6 short news = 14 entries
  // ========================
  await prisma.articleImage.deleteMany()
  await prisma.article.deleteMany()

  // Available cover images (re-used across articles when needed)
  const IMG = {
    cpu1: "1776649979_1126_unnamed.jpg",
    cpu2: "1776649979_3475_unnamed (1).jpg",
    cpu3: "1776649979_5368_unnamed (2).jpg",
    ram1: "1776668021_2799_175679759168b69a9787e51.jpg",
    ram2: "1776668021_9373_1756797521.jpg",
    ram3: "1776668021_4865_843591021340-content2.jpg",
    ram4: "1776668021_5019_001-show-ram.jpg",
    mb1: "1776669916_1886_1761551329.jpg",
    mb2: "1776669916_2794_1761550624.jpg",
    mb3: "1776669916_1845_1761550625.jpg",
    mb4: "1776669916_7432_1761551320.jpg",
  }

  const articles = [
    // ===== ARTICLES (deep guides) =====
    {
      id: 1,
      title: "CPU คืออะไร — รู้จักสมองของคอมพิวเตอร์",
      excerpt: "หน่วยประมวลผลกลาง สมองของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งทั้งหมด",
      content:
        "CPU มีชื่อเต็มๆ ว่า Central Processing Unit ถ้าแปลตามชื่อก็คือหน่วยประมวลผลกลาง CPU คืออุปกรณ์ชิ้นเล็กๆ ที่ทำหน้าที่ประมวลผลข้อมูลหรือชุดคำสั่งต่างๆ\n\nถ้าจะให้ยกตัวอย่างง่ายๆ เทียบกับร่างกายของคนเราแล้วล่ะก็ CPU ก็เปรียบเหมือนกับสมอง ที่เป็นศูนย์กลางในการควบคุมคำสั่งต่างๆ ไม่ว่าจะเป็นเดิน วิ่ง นั่ง นอน คอมพิวเตอร์เองก็เช่นเดียวกัน แค่เปิดเครื่องขึ้นมา ซีพียูก็เริ่มทำงานแล้ว\n\nCPU ในปัจจุบันมีสองค่ายหลัก: Intel และ AMD โดยทั้งสองค่ายผลิต CPU ที่มีจำนวน core และ thread ต่างกัน ยิ่งจำนวนสูงยิ่งทำงานหลายอย่างพร้อมกันได้ดี",
      type: "ARTICLE",
      isFeatured: true,
      categoryId: 1,
      images: [IMG.cpu1, IMG.cpu2, IMG.cpu3],
    },
    {
      id: 2,
      title: "วิธีเลือก CPU ให้เหมาะกับการใช้งานของคุณ",
      excerpt: "เลือก CPU แบบไหนดี? ตามงานที่ทำ — ออฟฟิศ เกม ตัดต่อ สตรีม",
      content:
        "การเลือก CPU ไม่ใช่แค่ดูราคาแพงสุด แต่ต้องดูว่าใช้งานอะไร\n\n💼 ใช้งานทั่วไป (Office, Browse): CPU 4-6 cores พอ ราคาประหยัด เช่น Intel i3 / AMD Ryzen 3\n\n🎮 เล่นเกม: 6-8 cores ความเร็วสูง (boost clock 4.5GHz+) เช่น Intel i5-13400, AMD Ryzen 5 7600X\n\n✂️ ตัดต่อวิดีโอ + สตรีม: 12+ cores เน้น multi-thread เช่น Intel i7/i9, AMD Ryzen 7/9\n\n🎨 งาน 3D / AI: 16+ cores มากกว่า เช่น Threadripper, Xeon\n\nนอกจาก cores ดู TDP (กินไฟ) ด้วย CPU TDP สูงกินไฟเยอะ ต้องเตรียม PSU + cooler รับให้ไหว",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 1,
      images: [IMG.cpu2],
    },
    {
      id: 3,
      title: "RAM คืออะไร? ทำไมเราถึงต้องการมัน",
      excerpt: "หน่วยความจำหลักของคอมพิวเตอร์ พื้นที่พักข้อมูลชั่วคราวระหว่างทำงาน",
      content:
        "RAM (Random Access Memory) เป็นหน่วยความจำหลักที่ทำหน้าที่รับข้อมูลจากโปรแกรมต่างๆ เพื่อรอส่งไปประมวลผลไปยังซีพียู เปรียบเสมือนพื้นที่พักชั่วคราว\n\nเมื่อปิดเครื่อง ข้อมูลใน RAM จะหายไปหมด เปิดใหม่ RAM จะดึงข้อมูลจาก SSD/HDD มาพักไว้รอให้ CPU ใช้งาน\n\nRAM ในปัจจุบันมีตั้งแต่ 4GB - 64GB การเลือกขนาดควรดูตามการใช้งาน:\n- Office, Browse: 8GB พอ\n- เล่นเกม: 16GB ขั้นต่ำ\n- ตัดต่อ/3D: 32GB ขึ้นไป\n\nนอกจากขนาด ดูประเภท (DDR4, DDR5) และความเร็ว (MHz) ด้วย",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 2,
      images: [IMG.ram1, IMG.ram2, IMG.ram3, IMG.ram4],
    },
    {
      id: 4,
      title: "DDR4 vs DDR5 ต่างกันยังไง? เลือกแบบไหนดี",
      excerpt: "DDR5 ใหม่กว่า เร็วกว่า แต่แพงกว่า — เปรียบเทียบให้เห็นภาพ",
      content:
        "DDR5 เป็นมาตรฐาน RAM รุ่นใหม่ที่มาแทน DDR4 ความแตกต่างหลัก:\n\n⚡ ความเร็ว: DDR4 เริ่ม 2133MHz สูงสุด 3200MHz ทั่วไป // DDR5 เริ่ม 4800MHz ปัจจุบันถึง 8000MHz\n\n🔋 แรงดันไฟ: DDR4 ใช้ 1.2V // DDR5 ใช้ 1.1V — กินไฟน้อยกว่า\n\n💾 ความจุต่อแถว: DDR4 สูงสุด 32GB ต่อแถว // DDR5 สูงสุด 128GB ต่อแถว\n\n💰 ราคา: DDR5 แพงกว่าประมาณ 30-50%\n\n🔌 Compatibility: ใช้ slot คนละแบบ ไม่สามารถเอา DDR4 ใส่ slot DDR5 ได้ ต้องดู mainboard ว่ารองรับอะไร\n\nสรุป: ถ้าประกอบเครื่องใหม่ ใช้ DDR5 คุ้มกว่าระยะยาว ถ้าอัพเกรด PC เก่าที่ใช้ DDR4 ไม่จำเป็นต้องเปลี่ยน",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 2,
      images: [IMG.ram2],
    },
    {
      id: 5,
      title: "เมนบอร์ด คืออะไร — บ้านของชิ้นส่วนคอมพิวเตอร์",
      excerpt: "แผงวงจรหลักที่เชื่อมต่อทุกชิ้นส่วนของคอมพิวเตอร์เข้าด้วยกัน",
      content:
        "เมนบอร์ด เป็นแผงวงจรหลักของคอมพิวเตอร์ เป็นที่อยู่ของซีพียู แรม การ์ดจอ และอุปกรณ์จัดเก็บข้อมูลอย่าง HDD และ SSD\n\nหน้าที่ของมันเปรียบเสมือนเป็นบ้านของอุปกรณ์เหล่านี้ ให้ชิ้นส่วนต่างๆ ของคอมพิวเตอร์ทำงานประสานกันเป็นอย่างดี\n\nสิ่งที่ต้องดูเมื่อเลือกเมนบอร์ด:\n- 🔌 Socket: ต้องตรงกับ CPU (LGA1700 สำหรับ Intel 12-14 gen, AM5 สำหรับ AMD ล่าสุด)\n- 💾 RAM Type: รองรับ DDR4 หรือ DDR5\n- 📐 Form Factor: ATX, Micro-ATX, Mini-ITX (ขนาดต่าง)\n- 🔧 Chipset: B760, Z790, B650, X670 (กำหนด feature และราคา)",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 3,
      images: [IMG.mb1, IMG.mb2, IMG.mb3, IMG.mb4],
    },
    {
      id: 6,
      title: "Form Factor ของเมนบอร์ด: ATX, Micro-ATX, Mini-ITX",
      excerpt: "ขนาดของเมนบอร์ดมีผลกับเคส, port และความสามารถในการอัพเกรด",
      content:
        "เมนบอร์ดมี form factor หลักๆ 3 แบบ:\n\n📦 ATX (305 × 244mm)\n- ขนาดมาตรฐาน เต็มพิกัด\n- มี slot RAM 4 ช่อง, PCIe หลายช่อง\n- เหมาะกับเครื่องเล่นเกมจริงจัง / workstation\n- ต้องใช้เคส mid-tower ขึ้นไป\n\n📦 Micro-ATX (244 × 244mm)\n- ขนาดกลาง\n- RAM 4 ช่อง, PCIe 1-2 ช่อง\n- ราคาประหยัด, เคสเล็กกว่า\n- เหมาะกับงานทั่วไปและเล่นเกมได้\n\n📦 Mini-ITX (170 × 170mm)\n- ขนาดเล็กสุด\n- RAM 2 ช่องเท่านั้น, PCIe 1 ช่อง\n- เคส SFF (Small Form Factor) สวยงามตั้งโต๊ะ\n- ราคาแพงกว่าเพราะอุปกรณ์เฉพาะทาง\n\nเลือกตามขนาดเคสและความต้องการ port",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 3,
      images: [IMG.mb3],
    },
    {
      id: 7,
      title: "การ์ดจอ (GPU) คืออะไร — มากกว่าแค่เล่นเกม",
      excerpt: "หน่วยประมวลผลกราฟิก ทำหน้าที่ render ภาพและทำงาน parallel",
      content:
        "GPU (Graphics Processing Unit) คือ chip เฉพาะทางสำหรับประมวลผลกราฟิก ในปัจจุบันใช้ในงานหลายอย่าง:\n\n🎮 เล่นเกม: GPU ทำงานหนักสุด render frame ต่อวินาที\n🎬 ตัดต่อวิดีโอ: เร่งการ encode/decode\n🤖 AI/Machine Learning: training neural networks\n💎 3D Modeling, CAD: render scenes\n🪙 Crypto mining (ในอดีต)\n\nGPU มี 2 แบบ:\n1. iGPU (Integrated): อยู่ใน CPU เลย เช่น Intel UHD, AMD Radeon Vega — ฟรี แต่แรงต่ำ\n2. dGPU (Discrete): การ์ดจอแยก เสียบใน slot PCIe เช่น NVIDIA RTX, AMD Radeon RX — แรงกว่ามาก\n\nค่ายหลัก: NVIDIA (RTX series) และ AMD (Radeon RX series)",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 4,
      images: [IMG.cpu3],
    },
    {
      id: 8,
      title: "SSD vs HDD: เลือกแบบไหนดี?",
      excerpt: "SSD เร็วกว่า ทนกว่า แต่ HDD ราคาคุ้มกว่าเมื่อต้องการพื้นที่เยอะ",
      content:
        "SSD (Solid State Drive) และ HDD (Hard Disk Drive) เป็นที่เก็บข้อมูลที่ต่างกันมาก\n\n⚡ HDD\n- ใช้แผ่นจานหมุน + หัวอ่าน\n- ความเร็วอ่านเขียน: 80-160 MB/s\n- ราคาถูก: 500GB ~700 บาท, 1TB ~1,200 บาท\n- ความจุเยอะ ถึง 20TB\n- มีเสียง, สั่นสะเทือนกระทบได้\n\n🚀 SSD\n- Chip flash memory ไม่มีชิ้นส่วนเคลื่อนไหว\n- ความเร็ว: SATA SSD ~550MB/s, NVMe SSD 3,500-7,000+MB/s\n- ราคา: 500GB SATA ~1,500 บาท, 1TB NVMe ~3,000 บาท\n- ความจุสูงสุดต่อตัว 8TB\n- เงียบ ทนต่อการกระแทก\n\n💡 แนะนำ: SSD สำหรับ OS + โปรแกรม (1TB), HDD สำหรับเก็บไฟล์ใหญ่ (4TB+)",
      type: "ARTICLE",
      isFeatured: false,
      categoryId: 5,
      images: [IMG.ram4],
    },

    // ===== NEWS (short updates) =====
    {
      id: 9,
      title: "Intel เปิดตัว Core Ultra 9 285K รุ่นเรือธง",
      excerpt: "CPU desktop รุ่นใหม่ 24 cores พื้นฐาน 3.7GHz boost 5.7GHz",
      content:
        "Intel เปิดตัว Core Ultra 9 285K วันนี้ ตัวเรือธง Arrow Lake แทน i9-14900K\n\nสเปก:\n- 24 cores (8P + 16E)\n- Base 3.7GHz / Boost 5.7GHz\n- TDP 125W\n- ใช้ socket LGA1851 ใหม่ (เปลี่ยนจาก LGA1700)\n- รองรับ DDR5-6400 native\n- ราคาเปิดตัว $589\n\nต้องเปลี่ยน mainboard ใหม่เป็น Z890 chipset",
      type: "NEWS",
      isFeatured: false,
      categoryId: 1,
      images: [IMG.cpu1],
    },
    {
      id: 10,
      title: "AMD ลดราคา Ryzen 7 7800X3D 20%",
      excerpt: "CPU เกมเมอร์ตัวท็อปลดเหลือ 12,500 บาท จากเดิม 16,500 บาท",
      content:
        "AMD ประกาศลดราคา Ryzen 7 7800X3D สำหรับตลาดเอเชียแปซิฟิก หลังเตรียมเปิดตัว 9800X3D\n\nราคาใหม่: 12,500 บาท (จาก 16,500 บาท)\n\n7800X3D ยังเป็น CPU เกมที่ดีที่สุดตัวหนึ่งในขณะนี้ ด้วย 3D V-Cache 96MB ช่วยเพิ่ม FPS เกมหลายตัว 10-20% เทียบกับ 7800X\n\nโปรโมชั่นถึงสิ้นเดือน มีจำนวนจำกัด",
      type: "NEWS",
      isFeatured: false,
      categoryId: 1,
      images: [IMG.cpu2],
    },
    {
      id: 11,
      title: "G.Skill เปิดตัว DDR5-9000 ทำลายสถิติความเร็ว",
      excerpt: "Trident Z5 RGB ทำความเร็ว 9000MHz CL44 — เร็วที่สุดในตลาดเชิงพาณิชย์",
      content:
        "G.Skill ประกาศวางขาย Trident Z5 RGB DDR5-9000 ขนาด 16GB×2\n\nสเปก:\n- ความเร็ว 9000 MT/s\n- CL 44-58-58-128\n- 1.45V\n- รองรับ Intel Z790/Z890 ที่ใช้ XMP 3.0\n\nราคา ~22,000 บาท ต่อชุด — สำหรับสาย overclock จริงจัง\n\nต้องการ mainboard และ CPU ที่รองรับความเร็วสูงด้วย",
      type: "NEWS",
      isFeatured: false,
      categoryId: 2,
      images: [IMG.ram1],
    },
    {
      id: 12,
      title: "NVIDIA ประกาศ RTX 5090 เปิดตัวต้นปี 2026",
      excerpt: "การ์ดจอเรือธงรุ่นใหม่ ใช้สถาปัตยกรรม Blackwell — VRAM 32GB",
      content:
        "NVIDIA ยืนยันเปิดตัว RTX 5090 ในงาน CES 2026\n\nสเปกที่ลือ:\n- GDDR7 32GB\n- 21,760 CUDA cores\n- TDP 575W (เพิ่มจาก 4090 ที่ 450W)\n- รองรับ DisplayPort 2.1\n- ราคาเริ่มต้น $1,999\n\nต้องใช้ PSU 1000W+ และเคสที่รองรับการ์ดยาว 320mm",
      type: "NEWS",
      isFeatured: false,
      categoryId: 4,
      images: [IMG.mb2],
    },
    {
      id: 13,
      title: "Samsung 990 EVO Plus 4TB วางจำหน่ายแล้ว",
      excerpt: "NVMe Gen5 ความจุ 4TB ความเร็วอ่าน 7,250MB/s ราคา 14,900 บาท",
      content:
        "Samsung เปิดตัว 990 EVO Plus 4TB SSD ใหม่ล่าสุด\n\nสเปก:\n- Interface: PCIe Gen5 x4 NVMe 2.0\n- อ่าน 7,250 MB/s, เขียน 6,900 MB/s\n- DRAM 4GB, TBW 2,400 TB\n- รับประกัน 5 ปี\n\nราคา 14,900 บาท สำหรับ 4TB — ราคาต่อ GB ดีที่สุดในกลุ่ม Gen5\n\nเหมาะกับงาน video editing และ AI training",
      type: "NEWS",
      isFeatured: false,
      categoryId: 5,
      images: [IMG.ram3],
    },
    {
      id: 14,
      title: "Noctua ประกาศ NH-D15 G2 ระบายความร้อนรุ่นใหม่",
      excerpt: "Air cooler รุ่นใหม่ในตำนาน — ระบายความร้อนได้ดีขึ้น 8%",
      content:
        "Noctua เปิดตัว NH-D15 G2 รุ่นที่ 2 ของ flagship air cooler\n\nสิ่งที่อัพเกรด:\n- Heat pipes 7 แท่ง (เพิ่มจาก 6)\n- Fan NF-A14x25 G2 ใหม่ — เงียบกว่า\n- Mount support socket ใหม่ทุกค่าย\n- รองรับ TDP สูงสุด 280W (เพิ่มจาก 240W)\n\nราคา 4,900 บาท — แพงกว่าตัวเก่าเล็กน้อย แต่ประสิทธิภาพดีกว่าทั้ง air cooler ปัจจุบัน\n\nสีน้ำตาล signature ของ Noctua ยังคงอยู่",
      type: "NEWS",
      isFeatured: false,
      categoryId: 7,
      images: [IMG.mb4],
    },
  ]

  for (const a of articles) {
    const { images, ...articleData } = a
    await prisma.article.create({ data: articleData })
    for (let i = 0; i < images.length; i++) {
      await prisma.articleImage.create({
        data: {
          articleId: a.id,
          image: images[i],
          isCover: i === 0,
        },
      })
    }
  }
  const articleCount = articles.filter((a) => a.type === "ARTICLE").length
  const newsCount = articles.filter((a) => a.type === "NEWS").length
  console.log(`✅ Articles: ${articleCount} guides + ${newsCount} news = ${articles.length}`)

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
      price: 2200, categoryId: 2, articleId: 3 },
    { id: 302, name: "G.Skill Trident Z5 32GB DDR5-6000", type: "RAM",
      specs: { size: 32, type: "DDR5", speed: 6000 },
      imageUrl: "/components/ram-gskill-32.png",
      description: "32GB (2×16) DDR5 6000MHz CL30",
      price: 4500, categoryId: 2, articleId: 4 },
    { id: 303, name: "Corsair Vengeance 16GB DDR4-3200", type: "RAM",
      specs: { size: 16, type: "DDR4", speed: 3200 },
      imageUrl: "/components/ram-corsair-16.png",
      description: "16GB (2×8) DDR4 3200MHz — สำหรับ board รุ่นเก่า",
      price: 1500, categoryId: 2, articleId: 4 },

    // GPUs (4)
    { id: 401, name: "NVIDIA RTX 4060", type: "GPU",
      specs: { vram: 8, tdp: 115 },
      imageUrl: "/components/gpu-rtx-4060.png",
      description: "8GB VRAM เล่นเกม 1080p ลื่นๆ",
      price: 11500, categoryId: 4, articleId: 7 },
    { id: 402, name: "NVIDIA RTX 4070", type: "GPU",
      specs: { vram: 12, tdp: 200 },
      imageUrl: "/components/gpu-rtx-4070.png",
      description: "12GB VRAM 1440p high settings",
      price: 22000, categoryId: 4, articleId: 7 },
    { id: 403, name: "NVIDIA RTX 4080", type: "GPU",
      specs: { vram: 16, tdp: 320 },
      imageUrl: "/components/gpu-rtx-4080.png",
      description: "16GB VRAM 4K gaming",
      price: 42000, categoryId: 4, articleId: 7 },
    { id: 404, name: "AMD Radeon RX 7600", type: "GPU",
      specs: { vram: 8, tdp: 165 },
      imageUrl: "/components/gpu-rx-7600.png",
      description: "8GB VRAM เกม 1080p — สาย AMD",
      price: 9800, categoryId: 4, articleId: 7 },

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
      price: 2800, categoryId: 5, articleId: 8 },
    { id: 602, name: "WD Black SN850X 2TB", type: "STORAGE",
      specs: { size: 2000, type: "NVMe" },
      imageUrl: "/components/storage-wd-black-2tb.png",
      description: "2TB NVMe Gen4 7300MB/s — gaming",
      price: 6500, categoryId: 5, articleId: 8 },
    { id: 603, name: "Crucial MX500 500GB SATA", type: "STORAGE",
      specs: { size: 500, type: "SATA" },
      imageUrl: "/components/storage-crucial-500.png",
      description: "500GB SATA — งบประหยัด",
      price: 1300, categoryId: 5, articleId: 8 },

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
