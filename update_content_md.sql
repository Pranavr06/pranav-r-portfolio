-- Update AIC Nitte
UPDATE public.experiences 
SET content = '<div class="btn-container add-margin-bottom"><a href="../assets/AIC-certificate.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-color-2">View Certificate</a><div class="menu-container"><button class="menu-btn card-menu-btn" aria-label="More options" data-tooltip="More options"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg></button><div class="options-menu"><button class="menu-option btn-copy-link">Copy Link</button> <button class="menu-option btn-share">Share</button></div></div></div>

## Overview

**Role:** Intern | **Organization:** AIC NITTE | **Duration:** 1st Year Internship

**Focus Areas:**

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">3D Design</span> <span class="tech-tag">Embedded Systems</span> <span class="tech-tag">Hardware + Software Integration</span></div>

Hands-on internship focused on bridging digital design, hardware systems, and real-world engineering workflows.

### 3D Aircraft Modeling using Tinkercad

**Tools:**

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">Tinkercad</span> <span class="tech-tag">3D Printer</span></div>

#### What I Did

-   Designed a complete 3D aircraft model using primitive shapes.
-   Applied scaling, alignment, and geometric modeling principles.
-   Prepared model for real-world manufacturing.

#### Process

-   Created model using cubes, cylinders, cones.
-   Exported as STL file.
-   Printed using additive manufacturing.

#### Outcome

Successfully converted digital design → physical 3D printed model.

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/aic-simulation.webp" alt="Simulation Image" class="grid-img" loading="lazy"><figcaption>Simulation Image</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/aic-physical-model.webp" alt="Physical Printed Model" class="grid-img" loading="lazy"><figcaption>Physical Printed Model</figcaption></figure></div>

#### Model Showcase

<div class="video-wrapper video-portrait"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/aircraft-portrait-video.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div>

3D Aircraft Model demonstration.

### 3D Scanning using Meshmixer

**Tools:**

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">Mobile Camera</span> <span class="tech-tag">Meshmixer</span></div>

#### What I Did

-   Captured object images from multiple angles.
-   Generated 3D model using photogrammetry.
-   Cleaned and refined mesh.

#### Technical Work

-   Used "Make Solid", "Smooth", "Close Cracks".
-   Removed noise and improved surface quality.

#### Outcome

Converted physical object → clean digital 3D model.

#### Scanning Showcase

<div class="image-grid"><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/scanning-video1.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">Classroom atmosphere during the workshop session.</p></div><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/scanning-video2.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">9/11 attack simulation.</p></div></div>

### Introduction to Arduino & Sensor Integration

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">Arduino</span> <span class="tech-tag">IR Sensor</span> <span class="tech-tag">Hardware Basics</span></div>

Before diving into complex embedded systems, I attended a hands-on introductory session focused on microcontrollers and sensors. We were provided with original Arduino boards, breadboards, IR sensors, and LEDs to learn the fundamentals of circuit building and hardware integration.

-   Understood digital and analog pin configurations on the Arduino.
-   Wired an IR sensor to control a red LED, observing the sensor''s blue indicator glow on light surfaces and the red LED glow on dark surfaces.
-   Gained practical experience bridging code with physical hardware components on a breadboard.

<div class="image-grid"><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/arduino-session-video1.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">IR sensor glowing blue for a white surface and activating the red LED for a dark surface.</p></div><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/arduino-session-video2.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">Further testing of the Arduino and breadboard circuit setup.</p></div></div>

### Arduino-Based Tic Tac Toe System

#### System Overview

Built an interactive 2-player game using Arduino Uno. Integrated LEDs, joystick, push button, and buzzer.

<div class="team-grid team-grid-compact"><div><h4 class="mt-0">Hardware</h4><ul class="mb-0"><li>Arduino Uno R3</li><li>9 LEDs (3×3 grid)</li><li>Joystick module</li><li>Push button</li><li>Buzzer</li><li>Breadboard + resistors</li></ul></div><div><h4 class="mt-0">Features</h4><ul class="mb-0"><li>Real-time cursor navigation using joystick</li><li>Turn-based gameplay</li><li>LED-based visual feedback</li><li>Win detection logic</li><li>Buzzer alert on win</li></ul></div></div>

#### Outcome

Developed a complete embedded system combining hardware control and real-time game logic.

<details><summary>👉 View Full Code</summary><div class="code-block-container mt-1"><pre class="code-block mb-0"><code class="language-cpp">// Define LED pins 
const int ledPins[9] = {2, 3, 4, 5, 6, 7, 8, 9, 10}; 
 
// Define input pins 
const int buttonPin = 12; 
const int buzzerPin = 13; 
const int vrxPin = A0; 
const int vryPin = A1; 
 
// Game variables 
int board[9] = {0}; // 0: empty, 1: X, 2: O 
int currentPlayer = 1; // 1: X, 2: O 
int selected = 0; // Selected cell index 
 
// Timing variables for blinking 
unsigned long previousMillis = 0; 
const long blinkInterval = 300; 
bool blinkState = false; 
 
void setup() { 
  for (int i = 0; i &lt; 9; i++) { 
    pinMode(ledPins[i], OUTPUT); 
    digitalWrite(ledPins[i], LOW); 
  } 
  pinMode(buttonPin, INPUT_PULLUP); 
  pinMode(buzzerPin, OUTPUT); 
  digitalWrite(buzzerPin, LOW); 
  Serial.begin(9600); 
} 
 
void loop() { 
  int xValue = analogRead(vrxPin); 
  int yValue = analogRead(vryPin); 
  selected = getSelectedCell(xValue, yValue); 
  blinkSelectedLED(); 
  if (digitalRead(buttonPin) == LOW) { 
    delay(200); 
    if (board[selected] == 0) { 
      board[selected] = currentPlayer; 
      if (checkWin(currentPlayer)) { 
        indicateWin(currentPlayer); 
        while (true); 
      } 
      currentPlayer = (currentPlayer == 1) ? 2 : 1; 
    } 
  } 
} 
 
int getSelectedCell(int x, int y) { 
  int row = 1; 
  int col = 1; 
  if (x &lt; 341) col = 0; 
  else if (x &gt; 682) col = 2; 
  if (y &lt; 341) row = 0; 
  else if (y &gt; 682) row = 2; 
  return row * 3 + col; 
} 
 
void blinkSelectedLED() { 
  unsigned long currentMillis = millis(); 
  if (currentMillis - previousMillis &gt;= blinkInterval) { 
    previousMillis = currentMillis; 
    blinkState = !blinkState; 
    for (int i = 0; i &lt; 9; i++) { 
      if (i == selected &amp;&amp; board[i] == 0) { 
        digitalWrite(ledPins[i], blinkState ? HIGH : LOW); 
      } else { 
        if (board[i] == 1) { 
          digitalWrite(ledPins[i], HIGH); 
        } else if (board[i] == 2) { 
          digitalWrite(ledPins[i], blinkState ? HIGH : LOW); 
        } else { 
          digitalWrite(ledPins[i], LOW); 
        } 
      } 
    } 
  } 
} 
 
bool checkWin(int player) { 
  int winCombos[8][3] = { 
    {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, 
    {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, 
    {0, 4, 8}, {2, 4, 6} 
  }; 
  for (int i = 0; i &lt; 8; i++) { 
    if (board[winCombos[i][0]] == player &amp;&amp; 
        board[winCombos[i][1]] == player &amp;&amp; 
        board[winCombos[i][2]] == player) { 
      return true; 
    } 
  } 
  return false; 
} 
 
void indicateWin(int player) { 
  digitalWrite(buzzerPin, HIGH); 
  delay(1000); 
  digitalWrite(buzzerPin, LOW); 
  for (int i = 0; i &lt; 9; i++) { 
    if (player == 1) { 
      if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8) { 
        digitalWrite(ledPins[i], HIGH); 
      } else { 
        digitalWrite(ledPins[i], LOW); 
      } 
    } else { 
      if (i != 4) { 
        digitalWrite(ledPins[i], HIGH); 
      } else { 
        digitalWrite(ledPins[i], LOW); 
      } 
    } 
  } 
}</code></pre><button class="copy-code-btn">Copy</button></div></details>

<div class="image-grid image-grid-compact"><figure class="project-image-container no-margin"><img src="../assets/aic-circuit.webp" alt="Circuit setup" class="grid-img" loading="lazy"><figcaption>Circuit setup</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/aic-o-wins.webp" alt="O wins" class="grid-img" loading="lazy"><figcaption>O wins</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/aic-x-wins.webp" alt="X wins" class="grid-img" loading="lazy"><figcaption>X wins</figcaption></figure></div>

### Innovation & Design Thinking Session

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">Design Thinking</span> <span class="tech-tag">Problem Solving</span> <span class="tech-tag">Product Ideation</span></div>

-   Participated in an intensive workshop covering the core frameworks of innovation and user-centric design.
-   Learned effective problem-solving methodologies to tackle real-world engineering and business challenges.
-   Explored strategies for transforming rough ideas into viable, scalable startup prototypes.

<figure class="project-image-container figure-constrained"><img src="../assets/design-thinking-workshop.webp" alt="Innovation and Design Thinking Session" class="grid-img" loading="lazy"><figcaption>Attending the Innovation &amp; Design Thinking session at AIC Nitte.</figcaption></figure>

### Startup Ecosystems Virtual Session

<div class="tech-stack tech-stack-no-margin tech-stack-start"><span class="tech-tag">Startup Ecosystems</span> <span class="tech-tag">Venture Scaling</span> <span class="tech-tag">Entrepreneurship</span></div>

**Date:** June 13, 2025 | **Format:** Virtual Masterclass

-   Participated in an intensive, day-long virtual session exploring the foundational pillars that build and sustain thriving startup ecosystems.
-   Gained insights into the complete startup lifecycle, from early-stage incubation and funding strategies to market acceleration.
-   Learned how emerging tech ventures navigate investor relations, product-market fit, and sustainable scaling.

<figure class="project-image-container figure-constrained"><img src="../assets/startup-ecosystem-meet.webp" alt="Startup Ecosystems Google Meet Session" class="grid-img" loading="lazy"><figcaption>Virtual session on Startup Ecosystems alongside fellow participants and the resource person.</figcaption></figure>

### Industrial Visit – SKF Elixer India Pvt Ltd

**Location:** Moodbidri, Mangalore, Karnataka

-   Observed real-world manufacturing processes.
-   Learned about industrial automation and production workflows.
-   Understood practical application of engineering concepts.

#### Industrial Visit Showcase

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/industrial-pic1.webp" alt="Industrial Visit Process 1" class="grid-img" loading="lazy"><figcaption>Inside the SKF Elixer manufacturing facility.</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/industrial-pic2.webp" alt="Industrial Visit Process 2" class="grid-img" loading="lazy"><figcaption>SKF Elixer India Pvt Ltd factory board.</figcaption></figure></div>

<div class="image-grid"><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/industrial-video1.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">Manufacturing process of Institutional water systems.</p></div><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/industrial-video2.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">Outside view of the manufacturing factory.</p></div></div>

<figure class="project-image-container figure-constrained"><img src="../assets/industrial-group-photo.webp" alt="Industrial Visit Group Photo" class="grid-img" loading="lazy"><figcaption>Group photo with peers and coordinators at the end of the industrial visit.</figcaption></figure>

### Internship Completion & Certification

<figure class="project-image-container figure-constrained"><img src="../assets/aic-receiving-certificate.webp" alt="Receiving the AIC Nitte Internship Certificate" class="grid-img" loading="lazy"><figcaption>Receiving the internship certificate upon successful completion.</figcaption></figure>

<figure class="project-image-container figure-constrained"><img src="../assets/aic-certificate-image.webp" alt="AIC Nitte Internship Certificate" class="grid-img" loading="lazy"><figcaption>Official AIC Nitte Internship Certificate.</figcaption></figure>

### Key Learnings

-   Bridged gap between digital design and physical manufacturing.
-   Learned embedded system design and hardware interfacing.
-   Gained exposure to real-world engineering environments.
-   Improved problem-solving through hands-on projects.

[![Scroll down](../assets/arrow.webp)](#contact)' 
WHERE read_more_url = '/experiences/aic-nitte';

-- Update MY Bharat Budget Quest
UPDATE public.experiences 
SET content = '<div class="btn-container add-margin-bottom"><a href="../assets/my-bharat-budget-national-certificate.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-color-2">View Certificate</a><div class="menu-container"><button class="menu-btn card-menu-btn" aria-label="More options" data-tooltip="More options"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg></button><div class="options-menu"><button class="menu-option btn-copy-link">Copy Link</button> <button class="menu-option btn-share">Share</button></div></div></div>

## Journey Highlights

The MY Bharat Budget Quest 2026 was a multi-stage national competition organized by the Ministry of Youth Affairs & Sports. My journey began with an online quiz, testing my awareness of India''s Union Budget and public policy. Successfully navigating this initial round, I advanced to the essay writing stage, where I authored a piece on the ''Future Economy: Digital, Technology and Innovation-based Economy,'' analyzing the transformative impact of digital infrastructure on India''s economic future. The excitement grew with each successive stage, culminating in the immense honor of being shortlisted from over 12 lakh participants for the prestigious Final Round.

## A Memorable Encounter

On the first day, **April 12, 2026**, while walking to the campus of The Art of Living International Center, we had the memorable experience of seeing Gurudev Sri Sri Ravi Shankar.

<div class="video-wrapper video-portrait"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/gurudev-sighting-video.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div>

A brief video capturing the moment we saw Gurudev Sri Sri Ravi Shankar.

<figure class="project-image-container figure-constrained"><img src="../assets/reception-pic.webp" alt="Reception area at The Art of Living Center" loading="lazy"><figcaption>The reception area at the center.</figcaption></figure>

Afterward, we visited a bookstore within the campus that featured photos of Gurudev Sri Sri Ravi Shankar alongside a vast collection of spiritual and literary books.

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/bookstore-pic1.webp" alt="Bookstore at The Art of Living Center" class="grid-img" loading="lazy"><figcaption>Exploring the spiritual literature and photos.</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/bookstore-pic2.webp" alt="Inside the campus bookstore" class="grid-img" loading="lazy"><figcaption>Inside the campus bookstore.</figcaption></figure></div>

Later in the afternoon, we headed to the campus cafeteria for lunch. The meal was simple, traditional, and home-style—a classic Indian thali. We enjoyed steamed white rice topped with yellow dal, accompanied by freshly made chapati and flavorful vegetable side dishes, perfectly complementing the serene atmosphere of the center.

<figure class="project-image-container figure-portrait"><img src="../assets/lunch-pic.webp" alt="Traditional Indian thali lunch at the cafeteria" loading="lazy"><figcaption>Enjoying a traditional, home-style Indian lunch at the campus cafeteria.</figcaption></figure>

### NARI SHAKTI – Viksit Bharat Ki Aawaz

In the evening, we attended the **NARI SHAKTI – Viksit Bharat Ki Aawaz** program. It was an inspiring experience to be part of the Nari Shakti Youth Parliament and to stand alongside fellow Viksit Bharat Young Leaders Dialogue (VBYLD) 2026 finalists who had traveled to Bharat Mandapam in Delhi. The atmosphere was filled with collaboration and a shared vision for youth empowerment.

<figure class="project-image-container figure-portrait"><img src="../assets/my-bharat-backdrop.webp" alt="Standing in front of the MY BHARAT BUDGET QUEST promotional backdrop" loading="lazy"><figcaption>Posing formally at the official MY BHARAT BUDGET QUEST photo area.</figcaption></figure>

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/nari-shakti-stage.webp" alt="Stage program of NARI SHAKTI - Viksit Bharat Ki Aawaz" class="grid-img" loading="lazy"><figcaption>Stage program of NARI SHAKTI – Viksit Bharat Ki Aawaz.</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/nari-shakti-event.webp" alt="Group photo of VBYLD''26 finalists at the Nari Shakti Youth Parliament" class="grid-img" loading="lazy"><figcaption>Posing with fellow VBYLD''26 finalists.</figcaption></figure><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/nari-shakti-speech.webp" alt="Posing for a speech at the podium" loading="lazy"><figcaption>Posing at the podium during the event.</figcaption></figure><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/nari-shakti-title.webp" alt="Posing with Nari Shakti title screen" loading="lazy"><figcaption>Posing with the event title screen.</figcaption></figure></div>

### Memories Gallery

These images capture some of the key moments and highlights from my participation in the event.

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/personal-memory-pic1.webp" alt="Personal memory from the event" class="grid-img" loading="lazy"><figcaption>Enjoying the vibrant atmosphere at the campus.</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/night-group-selfie.webp" alt="Candid selfie group shot at night in front of the illuminated structure" class="grid-img" loading="lazy"><figcaption>A cheerful, candid selfie moment with fellow participants.</figcaption></figure></div>

<figure class="project-image-container figure-portrait"><img src="../assets/night-group-seated.webp" alt="Seated group portrait on the illuminated steps" loading="lazy"><figcaption>A beautiful group portrait seated on the glowing steps of the structure.</figcaption></figure>

<div class="image-grid"><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/night-portrait-wide.webp" alt="Wide night portrait in front of illuminated architecture" loading="lazy"><figcaption>Standing before the beautifully illuminated architecture at night.</figcaption></figure><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/night-portrait-zoomed.webp" alt="Zoomed night portrait in front of illuminated architecture" loading="lazy"><figcaption>Enjoying the serene and elegant nighttime vibe.</figcaption></figure></div>

<div class="image-grid"><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/amphitheater-fountain.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">Fountain of water in the scenic amphitheater.</p></div><div><div class="video-wrapper video-portrait mt-0 mb-0"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/illuminated-monument.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div><p class="video-caption mt-1">The beautifully illuminated monument at night.</p></div></div>

<figure class="project-image-container figure-constrained"><img src="../assets/illuminated-monument-pic.webp" alt="The beautifully illuminated monument at night" loading="lazy"><figcaption>A stunning view of the illuminated monument at night.</figcaption></figure>

<div class="video-wrapper video-portrait"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/dinner-video.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div>

Enjoying dinner with fellow participants after the program.

## Day 2: Official Programs Begin

On the morning of **April 13, 2026**, the official events commenced. We started the day with a refreshing morning walk, followed by a hearty breakfast at the hotel to energize ourselves for the busy schedule ahead.

<div class="video-wrapper video-portrait"><video autoplay="" loop="" muted="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/morning-walk.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div>

A refreshing morning walk to start the day.

<div class="image-grid"><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/hotel-breakfast.webp" alt="Breakfast at the hotel" loading="lazy"><figcaption>Enjoying a hearty breakfast at the hotel.</figcaption></figure><figure class="project-image-container figure-portrait mt-0 mb-0"><img src="../assets/hotel-breakfast2.webp" alt="Morning ambiance outside the hotel" loading="lazy"><figcaption>Taking in the refreshing morning ambiance outside the hotel.</figcaption></figure></div>

Following breakfast, we visited the BYOGI wellness facility. The modern, eco-friendly building featured a clean white exterior, minimalistic architecture, and solar panel installations, nestled beautifully among lush greenery. Colorful posters highlighting yoga and holistic health adorned the windows, reflecting a peaceful, wellness-oriented atmosphere.

<figure class="project-image-container figure-constrained"><img src="../assets/byogi-wellness-center.webp" alt="BYOGI wellness and yoga center building" loading="lazy"><figcaption>The peaceful and eco-friendly BYOGI wellness facility on campus.</figcaption></figure>

### My Bharat Budget Quest - 2026

The core of the event featured insightful sessions and addresses by esteemed dignitaries. We had the privilege of listening to Smt. Shobha Karandlaje, Union Minister of State, who delivered an engaging speech highlighting youth empowerment and policy. Additionally, Dr. C. N. Manjunath, MP and renowned cardiologist, shared his valuable perspectives during the panel discussions. The grand stage setup, large LED displays, and impactful addresses set a formal and inspiring tone for the youth policy dialogues.

<figure class="project-image-container figure-constrained"><img src="../assets/guests-arriving.webp" alt="Esteemed dignitaries arriving at the event" loading="lazy"><figcaption>The arrival of the esteemed guests for the day''s sessions.</figcaption></figure>

<div class="image-grid"><figure class="project-image-container no-margin"><img src="../assets/shobha-karandlaje-speech.webp" alt="Smt. Shobha Karandlaje delivering a speech at the podium" class="grid-img" loading="lazy"><figcaption>Smt. Shobha Karandlaje addressing the audience.</figcaption></figure><figure class="project-image-container no-margin"><img src="../assets/dr-cn-manjunath-stage.webp" alt="Dr. C N Manjunath speaking at the main stage" class="grid-img" loading="lazy"><figcaption>Dr. C. N. Manjunath speaking during the panel discussion.</figcaption></figure></div>

<figure class="project-image-container figure-portrait"><img src="../assets/selfie-dr-cn-manjunath.webp" alt="Selfie with Dr. C N Manjunath and Maneesh P Shetty" loading="lazy"><figcaption>A memorable selfie with Dr. C. N. Manjunath alongside fellow VBYLD''26 finalist Maneesh P Shetty.</figcaption></figure>

### Virtual Dialogue with the Union Minister

Although the Hon''ble Prime Minister was originally scheduled to attend, he was unfortunately unable to join. On his behalf, Dr. Mansukh Mandaviya, the Hon''ble Union Minister of Youth Affairs and Sports, led the National-Level Virtual Dialogue, where we proudly represented **Zone 8 (Karnataka, Keralam, and Lakshadweep)**. Participating in this session was an unparalleled and deeply inspiring experience. It offered a direct opportunity to engage with national leadership on critical economic policies and the role of youth in shaping India''s future. The interaction reinforced my understanding of the complexities of governance and the profound impact of well-structured public policy. Witnessing the Minister''s vision for a ''Viksit Bharat'' firsthand was a truly memorable moment, deepening my commitment to contributing to national progress.

<figure class="project-image-container figure-constrained"><img src="../assets/pm-letter.webp" alt="Letter from the Hon''ble Prime Minister" loading="lazy"><figcaption>A special message from the Hon''ble Prime Minister addressed to the participants.</figcaption></figure>

<div class="video-wrapper"><video controls="" width="100%" preload="metadata" class="video-rounded"><source src="../assets/pm-letter-crowd-cheering.mp4" type="video/mp4"> Your browser does not support the video tag.</video></div>

The crowd erupts in joy upon seeing the Prime Minister''s letter.

<figure class="project-image-container figure-constrained"><img src="../assets/virtual-interaction-mandaviya-ji.webp" alt="Virtual interaction led by Dr. Mansukh Mandaviya" loading="lazy"><figcaption>Attending the virtual dialogue session led by Union Minister Dr. Mansukh Mandaviya.</figcaption></figure>

<figure class="project-image-container figure-constrained"><img src="../assets/virtual-interaction-auditorium.webp" alt="Wide shot of the indoor auditorium during the virtual interaction" loading="lazy"><figcaption>The large indoor auditorium hosting the live, multi-location digital engagement.</figcaption></figure>

The event concluded with a solemn and unifying moment as thousands of participants stood together for the National Anthem, marking the successful end of an inspiring national program.

<figure class="project-image-container figure-constrained"><img src="../assets/national-anthem-moment.webp" alt="Participants standing for the National Anthem" loading="lazy"><figcaption>A moment of unity and respect during the National Anthem at the conclusion of the program.</figcaption></figure>

[![Scroll down](../assets/arrow.webp)](#contact)' 
WHERE read_more_url = '/experiences/my-bharat-budget';