import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAI43FpDllHxvhW5myKdAkIbs5zAIEmDVw";
const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = join(process.cwd(), "public", "blog-images");

const STYLE = "Modern flat illustration, clean minimal style, warm green (#15803d) and cream (#faf8f0) color palette, professional fintech feel, no text, no watermarks, white background edges";

const ARTICLES: { slug: string; prompt: string }[] = [
  { slug: "1099-loans-complete-guide-gig-workers", prompt: "A gig worker reviewing a 1099 tax form next to a laptop showing a loan application, green checkmark, coins and dollar bills, financial documents" },
  { slug: "amazon-flex-loans-delivery-income", prompt: "Amazon delivery van and packages, a driver holding a phone with earnings displayed, cardboard boxes stacked, green money flowing" },
  { slug: "apr-explained-gig-workers-guide", prompt: "A percentage symbol (%) made of coins, calculator showing interest rates, magnifying glass examining fine print, clear and educational feel" },
  { slug: "bank-statement-loans-explained-gig-workers", prompt: "Bank statements and financial papers with highlighted deposit lines, a rubber stamp saying APPROVED in green, no W-2 form crossed out" },
  { slug: "cosigner-gig-worker-loan-pros-cons-risks", prompt: "Two people shaking hands over a loan document, one is a gig worker with a delivery bag, scales of justice showing pros and cons" },
  { slug: "credit-score-guide-1099-workers", prompt: "A credit score gauge/meter showing upward movement from red to green, 1099 form nearby, positive growth arrows" },
  { slug: "debt-to-income-ratio-gig-workers", prompt: "A balance scale with income on one side and expenses on the other, calculator, pie chart showing DTI ratio, clean infographic style" },
  { slug: "doordash-driver-loans-how-to-qualify", prompt: "DoorDash style food delivery person on a bike with insulated bag, phone showing earnings app, green loan approval badge" },
  { slug: "emergency-fund-gig-worker-how-to-build", prompt: "A piggy bank being filled with coins, safety net underneath, umbrella protecting money from rain, savings growth chart" },
  { slug: "emergency-loan-uber-driver", prompt: "A rideshare driver next to a car with an open hood (broken down), emergency money flying in to help, wrench and tools, urgent feel" },
  { slug: "fiverr-income-freelancer-personal-loans", prompt: "A creative freelancer at a desk with design tools, Fiverr-style gig icons (logo design, writing, video), money and loan approval" },
  { slug: "gig-work-retirement-savings-sep-ira-solo-401k", prompt: "Retirement nest egg with gold coins, calendar showing future dates, 401k and IRA labels, growing money tree, long-term planning" },
  { slug: "gig-worker-financial-planning-money-roadmap", prompt: "A road/path winding upward with financial milestones (savings, investing, loan payoff), map pin markers, mountain summit with dollar sign" },
  { slug: "gig-worker-guide-building-business-credit", prompt: "Building blocks stacking up to form a credit score tower, business card, green upward trend line, construction crane" },
  { slug: "gig-worker-insurance-what-you-need", prompt: "A shield protecting a gig worker, insurance policy document, car and health icons, safety umbrella, protective green barrier" },
  { slug: "gig-worker-tax-deductions-complete-list-2024", prompt: "A checklist with green checkmarks next to deduction items (car, phone, home office), money being saved, tax form with scissors cutting costs" },
  { slug: "gig-workers-business-loans-complete-guide", prompt: "A gig worker at a crossroads with multiple loan options ahead, signposts pointing to different loan types, briefcase and money" },
  { slug: "grubhub-doordash-ubereats-best-platform-drivers", prompt: "Three food delivery bags side by side in a comparison, VS text between them, rating stars, earnings charts comparing platforms" },
  { slug: "income-tax-basics-new-1099-workers-first-year", prompt: "A graduation cap on top of a 1099 tax form, first year calendar, beginner-friendly icons, step 1-2-3 markers, welcoming feel" },
  { slug: "loan-approval-tips-gig-workers", prompt: "A target/bullseye with a loan application hitting the center, green approval stamp, tips lightbulb, thumbs up, strategy board" },
  { slug: "lyft-vs-uber-which-pays-more-2024", prompt: "Two rideshare cars side by side, one pink-ish one black, dollar signs comparing earnings, trophy for the winner, racing feel" },
  { slug: "maximize-instacart-earnings-tips", prompt: "Shopping cart overflowing with groceries and money, upward earnings graph, smartphone with tips notification, star rating" },
  { slug: "non-qm-loans-self-employed-guide", prompt: "A door opening to reveal a loan opportunity, traditional bank door closed behind, alternative path forward, key unlocking" },
  { slug: "pennylime-vs-payday-loans-difference-matters", prompt: "Split comparison: left side dark and predatory (loan shark), right side bright green and friendly (handshake), clear winner" },
  { slug: "postmates-vs-doordash-delivery-drivers", prompt: "Two delivery bikes racing, food bags on each, stopwatch timing, comparison chart floating above, city street background" },
  { slug: "quarterly-taxes-gig-workers-guide", prompt: "Calendar with four quarters highlighted, tax payment envelopes, calculator, deadline clock, organized quarterly planning desk" },
  { slug: "refinancing-loan-gig-worker-when-how", prompt: "A loan document being refreshed/recycled into a better one, lower interest rate arrow, green improvement indicators, exchange arrows" },
  { slug: "rover-pet-sitter-loans-pet-care-income", prompt: "A happy pet sitter walking dogs in a park, money and earnings chart, dog leash and pet care items, green nature background" },
  { slug: "self-employed-health-insurance-gig-workers", prompt: "Health insurance card with a green cross, stethoscope, self-employed worker, medical protection shield, affordable care concept" },
  { slug: "shipt-shopper-loan-guide", prompt: "A grocery shopper in a store aisle with phone, shopping bags being delivered, earnings receipt, loan application flowing from phone" },
  { slug: "taskrabbit-taskers-financial-tips", prompt: "A handyman with tools (hammer, drill, paintbrush), money growing from completed tasks, task checkboxes, home service icons" },
  { slug: "thumbtack-pro-loans-home-services-business", prompt: "A home services pro (plumber/electrician) with tools, small business growth chart, loan funding flowing into equipment purchase" },
  { slug: "turo-host-loans-car-rental-income", prompt: "A shiny car with a FOR RENT sign and keys, passive income coins flowing in, car maintenance tools, host dashboard on phone" },
  { slug: "upwork-freelancers-loan-approval-contract-income", prompt: "A freelancer at a computer with contract documents, Upwork-style job milestones, payment flowing from completed projects to loan approval" },
  { slug: "what-happens-default-gig-worker-loan", prompt: "Warning triangle sign, loan document with red X, consequences path showing late fees and collections, but also a recovery path in green" },
];

async function generateOne(slug: string, prompt: string): Promise<boolean> {
  try {
    console.log(`[${slug}] generating...`);
    const r = await ai.models.generateImages({
      model: "imagen-4.0-fast-generate-001",
      prompt: `${STYLE}. ${prompt}`,
      config: { numberOfImages: 1, aspectRatio: "16:9" },
    });
    const img = r.generatedImages?.[0]?.image;
    if (img?.imageBytes) {
      await writeFile(join(OUTPUT_DIR, `${slug}.png`), Buffer.from(img.imageBytes, "base64"));
      console.log(`  OK`);
      return true;
    }
    console.log(`  EMPTY`);
    return false;
  } catch (e) {
    console.error(`  FAIL: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Generating ${ARTICLES.length} blog images...\n`);

  let ok = 0;
  for (const a of ARTICLES) {
    if (await generateOne(a.slug, a.prompt)) ok++;
    await new Promise((r) => setTimeout(r, 1500)); // rate limit
  }

  console.log(`\nDone: ${ok}/${ARTICLES.length}`);
}

main().catch(console.error);
