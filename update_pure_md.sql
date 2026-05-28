-- Update AIC Nitte
UPDATE public.experiences 
SET content = '[View Certificate](../assets/AIC-certificate.pdf)

## Overview

**Role:** Intern | **Organization:** AIC NITTE | **Duration:** 1st Year Internship

**Focus Areas:**

`3D Design` `Embedded Systems` `Hardware + Software Integration`

Hands-on internship focused on bridging digital design, hardware systems, and real-world engineering workflows.

### 3D Aircraft Modeling using Tinkercad

**Tools:**

`Tinkercad` `3D Printer`

#### What I Did

- Designed a complete 3D aircraft model using primitive shapes.
- Applied scaling, alignment, and geometric modeling principles.
- Prepared model for real-world manufacturing.

#### Process

- Created model using cubes, cylinders, cones.
- Exported as STL file.
- Printed using additive manufacturing.

#### Outcome

Successfully converted digital design -> physical 3D printed model.

![Simulation Image](../assets/aic-simulation.webp)
![Physical Printed Model](../assets/aic-physical-model.webp)

#### Model Showcase

![3D Aircraft Model demonstration](../assets/aircraft-portrait-video.mp4)

### 3D Scanning using Meshmixer

**Tools:**

`Mobile Camera` `Meshmixer`

#### What I Did

- Captured object images from multiple angles.
- Generated 3D model using photogrammetry.
- Cleaned and refined mesh.

#### Technical Work

- Used "Make Solid", "Smooth", "Close Cracks".
- Removed noise and improved surface quality.

#### Outcome

Converted physical object -> clean digital 3D model.

#### Scanning Showcase

![Classroom atmosphere during the workshop session](../assets/scanning-video1.mp4)
![9/11 attack simulation](../assets/scanning-video2.mp4)

### Introduction to Arduino & Sensor Integration

`Arduino` `IR Sensor` `Hardware Basics`

Before diving into complex embedded systems, I attended a hands-on introductory session focused on microcontrollers and sensors. We were provided with original Arduino boards, breadboards, IR sensors, and LEDs to learn the fundamentals of circuit building and hardware integration.

- Understood digital and analog pin configurations on the Arduino.
- Wired an IR sensor to control a red LED, observing the sensor''s blue indicator glow on light surfaces and the red LED glow on dark surfaces.
- Gained practical experience bridging code with physical hardware components on a breadboard.

![IR sensor glowing blue for a white surface and activating the red LED for a dark surface](../assets/arduino-session-video1.mp4)
![Further testing of the Arduino and breadboard circuit setup](../assets/arduino-session-video2.mp4)

### Arduino-Based Tic Tac Toe System

#### System Overview

Built an interactive 2-player game using Arduino Uno. Integrated LEDs, joystick, push button, and buzzer.

#### Hardware
- Arduino Uno R3
- 9 LEDs (3x3 grid)
- Joystick module
- Push button
- Buzzer
- Breadboard + resistors

#### Features
- Real-time cursor navigation using joystick
- Turn-based gameplay
- LED-based visual feedback
- Win detection logic
- Buzzer alert on win

#### Outcome

Developed a complete embedded system combining hardware control and real-time game logic.

```cpp
// Define LED pins 
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
  for (int i = 0; i < 9; i++) { 
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
  if (x < 341) col = 0; 
  else if (x > 682) col = 2; 
  if (y < 341) row = 0; 
  else if (y > 682) row = 2; 
  return row * 3 + col; 
} 
 
void blinkSelectedLED() { 
  unsigned long currentMillis = millis(); 
  if (currentMillis - previousMillis >= blinkInterval) { 
    previousMillis = currentMillis; 
    blinkState = !blinkState; 
    for (int i = 0; i < 9; i++) { 
      if (i == selected && board[i] == 0) { 
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
  for (int i = 0; i < 8; i++) { 
    if (board[winCombos[i][0]] == player && 
        board[winCombos[i][1]] == player && 
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
  for (int i = 0; i < 9; i++) { 
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
}
```

![Circuit setup](../assets/aic-circuit.webp)
![O wins](../assets/aic-o-wins.webp)
![X wins](../assets/aic-x-wins.webp)

### Innovation & Design Thinking Session

`Design Thinking` `Problem Solving` `Product Ideation`

- Participated in an intensive workshop covering the core frameworks of innovation and user-centric design.
- Learned effective problem-solving methodologies to tackle real-world engineering and business challenges.
- Explored strategies for transforming rough ideas into viable, scalable startup prototypes.

![Attending the Innovation & Design Thinking session at AIC Nitte.](../assets/design-thinking-workshop.webp)

### Startup Ecosystems Virtual Session

`Startup Ecosystems` `Venture Scaling` `Entrepreneurship`

**Date:** June 13, 2025 | **Format:** Virtual Masterclass

- Participated in an intensive, day-long virtual session exploring the foundational pillars that build and sustain thriving startup ecosystems.
- Gained insights into the complete startup lifecycle, from early-stage incubation and funding strategies to market acceleration.
- Learned how emerging tech ventures navigate investor relations, product-market fit, and sustainable scaling.

![Virtual session on Startup Ecosystems alongside fellow participants and the resource person.](../assets/startup-ecosystem-meet.webp)

### Industrial Visit - SKF Elixer India Pvt Ltd

**Location:** Moodbidri, Mangalore, Karnataka

- Observed real-world manufacturing processes.
- Learned about industrial automation and production workflows.
- Understood practical application of engineering concepts.

#### Industrial Visit Showcase

![Inside the SKF Elixer manufacturing facility.](../assets/industrial-pic1.webp)
![SKF Elixer India Pvt Ltd factory board.](../assets/industrial-pic2.webp)

![Manufacturing process of Institutional water systems.](../assets/industrial-video1.mp4)
![Outside view of the manufacturing factory.](../assets/industrial-video2.mp4)

![Group photo with peers and coordinators at the end of the industrial visit.](../assets/industrial-group-photo.webp)

### Internship Completion & Certification

![Receiving the internship certificate upon successful completion.](../assets/aic-receiving-certificate.webp)
![Official AIC Nitte Internship Certificate.](../assets/aic-certificate-image.webp)

### Key Learnings

- Bridged gap between digital design and physical manufacturing.
- Learned embedded system design and hardware interfacing.
- Gained exposure to real-world engineering environments.
- Improved problem-solving through hands-on projects.' 
WHERE read_more_url = '/experiences/aic-nitte';

-- Update MY Bharat Budget Quest
UPDATE public.experiences 
SET content = '[View Certificate](../assets/my-bharat-budget-national-certificate.pdf)

## Journey Highlights

The MY Bharat Budget Quest 2026 was a multi-stage national competition organized by the Ministry of Youth Affairs & Sports. My journey began with an online quiz, testing my awareness of India''s Union Budget and public policy. Successfully navigating this initial round, I advanced to the essay writing stage, where I authored a piece on the ''Future Economy: Digital, Technology and Innovation-based Economy,'' analyzing the transformative impact of digital infrastructure on India''s economic future. The excitement grew with each successive stage, culminating in the immense honor of being shortlisted from over 12 lakh participants for the prestigious Final Round.

## A Memorable Encounter

On the first day, **April 12, 2026**, while walking to the campus of The Art of Living International Center, we had the memorable experience of seeing Gurudev Sri Sri Ravi Shankar.

![A brief video capturing the moment we saw Gurudev Sri Sri Ravi Shankar.](../assets/gurudev-sighting-video.mp4)

![The reception area at the center.](../assets/reception-pic.webp)

Afterward, we visited a bookstore within the campus that featured photos of Gurudev Sri Sri Ravi Shankar alongside a vast collection of spiritual and literary books.

![Exploring the spiritual literature and photos.](../assets/bookstore-pic1.webp)
![Inside the campus bookstore.](../assets/bookstore-pic2.webp)

Later in the afternoon, we headed to the campus cafeteria for lunch. The meal was simple, traditional, and home-style - a classic Indian thali. We enjoyed steamed white rice topped with yellow dal, accompanied by freshly made chapati and flavorful vegetable side dishes, perfectly complementing the serene atmosphere of the center.

![Enjoying a traditional, home-style Indian lunch at the campus cafeteria.](../assets/lunch-pic.webp)

### NARI SHAKTI - Viksit Bharat Ki Aawaz

In the evening, we attended the **NARI SHAKTI - Viksit Bharat Ki Aawaz** program. It was an inspiring experience to be part of the Nari Shakti Youth Parliament and to stand alongside fellow Viksit Bharat Young Leaders Dialogue (VBYLD) 2026 finalists who had traveled to Bharat Mandapam in Delhi. The atmosphere was filled with collaboration and a shared vision for youth empowerment.

![Posing formally at the official MY BHARAT BUDGET QUEST photo area.](../assets/my-bharat-backdrop.webp)

![Stage program of NARI SHAKTI - Viksit Bharat Ki Aawaz.](../assets/nari-shakti-stage.webp)
![Posing with fellow VBYLD''26 finalists.](../assets/nari-shakti-event.webp)
![Posing at the podium during the event.](../assets/nari-shakti-speech.webp)
![Posing with the event title screen.](../assets/nari-shakti-title.webp)

### Memories Gallery

These images capture some of the key moments and highlights from my participation in the event.

![Enjoying the vibrant atmosphere at the campus.](../assets/personal-memory-pic1.webp)
![A cheerful, candid selfie moment with fellow participants.](../assets/night-group-selfie.webp)

![A beautiful group portrait seated on the glowing steps of the structure.](../assets/night-group-seated.webp)

![Standing before the beautifully illuminated architecture at night.](../assets/night-portrait-wide.webp)
![Enjoying the serene and elegant nighttime vibe.](../assets/night-portrait-zoomed.webp)

![Fountain of water in the scenic amphitheater.](../assets/amphitheater-fountain.mp4)
![The beautifully illuminated monument at night.](../assets/illuminated-monument.mp4)

![A stunning view of the illuminated monument at night.](../assets/illuminated-monument-pic.webp)

![Enjoying dinner with fellow participants after the program.](../assets/dinner-video.mp4)

## Day 2: Official Programs Begin

On the morning of **April 13, 2026**, the official events commenced. We started the day with a refreshing morning walk, followed by a hearty breakfast at the hotel to energize ourselves for the busy schedule ahead.

![A refreshing morning walk to start the day.](../assets/morning-walk.mp4)

![Enjoying a hearty breakfast at the hotel.](../assets/hotel-breakfast.webp)
![Taking in the refreshing morning ambiance outside the hotel.](../assets/hotel-breakfast2.webp)

Following breakfast, we visited the BYOGI wellness facility. The modern, eco-friendly building featured a clean white exterior, minimalistic architecture, and solar panel installations, nestled beautifully among lush greenery. Colorful posters highlighting yoga and holistic health adorned the windows, reflecting a peaceful, wellness-oriented atmosphere.

![The peaceful and eco-friendly BYOGI wellness facility on campus.](../assets/byogi-wellness-center.webp)

### My Bharat Budget Quest - 2026

The core of the event featured insightful sessions and addresses by esteemed dignitaries. We had the privilege of listening to Smt. Shobha Karandlaje, Union Minister of State, who delivered an engaging speech highlighting youth empowerment and policy. Additionally, Dr. C. N. Manjunath, MP and renowned cardiologist, shared his valuable perspectives during the panel discussions. The grand stage setup, large LED displays, and impactful addresses set a formal and inspiring tone for the youth policy dialogues.

![The arrival of the esteemed guests for the day''s sessions.](../assets/guests-arriving.webp)

![Smt. Shobha Karandlaje addressing the audience.](../assets/shobha-karandlaje-speech.webp)
![Dr. C. N. Manjunath speaking during the panel discussion.](../assets/dr-cn-manjunath-stage.webp)

![A memorable selfie with Dr. C. N. Manjunath alongside fellow VBYLD''26 finalist Maneesh P Shetty.](../assets/selfie-dr-cn-manjunath.webp)

### Virtual Dialogue with the Union Minister

Although the Hon''ble Prime Minister was originally scheduled to attend, he was unfortunately unable to join. On his behalf, Dr. Mansukh Mandaviya, the Hon''ble Union Minister of Youth Affairs and Sports, led the National-Level Virtual Dialogue, where we proudly represented **Zone 8 (Karnataka, Keralam, and Lakshadweep)**. Participating in this session was an unparalleled and deeply inspiring experience. It offered a direct opportunity to engage with national leadership on critical economic policies and the role of youth in shaping India''s future. The interaction reinforced my understanding of the complexities of governance and the profound impact of well-structured public policy. Witnessing the Minister''s vision for a ''Viksit Bharat'' firsthand was a truly memorable moment, deepening my commitment to contributing to national progress.

![A special message from the Hon''ble Prime Minister addressed to the participants.](../assets/pm-letter.webp)

![The crowd erupts in joy upon seeing the Prime Minister''s letter.](../assets/pm-letter-crowd-cheering.mp4)

![Attending the virtual dialogue session led by Union Minister Dr. Mansukh Mandaviya.](../assets/virtual-interaction-mandaviya-ji.webp)
![The large indoor auditorium hosting the live, multi-location digital engagement.](../assets/virtual-interaction-auditorium.webp)

The event concluded with a solemn and unifying moment as thousands of participants stood together for the National Anthem, marking the successful end of an inspiring national program.

![A moment of unity and respect during the National Anthem at the conclusion of the program.](../assets/national-anthem-moment.webp)' 
WHERE read_more_url = '/experiences/my-bharat-budget';