INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('3D Aircraft Model', 'A meticulously designed 3D aircraft model demonstrating advanced spatial reasoning, geometric precision, and an eye for intricate design details using digital CAD tools.', '[View on TinkerCAD](https://www.tinkercad.com/things/6RzgDxL78sa-3d-aircraft-model-?sharecode=3UfX2aLB1Bk-RHtGx5QpFzzxNaWX-S-VhvhygTqSYzA)

Project Overview
----------------

TinkerCAD 3D Modeling

This project was an exercise in precision, patience, and spatial reasoning. The goal was to move beyond simple shapes and construct a complex, recognizable object—a modern jet aircraft. Using Autodesk TinkerCAD, a browser-based 3D modeling tool, I designed a detailed model from scratch, focusing on achieving realistic aerodynamic proportions and capturing the key features that define an aircraft''s silhouette.

### Inspiration and Goals

My fascination with aerospace engineering and design inspired this project. I wanted to challenge myself to translate a 2D concept—blueprints and photographs of aircraft—into a tangible 3D form. The primary goals were to practice geometric modeling, understand how complex shapes can be built from simple primitives, and pay meticulous attention to symmetry and scale, which are critical in both real-world engineering and 3D art.

### The Design Process: From Primitives to Plane

The entire model was constructed using only primitive shapes like cubes, cylinders, wedges, and spheres. The process involved several key stages:

*   **Blocking Out the Fuselage:** The main body was formed by stretching and combining several cylindrical and box shapes to create the basic fuselage.
    
    ![TinkerCAD screenshot showing basic cylinders forming the rough fuselage body](/assets/aircraft-blocking.webp)
    
    Phase 1: Blocking out the basic shape with primitive cylinders.
    
*   **Boolean Operations:** The real detail work came from using boolean operations. I used "hole" shapes to carve out the cockpit, create the engine intakes, and shape the exhaust nozzles. This technique is fundamental to creating complex negative space in TinkerCAD.
    
    ![TinkerCAD screenshot showing transparent ''hole'' shapes cutting into the model](/assets/aircraft-boolean-holes.webp)
    
    Phase 2: Using boolean "hole" operations to carve the cockpit and intakes.
    
*   **Crafting the Wings and Stabilizers:** Achieving the correct aerodynamic profile for the wings was the most challenging part. It required carefully rotating, scaling, and aligning multiple wedge and roof shapes to create the tapered, swept-back look. The vertical and horizontal stabilizers were created similarly, ensuring perfect symmetry using the mirror tool.

### Final Model Views

![Side profile view of the finished aircraft model](/assets/aircraft-side-view.webp) ![Top down view showing symmetry of the wings](/assets/aircraft-top-view.webp)

### Challenges and Learning Outcomes

The main challenge was maintaining correct proportions and alignment without the advanced tools of professional software like Blender or Fusion 360. TinkerCAD''s simplicity forces a deeper understanding of geometric manipulation. This project significantly improved my spatial reasoning skills and taught me the importance of breaking down a complex object into its simplest constituent parts. It was a valuable lesson in patience and precision, reinforcing that even with basic tools, attention to detail can yield a complex and satisfying result.

### Skills Applied

*   **Spatial Reasoning:** Visualizing 3D objects from 2D plans.
*   **Geometric & Boolean Modeling:** Combining and subtracting primitive shapes to create complex, organic forms.
*   **Attention to Detail:** Ensuring symmetry and proper scaling of components.

### Credits

This project was inspired by the [Tinkercad Airplane tutorial](https://youtu.be/vRUQtT0P6jI?si=9seEEe4u0KUUEyOZ).

[![Scroll down to contact section](/assets/arrow.webp "Scroll down")](#contact)', '/assets/project-2.webp', ARRAY['TinkerCAD','3D Modeling'], 'Completed', 'https://www.tinkercad.com/things/6RzgDxL78sa-3d-aircraft-model-?sharecode=3UfX2aLB1Bk-RHtGx5QpFzzxNaWX-S-VhvhygTqSYzA', '3d-aircraft-model') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('DevCollab Hub', 'A comprehensive full-stack MERN application designed to streamline developer collaboration. Features include real-time task tracking, secure user authentication, and an interactive Kanban board for agile project management.', 'Live Demo (Coming Soon)

Project Overview
----------------

MongoDB Express.js React Node.js

DevCollab Hub is an ambitious full-stack application designed to solve a common problem for student developers: disorganized collaboration. Inspired by tools like Trello and Jira, this platform provides a centralized, real-time workspace for managing projects, tracking tasks, and communicating with team members. The goal is to create a streamlined environment perfect for hackathons, group assignments, and personal project planning.

### The Problem: Streamlining Student Collaboration

During group projects, communication and task tracking often become fragmented across Discord messages, Google Docs, and scattered notes. DevCollab Hub aims to consolidate this workflow into a single, intuitive dashboard, reducing administrative overhead and allowing developers to focus on what they do best: coding.

![Screenshot of the DevCollab Hub Kanban board interface](/assets/devcollab-dashboard.webp)

The main dashboard featuring the drag-and-drop Kanban board.

### Key Features

*   **Secure User Authentication:** Users can sign up and log in securely. The backend uses JSON Web Tokens (JWT) to manage sessions and protect routes, ensuring that only authenticated users can access project data.
*   **Interactive Kanban Board:** The core of the application is a drag-and-drop Kanban board. Users can create tasks, assign them to team members, and move them between columns (e.g., "To Do," "In Progress," "Done") to visually track progress.
*   **Real-time Collaboration:** When one user moves a task, it moves instantly on every other team member''s screen. This is achieved using WebSockets (via the Socket.io library), which establishes a persistent, two-way communication channel between the client and server.

### System Architecture: The MERN Stack in Action

The application is being built with the popular MERN stack, chosen for its flexibility and use of JavaScript across the entire development pipeline:

*   **MongoDB:** A NoSQL database that provides a flexible, JSON-like document structure, perfect for storing nested data like projects, task lists, and individual tasks.
*   **Express.js:** A minimalist web framework for Node.js that provides a robust set of features for building the backend RESTful API. It handles routing, middleware, and requests.
*   **React:** A powerful front-end library for building dynamic, component-based user interfaces. Its state management capabilities are ideal for handling the complex UI of the Kanban board.
*   **Node.js:** The JavaScript runtime environment that allows us to run our Express server and execute backend logic.

To visualize how these technologies interact, here is the high-level architecture of the application:

![Diagram showing MERN stack architecture data flow from React client to Node/Express server to MongoDB](/assets/devcollab-architecture.webp)

Data flow between the Client (React), Server (Node/Express), and Database (MongoDB).

![Screenshot showing the backend database structure or API testing](/assets/devcollab-backend.webp)

Backend structure: Managing data consistency and API routes.

### Challenges and Future Scope

The primary technical challenge is managing the complex state of the application in real-time, ensuring data consistency across all connected clients. Implementing the drag-and-drop functionality while syncing with the backend database requires careful state management on the front-end and efficient API design. The future roadmap includes adding features like in-app chat, notifications, and integration with GitHub to link tasks directly to commits and pull requests.

**Note:** This project is currently in the _active development phase_. While core functionalities are being implemented, some diagrams and code snippets above are conceptual illustrations used to demonstrate the full architectural vision. Some visualizations were generated with AI assistance.

[![Scroll down to contact section](/assets/arrow.webp "Scroll down")](#contact)', '/assets/project-4.webp', ARRAY['MongoDB','Express.js','React','Node.js'], 'In Progress', null, 'devcollab-hub') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Personal Portfolio', 'A fully responsive, accessibility-optimized personal portfolio designed and developed from scratch to showcase my technical skills, software projects, and professional journey. The very website you are currently exploring.', '[Live Demo](/) [Source Code](https://github.com/PranavR06)

Project Overview
----------------

HTML5 CSS3 JavaScript Netlify

This portfolio is more than just a collection of links; it''s a living project that demonstrates my commitment to clean code, responsive design, and a great user experience. Built from the ground up using only fundamental web technologies—HTML, CSS, and JavaScript—it serves as a practical showcase of my skills. The goal was to create a fast, accessible, and aesthetically pleasing platform to host my professional journey, without relying on heavy frameworks like Bootstrap or React.

### Design Philosophy

The design is guided by a "content-first" principle. The layout is clean and minimalist, using a consistent color palette and generous whitespace to ensure that the projects and information are the main focus. The user interface is designed to be intuitive, with clear navigation and predictable interactions, adhering to Jakob''s Law of UX—users prefer sites that work the same way as all the other sites they already know.

![Comparison of the portfolio layout on Mobile vs Desktop screens](/assets/portfolio-responsive.webp)

Responsive Design: Ensuring a seamless experience across all device sizes.

### Key Features

*   **Fully Responsive Design:** The site was built with a mobile-first approach, ensuring a seamless experience on any device. Using CSS media queries, the layout fluidly adapts from a single-column view on phones to a multi-column grid on desktops.
*   **Persistent Dark Mode:** A user-friendly theme toggle allows switching between light, dark, and system-default themes. The user''s preference is saved in `localStorage`, so their choice is remembered on their next visit.
*   **High-Level Accessibility (A11y):** Accessibility was a primary concern. The site uses semantic HTML5 tags (`<main>`, `<nav>`, `<article>`), ARIA (Accessible Rich Internet Applications) labels for icons and buttons, and ensures all interactive elements are keyboard-navigable with visible focus states.
*   **Performance Optimized:** To ensure fast load times, all images are converted to the modern WebP format and lazy-loaded. CSS and JavaScript are clean and efficient, resulting in a Lighthouse performance score consistently above 90.

![Google Lighthouse report showing 90+ scores in Performance and Accessibility](/assets/portfolio-lighthouse.webp)

Performance First: Achieving top-tier scores in Google Lighthouse metrics.

### Technical Deep Dive

One of the most interesting challenges was implementing the theme toggle to prevent the "flash of incorrect theme" (FOIT) on page load. If the script runs after the body, a user with dark mode enabled might briefly see the light theme before it switches. This was solved by placing a minimal, blocking JavaScript snippet in the HTML s `<head>`. This script checks `localStorage` and applies the ''dark-theme'' class to the body \*before\* the page is rendered, ensuring a seamless experience.

To understand why this works, it helps to visualize the browser''s rendering process. By intervening before the Paint stage, we prevent the screen from flickering white.

![Diagram of the Critical Rendering Path showing HTML parsing, DOM construction, and Painting](/assets/rendering-path.webp)

The Critical Rendering Path: Optimizing the sequence of HTML parsing and Painting.

The smooth scrolling behavior is achieved with the CSS property `scroll-behavior: smooth;`, enhanced by JavaScript to handle hamburger menu closures and accurate section targeting. All interactive elements, like the "More options" menus, are handled by a single, efficient event delegation system in `main.js` to minimize memory usage and improve performance.

### Learning Outcomes

Building this portfolio from scratch was a fantastic learning experience. It reinforced my understanding of the CSS box model, Flexbox, and Grid for creating complex layouts. I gained practical experience in writing accessible HTML and implementing modern JavaScript features like `localStorage` and the Intersection Observer API for fade-in animations. Most importantly, it taught me the importance of planning for performance and accessibility from day one, rather than treating them as afterthoughts.

### Credits

This portfolio design was inspired by [Brian Design''s tutorial](https://youtu.be/ldwlOzRvYOU?si=2VsIMxf58eJOWvGp).

[![Scroll down to contact section](/assets/arrow.webp "Scroll down")](#contact)', '/assets/project-1.webp', ARRAY['HTML5','CSS3','JavaScript','Netlify'], 'Completed', 'https://pranavr.netlify.app/', 'personal-portfolio') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Sentiment Analysis AI', 'A machine learning pipeline planned to perform advanced sentiment analysis on user reviews, leveraging Natural Language Processing (NLP) techniques to accurately classify text into positive, negative, or neutral sentiments.', 'Updates Coming Soon

Project Concept
---------------

Python TensorFlow Scikit-learn

This project is my planned entry into the fascinating world of Natural Language Processing (NLP) and Machine Learning. The goal is to build and train a model that can understand the emotional tone behind a piece of text. By analyzing user reviews, social media comments, or any other text data, the AI will classify the sentiment as positive, negative, or neutral. This is a foundational task in AI with vast real-world applications.

### The Vision: Decoding Emotion in Text

Humans can effortlessly detect sarcasm, joy, or anger in text. For a machine, this is an incredibly complex task. This project aims to demystify that process by leveraging neural networks to recognize patterns in language that correspond to different sentiments. The ultimate vision is to create a simple, accessible tool that anyone can use to gauge the sentiment of a piece of text.

### Planned Methodology: A Step-by-Step Approach

*   **1\. Data Collection:** The project will start with a well-known public dataset, such as the IMDB movie reviews dataset, which contains thousands of labeled positive and negative reviews. This provides the "ground truth" needed to train the model.
    
    ![Screenshot of the IMDB dataset showing raw text reviews and sentiment labels](/assets/sentiment-dataset.webp)
    
    The Raw Material: A preview of the labeled IMDB dataset ready for training.
    
*   **2\. Text Preprocessing:** Raw text is messy. This crucial step involves cleaning the data by converting it to lowercase, removing punctuation and "stopwords" (common words like "the," "is," "a"), and performing tokenization (splitting text into individual words or tokens).
*   **3\. Vectorization:** Machines don''t understand words; they understand numbers. The preprocessed text will be converted into numerical vectors using techniques like TF-IDF or word embeddings (e.g., Word2Vec, GloVe).
    
    To bridge the gap between human language and machine understanding, the data flows through a specific pipeline:
    
    ![Diagram of the NLP pipeline: Tokenization, Vectorization, Classification](/assets/sentiment-pipeline.webp)
    
    The NLP Pipeline: Transforming raw text into actionable sentiment scores.
    
*   **4\. Model Selection and Training:** The initial plan is to implement a Recurrent Neural Network (RNN), specifically an LSTM (Long Short-Term Memory) network, which is well-suited for sequence data like text. The model will be built using TensorFlow and Keras. As a stretch goal, I plan to experiment with a pre-trained Transformer model like BERT for transfer learning, which often yields state-of-the-art results.
*   **5\. Evaluation:** The model''s performance will be evaluated using metrics like accuracy, precision, recall, and the F1-score to understand how well it classifies each sentiment.

![Python code snippet defining the LSTM model architecture in Keras](/assets/sentiment-model-code.webp)

The Blueprint: Planning the LSTM architecture using TensorFlow/Keras.

### The Technology Stack

*   **Python:** The de-facto language for machine learning.
*   **TensorFlow & Keras:** For building and training the neural network.
*   **Scikit-learn:** For data splitting, preprocessing, and performance evaluation.
*   **NLTK / SpaCy:** Powerful libraries for NLP tasks like tokenization and stop-word removal.
*   **Flask/FastAPI (for deployment):** To wrap the trained model in a simple API.

### Potential Applications and Impact

The skills and model developed in this project have direct applications in many industries. Businesses can use it to analyze customer feedback from surveys and social media to quickly gauge public opinion. It can be used to filter toxic comments, track brand reputation, or even analyze financial news for market sentiment. The ultimate goal is to deploy this model as a simple web API, making this powerful technology accessible for anyone to try in real-time.

**Note:** This project is currently in the _planning phase_. The code snippets and visualizations presented above are conceptual illustrations generated to demonstrate the planned architecture and logic. Some images used in this presentation were generated with AI assistance to represent the final vision.

[![Scroll down to contact section](/assets/arrow.webp "Scroll down")](#contact)', '/assets/project-5.webp', ARRAY['Python','TensorFlow','Scikit-learn'], 'Completed', null, 'sentiment-analysis-ai') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Vaultary', 'A Python-based cybersecurity utility engineered to rigorously analyze password strength, identify common vulnerabilities, and estimate brute-force cracking times to promote robust digital security habits.', '[Live Demo](https://vaultary.vercel.app) [GitHub Repo](https://github.com/PranavR06/Vaultary)

Project Overview
----------------

Python Flask Cybersecurity Cryptography

**Vaultary** is a comprehensive identity and security platform designed to help users analyze password strength, detect breaches, and manage credentials securely. It goes beyond simple rule-based checking by analyzing mathematical entropy and integrating with live breach databases.

1\. Features
------------

Vaultary is packed with features ensuring robust security and user management:

*   **Advanced Password Strength Analysis:** Uses `zxcvbn` to calculate entropy, crack time, and score (0-4). It provides specific feedback (warnings and suggestions) and visualizes the security breakdown using a Radar Chart.
*   **Real-time Breach Detection:** Integrates with the **HaveIBeenPwned API** to check if a password has appeared in known data breaches. It uses k-Anonymity (sending only the first 5 characters of the SHA-1 hash) to protect user privacy.
*   **Secure Password Vault:** Allows users to save credentials (Site Name, URL, Username, Password). Passwords are encrypted using **AES-256 Encryption** (Fernet) before storage.
*   **User Authentication & Management:** Supports local email/password login with Bcrypt hashing, OAuth (Google, GitHub, LinkedIn), email verification, and secure password resets.
*   **Two-Factor Authentication (2FA):** Time-based One-Time Password (TOTP) support compatible with apps like Google Authenticator.
*   **Dashboard Tools:** Includes profile management, an admin panel for user management, session timeout handling, and a secure server-side password generator.

![Vaultary Main Dashboard with Radar Chart](/assets/vaultary-dashboard.webp)

Visual analytics dashboard featuring the security radar chart.

2\. Uses
--------

*   **Security Auditing:** Users can test their passwords to see how long they would take to crack and if they are vulnerable to dictionary attacks or keyboard patterns.
*   **Credential Management:** Acts as a web-based password manager to store login details securely.
*   **Identity Protection:** Helps users verify if their credentials have been compromised in public leaks.
*   **Educational Tool:** Demonstrates why certain passwords (like "P@ssword1") are weak despite meeting standard complexity rules.

3\. The Vaultary Difference
---------------------------

Unlike traditional checkers that rely on simple rules (e.g., "1 uppercase, 1 number"), Vaultary offers:

*   **Entropy vs. Rules:** Analyzes mathematical entropy (randomness) rather than just character counts.
*   **Pattern Recognition:** Detects common patterns like keyboard walks (e.g., "qwerty"), repetitions, and common substitutions (e.g., ''@'' for ''a'').
*   **Breach Integration:** Connects to live breach databases to flag compromised passwords.
*   **Visual Analytics:** Provides a graphical breakdown of _why_ a password is strong or weak, rather than just a green/red bar.

![Password Entropy Visualization](/assets/password-entropy.webp)

Understanding password entropy: Randomness vs. Complexity.

4\. Technical Stack
-------------------

![Vaultary System Architecture Diagram](/assets/vaultary-architecture.webp)

System architecture showing data flow between User, Flask App, and APIs.

**Backend Framework:** Python Flask

**Database:** SQLAlchemy ORM (SQLite for dev, PostgreSQL for production)

**Authentication:** JWT (HTTP-only cookies), Authlib (OAuth), Flask-Bcrypt

**Security Libraries:** Cryptography (Fernet), Flask-Limiter, Flask-Talisman

**Frontend:** HTML5, CSS3 (Variables), Vanilla JavaScript, Chart.js

5\. Code Review & Limitations
-----------------------------

Based on the current codebase, here are some technical observations and areas for future improvement:

### "Zero-Knowledge" Architecture

The current implementation claims "Zero-Knowledge," but the server holds the `VAULT_KEY` and performs decryption. In a true Zero-Knowledge architecture, decryption happens _only_ on the client side using a key derived from the user''s master password that the server never sees. Currently, if the server is compromised, the vault keys are accessible.

### JWT Invalidation

The logout function simply clears the cookie on the client. Since JWTs are stateless, the token remains valid until it expires (1 hour). Implementing a token blacklist (e.g., using Redis) would prevent a stolen token from being used after logout.

### Rate Limiting Storage

The limiter uses in-memory storage. If deployed on a platform with multiple workers (like Gunicorn) or serverless functions, rate limits might not be shared across instances, making them less effective.

### Input Validation

While regex validation is present, adopting strict schema validation libraries (like Pydantic or Marshmallow) would enhance robustness against malformed data.

6\. Future Roadmap
------------------

*   **Biometric Integration:** Implementing WebAuthn for fingerprint login.
*   **Secure Notes:** Extending the vault to store unstructured text data.

[![Scroll down to contact section](/assets/arrow.webp "Scroll down")](#contact)', '/assets/project-3.webp', ARRAY['Python','Flask','Zxcvbn'], 'Completed', 'https://vaultary.vercel.app', 'vaultary') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Classroom Management System', 'Led system design and documentation for a Java-based scheduling application, strengthening my object-oriented programming and workflow management skills.', 'Source Code Unavailable [View Report](..//assets/classroom-management-report.pdf)

Project Overview
----------------

During my third semester, my teammate Prathwik and I built a Java-based Classroom Management System. The core focus of this application was to solve scheduling conflicts by allowing professors to view the timetables of all classes, identify free periods, and book available classrooms. Any booking made is immediately reflected for all other staff, ensuring a single source of truth.

Unlike previous projects where I focused heavily on writing code, my primary responsibility in this project was **System Design and Documentation**. This shift allowed me to deeply explore Object-Oriented Programming (OOP) concepts, software architecture, and the importance of a structured development lifecycle.

### Key Features

*   **Centralized Timetable Viewing:** Professors can easily browse the complete daily or weekly schedule for any class or room.
*   **Free Slot Detection:** The system automatically highlights unoccupied periods based on the master schedule.
*   **Conflict-Free Booking:** Staff can book a free period for extra classes or events. The system locks the slot and updates the view globally to prevent double-booking.
*   **Data Persistence:** Reliable storage and synchronization of timetable and booking data.

Team & Contributions
--------------------

![Pranav R](..//assets/pranavr.webp)

### Pranav R

Documentation Lead

*   Managed comprehensive project documentation, including the Software Requirements Specification (SRS).
*   Established an organized project workflow, bridging the gap between planning and coding.

![Prathwik Shetty](..//assets/NNM24IS171.webp)

### Prathwik Shetty

System Architect & Core Developer

*   Architected the system using core OOP principles (Inheritance, Polymorphism, Encapsulation).
*   Drafted comprehensive UML diagrams including Use Case, Class, and Sequence diagrams.
*   Developed the core Java application logic, including the timetable scheduling algorithm and booking synchronization.

System Design & Architecture
----------------------------

A major challenge in software development is translating real-world relationships into code. By leading the system design, I mapped out the entities of a classroom environment into a robust Java class structure.

![Classroom Management System UML Class Diagram](..//assets/classroom-uml.webp)

The Class Diagram detailing the relationships between Professors, Classrooms, Timetables, and Booking objects.

### Applying OOP Principles

*   **Inheritance:** Created a base `User` class containing common attributes (ID, Name, Contact) which was inherited by staff and admin classes to reduce code duplication.
*   **Encapsulation:** Protected sensitive data like booking statuses and schedule arrays using private variables accessed only via controlled getter and setter methods to prevent accidental overwrites.
*   **Polymorphism:** Implemented overridden methods for dashboard initialization, allowing the system to display different interfaces based on the logged-in user''s role.

Challenges & Engineering Solutions
----------------------------------

*   **Concurrency & Double-Booking:** Ensuring two professors couldn''t book the same free period simultaneously.  
    _Solution:_ Designed the booking logic with strict state validation, ensuring the timetable updates synchronously and rejects conflicting requests.
*   **Complex Timetable Mapping:** Structuring data for days, periods, classrooms, and bookings was highly multi-dimensional.  
    _Solution:_ Designed an efficient relational object model using nested Java Collections (like HashMaps and ArrayLists) to quickly traverse and query free slots.

Academic Context & Guidance
---------------------------

This project was made for the subject **OBJECT ORIENTED PROGRAMMING** (Course Code: CS2002-1), under the expert guidance of:

![Ms. Anusha N](..//assets/anusha-n.webp)

### Ms. Anusha N

**Designation:** Assistant Professor Gd.I

**Institution:** NMAM Institute of Technology (NMAMIT), Nitte

**Email:** [anusha24@nitte.edu.in](mailto:anusha24@nitte.edu.in)

Impact & Learning Outcomes
--------------------------

Taking on the role of System Designer was a pivotal learning experience. It shifted my perspective from merely "writing scripts" to "engineering software." I learned that investing time in proper architecture, documentation, and UML planning drastically reduces bugs during the coding phase and makes team collaboration seamless.

[![Scroll down to contact section](..//assets/arrow.webp "Scroll down")](#contact)', '/assets/college-2.webp', ARRAY['Java','OOP','System Design'], 'College', '/assets/classroom-management-report.pdf', 'classroom-management-project') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Marketing Response Prediction', 'Applied machine learning to predict customer marketing responses, culminating in an IEEE conference paper submission.', '[View Research Paper](..//assets/marketing-prediction-research-paper.pdf)

Project Overview
----------------

Understanding customer behavior is one of the most critical challenges in modern business. In this project, our team developed a predictive machine learning model designed to analyze historical marketing campaign data and forecast customer response patterns.

Beyond just writing code, a significant milestone of this project was the academic rigor involved. We prepared and submitted a formal research paper based on our findings, formatted to IEEE conference standards, giving me a profound introduction to the world of academic research and technical documentation.

### Methodology & Workflow

*   **Exploratory Data Analysis (EDA):** Visualized underlying trends, identified correlations between customer demographics and response rates, and mapped out data distributions.
*   **Data Preprocessing:** Handled missing values, treated outliers, and encoded categorical features to prepare the dataset for algorithmic consumption.
*   **Model Training:** Applied and compared foundational machine learning algorithms (such as Logistic Regression, Decision Trees, and Random Forest) to determine the best fit for our classification problem.
*   **Performance Evaluation:** Utilized metrics like Accuracy, Precision, Recall, and the F1-Score to rigorously evaluate model reliability and mitigate false positives.

Team & Contributions
--------------------

![Pranav R](..//assets/pranavr.webp)

### Pranav R

QA Tester & Research Co-Author

*   Conducted rigorous testing and evaluation of the machine learning models.
*   Co-authored the research paper, strictly adhering to IEEE conference formatting guidelines.

![P Suyash](..//assets/NNM24IS148.webp)

### P Suyash

Machine Learning Engineer

Co-developed the main ML project, conducted extensive literature reviews, and contributed to the codebase.

![Pratham (163)](..//assets/NNM24IS163.webp)

### Pratham (163)

QA Tester & Research Co-Author

Performed comprehensive model testing and contributed significantly to drafting the research paper.

![Pratham Prabhakar](..//assets/NNM24IS167.webp)

### Pratham Prabhakar

Lead Machine Learning Engineer

Developed the core machine learning models, handled data preprocessing, and tuned classification algorithms.

Academic Context & Guidance
---------------------------

This project was made for the subject **INTRODUCTION TO DATA SCIENCE** (Course Code: IS1102-2), under the expert guidance of:

![Mr. Sharath Kumar](..//assets/sharath-kumar.webp)

### Mr. Sharath Kumar

**Designation:** Assistant Professor Gd.II

**Institution:** NMAM Institute of Technology (NMAMIT), Nitte

**Email:** [sharath.sk@nitte.edu.in](mailto:sharath.sk@nitte.edu.in)

Research & IEEE Paper Submission
--------------------------------

Developing a predictive model was only half the journey. Translating complex code and data outputs into a structured, scientifically sound document was an entirely different challenge.

We structured our IEEE paper to clearly define the problem statement, review existing literature, explain our proposed methodology, and present our empirical results. This rigorous process taught me how to logically defend engineering decisions, format academic references properly, and communicate highly technical concepts to a broader research audience.

### Conference Presentation & Recognition

Our research paper, titled **"Integrating Supervised learning paradigms for Enhanced Marketing Campaign Outcome Prediction"**, was successfully accepted and presented at an international IEEE conference by our guide, Mr. Sharath Kumar.

#### 🏆 Certificate of Presentation

*   **Conference:** 2026 IEEE Sixth International Conference on Artificial Intelligence and Data Engineering (AIDE 2026), under the aegis of ICETE 2026.
*   **Authors:** Pratham Prabhakar, Pratham (163), P Suyash, and Pranav R.
*   **Presented By:** Mr. Sharath Kumar
*   **Date & Location:** February 05 - 07, 2026 at NMAM Institute of Technology, Nitte, India.

![IEEE AIDE 2026 Certificate of Presentation](..//assets/aide-2026-certificate.webp)

[Download PDF](..//assets/aide-2026-certificate.pdf)

Impact & Learning Outcomes
--------------------------

This project was instrumental in shaping my understanding of data science. I learned that machine learning is not just about importing libraries; it is about deeply understanding the data, selecting the right metrics for the specific business context, and being able to formally document and present findings to the academic community.

[![Scroll down to contact section](..//assets/arrow.webp "Scroll down")](#contact)', '/assets/college-3.webp', ARRAY['Machine Learning','Data Analysis','Research'], 'College', '/assets/marketing-prediction-research-paper.pdf', 'marketing-prediction-project') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Mentor-Mentees Management Website', 'A web application developed during my first year to manage mentor-mentee relationships, focusing on frontend UI and project documentation.', '[View Source Code](https://github.com/Pranavr06/mentor-page) [View Report](..//assets/mentor-mentees-report.pdf)

Project Overview
----------------

A role-based web application engineered to streamline interactions between mentors and mentees. The platform centralizes academic tracking, profile management, and secure communication, eliminating fragmented administrative overhead.

### The Problem

Educational institutions often struggle with inefficient, paper-based, or fragmented digital systems for tracking mentor-mentee interactions. This leads to inconsistent data, poor communication, and a lack of a centralized view of a student''s academic and personal progress, making it difficult for mentors to provide timely support.

### Key Features

*   **Role-Based Access Control (RBAC):** Distinct, secure dashboards tailored for mentors and mentees.
*   **Secure Authentication:** Robust session handling and secure login flows.
*   **Academic Record Management:** Centralized system for real-time student data access and tracking.
*   **Notification System:** Integrated alerts for targeted announcements and administrative updates.

Team & Contributions
--------------------

![Pranav R](..//assets/pranavr.webp)

### Pranav R

Frontend & Documentation Lead

*   Built dashboards and UI components
*   Improved UI/UX and usability
*   Led documentation (report, PPT, manuals)

![Pramukh A Nayak](..//assets/NNM24IS158.webp)

### Pramukh A Nayak

Backend Developer

Developed backend logic, APIs, and database handling.

![Pranav Shenoy](..//assets/NNM24IS160.webp)

### Pranav Shenoy

Frontend & Auth Logic

Worked on frontend integration and role-based authentication.

![Prarthana Acharya](..//assets/NNM24IS161.webp)

### Prarthana Acharya

Content & Coordination

Managed content and helped in team coordination.

![Prarthana Nayak](..//assets/NNM24IS162.webp)

### Prarthana Nayak

Testing & QA

Performed testing and ensured system reliability.

![Pratham (NNM24IS163)](..//assets/NNM24IS163.webp)

### Pratham (163)

Frontend Debugging

*   Designed responsive layouts using Bootstrap.
*   Fixed UI bugs and JavaScript issues.

![Pratham (NNM24IS164)](..//assets/NNM24IS164.webp)

### Pratham (164)

UI/UX Designer

Designed layout and improved visual consistency.

Project Interface
-----------------

### Authentication

![Mentor Secure Login](..//assets/mentor-login.webp) ![Student Secure Login](..//assets/student-login.webp)

### Dashboards & Management

![Mentor Dashboard Overview](..//assets/mentor-dashboard.webp)

The main mentor dashboard providing a centralized overview of assigned mentees.

![Student Details View](..//assets/student-details.webp)

Detailed profile management view for tracking individual academic and personal records.

![Mentor Details View](..//assets/mentor-details.webp)

Comprehensive view of mentor and their associated administrative information.

Challenges & Engineering Solutions
----------------------------------

*   **Role-Based Routing:** Managing secure redirection and maintaining session integrity was complex.  
    _Solution:_ Implemented strict session-based authentication coupled with conditional routing logic on the backend to prevent unauthorized access.
*   **Data Consistency:** Ensuring reliable data across relational tables (User, Mentor, Mentee).  
    _Solution:_ Utilized PHP for robust backend data handling alongside optimized MySQL queries, refining the relational schema to guarantee data integrity during concurrent updates.
*   **Team Collaboration:** Coordinating code integration among 7 developers.  
    _Solution:_ Leveraged GitHub for strict version control, enabling parallel development and seamless merge workflows.

Academic Context & Guidance
---------------------------

This project was developed as part of a **1st year internship** under the expert guidance of:

![Ms. Ashwitha C Thomas](..//assets/ashwitha-thomas.webp)

### Ms. Ashwitha C Thomas

**Role:** Former Assistant Professor (Grade-I)

**Institution:** NMAM Institute of Technology (NMAMIT), Nitte

Impact & Results
----------------

We successfully deployed a fully functional platform that modernizes mentor-student communication workflows. The clean, highly structured UI significantly reduced friction in accessing academic data, establishing a scalable foundation for institutional administrative tools.

### Future Improvements

*   Integration of a real-time WebSocket-based chat system.
*   Implementation of advanced security protocols including JWT and data encryption.
*   Development of a performance analytics dashboard for granular academic insights.

[![Scroll down to contact section](..//assets/arrow.webp "Scroll down")](#contact)', '/assets/college-1.webp', ARRAY['HTML5','CSS3','JavaScript'], 'College', '/assets/mentor-mentees-report.pdf', 'mentor-mentees-project') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('Online Examination Management System', 'A secure, scalable Online Examination & Proctoring System built with full-stack architecture, featuring real-time YOLOv8 cheating detection, tab-switching prevention, and conditional AWS S3 storage.', '[View Source Code](https://github.com/Pranavr06) [View Report](..//assets/online-exam-report.pdf)

Project Overview
----------------

The Online Examination Management System (OEMS) is a full-stack web application designed to conduct secure, scalable, and intelligent online examinations. The system integrates real-time AI-based proctoring with a robust backend architecture to ensure exam integrity, prevent malpractice, and provide seamless exam management for students and administrators.

Unlike basic exam portals, OEMS focuses heavily on security, automation, and real-time monitoring, combining computer vision with cloud infrastructure to simulate a controlled examination environment remotely.

Core Features
-------------

### AI Proctoring System

The core strength of the system lies in its intelligent proctoring module powered by YOLOv8 and OpenCV.

*   Real-time object detection using YOLOv8 (Ultralytics)
*   Detection of mobile phones to prevent unfair assistance
*   Detection of multiple persons in the frame indicating malpractice
*   Continuous monitoring via webcam feed
*   Automatic screenshot capture when suspicious activity is detected
*   Conditional storage of evidence only when violations occur
*   Confidence threshold tuning to reduce false positives
*   Frame sampling optimization to balance performance and detection accuracy

_This module ensures that the system is not just passive but actively enforces exam discipline._

### Student Module

The student interface is designed to be simple yet secure, ensuring minimal distraction while maintaining strict control.

*   Secure authentication system (JWT/session-based)
*   Personalized dashboard displaying assigned exams
*   Timer-based examination system with strict duration control
*   Auto-submission upon timeout or rule violation
*   Real-time proctoring activated during exams
*   Prevention of tab switching, refresh attempts, and unauthorized navigation
*   Smooth UI/UX for answering questions without lag

### Teacher & Admin Module

The admin panel provides full control over exam lifecycle and monitoring.

*   Create, update, and delete examinations
*   Question bank management (MCQs)
*   Assign exams to specific students or groups
*   Monitor ongoing exams in real-time
*   Access detailed proctoring reports with captured evidence
*   View and analyze student performance

_Note: Proper role-based access control (RBAC) is implemented to differentiate admin and teacher permissions._

### Evaluation System

*   Automatic evaluation of objective-type questions
*   Instant result generation after submission
*   Storage of results for future access
*   Basic analytics for performance tracking

### Cloud & Storage Integration

To handle evidence efficiently and cost-effectively:

*   Integration with AWS S3 for storing violation screenshots
*   Structured storage format: `user_id / exam_id / timestamp`
*   Upload triggered only on detection events (not continuous streaming)
*   Reduces unnecessary cloud storage costs

### Security Features

Security is treated as a primary design concern rather than an afterthought.

*   JWT-based authentication for secure session handling
*   Input validation and sanitization across all endpoints
*   Protection against: Multiple concurrent logins, Tab switching and window focus loss, Page refresh bypass attempts
*   Secure REST API built using FastAPI
*   Basic logging of suspicious activities and violations

Team & Contributions
--------------------

![Pranav R](..//assets/pranavr.webp)

### Pranav R

Full-Stack AI Engineer

*   Spearheaded the overall project development, leading both the full-stack architecture and AI proctoring integration.
*   Developed the core AI engine (YOLOv8), secure backend API (FastAPI), and cloud evidence pipeline (AWS S3).

![Pratham (164)](..//assets/NNM24IS164.webp)

### Pratham (164)

Frontend Developer

Built the secure exam interface and student dashboards, ensuring a seamless user experience.

![Prathwik](..//assets/NNM24IS171.webp)

### Prathwik

Backend API Developer

Developed the FastAPI backend architecture and integrated the database for secure data handling.

Technology Stack
----------------

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** FastAPI / Flask (REST API architecture)
*   **AI & Computer Vision:** YOLOv8 (Ultralytics), OpenCV
*   **Database:** MySQL / PostgreSQL
*   **Cloud Services:** AWS S3 (evidence storage)

System Interface & Walkthrough
------------------------------

### 1\. Login

A secure authentication gateway featuring role-based routing to ensure users are directed to their specific functional dashboards.

![Secure Login Interface](..//assets/oems-login.webp)

The unified login portal for all system users.

### 2\. Superadmin Dashboard

The highest level of access designed for managing global system settings, institutional onboarding, and overall compliance.

![Superadmin Interface](..//assets/oems-superadmin.webp)

Global control center for the OEMS platform.

### 3\. Admin Dashboard

An institutional control center for administrators to manage teacher accounts, student enrollments, and broad examination schedules.

![Admin Interface](..//assets/oems-admin.webp)

Institutional management and user administration hub.

### 4\. Teacher Dashboard

A dedicated interface for educators to create dynamic question banks, assign specific exams, and review detailed proctoring alerts.

![Teacher Interface](..//assets/oems-teacher.webp)

Educator portal for exam creation and monitoring.

### 5\. Student Dashboard

A secure, personalized portal where students access assigned exams, view upcoming schedules, and review past performance.

![Student Dashboard Interface](..//assets/oems-student.webp)

The secure student portal displaying assigned exams and active timers.

### 6\. Secure Exam Interface

A distraction-free environment featuring a live countdown timer, strict tab-switching prevention, and active background monitoring.

![Secure Exam Interface](..//assets/oems-exam-interface.webp)

A highly monitored exam interface with real-time tracking.

### 7\. AI Detection (Proctoring)

The core YOLOv8 engine actively analyzes webcam feeds in real-time to detect mobile phones and unauthorized persons within the frame.

![AI Real-Time Detection](..//assets/oems-ai-detection.webp)

YOLOv8 actively flagging a mobile phone during a live exam session.

### 8\. Violation Evidence

When the confidence threshold is met, the system conditionally captures the exact frame and securely uploads it to AWS S3, logging the event.

![Violation Evidence Log](..//assets/oems-violation-evidence.webp)

Time-stamped evidence securely stored and linked to the specific exam session.

### 9\. Results & Analytics

Instant, automated evaluation of submissions with granular performance analytics and scorecard generation.

![Automated Results and Analytics](..//assets/oems-results.webp)

Automated scoring and student performance breakdown.

System Architecture
-------------------

A highly modular data flow ensuring that heavy AI processing and cloud uploads only occur conditionally, preserving bandwidth and reducing AWS costs.

*   Client (browser) captures video frames during the exam
*   Frames are sent to the backend API at controlled intervals
*   YOLO model processes frames for object detection
*   If a violation is detected:  
        • Screenshot is captured  
        • Uploaded to AWS S3  
        • Event logged in database
*   Admin dashboard retrieves logs and evidence for review

![System Architecture Diagram](..//assets/online-exam-er-diagram.webp)

The system architecture mapping the flow from Client to YOLOv8 to AWS S3.

### Database Design (ER Diagram)

The application relies on a robust relational database schema to seamlessly connect users, examinations, question banks, and AI proctoring evidence logs.

![Entity Relationship Diagram of the entire system](..//assets/oems-database-er-diagram.webp)

Entity-Relationship (ER) Diagram mapping the core tables and their associations across the entire system.

Challenges & Solutions
----------------------

*   **Real-time Processing vs Performance:** Continuous frame processing is computationally expensive.  
    _Solution:_ Implemented frame skipping and asynchronous processing.
*   **False Positives in Detection:** Incorrect detections affecting credibility.  
    _Solution:_ Tuned confidence thresholds and validation logic.
*   **Cloud Cost Optimization:** Storing large amounts of unnecessary data.  
    _Solution:_ Conditional uploads only when violations occur.
*   **Exam Security Loopholes:** Users bypassing restrictions via refresh/tab switch.  
    _Solution:_ Implemented strict session monitoring and event tracking.

Key Highlights
--------------

*   Combines AI + full-stack + cloud
*   Solves a real-world problem (exam malpractice)
*   Shows system design thinking (not just UI)
*   Goes beyond UI by addressing security and scalability

Academic Context & Guidance
---------------------------

This project was made for the subject **DATABASE MANAGEMENT SYSTEMS** (Course Code: CS2102-1), under the expert guidance of:

![Mr. Prashanth Kumar](..//assets/prashanth-kumar.webp)

### Mr. Prashanth Kumar

**Designation:** Assistant Professor Gd.II

**Institution:** NMAM Institute of Technology (NMAMIT), Nitte

**Email:** [prashanth.kumar@nitte.edu.in](mailto:prashanth.kumar@nitte.edu.in)

Future Improvements
-------------------

*   Role-Based Access Control (Admin / Teacher / Student separation)
*   Advanced analytics dashboard
*   Live proctoring dashboard for admins
*   Integration with WebRTC for optimized video streaming
*   AI model improvements for higher accuracy
*   Deployment on scalable cloud infrastructure (AWS/GCP)

[![Scroll down to contact section](..//assets/arrow.webp "Scroll down")](#contact)', '/assets/college-4.webp', ARRAY['FastAPI','YOLOv8','AWS S3'], 'College', '/assets/online-exam-report.pdf', 'online-exam-project') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;
