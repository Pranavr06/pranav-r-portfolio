const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const blogs = [
  {
    title: 'Are AI Coding Agents Actually Going to Replace Us? (A CS Student’s Perspective)',
    excerpt: 'With the rise of autonomous coding agents like Devin and advanced Copilots, the software engineering landscape is shifting. Here is why human architecture still matters.',
    read_time_minutes: 12,
    category: 'Software Engineering',
    image_url: '/assets/blog-1.webp',
    slug: 'ai-coding-agents-replacing-programmers',
    status: 'Published',
    content: The tech world in May 2026 was dominated by one overwhelming narrative: autonomous AI coding agents are here, and they are coming for our jobs. As a Computer Science and Information Science student, watching tools like Devin and advanced iterations of GitHub Copilot build entire applications from a single prompt is both awe-inspiring and deeply terrifying.

Are we studying for a profession that won't exist in five years?

After spending months integrating AI into my own workflow, building full-stack applications, and heavily utilizing machine learning, I’ve realized that the "death of the programmer" is vastly exaggerated. Here is my perspective on the future of software engineering.

## The Shift from Syntax to Systems

Historically, the value of a programmer was directly tied to their knowledge of syntax. If you knew how to write a Redux store from memory or configure Webpack without crying, you were highly valued. AI has completely commoditized syntax. Today, I don't memorize boilerplates; I just ask an AI agent to generate the scaffolding.

But here is what AI cannot do: **System Architecture and Contextual Empathy.**

When I was building the backend for my personal portfolio, I had to make decisions about Role-Based Access Control (RBAC). An AI can write the SQL query for me, but it doesn't intuitively know *why* my specific user base requires a strict separation between a 'public' schema and an 'auth' schema in Supabase. It doesn't know the business logic. It doesn't understand the nuance of human requirements.

## AI as a Multiplier, Not a Replacement

Think of AI coding agents like the invention of the calculator for mathematicians, or the spreadsheet for accountants. When Excel was invented, people panicked that accountants would be obsolete. Instead, accounting became more complex, more analytical, and more valuable.

In 2026, AI is a multiplier. A junior developer with AI can output the code volume of a mid-level developer. But if that junior developer lacks the fundamental understanding of underlying principles—like how a database index actually works, or how memory management impacts application scale—they will simply generate highly efficient garbage.

## What Should CS Students Do?

If you are a student right now, your strategy needs to pivot:
1.  **Stop memorizing syntax.** Focus heavily on System Design, Data Structures, and architectural patterns.
2.  **Learn to debug AI.** The most critical skill in 2026 is reading AI-generated code and spotting the subtle, confident errors it makes.
3.  **Build Soft Skills.** Translating vague human requirements into strict technical architecture is something an LLM still struggles with. 

The future belongs to the "AI-Enhanced Architect." We aren't being replaced; we are being promoted. The barrier to entry for building software has dropped to zero, but the barrier to building *good, scalable, secure* software remains as high as ever.
  },
  {
    title: 'The AI Misinformation Epidemic (And How We Fight Back)',
    excerpt: 'Deepfakes and AI-generated fake news are causing global chaos. Here is a look at the crisis, and the technical strategies required to detect deception at scale.',
    read_time_minutes: 13,
    category: 'Cybersecurity',
    image_url: '/assets/blog-2.webp',
    slug: 'ai-misinformation-epidemic-deepfakes',
    status: 'Published',
    content: We are living in an era where seeing is no longer believing. 

In June 2026, the internet reached a tipping point. The sheer volume of AI-generated content—hyper-realistic deepfakes, synthetic voice clones, and LLM-generated news articles—began to outpace human-generated content on several major platforms. The implications for democracy, financial markets, and personal reputation are catastrophic.

This isn't a theoretical threat anymore. It is an active, ongoing information war.

## The Anatomy of AI Misinformation

To understand how to fight fake news, we first have to understand how it's generated. Modern misinformation campaigns don't rely on humans typing out fake stories in basements. They utilize autonomous LLM pipelines that can scrape trending topics, generate inflammatory narratives tailored to specific psychographics, and deploy them across thousands of bot accounts in milliseconds.

The speed and scale of these attacks mean that human moderation is obsolete. By the time a human fact-checker flags a fabricated story, it has already been viewed millions of times. 

## Fighting AI with AI

During my internship at the Indian Institute of Computing and Technology (IICT), I was tasked with tackling this exact problem. I quickly realized that you cannot fight an automated AI threat with manual human intervention. You have to fight AI with AI.

Our approach wasn't to look at the *truthfulness* of the facts (which is incredibly hard for an algorithm to verify), but rather to look at the **linguistic DNA** of the text.

When LLMs or coordinated troll farms generate text, they leave behind subtle mathematical fingerprints. By utilizing Natural Language Processing (NLP) techniques like TF-IDF (Term Frequency-Inverse Document Frequency), we can map an article into a high-dimensional vector space. We aren't reading the words; we are analyzing the statistical distribution of the vocabulary.

## Why Simple Models Win

One of the biggest shocks during my research was discovering that we didn't need a massive, power-hungry Deep Neural Network to catch fake news. 

After processing nearly 40,000 articles, I trained multiple models. While Neural Networks performed well, a highly optimized **Logistic Regression** model achieved a staggering 99.02% accuracy. It was incredibly fast, computationally cheap, and most importantly, it was interpretable. In cybersecurity, Explainable AI (XAI) is critical. We need to know *why* a model flagged an article as fake. 

## The Road Ahead

The arms race between generative AI and detection AI is only going to accelerate. As generative models get better at mimicking human cadence, detection models will have to evolve beyond pure text analysis into multimodal detection (analyzing metadata, digital signatures, and cross-platform propagation patterns). 

The internet of the future will likely require a decentralized "trust layer" built directly into our browsers. Until then, as developers, our responsibility is to keep building faster, smarter detection pipelines.
  },
  {
    title: 'The Fragility of the Cloud: Why One Bad Update Can Take Down the World',
    excerpt: 'Reflecting on historic global IT outages, exploring the inherent risks of centralized cloud infrastructure, and why DevOps pipelines must evolve.',
    read_time_minutes: 12,
    category: 'Cloud Computing',
    image_url: '/assets/blog-3.webp',
    slug: 'fragility-of-the-cloud-it-outage',
    status: 'Published',
    content: There is a terrifying reality about the modern internet that most people ignore until their screens turn blue: our global infrastructure is precariously balanced on the shoulders of just a few massive tech providers.

In July, the tech community was harshly reminded of this fragility. When major global IT outages occur—halting flights, disrupting banking, and freezing hospital systems—it forces us to ask a difficult question: Have we optimized for convenience at the cost of resilience?

## The Illusion of Decentralization

The cloud was sold to us as the ultimate decentralized safety net. If a server in New York goes down, the load seamlessly balances to a server in London. Your data is everywhere, and therefore, it is safe.

But physical decentralization means nothing if the software layer is entirely centralized. 

When a single security vendor pushes a flawed kernel-level update to 50 million machines simultaneously, it doesn't matter if those machines are in AWS, Azure, or GCP. It doesn't matter if they are physically spread across fifty countries. They all crash at the exact same millisecond. We have eliminated physical single points of failure only to create massive, logical single points of failure.

## The Kernel Privilege Problem

The root cause of many of these catastrophic outages stems from how security software interacts with the operating system. To detect advanced malware, cybersecurity tools require Ring 0 (Kernel-level) access. They need to monitor the OS at its deepest, most privileged level.

The problem is that when a piece of software operates in Ring 0, a simple null pointer dereference or logic loop doesn't just crash the app—it crashes the entire operating system. It causes the dreaded Blue Screen of Death (BSOD). 

## Rethinking DevOps and Deployment

As an aspiring systems engineer, looking at these incidents changes how I view deployment pipelines. The mantra of Silicon Valley has always been "move fast and break things." But when your software is installed on hospital infrastructure and airline navigation systems, "breaking things" is no longer acceptable.

We need to fundamentally rethink CI/CD pipelines for critical infrastructure:
1.  **Phased Rollouts:** Never push an update to 100% of the fleet simultaneously. Canary deployments should be the legally mandated standard for Ring 0 software.
2.  **Automated Rollbacks:** If a machine fails to boot after an update, the bootloader should automatically revert to the previous known-good state. 
3.  **User-Space Security:** Operating system developers (like Microsoft and Linux maintainers) are pushing to move security tools out of the kernel and into "user space," using robust APIs to monitor threats without risking OS stability.

The cloud is incredibly powerful, but incidents in July remind us that engineering arrogance is dangerous. Resilience isn't just about having backups; it's about anticipating catastrophic failure at the most foundational levels of our code.
  },
  {
    title: 'My Friend Tried to Hack My Website (And How My Backend Stopped Him)',
    excerpt: 'A deep dive into Parameter Tampering, Supabase Auth, and why implementing secure Role-Based Access Control (RBAC) saved my portfolio.',
    read_time_minutes: 13,
    category: 'Cybersecurity',
    image_url: '/assets/blog-4.webp',
    slug: 'my-friend-tried-to-hack-my-website-rbac',
    status: 'Published',
    content: When you build a portfolio website and tell your friends you implemented a secure Admin Dashboard, you are essentially daring them to hack it.

That is exactly what happened to me in August. My friend, armed with Burp Suite and a lot of confidence, decided to test my Next.js and Supabase backend. What followed was a brilliant real-world lesson in web security, Parameter Tampering, and the absolute necessity of Role-Based Access Control (RBAC).

Here is the story of how he tried to break in, and how my backend stopped him cold.

## The Vulnerability Hunt

My website has two types of users:
1.  **Standard Users:** People who log in via Google OAuth to leave testimonials.
2.  **Admins:** Me (and approved users) who log in via email/password to access the \/admin\ dashboard to approve testimonials, view analytics, etc.

My friend noticed the "Forgot Password" link on the Admin login page. He realized that since Supabase handles authentication, anyone could technically request a magic reset link if they knew an admin's email.

## The Burp Suite Intercept

Instead of just clicking the button on the UI, my friend fired up **Burp Suite** (a popular penetration testing tool that acts as a web proxy). Burp Suite allows you to intercept the HTTP request *after* it leaves the browser but *before* it reaches the server. 

He intercepted the password reset payload and did two things:
1.  He changed the target email to *his own* email address.
2.  He maliciously injected a new parameter into the JSON payload: \"is_admin": true\.

His goal was classic **Parameter Tampering**. He hoped that the backend would blindly accept the payload, create a magic link for his email, and forcefully upgrade his database profile to an admin role because of the injected parameter.

## Why He Failed: Never Trust the Client

He successfully received the magic link in his inbox. He clicked it, set a new password, and proudly navigated to my \/admin/login\ page. He typed in his credentials and hit Enter.

And the server violently kicked him out with a \401 Unauthorized\ error.

Here is why his attack failed:
In modern backend architecture, **you never, ever trust the client**. It doesn't matter what parameters you inject into an HTTP request. My Supabase backend completely ignored his \is_admin=true\ injection because the Auth API doesn't map arbitrary payload data directly to secure database tables.

More importantly, my application uses strict **Role-Based Access Control (RBAC)** backed by Row Level Security (RLS). 

When he tried to log in, my Next.js middleware didn't just check if he had a valid password. It ran a secure, server-side SQL query against a protected \profiles\ table:
\SELECT is_admin FROM profiles WHERE id = [His User ID]\

Because he didn't have direct access to the database to alter the actual table row, the database returned \alse\. The server instantly rejected his session and redirected him away from the admin panel.

## The Takeaway

This was a fantastic stress test of my architecture. It proved a fundamental rule of cybersecurity: Frontend validation is for User Experience (UX). Backend validation is for Security. 

Hackers can bypass your frontend UI in seconds using proxies. They can manipulate URLs, inject headers, and modify payloads. But if your backend relies on a strictly defined, server-side source of truth (like an RLS-protected database table), their tricks are completely useless. 

Tell your friends to hack your side projects. It's the best way to learn!
  },
  {
    title: 'EOS-05 is in Orbit: Why ISRO’s Comeback Launch is a Masterclass in Engineering Resilience',
    excerpt: 'Analyzing the successful GSLV-F17 mission, the EOS-05 satellite, and what software engineers can learn from aerospace failure recovery.',
    read_time_minutes: 12,
    category: 'Space Tech',
    image_url: '/assets/blog-5.webp',
    slug: 'eos-05-isro-launch-engineering-resilience',
    status: 'Published',
    content: In September 2026, the Indian Space Research Organisation (ISRO) successfully launched the EOS-05 satellite aboard the GSLV-F17 rocket, placing it perfectly into a geosynchronous transfer orbit. 

On the surface, it’s another proud moment for Indian space exploration. But if you look closely at the context surrounding this launch, it is much more than just a successful mission. It is a masterclass in engineering resilience, system diagnostics, and bouncing back from failure.

## The Context of the Comeback

To understand the weight of this launch, you have to understand the preceding months. ISRO had faced two highly publicized, uncharacteristic mission setbacks earlier in the year. In the aerospace industry, a failure isn't a software bug you can patch with a hotfix overnight. A failure means millions of dollars and years of research burning up in the atmosphere. The pressure on the GSLV-F17 team was immense. 

The GSLV (Geosynchronous Satellite Launch Vehicle) has historically been one of ISRO's most complex launch vehicles, heavily relying on the indigenous cryogenic upper stage. The fact that ISRO diagnosed the previous anomalies, re-engineered the fail-safes, and executed a flawless launch in September speaks volumes about their internal engineering culture.

## The EOS-05 Payload

The EOS-05 itself is an engineering marvel. It is India's first imaging satellite explicitly designed to operate from a geosynchronous orbit. 

Traditionally, most high-resolution Earth Observation Satellites (EOS) are placed in Low Earth Orbit (LEO). LEO satellites fly close to the earth, which gives them great picture quality, but they orbit the earth very fast. They only pass over a specific location for a few minutes a day. 

By placing the EOS-05 in a geosynchronous orbit (nearly 36,000 km away), the satellite essentially matches the Earth's rotation. It acts as a permanent, unblinking eye over the Indian subcontinent. This provides unprecedented real-time monitoring capabilities for disaster management, agriculture, and national security. The technical challenge of taking high-resolution images from 36,000 km away required massive breakthroughs in optical sensors and data transmission bandwidth.

## What Software Engineers Can Learn

As a Computer Science student, watching aerospace engineering teams operate gives me a profound respect for system design. There are three key takeaways we can apply to software engineering:

1.  **Blameless Post-Mortems:** When an ISRO rocket fails, the investigation focuses entirely on *what* failed, not *who* failed. Telemetry data is analyzed relentlessly to find the root hardware or logic flaw. In software, we must adopt this same culture. When a production server crashes, we need to fix the system architecture, not fire the junior developer who deployed it.
2.  **Redundancy as a Standard:** Aerospace systems have triple-redundancy. If Sensor A fails, Sensor B takes over. If B fails, C initiates a safe mode. In our code, we often rely on "happy paths." We need to build web systems that gracefully degrade when external APIs or databases go down.
3.  **The "Fail Forward" Mentality:** ISRO didn't let two setbacks halt their 2026 timeline. They learned, adapted, and launched again. 

The successful deployment of EOS-05 isn't just a win for India's space program; it's a reminder to engineers everywhere that failure is simply the highest-fidelity feedback mechanism available.
  }
];

async function insertBlogs() {
  for (const blog of blogs) {
    const { error } = await supabase.from('blogs').insert(blog);
    if (error) {
      console.error('Error inserting', blog.slug, error.message);
    } else {
      console.log('Inserted:', blog.slug);
    }
  }
  console.log('All blogs inserted!');
}

insertBlogs();
