# 🌾 FarmIntel (फार्मइंटेल) — AI-Powered Farm-to-Market Intelligence & Direct Trading Platform

FarmIntel connects Indian smallholder farmers directly with verified wholesale buyers, flour mills, FPOs, and processing units. It provides real-time mandi price intelligence, net profit realization calculation (factoring in haulage, toll, and mandi cess), computer-vision crop quality grading, bilateral offer negotiation, digital escrow protection, and integrated fleet dispatch.

---

## 📑 Table of Contents
1. [Platform Architecture & Personas](#1-platform-architecture--personas)
2. [End-to-End A to Z Workflow](#2-end-to-end-a-to-z-workflow)
   - [Phase A: Crop Harvest & AI Visual Quality Inspection](#phase-a-crop-harvest--ai-visual-quality-inspection-image-based)
   - [Phase B: Net Realisation & Mandi Price Arbitrage Analysis](#phase-b-net-realisation--mandi-price-arbitrage-analysis)
   - [Phase C: Optimal Selling Window & Weather Intelligence](#phase-c-optimal-selling-window--weather-intelligence)
   - [Phase D: Direct Buyer Discovery & Proposal Dispatch](#phase-d-direct-buyer-discovery--proposal-dispatch)
   - [Phase E: Bilateral Counter-Bidding & Binding Contract Lock](#phase-e-bilateral-counter-bidding--binding-contract-lock)
   - [Phase F: Automated Escrow Deposit](#phase-f-automated-escrow-deposit)
   - [Phase G: Fleet Assignment & GPS Logistics Transit](#phase-g-fleet-assignment--gps-logistics-transit)
   - [Phase H: Delivery Confirmation & Escrow Fund Release](#phase-h-delivery-confirmation--escrow-fund-release)
   - [Phase I: Itemized Financial Settlement & Tax Invoicing](#phase-i-itemized-financial-settlement--tax-invoicing)
   - [Phase J: Multilingual AI Advisory (Gemini + Offline Agronomy)](#phase-j-multilingual-ai-advisory-gemini--offline-agronomy)
3. [🖼️ Image-Based Quality Examination: How It Works & How to Open It](#3-🖼️-image-based-quality-examination-how-it-works--how-to-open-it)
   - [Step 1: Navigating to the Image Inspection Interface](#step-1-navigating-to-the-image-inspection-interface)
   - [Step 2: Uploading Produce Photos or Selecting Standard Samples](#step-2-uploading-produce-photos-or-selecting-standard-samples)
   - [Step 3: What the Computer Vision Engine Inspects](#step-3-what-the-computer-vision-engine-inspects)
   - [Step 4: Interpreting the Visual Assistance Output](#step-4-interpreting-the-visual-assistance-output)
   - [Step 5: Attaching Verified Grade to Marketplace Lots](#step-5-attaching-verified-grade-to-marketplace-lots)
4. [Interactive 2-Sided Demo Workflow Assistant](#4-interactive-2-sided-demo-workflow-assistant)
5. [Local Development & Deployment](#5-local-development--deployment)
6. [API Endpoints Reference](#6-api-endpoints-reference)

---

## 1. Platform Architecture & Personas

FarmIntel operates with two interconnected personas preloaded for zero-friction evaluation:

| Persona | Name | Role & Entity | Location | Primary Assets / Quota |
|---|---|---|---|---|
| **Farmer** | **Ramesh Kumar** | Smallholder Producer / Kisan | Danapur Rural, Patna, Bihar | 50 Quintals Grade A Sharbati Wheat |
| **Buyer** | **ABC Foods Pvt. Ltd.** | Verified Institutional Processor & Mill | Industrial Area, Patna, Bihar | Trust Score 4.8/5 • 1,500 Q Procurement Quota |
| **Admin** | **Mandi Regulator** | Quality Inspector & Dispute Officer | Regional Agriculture Board | Mandi surveillance, escrow oversight & dispute resolution |

---

## 2. End-to-End A to Z Workflow

```
[Phase A: Produce Photo & AI Grade] 
       │
       ▼
[Phase B: Net Profit Mandi Arbitrage] ──► [Phase C: 7-Day Selling Window]
       │
       ▼
[Phase D: Farmer Dispatches Offer to Buyer] 
       │
       ▼
[Phase E: Buyer Counter-Bids or Accepts] ──► Legal Contract (FI-2026-0001)
       │
       ▼
[Phase F: Buyer Deposits Funds into Escrow]
       │
       ▼
[Phase G: Farmer Assigns Fleet & Dispatches Cargo (BR-01-GB-4421)]
       │
       ▼
[Phase H: Cargo Arrives at Mill & Buyer Releases Escrow]
       │
       ▼
[Phase I: Instant Bank Credit, Mandi Cess, & Digital Tax Receipt]
```

### Phase A: Crop Harvest & AI Visual Quality Inspection (Image-Based)
- The farmer accesses **Crop Quality Assistance** from the navigation bar or dashboard action card.
- Photographs of the produce lot (or sample presets like Sharbati Wheat, Hybrid Tomato, Yellow Maize, or Kufri Potato) are submitted for visual analysis.
- The system estimates grain luster, moisture threshold compliance, color uniformity, and defect percentages, classifying the produce into Grade A, B, or C.
- The certified grade is attached directly to the lot listing to boost buyer credibility.

### Phase B: Net Realisation & Mandi Price Arbitrage Analysis
- Farmers frequently make the mistake of driving produce to distant mandis boasting high headline prices (e.g., Fatuha @ ₹2,480/Q), only to lose profit due to high diesel, tolls, and loading charges.
- FarmIntel calculates the **Net Realisation Formula**:
  $$\text{Net Realisation} = (\text{Quantity} \times \text{Mandi Price}) - \text{Haulage Cost} - \text{Mandi Cess (1\%)} - \text{Handling/Loading}$$
- In real time, the platform highlights that selling at **Patna Mandi (Bazar Samiti)** at ₹2,420/Q nets **₹1,90,560**—significantly higher than Fatuha at ₹2,480/Q which nets only **₹1,88,800** after transport penalties.

### Phase C: Optimal Selling Window & Weather Intelligence
- Machine learning models analyze 30-day arrival volume velocity, regional mill procurement backlogs, and precipitation forecasts.
- The farmer is provided an actionable recommendation (e.g., *"Sell within 2–3 days: peak processor inquiry active, zero rain forecast, transit routes clear"*).

### Phase D: Direct Buyer Discovery & Proposal Dispatch
- Under **Find Buyers**, Ramesh reviews verified buyers, their distance, trust score, verification badges, and accepted payment modalities.
- Ramesh selects **ABC Foods Pvt. Ltd.** and clicks **Send Direct Proposal**.
- Ramesh inputs trade terms: **50 Quintals of Wheat @ ₹2,400/Quintal** (Deal value: ₹1,20,000), selecting delivery at the buyer's processing warehouse in Patna.

### Phase E: Bilateral Counter-Bidding & Binding Contract Lock
- In the top banner, toggle the persona switcher to **ABC Foods Pvt. Ltd. (Buyer)**.
- Under **Farmer Proposals**, ABC Foods reviews Ramesh's proposal alongside his AI-verified Grade A quality certificate.
- ABC Foods can either accept the price immediately or submit a counter-offer (e.g., ₹2,380/Q with customized delivery window).
- When accepted by both parties, the system instantly executes a legally binding digital trade contract: **Contract #FI-2026-0001**.

### Phase F: Automated Escrow Deposit
- To prevent non-payment and default risk, ABC Foods places the total contract sum into **e-NAM digital escrow**:
  - Contract Value: **₹1,20,000.00**
  - Escrow Status: **FUNDS LOCKED IN ESCROW**
- Ramesh receives an instant notification that purchase capital is secured before dispatching any cargo.

### Phase G: Fleet Assignment & GPS Logistics Transit
- Under **Active Deals & Logistics**, Ramesh selects Deal #FI-2026-0001 and clicks **Assign Transport**.
- Vehicle details are logged: **Tata 407 (BR-01-GB-4421)**, Driver: **Suresh Singh**, Transit Route: *Danapur Rural → Danapur Cantt → Patna Bypass → ABC Foods Warehouse (28 km)*.
- Once dispatched, real-time GPS tracking status changes to **IN TRANSIT**.

### Phase H: Delivery Confirmation & Escrow Fund Release
- The truck arrives at ABC Foods Industrial Warehouse.
- ABC Foods verifies weighbridge tonnage (50 Quintals) and confirms quality match.
- ABC Foods clicks **Confirm Receipt & Release Escrow**.

### Phase I: Itemized Financial Settlement & Tax Invoicing
- Escrow funds are instantly disbursed via direct bank API / RTGS:
  - Gross Sale Proceeds: **₹1,20,000**
  - Logistics Deduction: **-₹2,400** (Direct carrier payout)
  - Mandi Cess (1%): **-₹1,200** (Govt. compliance transfer)
  - Net Credited to Farmer: **₹1,16,400**
- Both parties can view, print, or download the tamper-evident digital settlement receipt and export CSV ledgers for accounting.

### Phase J: Multilingual AI Advisory (Gemini + Offline Agronomy)
- Farmers can open **FarmIntel AI Assistant** at any time via the bottom floating button or header.
- Voice/text input is supported in **Hindi (हिन्दी)**, **English**, and **Hinglish**.
- The AI advisor leverages server-side Gemini (`gemini-3.8-flash`) grounded strictly in live mandi quotes, weather forecasts, and verified buyer inventories, preventing hallucinations.

---

## 3. 🖼️ Image-Based Quality Examination: How It Works & How to Open It

The **Crop Quality Assistance** module uses computer-vision models to assess crop lots before listing or shipment.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI CROP QUALITY SCANNER                         │
├──────────────────────────────┬─────────────────────────────────────────┤
│                              │  Grade: Grade A (Premium)               │
│   [ 📷 Uploaded Grain Photo ] │  Moisture: 11.2% (Dry & Transit Safe)   │
│   • Sharbati Gold Kernels    │  Color Uniformity: 94%                  │
│   • Uniform Amber Luster     │  Visible Defects: <2.1%                 │
│                              │  Value Uplift: +₹60/Q                   │
├──────────────────────────────┴─────────────────────────────────────────┤
│  Visual Observations:                                                  │
│  ✔ Plump, mature golden grain kernels with healthy uniform amber luster │
│  ✔ Visually indicates well-dried condition within safe moisture (<12%)  │
│  ✔ Very low visible chaff, broken grains, or pest discolouration       │
│                                                                        │
│  [Attach Grade to Crop Lot & View Listings →]                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Navigating to the Image Inspection Interface
There are two immediate ways to open the visual quality scanner:
1. **From Top Navigation Bar**: Click on **📷 AI Quality** (or **📷 AI क्वालिटी** in Hindi mode).
2. **From Farmer Home Dashboard**: Scroll down to the **Quick Actions** panel and click **Crop Quality (AI Inspection)** featuring the camera icon (`📷`).

### Step 2: Uploading Produce Photos or Selecting Standard Samples
- **Upload Your Own Produce Photo**: Click the purple **Upload Crop Photo** button to pick any image from your mobile device camera, tablet, or desktop filesystem (`.jpg`, `.jpeg`, `.png`, `.webp`).
- **Standard Pre-calibrated Presets**: Alternatively, click any of the one-touch benchmark samples:
  1. **Wheat (Sharbati Gold)** — Amber milling grain inspection.
  2. **Tomato (Abhinav Hybrid)** — Color maturity, turgor, and skin integrity inspection.
  3. **Maize / Corn (Yellow Feed)** — Kernel fullness and moisture drying check.
  4. **Potato (Kufri Jyoti)** — Shape regularity and skin blemish analysis.

### Step 3: What the Computer Vision Engine Inspects
When a photo is submitted, the image is processed server-side through Gemini Vision (`gemini-3.8-flash`) with structured output schema validation:
1. **Luster & Color Uniformity**: Analyzes chromatic distribution across grains or fruits to detect maturity and even sun-curing.
2. **Moisture Threshold Estimation**: Detects visual markers of moisture retention (e.g. shriveled vs. plump kernels, surface condensation).
3. **Defect & Foreign Matter Density**: Identifies broken grains, chaff, discolored tips, insect bores, or handling bruises.
4. **Variety Conformance**: Correlates visual parameters with crop standards (e.g. Sharbati Wheat, Abhinav Tomato).

### Step 4: Interpreting the Visual Assistance Output
The analysis card renders five distinct diagnostic elements:
- **Estimated Grade Badge**: Highlights `Grade A (Premium)`, `Grade B (Standard)`, or `Grade C`.
- **Key Metric Indicators**:
  - **Moisture Estimate**: Target is `<12.0%` for grains to ensure safe silo storage without mold risk.
  - **Color Uniformity Percentage**: Measures visual consistency (e.g. 94% indicates top-tier lot sorting).
  - **Visible Damage Percentage**: Quantifies defects (e.g. `<2.1%` meets institutional procurement tolerances).
- **Visual Observations**: Natural-language bullet points detailing why the model assigned the grade.
- **Suggested Commercial Category**: E.g. *"Premium Institutional Flour / Direct Processor Milling"*.
- **Market Value Uplift**: Illustrates the expected premium (e.g. `+₹60/Q Value Uplift`) over standard unclassified lots.
- **Strict Verification Notice**: Clear agricultural disclaimer reminding users that AI vision provides pre-screening and final physical inspection occurs at the weighbridge.

### Step 5: Attaching Verified Grade to Marketplace Lots
- Click **Attach Grade to Crop Lot & View Listings →**.
- This binds the AI inspection report directly to your active crop inventory so prospective buyers can inspect the quality report before submitting bids.

---

## 4. Interactive 2-Sided Demo Workflow Assistant

A persistent helper bar is mounted at the top of the interface to allow seamless demonstration of both sides of an agricultural transaction:

- **1-Click Persona Switcher**:
  - Switch to **ABC Foods (Buyer)** to review incoming proposals, negotiate bids, and release escrow funds.
  - Switch back to **Ramesh Kumar (Farmer)** to create proposals, review counter-offers, and assign transit logistics.
- **Scenario Reset Button**:
  - Click **Reset Scenario** to clear completed tests and restore the platform to its pristine demo state (Ramesh with 50 Q Wheat and ABC Foods ready to negotiate).
- **Quick Links**: Direct shortcuts to **Farmer Proposals**, **Active Deals**, and **Settlement Ledger**.

---

## 5. Local Development & Deployment

### Prerequisites
- Node.js 18+ or 20+
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation
```bash
# Clone the repository
git clone <repository_url>
cd farmintel

# Install dependencies
npm install

# Start local full-stack development server
npm run dev
```
The application will boot on **`http://localhost:3000`** with Express backend routes mounted alongside Vite SPA middleware.

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Optionally configure keys in `.env` (the platform includes built-in realistic mock engines for offline/zero-key demonstration):
```env
# Optional Gemini AI key for real-time generative responses
GEMINI_API_KEY=your_gemini_api_key_here

# Optional JWT secret for custom authentication
JWT_SECRET=your_custom_jwt_secret
```

---

## 6. API Endpoints Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check, server uptime, and database stats |
| `/api/auth/login` | `POST` | User authentication & JWT token dispatch |
| `/api/listings` | `GET`, `POST` | Fetch or create farmer crop listings |
| `/api/mandis` | `GET` | Live mandi pricing, distance matrix, and modal rates |
| `/api/recommendations/market` | `GET` | Compute best net profit mandi vs highest headline price |
| `/api/recommendations/selling-window` | `GET` | 7-day price trajectory & weather-adjusted selling window |
| `/api/ai/quality` | `POST` | Computer-vision crop quality grading from image input |
| `/api/ai/chat` | `POST` | Grounded multilingual agricultural advisory chatbot |
| `/api/offers` | `GET`, `POST` | Retrieve trade proposals or submit direct farmer offers |
| `/api/offers/:id/status` | `PUT` | Accept, counter-offer, or reject proposals |
| `/api/deals` | `GET`, `POST` | Fetch active trade contracts and escrow milestones |
| `/api/deals/:id/status` | `PUT` | Update escrow state (Funded, In Transit, Delivered, Settled) |
| `/api/deals/:id/assign-vehicle`| `POST` | Dispatch logistics fleet with vehicle and driver info |
| `/api/transactions` | `GET` | Itemized digital settlement history and payment hashes |
| `/api/demo/reset` | `POST` | Reset demo state to initial test conditions |

---

*Built with passion to empower smallholder Indian farmers with transparent market intelligence, fair pricing, and secure digital trade.*
