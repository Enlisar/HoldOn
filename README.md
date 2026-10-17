# HoldOn (Circular Lens) 🌿⏸️

> **Think before you click buy.**  
> A cross-browser extension for **Chromium** (Chrome, Edge, Brave, Opera) and **Firefox** that intervenes on e-commerce product pages (Amazon.in & Flipkart) to calculate **True Ownership Cost**, assess **Repairability**, guide **Mindful Purchasing Decisions**, connect shoppers with **Delhi NCR Circular Hubs**, and enforce a **30-Day Impulse Pause Shield**.

Designed with **Calm Minimalism** using **WXT**, **React 19**, **TypeScript**, **Tailwind CSS**, and **xAI Grok API**.

---

## 🎨 Calm Minimalist Design System

Built with a warm, restrained palette — sustainable without looking preachy:

| Role | Color | Hex Code | Usage |
|---|---|---|---|
| **Base Surface** | Warm ivory | `#F7F6F0` | Primary background, card foundation |
| **Ink & Text** | Forest charcoal | `#252923` | Headings, primary text, dark buttons |
| **Mindful Green** | Soft sage | `#A7B79B` | High repairability, sustainable highlights, icons |
| **Cool-Off Amber** | Warm amber | `#D9A66B` | 30-Day pause shield, moderate scores |
| **Subtle Divider** | Soft stone | `#E9E7E0` | Borders, subtle card backings, secondary chips |
| **Caution** | Muted terracotta | `#B96C60` | Low repairability warnings, unrepairable flags |

- **Typography**: Inter / Geist clean sans-serif
- **Corner Radius**: 12–16 px (`rounded-xl` / `rounded-2xl`)
- **Shadows**: Subtle, ambient, soft drop-shadows
- **Icons**: Clean outline icons (`strokeWidth={1.5}`)

---

## 🚀 Features (Core Working Preserved 100%)

### 1. Isolated Content Script (Amazon.in & Flipkart)
- Runs on product pages within a scoped **Shadow DOM** so styles never clash with host page CSS.
- Automatically scrapes product title, live price, category breadcrumbs, rating, and product image.
- Minimizable to a discreet pill (`HoldOn • Score X/10`) in the bottom-right corner.

### 2. True Cost Scorecard
- **Estimated Lifespan** (e.g. 1.5 - 2 Years for earbuds vs 8 - 12 Years for power tools).
- **Repairability Score (1 to 10)** with color-coded gauge (Poor, Fair, Moderate, Good, Exceptional).
- **1-Year Resale Value** & depreciation percentage.
- **Cost-Per-Month & Cost-Per-Use** breakdowns.
- **Carbon Footprint Estimate** (kg CO₂e embodied emissions).
- **Component Factor Breakdown**: Audits battery replaceability, spare parts availability, modularity, and casing construction.
- **Circular & Modular Alternatives**: Recommends durable alternatives (e.g. Fairphone, Framework, certified refurbished).

### 3. Interactive Decision Tree ("Should I Buy This?")
- **5 Guided Mindfulness Questions**:
  1. *Do you already own something that does a similar job?*
  2. *How often do you realistically expect to use this?*
  3. *Is this replacing a broken item?*
  4. *Are you buying it mainly because it's on sale or trending?*
  5. *Could you borrow, rent, or buy this second-hand?*
- **Actionable Circular Recommendations**:
  - 🔧 **Attempt Repair First** (Links directly to local repair shops)
  - 🤝 **Borrow or Rent** (Highlights nearby tool libraries & rental hubs)
  - 🔄 **Buy Refurbished / Second-Hand** (Directs to verified refurb shops)
  - ⏸️ **Activate 30-Day Cool Off** (Saves item to Pause List)
  - ❌ **Skip This Purchase** (Celebrates money saved)
  - ✅ **Proceed Mindfully** (Maintenance guide for high-utility goods)

### 4. Delhi NCR Circular Hubs (One City Focused)
Preloaded with 8 verified circular economy hubs across South, Central, and West Delhi & NCR:
- **Nehru Place Hardware Lab**: Laptops, displays, and motherboard micro-soldering (`Repair`)
- **Gaffar Market Karol Bagh**: Smartphones, earbuds, and batteries (`Repair`)
- **Lajpat Nagar Central Market**: Garments, seam mending, boots, and soling (`Repair`)
- **Savitri Home Appliance GK-1**: Blenders, mixers, and kitchen appliances (`Repair`)
- **Clothes Box Foundation Gurugram**: Pre-loved apparel and upcycled fashion (`Second-Hand`)
- **Cashify Refurbished MegaMart CP**: Certified pre-owned phones & tech (`Second-Hand`)
- **Delhi MakerSpace Okhla**: Power drills, saws, and DIY tool rental (`Borrow / Rent`)
- **GreenZon E-Waste Mayapuri**: Certified electronic waste disposal (`Recycle`)

Includes distance in km, opening hours, verified badges, and a 1-click **"Directions"** button that opens Google Maps.

### 5. 30-Day Impulse Pause Shield
- Save products with a personal reflection note (*"Why do I want this right now?"*).
- 30-day live countdown timer.
- Actions: **"I Skipped It! 🎉"** or **"Original Link"**.
- Real-time impact tracker displaying **Total Money Saved (₹)** and **Embodied Carbon Diverted (kg CO₂)**.

### 6. Grok API Integration
- Multi-tier intelligence: Calls live xAI Grok API when configured, with seamless fallback to our built-in benchmark engine for 30+ product categories.
- Enter your Grok API key in the **Settings** tab and test connection instantly.

---

## 📦 How to Load and Test

### 1. Build Production Extension
```powershell
npm run build
```
Compiled output is saved in:
- Chromium (Chrome, Brave, Edge): [`.output/chrome-mv3`](file:///d:/Coding/shunya/.output/chrome-mv3)
- Firefox: [`.output/firefox-mv2`](file:///d:/Coding/shunya/.output/firefox-mv2)

### 2. Install in Chrome / Brave / Edge
1. Navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the folder: `shunya/.output/chrome-mv3`.
5. Pin **HoldOn** in your browser toolbar.

### 3. Test on Amazon / Flipkart
1. Visit any product page on [Amazon.in](https://www.amazon.in) (e.g., search for any earbuds, jacket, phone, or drill).
2. The **HoldOn** card will automatically appear in the top-right corner with the True Cost Scorecard.
3. You can minimize it to a floating pill, take the Decision Tree quiz, explore Delhi repair hubs, or save items to the 30-day Pause List.
