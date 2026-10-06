/* =====================================================================
   RIHITO'S JOURNAL · TEMPLATE DATA
   A fictional learner ("IOI") on a 24-month self-study path from
   first circuit to autonomous robots. Replace anything here, or use the
   Console page in the app to edit without touching code.
   Dates are relative to your start date, so the template never goes stale.
   ===================================================================== */

/* ---------- start date: Console edit > first visit (stored) ---------- */
const KEY="robojournal";
const START=(()=>{
  const z=n=>String(n).padStart(2,"0"), f=dt=>dt.getFullYear()+"-"+z(dt.getMonth()+1)+"-"+z(dt.getDate());
  try{const c=JSON.parse(localStorage.getItem(KEY+"-custom")||"{}"); if(c&&c.profile&&/^\d{4}-\d{2}-\d{2}$/.test(c.profile.start)) return c.profile.start;}catch(e){}
  let s=null; try{s=localStorage.getItem(KEY+"-start");}catch(e){}
  if(!s){const t=new Date(); t.setHours(0,0,0,0); t.setDate(t.getDate()-((t.getDay()+6)%7)); s=f(t); try{localStorage.setItem(KEY+"-start",s);}catch(e){}}
  return s;
})();
const _D=s=>new Date(s+"T00:00:00");
const _iso=dt=>dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0")+"-"+String(dt.getDate()).padStart(2,"0");
const W=n=>{const x=_D(START); x.setDate(x.getDate()+Math.round(n*7)); return _iso(x);};        // date n weeks after start
const MO=n=>{const x=_D(START); x.setMonth(x.getMonth()+n); return _iso(x);};                     // date n months after start
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FMT=s=>{const x=_D(s); return MON[x.getMonth()]+" "+x.getDate()+", "+x.getFullYear();};
const MY=s=>{const x=_D(s); return MON[x.getMonth()]+" "+x.getFullYear();};
const SPAN=(a,b)=>MY(a)+" – "+MY(b);
const WK=n=>"Wk "+(n+1)+" · "+FMT(W(n)).replace(/, \d{4}$/,"");

/* ---------- who this journal belongs to ---------- */
const PROFILE={
  key:KEY,
  name:"IOI", first:"IOI",
  title:"Rihito's Journal",
  titleWords:["RIHITO’S","JOURNAL"],
  code:"RJ24",
  currency:"$",
  start:START, end:MO(24),
  weekStart:1
};

const TEXT={
  brand:"IOI", brandSub:"Rihito's Journal",
  coords:"Day one · your city here",
  kicker:"A field log of everything I build, from a first circuit to <span>autonomous robots</span>",
  homeLine:"Every build, gate and test run on the way from a blinking LED to robots that see, map and fly, logged in one place.",
  capLeft:"Self-taught · <b>Robotics</b>", capRight:"24 months · <b>~15 h/week</b>",
  heroName:'<span>Robot</span><span class="o">Path</span>',
  lede:"From a first circuit to robots that map rooms and fly missions. Every build carries intention, data and a story you don't see in the code.",
  statement:"One microcontroller, one breadboard, one rule: <em>build it, measure it, write it down. Seven phases, about 15 hours a week.</em>",
  manifesto:"More than tutorials, more than parts, more than a certificate. A public record of robots that work, measured, logged and shared, one gate at a time.",
  applyEyebrow:"After the roadmap · month 20 onward",
  applyLede:"Three ways to turn the portfolio into the next step. Pick one as the main target and keep a second warm. Deadlines differ by country and company, so check each official page when its phase starts.",
  footer:"Rihito's Journal<br>First circuit → autonomous robot · 24 months",
  communityNote:"<b>Want people in person?</b> Look for a university robotics club, an IEEE Robotics and Automation Society student chapter, a local makerspace or a ROS meetup. Student competitions such as FIRST, VEX, RoboCup and F1TENTH welcome volunteers and mentors too.",
  credNote:"<b>Left out on purpose:</b> certificates of completion that only prove you watched videos. Committees and hiring managers weigh projects, code and measured results first. Providers change programmes, so re-check each page before you pay."
};

const COUNTDOWNS=[
  {label:"Days to the portfolio launch",date:MO(14),hard:1},
  {label:"Days to applications open",date:MO(19)},
  {label:"Days to the finish line",date:MO(24)}
];
const LX=[["Electronics","p1"],["Embedded","p1b"],["ROS 2","p3"],["Drones","p4"]];

const DAILY={
  from:"06:00", to:"24:00", slot:30,
  targets:[1,2,2,2,2,2,4],        // Sunday first
  acts:[["Build","#ff2a6d"],["Study","#05d9e8"],["Read","#d8a657"],["Math","#3dff9a"],["Review","#b18cff"]],
  plan:[["19:00-20:00 Review"],["19:00-21:00 Build"],["19:00-20:00 Math","20:00-21:00 Study"],["19:00-21:00 Build"],["19:00-20:00 Study","20:00-21:00 Read"],["19:00-21:00 Build"],["09:00-13:00 Build"]]
};

/* ---------- roadmap ---------- */
const STATUS=["Not started","In progress","Done","Skipped"], REVIEW=["Not yet","Day 7 done","Day 30 done"];
const _P=(k,code,name,a,b,gate,hard)=>({k,code,name,dates:SPAN(a,b),start:a,end:b,gate,hard:!!hard});
const PHASES=[
 _P("p1","PH 1","Electronics + Arduino",W(0),W(8),"Rebuild A1–A10 from memory; explain Ohm's law, PWM and a debounce in your own words."),
 _P("p1b","PH 1b","Embedded + ESP32",W(9),MO(5),"The E6 balance rig holds level when pushed, with logged step responses."),
 _P("p2","PH 2","Linux, Python + vision",MO(5),MO(9),"The P4 rover follows a coloured line and streams video over Wi-Fi."),
 _P("p3","PH 3","ROS 2 + mobile robots",MO(9),MO(14),"Robot maps a room with SLAM and drives to a clicked goal with Nav2.",1),
 _P("p4","PH 4","Drones + control",MO(14),MO(18),"A waypoint mission flown in simulation, then on hardware, launched from ROS 2."),
 _P("p5","PH 5","Autonomy + research",MO(18),MO(21),"A small research-style project with a question, baseline, results and a write-up.",1),
 _P("p6","PH 6","Capstone + launch",MO(21),MO(24),"Capstone demo video, portfolio site updated, applications or launch done."),
 {k:"lang",code:"CORE",name:"Math + languages",dates:"Ongoing",start:W(0),end:MO(24),gate:""},
 {k:"cred",code:"CRED",name:"Credentials",dates:"Optional",start:MO(6),end:MO(22),gate:""},
 {k:"port",code:"PORT",name:"Portfolio",dates:"Ongoing",start:W(0),end:MO(24),gate:""},
 {k:"skill",code:"SKILL",name:"Side skills",dates:"Just in time",start:W(4),end:MO(22),gate:""}
];
const I=(id,title,phase,target,due,star,desc)=>({id,title,phase,target,due,star:!!star,desc});
const ITEMS=[
 // PH 1 · electronics + Arduino (8 weeks)
 I("A1","Blink, then a button with debounce","p1",WK(0),W(1),1,"Digital I/O, pull-up resistors and software debounce."),
 I("A2","Multimeter drills: volts, amps, continuity","p1",WK(0),W(1),1,"Measure before you guess. Check every resistor you use this week."),
 I("A3","Traffic light state machine","p1",WK(1),W(2),0,"millis() instead of delay(), and a switch-case state machine."),
 I("A4","Dimmer with PWM and a potentiometer","p1",WK(2),W(3),1,"analogRead, map(), analogWrite; what duty cycle means."),
 I("A5","Serial plotter: log a light sensor","p1",WK(2),W(3),0,"A voltage divider with an LDR; plot it live and save the data."),
 I("A6","Servo sweep and a pan-tilt mount","p1",WK(3),W(4),0,"Servo timing, external power, common ground."),
 I("A7","DC motor with an H-bridge driver","p1",WK(4),W(5),1,"Direction and speed control; why motors need their own supply."),
 I("A8","Ultrasonic distance alarm","p1",WK(5),W(6),0,"Timing a pulse, filtering noisy readings with a moving average."),
 I("A9","IMU over I²C: read pitch and roll","p1",WK(6),W(7),1,"I²C addresses, raw gyro + accelerometer, a complementary filter."),
 I("A10","Obstacle-avoiding two-wheel car","p1",WK(7),W(8),1,"Phase 1 capstone: sensors + motors + a state machine in one robot."),
 // PH 1b · embedded + ESP32
 I("E1","ESP32 + FreeRTOS: two tasks, one queue","p1b","Month 3",W(11),1,"Tasks, priorities and queues instead of one giant loop()."),
 I("E2","Wi-Fi telemetry dashboard","p1b","Month 3",W(13),0,"Stream sensor data to a web page served by the ESP32."),
 I("E3","Encoder speed measurement with interrupts","p1b","Month 4",W(15),1,"Quadrature encoders, ISRs and why volatile matters."),
 I("E4","PID speed control of a DC motor","p1b","Month 4",W(17),1,"Tune P, then I, then D; log step responses and compare."),
 I("E5","Logic analyser: decode I²C and SPI","p1b","Month 4",W(18),0,"See the bus you've been trusting. A $10 clone is enough."),
 I("E6","One-axis balance rig with cascaded PID","p1b","Month 5",MO(5),1,"Two motors on a hinged bar hold level. The gate project."),
 // PH 2 · Linux, Python, vision
 I("P1","Raspberry Pi headless setup + SSH + Git","p2","Month 6",MO(5)+"",1,"Flash, SSH in, set up keys, push your first repo from the Pi."),
 I("P2","Python: sensor logger with plots","p2","Month 6",MO(6),0,"pandas + matplotlib; a CSV per run, plots in the README."),
 I("P3","OpenCV: colour tracking from the camera","p2","Month 7",MO(7),1,"HSV thresholds, contours, centroid; measure the frame rate."),
 I("P4","Line-following rover (Pi + ESP32)","p2","Month 8",MO(8),1,"Pi does vision, ESP32 does motors over UART. The gate project."),
 I("P5","Wheel odometry: drive a 1 m square","p2","Month 9",MO(9),0,"Encoder ticks to pose; measure and report the drift."),
 // PH 3 · ROS 2
 I("R1","ROS 2 tutorials: nodes, topics, services","p3","Month 10",MO(9)+"",1,"The official beginner tutorials, in C++ and Python."),
 I("R2","Describe your rover in URDF + RViz","p3","Month 10",MO(10),0,"Links, joints, TF frames; see the robot in RViz."),
 I("R3","Simulate it in Gazebo","p3","Month 11",MO(11),1,"Diff-drive plugin, a lidar plugin and a test world."),
 I("R4","SLAM: map a room","p3","Month 12",MO(12),1,"slam_toolbox with a cheap 2D lidar; save and reload the map."),
 I("R5","Nav2: drive to a clicked goal","p3","Month 13",MO(13),1,"Localise on the saved map and navigate around obstacles."),
 I("R6","ros2_control bridge to your ESP32","p3","Month 14",MO(14),0,"micro-ROS or a serial bridge; real hardware under Nav2."),
 // PH 4 · drones + control
 I("D1","Flight dynamics: forces on a quadrotor","p4","Month 15",MO(14)+"",1,"Thrust, torque, why a quad yaws; MathWorks' drone series."),
 I("D2","PX4 SITL: fly in simulation","p4","Month 15",MO(15),1,"PX4 + Gazebo; arm, take off, land from QGroundControl."),
 I("D3","Offboard control from ROS 2","p4","Month 16",MO(16),1,"Send setpoints over the uXRCE-DDS bridge; fly a square."),
 I("D4","Small indoor drone on hardware","p4","Month 17",MO(17),0,"A Crazyflie or a sub-250 g build; know your local drone rules first."),
 I("D5","Waypoint mission launched from ROS 2","p4","Month 18",MO(18),1,"Sim first, then hardware with a tether or a net. The gate project."),
 // PH 5 · autonomy + research
 I("X1","Read 10 papers in one sub-field","p5","Month 19",MO(19),1,"Three-pass reading; a one-paragraph summary per paper."),
 I("X2","Reproduce one paper's result","p5","Month 20",MO(20),1,"Open-source code, your own data or robot; report what differs."),
 I("X3","Visual odometry on your own camera","p5","Month 20",MO(20),0,"Feature tracking + pose from frames; compare against wheel odometry."),
 I("X4","Write it up as a short paper","p5","Month 21",MO(21),1,"Question, method, results, limitations. Overleaf template."),
 // PH 6 · capstone + launch
 I("C1","Capstone: pick a problem worth solving","p6","Month 22",MO(21)+"",1,"Talk to five people who'd use it before you build."),
 I("C2","Capstone build and test log","p6","Month 23",MO(23),1,"Weekly measurable milestones; failures go in the log too."),
 I("C3","Demo video + launch post","p6","Month 24",MO(24),1,"Two minutes: the problem, the robot, it working, the numbers."),
 I("G1","Applications or launch done","p6","Month 24",MO(24),1,"Grad school, jobs or a first customer: whichever route you chose on Apply."),
 // core: math + languages
 I("L1","Python fundamentals","lang","Months 1–2",W(8),1,"Functions, classes, files, virtual environments."),
 I("L2","C++ for embedded and ROS","lang","Months 3–6",MO(6),1,"learncpp.com chapters 1–12, then classes and smart pointers."),
 I("L3","Linear algebra","lang","Months 4–8",MO(8),1,"Vectors, matrices, rotations; 3Blue1Brown, then MIT 18.06."),
 I("L4","Calculus + differential equations refresher","lang","Months 6–9",MO(9),0,"Enough to read a control or dynamics derivation."),
 I("L5","Probability for robotics","lang","Months 10–13",MO(13),1,"Bayes, Gaussians, the Kalman filter."),
 // credentials (optional, evaluated)
 I("CR1","ROS 2 skills certification (project-evaluated)","cred","Month 14",MO(14),0,"Tests a working robot, not course completion."),
 I("CR2","Coursera Modern Robotics specialization","cred","Months 9–16",MO(16),0,"Graded assignments with code; audit it free first."),
 I("CR3","NVIDIA Jetson AI Specialist","cred","Month 20",MO(20),0,"An open-source Jetson project reviewed by NVIDIA."),
 // portfolio
 I("PF1","GitHub profile README + first repo","port","Week 1",W(1),1,"One line about you, your focus, pinned repos."),
 I("PF2","Project README template in every repo","port","Week 2",W(2),1,"Result first, GIF, how it works, how to run it, lessons."),
 I("PF3","First demo video","port","Month 2",W(8),0,"60–120 seconds: problem, build, it working, what broke."),
 I("PF4","Personal site live","port","Month 6",MO(6),1,"GitHub Pages: About, Projects, CV, Blog."),
 I("PF5","First merged open-source PR","port","Month 13",MO(13),0,"Docs fix in ROS 2, Nav2 or PX4, then a small bug."),
 I("PF6","Portfolio launch: 6 pinned projects","port","Month 14",MO(14),1,"Each with a video, a README and a measured result."),
 I("PF7","CV v1 in Overleaf","port","Month 19",MO(19),1,"Two pages; one line per project with a number in it.")
];

/* ---------- learning resources ---------- */
const TRACKS=[
 {k:"elec",name:"Electronics & Arduino",ph:"p1",lead:"Circuits and microcontroller code before anything else."},
 {k:"rtos",name:"Embedded & ESP32",ph:"p1b",lead:"Multitasking firmware, interrupts and control loops."},
 {k:"tools",name:"Linux, Git & tools",ph:"p2",lead:"Every robot computer runs Linux; every project lives in Git."},
 {k:"cpp",name:"Python & C++",ph:"lang",lead:"Python for prototyping and data, C++ for the robot."},
 {k:"vision",name:"Computer vision",ph:"p2",lead:"From colour thresholds to deep learning."},
 {k:"ros",name:"ROS 2",ph:"p3",lead:"The common language of research and industry robots."},
 {k:"math",name:"Math, control & estimation",ph:"lang",lead:"The theory behind every robot that works."},
 {k:"drone",name:"Drones & aerial autonomy",ph:"p4",lead:"Flight stacks, dynamics and visual navigation."},
 {k:"research",name:"Courses & research",ph:"p5",lead:"University courses that are free online, and how to read papers."}
];
const R=(track,title,by,kind,cost,best,why,url,when)=>({track,title,by,kind,cost,best:!!best,why,url,when});
const RES=[
 R("elec","Arduino documentation and built-in examples","Arduino","Docs","Free",1,"Every example in Phase 1 starts here.","https://docs.arduino.cc/","Phase 1"),
 R("elec","Arduino lessons","Paul McWhorter · YouTube","Video","Free",1,"Patient, structured and project-based. A favourite in r/arduino beginner threads.","https://www.youtube.com/@paulmcwhorter","Phase 1"),
 R("elec","Practical Electronics for Inventors","Scherz & Monk","Book","Paid",0,"The desk reference for every part you wire.","https://openlibrary.org/search?q=Practical+Electronics+for+Inventors","Keep at your desk"),
 R("rtos","ESP-IDF Programming Guide","Espressif","Docs","Free",1,"The official reference for the ESP32.","https://docs.espressif.com/projects/esp-idf/en/latest/esp32/","Phase 1b"),
 R("rtos","Introduction to RTOS","Shawn Hymel · DigiKey","Video","Free",1,"Twelve short parts that make FreeRTOS click.","https://www.digikey.com/en/videos/d/digi-key-electronics/introduction-to-rtos-part-2-getting-started-with-frertos","Phase 1b"),
 R("rtos","Modern Embedded Systems Programming","Miro Samek","Video","Free",0,"What happens under Arduino's functions, in bare-metal C.","https://www.state-machine.com/video-course","After Phase 1b"),
 R("rtos","Random Nerd Tutorials","Rui & Sara Santos","Tutorials","Free",0,"Recipes for ESP32 Wi-Fi, web servers and sensors.","https://randomnerdtutorials.com/","Phase 1b"),
 R("tools","The Missing Semester of Your CS Education","MIT CSAIL","Course","Free",1,"Shell, Git, editors and debugging: the tools no class teaches.","https://missing.csail.mit.edu/","Phase 2"),
 R("tools","The Linux Command Line","William Shotts","Book","Free",0,"Free book; read the first half before ROS 2.","https://linuxcommand.org/tlcl.php","Phase 2"),
 R("tools","Pro Git","Chacon & Straub","Book","Free",0,"Chapters 1–3 are all you need at first.","https://git-scm.com/book/en/v2","Week 1"),
 R("cpp","Scientific Computing with Python","freeCodeCamp","Course","Free",1,"Project-based Python with a free certification.","https://www.freecodecamp.org/learn/scientific-computing-with-python/","Months 1–2"),
 R("cpp","CS50x: Introduction to Computer Science","Harvard · edX","Course","Free",0,"If you've never programmed, start here; C first, then Python.","https://cs50.harvard.edu/x/","Before Phase 1"),
 R("cpp","learncpp.com","learncpp.com","Tutorial","Free",1,"The best free C++ course on the web.","https://www.learncpp.com/","Months 3–6"),
 R("cpp","Python tutorial","Python Software Foundation","Docs","Free",0,"The official tutorial; short and complete.","https://docs.python.org/3/tutorial/","Month 1"),
 R("vision","First Principles of Computer Vision","Shree Nayar · Columbia","Video","Free",1,"Image formation to 3D vision, beautifully explained.","https://fpcv.cs.columbia.edu/","Phase 2"),
 R("vision","OpenCV tutorials","OpenCV","Docs","Free",0,"Python tutorials for every function you'll use.","https://docs.opencv.org/4.x/","Phase 2"),
 R("vision","CS231n: Deep Learning for Computer Vision","Stanford","Course","Free",0,"Lecture notes and assignments for CNNs and beyond.","https://cs231n.stanford.edu/","Phase 5"),
 R("ros","ROS 2 documentation and tutorials","Open Robotics","Docs","Free",1,"Do the beginner tutorials in order, both languages.","https://docs.ros.org/","Phase 3"),
 R("ros","Articulated Robotics","Josh Newans","Video","Free",1,"Build a ROS 2 robot from scratch; clear and current.","https://articulatedrobotics.xyz/","Phase 3"),
 R("ros","Nav2 documentation","Open Navigation","Docs","Free",0,"Concepts, tutorials and tuning guide.","https://docs.nav2.org/","Phase 3"),
 R("ros","Duckietown","Duckietown","Course + kit","Free",0,"An MIT-born course on small autonomous cars, with free materials.","https://duckietown.com/","Phase 3"),
 R("ros","RoboRacer (F1TENTH) course kit","RoboRacer Foundation","Course","Free",0,"Autonomous racing on 1/10 scale cars: lectures and labs for perception, planning and control.","https://f1tenth-coursekit.readthedocs.io/","Phase 5"),
 R("math","Essence of Linear Algebra","3Blue1Brown","Video","Free",1,"The intuition first. Watch before any linear algebra course.","https://www.3blue1brown.com/topics/linear-algebra","Month 4"),
 R("math","Linear Algebra 18.06","Gilbert Strang · MIT OCW","Course","Free",0,"The classic course; problem sets with solutions.","https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/","Months 5–8"),
 R("math","Control System Lectures","Brian Douglas","Video","Free",1,"PID, state space and Kalman filters without the fog.","https://www.youtube.com/@BrianBDouglas","Phase 1b onward"),
 R("math","Control Bootcamp","Steve Brunton","Video","Free",0,"Modern control in short, sharp lectures.","https://www.youtube.com/@Eigensteve","Phase 4"),
 R("math","Probabilistic Robotics","Thrun, Burgard & Fox","Book","Paid",1,"The standard text for localisation and SLAM.","https://robots.stanford.edu/probabilistic-robotics/","Phase 3"),
 R("math","PythonRobotics","Atsushi Sakai et al. · GitHub","Code","Free",1,"Readable Python for EKF, particle filters, A*, RRT, MPC and more.","https://github.com/AtsushiSakai/PythonRobotics","Phases 3–5"),
 R("drone","PX4 User and Developer Guide","Dronecode","Docs","Free",1,"Simulation, ROS 2 integration and offboard control.","https://docs.px4.io/","Phase 4"),
 R("drone","Drone Simulation and Control","MathWorks · Brian Douglas","Video","Free",1,"Five parts on how a quadcopter flies and is controlled.","https://www.mathworks.com/videos/series/drone-simulation-and-control.html","Phase 4"),
 R("drone","Visual Navigation for Autonomous Vehicles","Luca Carlone · MIT","Course","Free",0,"VIO, SLAM and perception for drones; full lecture notes.","https://vnav.mit.edu/","Phase 5"),
 R("drone","Crazyflie 2.1","Bitcraze","Platform","Paid",0,"A small open-source drone used in research labs.","https://www.bitcraze.io/","Phase 4"),
 R("research","Modern Robotics specialization","Kevin Lynch · Northwestern · Coursera","Course","Free",1,"Kinematics, dynamics, planning and control with a free textbook and videos.","https://www.coursera.org/specializations/modernrobotics","Phases 3–4"),
 R("research","Self-Driving Cars specialization","University of Toronto · Coursera","Course","Free",0,"State estimation, perception and planning for autonomous vehicles.","https://www.coursera.org/specializations/self-driving-cars","Phase 5"),
 R("research","Introduction to Robotics (2.12)","MIT OpenCourseWare","Course","Free",0,"Lecture notes and labs from MIT's undergraduate robotics course.","https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/","Phase 3"),
 R("research","Underactuated Robotics","Russ Tedrake · MIT","Course","Free",0,"Online textbook and lectures on control for walking and flying machines.","https://underactuated.mit.edu/","After Phase 4"),
 R("research","Robotic Manipulation","Russ Tedrake · MIT","Course","Free",0,"Perception, planning and control for robot arms, with notebooks.","https://manipulation.mit.edu/","Optional"),
 R("research","awesome-robotics","kiloreux · GitHub","List","Free",0,"A curated map of courses, books, simulators and libraries.","https://github.com/kiloreux/awesome-robotics","Any time"),
 R("research","arXiv cs.RO","arXiv","Papers","Free",0,"New robotics papers daily. Skim titles weekly from Phase 5.","https://arxiv.org/list/cs.RO/recent","Phase 5"),
 R("cpp","Introduction to CS and Programming in Python (6.0001)","MIT OpenCourseWare","Course","Free",0,"MIT's first programming course: lectures, problem sets and readings, all free.","https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/","Months 1–3"),
 R("cpp","freeCodeCamp on YouTube","freeCodeCamp","Video","Free",0,"Full-length free courses on Python, C++, Linux, Git and more.","https://www.youtube.com/@freecodecamp","Any time"),
 R("elec","Circuits and Electronics (6.002)","MIT OpenCourseWare","Course","Free",0,"The circuit theory behind every board you wire, with problem sets.","https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/","Phases 1–1b"),
 R("elec","Electrical engineering","Khan Academy","Course","Free",0,"Short lessons on circuits and electronics, good for filling gaps.","https://www.khanacademy.org/science/electrical-engineering","Phase 1"),
 R("math","Linear algebra","Khan Academy","Course","Free",0,"Vectors, matrices and transformations with practice exercises.","https://www.khanacademy.org/math/linear-algebra","Months 4–8"),
 R("math","Differential Equations (18.03)","MIT OpenCourseWare","Course","Free",0,"The maths behind dynamics and control.","https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/","Months 6–9"),
 R("math","Probabilistic Systems Analysis (6.041SC)","MIT OpenCourseWare","Course","Free",0,"Probability for estimation and SLAM, with recitation videos.","https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/","Months 10–13")
];

/* ---------- credentials ---------- */
const CREDS=[
 {tier:"Worth it",lead:"Evaluated by exam or graded project, and read as real skill.",items:[
  {name:"ROS 2 skills certification",by:"The Construct, with Open Robotics",how:"Final project tested on real remote robots, then presented live.",when:"Month 14 (CR1)",cost:"Course subscription",val:4,why:"The only ROS credential that tests a working robot rather than course completion.",url:"https://discourse.openrobotics.org/t/new-ros-2-skills-certification-courses/42181"},
  {name:"Modern Robotics specialization",by:"Northwestern University · Coursera",how:"Graded programming assignments and quizzes.",when:"Months 9–16 (CR2)",cost:"Free to audit; paid certificate",val:3,why:"Rigorous kinematics and control; the textbook and videos are free.",url:"https://www.coursera.org/specializations/modernrobotics"},
  {name:"NVIDIA Jetson AI Specialist",by:"NVIDIA Deep Learning Institute",how:"Open-source Jetson project, reviewed and graded by NVIDIA.",when:"Month 20 (CR3)",cost:"Free (needs a Jetson)",val:3,why:"Project-evaluated embedded AI on hardware your robot may carry.",url:"https://blogs.nvidia.com/blog/jetson-ai-specialists-certification-program"}]},
 {tier:"Nice to have",lead:"Free, low effort, and good structure while you learn.",items:[
  {name:"Scientific Computing with Python",by:"freeCodeCamp",how:"Five required projects that must pass tests.",when:"Months 1–2",cost:"Free",val:2,why:"A structured way to prove the Python basics.",url:"https://www.freecodecamp.org/learn/scientific-computing-with-python/"}]}
];

/* ---------- side skills (learn just in time) ---------- */
const L=(t,u,c,best)=>({t,u,c,best:!!best});
const DOMAINS=[
 {k:"mech",name:"Mechanical & making",lead:"Why your robot vibrates, flexes or won't fit: the physical side of the code."},
 {k:"elec",name:"Electrical hardware",lead:"Power, noise and boards, so sensors and motors stop fighting each other."},
 {k:"design",name:"Design & communication",lead:"So your site and videos look as good as the engineering behind them."},
 {k:"biz",name:"Product & market",lead:"Whether people actually want what you build."}
];
const SKILLS=[
 {id:"K1",d:"mech",t:"CAD basics in Onshape",when:"Month 2 · before A10",why:"Design mounts and brackets instead of taping things on.",learn:["Sketches and constraints, then extrudes","Parts, assemblies and mates","Export STL for printing"],res:[L("Onshape Learning Center","https://learn.onshape.com/","Free",1),L("FreeCAD","https://www.freecad.org/","Free")],ask:"Onshape forum · r/cad"},
 {id:"K2",d:"mech",t:"Design for 3D printing",when:"Month 7 · P4 rover",why:"Parts that print right the first time.",learn:["Orientation and layer strength","Tolerances for press-fits","Heat-set inserts"],res:[L("CNC Kitchen","https://www.youtube.com/@CNCKitchen","Free",1),L("Printables","https://www.printables.com/","Free")],ask:"r/3Dprinting"},
 {id:"K3",d:"elec",t:"Power: batteries, regulators, grounding",when:"Month 4 · E6 rig",why:"Most 'random' resets are power problems.",learn:["LiPo safety and charging","Buck converters vs linear regulators","Star grounding and decoupling capacitors"],res:[L("Battery University","https://batteryuniversity.com/","Free",1),L("EEVblog","https://www.youtube.com/@EEVblog","Free")],ask:"EEVblog forum · r/AskElectronics"},
 {id:"K4",d:"elec",t:"PCB design in KiCad",when:"Month 12",why:"Replace the rat's nest of jumpers with a board that doesn't come loose.",learn:["Schematic, footprints, layout","Design rules and Gerbers","Order from a fab"],res:[L("KiCad documentation","https://docs.kicad.org/","Free",1),L("Phil's Lab","https://www.youtube.com/@PhilsLab","Free")],ask:"KiCad forum · r/PrintedCircuitBoard"},
 {id:"K5",d:"design",t:"Shoot and edit a demo video",when:"Month 2 · PF3",why:"A 90-second video is read more than any README.",learn:["Shot list: problem, build, it working, numbers","Cut in DaVinci Resolve","Captions and a thumbnail"],res:[L("DaVinci Resolve","https://www.blackmagicdesign.com/products/davinciresolve","Free",1)],ask:"r/videography"},
 {id:"K6",d:"design",t:"A clean portfolio site",when:"Month 6 · PF4",why:"Your projects deserve a page that loads fast and reads well.",learn:["GitHub Pages","Type scale and spacing","One accent colour"],res:[L("GitHub Pages","https://pages.github.com/","Free",1),L("Refactoring UI (blog)","https://www.refactoringui.com/","Free")],ask:"r/web_design"},
 {id:"K7",d:"biz",t:"Customer interviews",when:"Month 21 · C1",why:"Find out whether anyone needs your capstone before you build it.",learn:["Ask about their past, not your idea","Five interviews, one page of notes each"],res:[L("The Mom Test","https://www.momtestbook.com/","Paid",1),L("YC Startup School","https://www.startupschool.org/","Free")],ask:"r/startups"}
];
const _KD={K1:W(7),K2:MO(7),K3:MO(4),K4:MO(12),K5:W(8),K6:MO(6),K7:MO(21)};
SKILLS.forEach(s=>ITEMS.push({id:s.id,title:s.t,phase:"skill",target:s.when,due:_KD[s.id],star:false,desc:s.why}));

/* ---------- community ---------- */
const COMM=[
 {k:"Start here",ph:"p1",list:[["r/robotics: getting started wiki","Reddit","https://www.reddit.com/r/robotics/wiki/index/","The subreddit's own beginner guide and FAQ."],["r/arduino","Reddit","https://www.reddit.com/r/arduino/","Friendly help for first projects."],["Arduino Forum","Forum","https://forum.arduino.cc/","The official forum; search it first."]]},
 {k:"Embedded & ESP32",ph:"p1b",list:[["r/embedded","Reddit","https://www.reddit.com/r/embedded/","Firmware careers and deep embedded topics."],["ESP32 forum","Forum","https://esp32.com/","Espressif engineers answer here."]]},
 {k:"Robotics & ROS 2",ph:"p3",list:[["ROS Discourse","Forum","https://discourse.openrobotics.org/","Official ROS announcements and help."],["Robotics Stack Exchange","Q&A","https://robotics.stackexchange.com/","Where ROS Answers moved; precise questions get precise answers."],["r/ROS","Reddit","https://www.reddit.com/r/ROS/","Quick questions and project show-offs."]]},
 {k:"Drones",ph:"p4",list:[["PX4 Discuss","Forum","https://discuss.px4.io/","PX4 developers and users."],["ArduPilot Discourse","Forum","https://discuss.ardupilot.org/","The other big open flight stack."]]},
 {k:"Vision & research",ph:"p5",list:[["OpenCV forum","Forum","https://forum.opencv.org/","OpenCV maintainers and users."],["Academia Stack Exchange","Q&A","https://academia.stackexchange.com/","Supervisors, papers and grad school."]]}
];

/* ---------- links per item ---------- */
const YT=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);
const LINKS={
 A1:[["Arduino: Debounce example","https://docs.arduino.cc/built-in-examples/digital/Debounce/"],["Video lessons",YT("arduino button debounce tutorial")]],
 A2:[["How to use a multimeter (SparkFun)","https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter/all"]],
 A3:[["Arduino: BlinkWithoutDelay","https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/"]],
 A4:[["Arduino: Fading with PWM","https://docs.arduino.cc/built-in-examples/analog/Fading/"],["What is PWM","https://docs.arduino.cc/learn/microcontrollers/analog-output/"]],
 A5:[["Arduino: AnalogReadSerial","https://docs.arduino.cc/built-in-examples/basics/AnalogReadSerial/"]],
 A6:[["Arduino: Servo sweep","https://docs.arduino.cc/tutorials/generic/basic-servo-control/"]],
 A7:[["Motor drivers explained",YT("arduino L298N TB6612 motor driver tutorial")]],
 A8:[["Ultrasonic sensor guide (Random Nerd)","https://randomnerdtutorials.com/complete-guide-for-ultrasonic-sensor-hc-sr04/"]],
 A9:[["Arduino: Wire (I²C) library","https://docs.arduino.cc/language-reference/en/functions/communication/wire/"],["Complementary filter explained",YT("complementary filter IMU arduino")]],
 A10:[["Obstacle-avoiding robot builds",YT("arduino obstacle avoiding robot car")]],
 E1:[["Introduction to RTOS (DigiKey)","https://www.digikey.com/en/videos/d/digi-key-electronics/introduction-to-rtos-part-2-getting-started-with-frertos"],["ESP-IDF FreeRTOS","https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/freertos.html"]],
 E2:[["ESP32 web server (Random Nerd)","https://randomnerdtutorials.com/esp32-web-server-arduino-ide/"]],
 E3:[["ESP-IDF pulse counter","https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/pcnt.html"]],
 E4:[["Understanding PID control (MathWorks)","https://www.mathworks.com/videos/series/understanding-pid-control.html"]],
 E5:[["sigrok PulseView","https://sigrok.org/wiki/PulseView"]],
 E6:[["Control System Lectures","https://www.youtube.com/@BrianBDouglas"],["Balance rig builds",YT("propeller balance beam PID arduino")]],
 P1:[["Raspberry Pi documentation","https://www.raspberrypi.com/documentation/"],["Pro Git","https://git-scm.com/book/en/v2"]],
 P2:[["pandas getting started","https://pandas.pydata.org/docs/getting_started/index.html"],["matplotlib tutorials","https://matplotlib.org/stable/tutorials/index.html"]],
 P3:[["OpenCV documentation (Python tutorials: colour spaces, contours)","https://docs.opencv.org/4.x/"]],
 P4:[["Line follower with OpenCV",YT("raspberry pi opencv line follower robot")]],
 P5:[["Wheel odometry explained",YT("differential drive wheel odometry")]],
 R1:[["ROS 2 beginner tutorials","https://docs.ros.org/en/jazzy/Tutorials.html"]],
 R2:[["URDF tutorials","https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html"],["Articulated Robotics","https://articulatedrobotics.xyz/"]],
 R3:[["Gazebo documentation","https://gazebosim.org/docs"]],
 R4:[["slam_toolbox","https://github.com/SteveMacenski/slam_toolbox"]],
 R5:[["Nav2 documentation: Getting Started","https://docs.nav2.org/"]],
 R6:[["micro-ROS","https://micro.ros.org/"],["ros2_control","https://control.ros.org/"]],
 D1:[["Drone Simulation and Control (MathWorks)","https://www.mathworks.com/videos/series/drone-simulation-and-control.html"]],
 D2:[["PX4 simulation","https://docs.px4.io/main/en/simulation/"]],
 D3:[["PX4 ROS 2 offboard example","https://docs.px4.io/main/en/ros2/offboard_control.html"]],
 D4:[["Crazyflie getting started","https://www.bitcraze.io/documentation/start/"]],
 D5:[["PX4 missions","https://docs.px4.io/main/en/flying/missions.html"]],
 X1:[["How to Read a Paper (Keshav)","https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf"],["arXiv cs.RO","https://arxiv.org/list/cs.RO/recent"]],
 X2:[["Papers with Code","https://paperswithcode.com/"]],
 X3:[["Visual Navigation for Autonomous Vehicles","https://vnav.mit.edu/"]],
 X4:[["Overleaf","https://www.overleaf.com/"]],
 C1:[["The Mom Test","https://www.momtestbook.com/"]],
 L1:[["Scientific Computing with Python (freeCodeCamp)","https://www.freecodecamp.org/learn/scientific-computing-with-python/"],["Python tutorial","https://docs.python.org/3/tutorial/"]],
 L2:[["learncpp.com","https://www.learncpp.com/"]],
 L3:[["Essence of Linear Algebra","https://www.3blue1brown.com/topics/linear-algebra"],["MIT 18.06","https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"]],
 L4:[["Khan Academy: differential equations","https://www.khanacademy.org/math/differential-equations"]],
 L5:[["Kalman filter explained (MathWorks)","https://www.mathworks.com/videos/series/understanding-kalman-filters.html"],["PythonRobotics","https://github.com/AtsushiSakai/PythonRobotics"]],
 CR1:[["ROS 2 skills certification","https://discourse.openrobotics.org/t/new-ros-2-skills-certification-courses/42181"]],
 CR2:[["Modern Robotics on Coursera","https://www.coursera.org/specializations/modernrobotics"],["Free textbook and videos","https://hades.mech.northwestern.edu/index.php/Modern_Robotics"]],
 CR3:[["Jetson AI certification","https://blogs.nvidia.com/blog/jetson-ai-specialists-certification-program"]],
 PF1:[["Profile README guide","https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"]],
 PF4:[["GitHub Pages","https://pages.github.com/"]],
 PF5:[["ROS 2 contributing guide","https://docs.ros.org/en/rolling/The-ROS2-Project/Contributing.html"]],
 PF7:[["Overleaf CV templates","https://www.overleaf.com/latex/templates/tagged/cv"]]
};
SKILLS.forEach(k=>{LINKS[k.id]=k.res.map(r=>[r.t,r.u]);});
const MAIN=PHASES.filter(p=>!["lang","cred","port","skill"].includes(p.k));

/* ---------- dates, tools, highlights ---------- */
const HARD=[
 [MY(MO(6)),"Personal site live",MO(6),0,"https://pages.github.com/"],
 [MY(MO(14)),"Portfolio launch: 6 pinned projects",MO(14),1,""],
 [MY(MO(19)),"Applications open (check each target)",MO(19),1,""],
 [MY(MO(24)),"Capstone demo and launch",MO(24),0,""]
];
const TOOLS=[["Arduino","p1","PH 1","https://docs.arduino.cc/"],["ESP32 · ESP-IDF","p1b","PH 1b","https://docs.espressif.com/projects/esp-idf/en/latest/esp32/"],["FreeRTOS","p1b","PH 1b","https://www.freertos.org/"],["Raspberry Pi","p2","PH 2","https://www.raspberrypi.com/documentation/"],["OpenCV","p2","PH 2","https://docs.opencv.org/4.x/"],["Python · C++","lang","Core","https://www.learncpp.com/"],["ROS 2","p3","PH 3","https://docs.ros.org/"],["Gazebo · Nav2","p3","PH 3","https://docs.nav2.org/"],["PX4","p4","PH 4","https://docs.px4.io/"],["PythonRobotics","p5","PH 5","https://github.com/AtsushiSakai/PythonRobotics"],["KiCad · Onshape","skill","Skills","https://docs.kicad.org/"]];
const FLAG=["A10","E6","P4","R5","D5","X2","C3"];

const PLAN=[
 {id:"how",h:"How the plan works",sub:`${SPAN(START,MO(24))} · about 1,300 usable hours`,body:`<p>Twenty-four months at 12–18 hours a week, with a 20% buffer for exams, holidays and bad weeks. Each phase ends in a <b>gate</b>: a project you either finish or don't. Dates are calculated from your start date, so change it in the Console and everything moves.</p><div class="mini-wrap"><table class="mini"><tr><th>Mode</th><th>When</th><th>Hours/wk</th><th>Rule</th></tr><tr><td>Normal</td><td>Most weeks</td><td>12–18</td><td>Follow the phase plan</td></tr><tr><td>Exam / busy</td><td>As needed</td><td>2–4</td><td>Review cards and one small rebuild</td></tr><tr><td>Sprint</td><td>Holidays</td><td>25–30</td><td>Big builds; keep days off</td></tr></table></div><p><b>Falling behind?</b> Cut stretch projects and optional credentials first. Never cut the review habit or ★ items.</p>`},
 {id:"sources",h:"Sources behind this plan",sub:"Where the order and recommendations come from",body:`<p>The sequence follows what beginners are pointed to again and again in community guides and open university courses.</p><ul class="src-list">${[["r/robotics wiki","https://www.reddit.com/r/robotics/wiki/index/"],["awesome-robotics","https://github.com/kiloreux/awesome-robotics"],["PythonRobotics","https://github.com/AtsushiSakai/PythonRobotics"],["MIT OpenCourseWare: Introduction to Robotics","https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/"],["MIT Visual Navigation for Autonomous Vehicles","https://vnav.mit.edu/"],["Modern Robotics (Northwestern)","https://hades.mech.northwestern.edu/index.php/Modern_Robotics"],["freeCodeCamp","https://www.freecodecamp.org/learn/"],["ROS 2 documentation","https://docs.ros.org/"],["PX4 documentation","https://docs.px4.io/"]].map(([t,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${t} ↗</a></li>`).join("")}</ul>`},
 {id:"memory",h:"Memory system",sub:"Learn fast, then make it stay",body:`<ul><li><b>Learn it</b>, then write 3–5 Anki cards.</li><li><b>Day 1:</b> explain it in the project README without looking.</li><li><b>Day 7:</b> rebuild a stripped-down version from a blank file; set Review to <i>Day 7 done</i>.</li><li><b>Day 30:</b> closed-book test on 3 random old projects; set <i>Day 30 done</i>.</li><li><b>Every day:</b> 15 minutes of Anki.</li></ul>`},
 ...MAIN.map(p=>({id:p.k,phase:p.k,h:`${p.code.replace("PH ","Phase ")}: ${p.name}`,sub:p.dates,body:{
  p1:`<p>Two small projects a week with a starter kit. Set up GitHub on day one (PF1).</p><p><b>Buy now:</b> an Uno-compatible board, breadboard, jumper wires, resistor and LED kit, a multimeter.</p>`,
  p1b:`<p>Real-time multitasking, interrupts and your first control loop. The balance rig is where theory meets a wobbling bar.</p><p><b>Buy:</b> two ESP32 boards, an encoder motor pair, a cheap logic analyser.</p>`,
  p2:`<p>Linux on a Raspberry Pi for thinking, the ESP32 for fast control. Your personal site goes live this phase.</p><p><b>Buy:</b> a Raspberry Pi with camera, a chassis kit, a LiPo or USB-C power bank.</p>`,
  p3:`<p>ROS 2 on your rover: simulate first, then map, then navigate. This is the phase that makes you employable.</p><p><b>Buy:</b> a low-cost 2D lidar.</p>`,
  p4:`<p>Simulator first, then hardware, then computer control. Learn your country's drone rules before the first flight.</p>`,
  p5:`<p>Pick one sub-field (SLAM, perception, planning or control), read deeply, reproduce one result and write it up.</p>`,
  p6:`<p>One capstone that solves a real person's problem, a demo video, and the applications or launch you chose on the Apply page.</p>`}[p.k]}))
];

/* ---------- books ---------- */
const COV=[["#0D1713","#E1C7A2"],["#4D7F7B","#F2EBE3"],["#986C41","#F7EFE4"],["#E1C7A2","#2a1f16"],["#4F5949","#F2EBE3"],["#5b2fa0","#efe6ff"],["#22508f","#e8f0ff"],["#9c2f2b","#fbe9e7"],["#2f6b45","#e7f5ec"]];
const SHELVES=[["learn","Learn how to learn"],["elec","Electronics & firmware"],["code","Code"],["robo","Robotics core"],["flight","Flight"],["vision","Vision & estimation"],["research","Research & product"]];
const B=(id,sh,t,by,pub,cost,ess,when,why,read,url,c)=>({id,sh,t,by,pub,cost,ess:!!ess,when,why,read,url,c});
const BOOKS=[
 B("BK1","learn","Make It Stick","Brown, Roediger & McDaniel","Harvard UP","Paid",1,"Week 1","The research behind the Day 7 and Day 30 reviews: retrieval practice and spacing.","Chapters 1–3 and 8.","https://www.hup.harvard.edu/books/9780674729018",5),
 B("BK2","elec","Practical Electronics for Inventors","Scherz & Monk","McGraw Hill","Paid",1,"Phase 1","The reference for every component you wire.","The section for each new part, before you wire it.","https://openlibrary.org/search?q=Practical+Electronics+for+Inventors",6),
 B("BK3","elec","Making Embedded Systems (2nd ed.)","Elecia White","O'Reilly","Paid",0,"Phase 1b","How professional firmware is structured, tested and debugged.","Chapters on architecture, interrupts and debugging.","https://www.oreilly.com/library/view/making-embedded-systems/9781098151539/",1),
 B("BK4","code","The Linux Command Line","William Shotts","No Starch / free online","Free",1,"Phase 2","Free, friendly and exactly enough Linux for ROS 2.","Parts 1 and 2.","https://linuxcommand.org/tlcl.php",3),
 B("BK5","code","A Tour of C++ (3rd ed.)","Bjarne Stroustrup","Addison-Wesley","Paid",0,"Months 4–6","Modern C++ in 250 pages, by its creator.","Chapters 1–9.","https://www.stroustrup.com/tour3.html",7),
 B("BK6","robo","Modern Robotics","Lynch & Park","Cambridge UP / free PDF","Free",1,"Phases 3–4","Rigid-body motion, kinematics and control, with free videos.","Chapters 2–6, then 8 and 11.","https://hades.mech.northwestern.edu/index.php/Modern_Robotics",4),
 B("BK7","robo","Probabilistic Robotics","Thrun, Burgard & Fox","MIT Press","Paid",1,"Phase 3","Localisation and SLAM, the standard text.","Chapters 2–4 and 7–8.","https://robots.stanford.edu/probabilistic-robotics/",0),
 B("BK8","robo","Feedback Systems (2nd ed.)","Åström & Murray","Princeton UP / free online","Free",0,"Phase 1b onward","Control theory that stays readable.","Chapters 1–3, then PID.","https://fbswiki.org/",8),
 B("BK9","robo","Planning Algorithms","Steven LaValle","Cambridge UP / free online","Free",0,"Phase 5","Motion planning from first principles.","Chapters 2 and 5.","https://lavalle.pl/planning/",2),
 B("BK10","flight","Small Unmanned Aircraft: Theory and Practice","Beard & McLain","Princeton UP","Paid",0,"Phase 4","How autopilots are actually built, step by step.","Chapters 1–6.","https://press.princeton.edu/books/hardcover/9780691149219/small-unmanned-aircraft",6),
 B("BK11","vision","Mathematics for Machine Learning","Deisenroth, Faisal & Ong","Cambridge UP / free PDF","Free",0,"Phase 5","The linear algebra and probability behind vision and estimation.","Part I.","https://mml-book.github.io/",5),
 B("BK12","vision","State Estimation for Robotics (2nd ed.)","Timothy Barfoot","Cambridge UP / free PDF","Free",0,"Phase 5","Kalman filters to batch estimation, properly.","Chapters 3–4.","https://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser24.pdf",1),
 B("BK13","research","The Mom Test","Rob Fitzpatrick","Self-published","Paid",0,"Phase 6","How to ask people about a product without being lied to.","The whole book; it's short.","https://www.momtestbook.com/",7)
];

/* ---------- parts ---------- */
const PCATS=["Boards","Sensors","Displays","Motors & drivers","Power","Passives & prototyping","Tools","Drone & flight","Computers & cameras","Other"];
const INV0=[
 ["Arduino Uno-compatible board",1,"Boards","Starter kit"],["Breadboard (830 points)",2,"Passives & prototyping",""],["Jumper wire set",1,"Passives & prototyping","M-M, M-F, F-F"],
 ["Resistor assortment",1,"Passives & prototyping","10 Ω – 1 MΩ"],["LED assortment",1,"Passives & prototyping",""],["Push buttons",10,"Passives & prototyping",""],
 ["Potentiometer 10 kΩ",3,"Passives & prototyping",""],["USB cable",2,"Other",""]
];
const BUY0=[
 ["Digital multimeter",1,"A2",W(0).slice(0,7),15,30,"Any auto-ranging meter is fine","Tools"],
 ["SG90 micro servo",2,"A6",W(3).slice(0,7),4,8,"","Motors & drivers"],
 ["TB6612FNG motor driver",2,"A7, A10",W(4).slice(0,7),5,10,"Prefer it over the L298N: less heat","Motors & drivers"],
 ["HC-SR04 ultrasonic sensor",2,"A8, A10",W(5).slice(0,7),3,6,"","Sensors"],
 ["MPU-6050 or BMI270 IMU breakout",2,"A9, E6",W(6).slice(0,7),5,15,"","Sensors"],
 ["Two-wheel robot chassis kit",1,"A10",W(7).slice(0,7),15,30,"With TT motors and a battery holder","Motors & drivers"],
 ["ESP32 dev board",2,"E1–E6",W(9).slice(0,7),8,15,"","Boards"],
 ["Encoder gear motor pair",1,"E3, E4",W(14).slice(0,7),20,35,"","Motors & drivers"],
 ["8-channel logic analyser",1,"E5",W(16).slice(0,7),10,20,"Works with sigrok PulseView","Tools"],
 ["Raspberry Pi + power supply + microSD",1,"P1–P5",MO(5).slice(0,7),70,120,"","Computers & cameras"],
 ["Pi camera module",1,"P3, P4",MO(6).slice(0,7),25,30,"","Computers & cameras"],
 ["2D lidar (low cost)",1,"R4, R5",MO(11).slice(0,7),90,120,"","Sensors"],
 ["Small research drone or sub-250 g kit",1,"D4, D5",MO(16).slice(0,7),200,300,"Check local drone rules first","Drone & flight"]
];

/* ---------- home cards ---------- */
const CUSTOM_DONE=()=>{try{const c=JSON.parse(localStorage.getItem(KEY+"-custom")||"{}"); return !!(c&&c.wizard&&c.wizard.built);}catch(e){return false;}};
const DECK=[
 {k:"start",n:"Start your journey",ty:"Setup",c:"#ff2a6d",holo:1,art:"flag",st:H=>CUSTOM_DONE()?["Built","✓"]:["Steps",7],
  m:[["Answer",H=>"7","You, timeline, level, focus, time, learning and tools."],["Rebuild",H=>CUSTOM_DONE()?"Done":"Go","Phases, deadlines, exams, daily plan and parts, made for you."]],w:["Guessing","Generic plans","5 min"],f:"Tell it where you're going. It redraws the whole map around you."},
 {k:"mission",n:"Mission",ty:"Overview",c:"var(--accent)",holo:1,art:"drone",st:H=>["Days left",H.daysTo(PROFILE.end)],
  m:[["Gate check",H=>MAIN.length,"Seven phases, each closed by a project you finish or don't."],["Now playing",H=>H.curPhase().code.replace("PH ","P"),"The phase you're in and the gate that ends it."]],w:["Drift","Busy weeks","5 min"],f:"The whole climb, from a first circuit to a robot that maps a room."},
 {k:"tracker",n:"Tracker",ty:"Progress",c:"var(--blue)",holo:1,art:"check",st:H=>["Items",ITEMS.filter(H.countable).length],
  m:[["Mark it done",H=>ITEMS.filter(H.countable).filter(i=>H.st(i.id)===2).length,"Every project and milestone, with a status."],["Spaced review",H=>ITEMS.filter(i=>H.rv(i.id)>0).length,"Day 7 and Day 30 rebuilds, so nothing fades."]],w:["Skipped reviews","Forgetting","2 min/day"],f:"Fast learning sticks only when you pull it back out of memory."},
 {k:"daily",n:"Daily",ty:"Habit",c:"var(--good)",art:"cal",st:H=>["Streak",H.streak()+"d"],
  m:[["Today",H=>H.todayPct()+"%","Blocks ticked against today's target."],["This week",H=>H.weekPct()+"%","Hours logged against the weekly plan."]],w:["Blank days","Drift","1 min/day"],f:"Tick the blocks you worked. The line on the graph paper never lies."},
 {k:"inbox",n:"Inbox",ty:"Signals",c:"var(--blue)",art:"mail",st:H=>["New",H.inbox()],
  m:[["Pinned",H=>Object.keys(JSON.parse(localStorage.getItem(PROFILE.key+"-pins")||"{}")).length,"Links you pinned: a mail to answer, a post to read."],["Connected",H=>{try{const c=JSON.parse(localStorage.getItem(PROFILE.key+"-inbox")||"{}"); return ["gh","gm","rd"].filter(k=>c[k]&&c[k].token).length;}catch(e){return 0;}},"GitHub, Gmail and Reddit, only if you switch them on."]],w:["Notification noise","Missed mail","2 min/day"],f:"Only what you starred, pinned or were mentioned in. Nothing else gets through."},
 {k:"board",n:"Board",ty:"Flow",c:"var(--good)",art:"board",st:H=>["Active",ITEMS.filter(i=>H.st(i.id)===1).length],
  m:[["Up next",H=>{const n=H.nextOpen(ITEMS.filter(H.countable)); return n?n.id:"—";},"The next card to pull, by due date."],["Finish first",H=>ITEMS.filter(i=>H.st(i.id)===2).length,"Done beats started. Keep the middle column short."]],w:["Too much at once","Overwhelm","1 min"],f:"Three columns, one rule: finish before you start."},
 {k:"plan",n:"Plan",ty:"Strategy",c:"var(--crit)",art:"plan",st:H=>["Months",H.monthsTo(PROFILE.end)],
  m:[["Weekly rhythm",H=>"15h","Five evenings and a Saturday build session."],["Re-plan",H=>MAIN.length,"Checkpoints where you adjust the next phase only."]],w:["Exam weeks","Guesswork","10 min/mo"],f:"Schedule 80%, keep 20% for the weeks that go wrong."},
 {k:"learn",n:"Learn",ty:"Knowledge",c:"var(--accent)",art:"learn",st:H=>["Sources",RES.length],
  m:[["Best pick",H=>RES.filter(r=>r.best).length,"The one to choose where options overlap."],["Free first",H=>RES.filter(r=>r.cost==="Free").length,"Most of the best material costs nothing."]],w:["Tutorial hopping","Paid hype","3 h/wk"],f:"One good source, finished, beats five half-watched playlists."},
 {k:"books",n:"Books",ty:"Reading",c:"#d8a657",art:"books",st:H=>["Books",BOOKS.length],
  m:[["Essentials",H=>BOOKS.filter(b=>b.ess).length,"The ones to own, with only the chapters you need."],["Finished",H=>BOOKS.filter(b=>H.st(b.id)===2).length,"Mark a book Done after its Day 30 review."]],w:["Cover to cover","Shallow notes","1 h/wk"],f:"Read the chapter the project needs, the week it needs it."},
 {k:"parts",n:"Parts",ty:"Hardware",c:"var(--blue)",holo:1,art:"chip",st:H=>["Owned",H.parts().inv.length],
  m:[["Shopping list",H=>H.parts().buy.length,"Ranked by the month a project needs each part."],["Next buy",H=>{const b=H.sortedBuy()[0]; return b?H.fmtMon(b.by).slice(0,3):"—";},"Buy only when its month comes."]],w:["Impulse buys","Missing parts","5 min"],f:"A starter kit in the drawer. The rest arrives just in time."},
 {k:"cred",n:"Credentials",ty:"Proof",c:"var(--good)",art:"medal",st:H=>["Options",ITEMS.filter(i=>i.phase==="cred").length],
  m:[["Evaluated",H=>CREDS.reduce((a,t)=>a+t.items.length,0),"Only skill-tested certificates are listed."],["Earned",H=>ITEMS.filter(i=>i.phase==="cred"&&H.st(i.id)===2).length,"Optional; projects come first."]],w:["Completion certs","Doubt","Exam day"],f:"A short list on purpose: people hire what you've built."},
 {k:"skills",n:"Skills",ty:"Craft",c:"var(--crit)",art:"gear",st:H=>["Skills",SKILLS.length],
  m:[["Just in time",H=>{const n=H.nextOpen(ITEMS.filter(i=>i.phase==="skill")); return n?n.id:"—";},"The next side skill, timed to the project that needs it."],["Domains",H=>DOMAINS.length,"Mechanical, electrical, design and product."]],w:["Learning too early","Bad builds","As needed"],f:"CAD, power and video, learned the week they matter."},
 {k:"community",n:"Community",ty:"Network",c:"var(--accent)",art:"nodes",st:H=>["Places",COMM.reduce((a,g)=>a+g.list.length,0)],
  m:[["Ask well",H=>COMM.length,"Topic groups: forums, Reddit and Q&A."],["Give back",H=>"1/wk","Answer one question a week once you can."]],w:["Lurking","Being stuck","15 min/wk"],f:"Somebody has already crashed the robot you're about to crash."},
 {k:"port",n:"Portfolio",ty:"Showcase",c:"var(--blue)",art:"window",st:H=>["Steps",ITEMS.filter(i=>i.phase==="port").length],
  m:[["Ship it",H=>ITEMS.filter(i=>i.phase==="port"&&H.st(i.id)===2).length,"Repo, video and a CV line for every build."],["Next step",H=>{const n=H.nextOpen(ITEMS.filter(i=>i.phase==="port")); return n?n.id:"—";},"The next portfolio milestone due."]],w:["Private repos","Invisibility","30 min/build"],f:"Work nobody can see doesn't get you hired."},
 {k:"apply",n:"Launch",ty:"Next step",c:"#e7826b",holo:1,art:"plane",st:H=>["Days",H.daysTo(COUNTDOWNS[1]?COUNTDOWNS[1].date:PROFILE.end)],
  m:[["Portfolio",H=>H.daysTo(COUNTDOWNS[0]?COUNTDOWNS[0].date:PROFILE.end),"Days to the portfolio launch."],["Finish",H=>H.daysTo(PROFILE.end),"Days to the end of the roadmap."]],w:["Late documents","Rejection","Deadlines"],f:"Grad school, a job or your own product. Every gate leads here."}
];

/* ---------- portfolio page ---------- */
const PORT={
links:{GitHub:[["Profile README guide","https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"],["Pro Git book","https://git-scm.com/book/en/v2"]],LinkedIn:[["LinkedIn","https://www.linkedin.com/"]],YouTube:[["YouTube Studio","https://studio.youtube.com/"],["DaVinci Resolve","https://www.blackmagicdesign.com/products/davinciresolve"]],"Personal website":[["GitHub Pages","https://pages.github.com/"],["academicpages","https://academicpages.github.io/"]],"Open source":[["ROS 2 contributing","https://docs.ros.org/en/rolling/The-ROS2-Project/Contributing.html"],["Contributing to PX4","https://docs.px4.io/main/en/contribute/"]],CV:[["Overleaf CV templates","https://www.overleaf.com/latex/templates/tagged/cv"]]},
channels:[
 {k:"Week 1",h:"GitHub",li:["Profile README: who you are, your focus, 3 best projects with GIFs.","One repo per serious project; one learning-log repo for exercises.","Commit small and often, with real messages."],cad:"Every project, the week it's done."},
 {k:"Month 2",h:"YouTube",li:["A 60–120 s demo for every ★ project.","Titles that say what it does, e.g. \"ESP32 balance rig holding level with cascaded PID\"."],cad:"About 2 videos a month."},
 {k:"Month 6",h:"Personal website",li:["GitHub Pages: About, Projects (video + repo), CV, Blog.","One page per project with the numbers."],cad:"Update at each gate."},
 {k:"Month 6",h:"LinkedIn",li:["Headline: what you build and with what.","Featured: your best demo videos."],cad:"One post per finished phase."},
 {k:"Month 12",h:"Open source",li:["Docs fixes first, then a small bug in a package you use.","Link merged PRs from your CV."],cad:"One contribution a month."},
 {k:"Month 19",h:"CV",li:["Two pages in Overleaf.","Each project line: what, how, a measured result, a link."],cad:"Update monthly; tailor per application."}],
readme:`# Project name: one line on what it does

![demo](media/demo.gif)

**Result:** e.g. holds level within ±2° under a push, 200 Hz control loop

## Why
The problem in 2-3 sentences.

## System
Architecture diagram, hardware list, wiring photo.

## How it works
The key algorithm, with the maths in brief.

## Results
Plots, measurements, video link. What works and what doesn't.

## Run it
Build and flash steps, dependencies, config.

## Lessons
What broke, how you found it, what you'd change.`,
docs:[["References","Two or three people who saw your work: a mentor, a professor, a club advisor or a manager. Ask six weeks ahead with links."],["Statement or cover letter","Your path from first circuit to your best robot, then the problem you want to work on next."],["Project one-pagers","For each pinned project: a photo, the result in one number, and a link to the video."]]
};

/* ---------- apply / launch page ---------- */
const APPLY={
countries:[
 {n:"Graduate school",role:"Route A",ph:"p5",li:["Shortlist 8–10 labs whose papers you've read; email professors with one specific question about their work.","Most programmes ask for a CV, statement, transcripts, references and an English test if needed.","Funded options include government scholarships and research assistantships; check each country's official portal."],uni:"Search labs by topic on Google Scholar and the authors of papers you liked in Phase 5.",links:[["Google Scholar","https://scholar.google.com/"],["arXiv cs.RO","https://arxiv.org/list/cs.RO/recent"]]},
 {n:"Industry job",role:"Route B",ph:"p3",li:["Robotics software, embedded and test roles all value ROS 2, C++ and a working robot on video.","Apply with your portfolio site and two projects that match the job.","Contributions to Nav2, PX4 or ros2_control are read by the same teams that hire."],uni:"Look at company career pages and robotics job boards; meetups and competitions are where referrals happen.",links:[["ROS Discourse jobs","https://discourse.openrobotics.org/c/jobs/15"]]},
 {n:"Your own product",role:"Route C",ph:"p6",li:["Start from a problem five real people describe the same way.","Build the smallest robot that solves part of it, and measure the result.","Startup programmes and accelerators accept solo technical founders."],uni:"Your capstone (C1–C3) is the prototype.",links:[["YC Startup School","https://www.startupschool.org/"],["The Mom Test","https://www.momtestbook.com/"]]}],
timeline:[[MY(MO(13)),"First merged open-source PR","PF5","p3",0],[MY(MO(14)),"Portfolio launch","PF6","p4",1],[MY(MO(19)),"CV v1","PF7","p5",0],[MY(MO(19)),"Applications open","X1","p5",1],[MY(MO(21)),"Short paper written","X4","p5",0],[MY(MO(24)),"Capstone demo","C3","p6",0],[MY(MO(24)),"Applications or launch done","G1","p6",1]]
};

/* =====================================================================
   START YOUR JOURNEY · data for the setup questions
   Application windows below come from the official pages linked in `src`
   (checked October 2026). They shift a little every year: the journal shows
   the link next to every date so you can confirm it.
   ===================================================================== */
const WIZARD={
  // y = intake year (the year your programme starts). Each rule returns [label, date, hard, link]
  routes:{
    japan:{n:"Japan · MEXT scholarship",role:"Research student via your Japanese embassy",ph:"p4",src:"https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
      fact:"Embassy recruitment for April or September/October arrival is held in April–May of the previous year; first screening runs May–July.",
      dates:y=>[["Research plan and documents ready",`${y-1}-03-31`,0],["MEXT embassy application (Apr–May)",`${y-1}-04-15`,1],["First screening (May–Jul)",`${y-1}-07-15`,0],["Contact professors for acceptance letters",`${y-1}-09-30`,0]],
      tests:["english","jlpt"]},
    china:{n:"China · CSC scholarship",role:"Chinese Government Scholarship",ph:"p5",src:"https://www.campuschina.org/",
      fact:"For September entry, embassy deadlines fall early in the same year (for example 8 Feb 2026 for September 2026 via the Melbourne consulate); some embassies and universities close later.",
      dates:y=>[["Shortlist universities and supervisors",`${y-1}-11-30`,0],["CSC application (check your embassy's deadline)",`${y}-02-01`,1]],tests:["english"]},
    russia:{n:"Russia · Open Doors olympiad",role:"Tuition-free Master's through a two-stage olympiad",ph:"p5",src:"https://int.itmo.ru/en/opendoors",
      fact:"Final-year Bachelor's students can enter. In the 2026 round, stage 1 (portfolio) ran 2–12 November and stage 2 ran 17 November – 7 December.",
      dates:y=>[["Open Doors stage 1: portfolio (early Nov)",`${y-1}-11-02`,1],["Open Doors stage 2: problem solving (Nov–Dec)",`${y-1}-11-17`,0]],tests:["english"]},
    korea:{n:"South Korea · GKS scholarship",role:"Global Korea Scholarship, embassy track",ph:"p5",src:"https://www.studyinkorea.go.kr/",
      fact:"The 2026 embassy track accepted online applications 12–25 February. Scholars start with a one-year Korean course, then the degree.",
      dates:y=>[["GKS embassy-track application (February)",`${y}-02-12`,1]],tests:["english","topik"]},
    uk:{n:"United Kingdom · Chevening",role:"One-year Master's, fully funded",ph:"p5",src:"https://www.chevening.org/scholarships/application-timeline/",
      fact:"For 2027–28 study, applications ran 4 August – 6 October 2026, interviews March–April 2027, results from mid-June, study from September/October 2027.",
      dates:y=>[["Chevening application opens (early Aug)",`${y-1}-08-04`,0],["Chevening application closes (early Oct)",`${y-1}-10-06`,1],["Chevening interviews (Mar–Apr)",`${y}-03-15`,0]],tests:["english"]},
    usa:{n:"United States · graduate school",role:"MS or PhD, funded by assistantships or fellowships",ph:"p5",src:"https://educationusa.state.gov/your-5-steps-us-study/research-your-options/graduate",
      fact:"EducationUSA advises starting your search 12–18 months before the academic year you want to begin. Each programme sets its own deadline.",
      dates:y=>[["Start shortlisting programmes (12–18 months ahead)",`${y-2}-09-01`,0],["Plan to have applications in (check each programme)",`${y-1}-12-01`,1]],tests:["english"]},
    other:{n:"Another country",role:"Your own target",ph:"p5",src:"",
      fact:"Find the official scholarship or admissions page for your country and replace these planning dates in Console → Hard dates.",
      dates:y=>[["Applications in (planning date, about 9 months before start)",`${y-1}-12-01`,1]],tests:["english"]}
  },
  tests:{
    english:{n:"English test: IELTS Academic or TOEFL iBT",links:[["IELTS","https://ielts.org/"],["TOEFL","https://www.ets.org/toefl.html"]]},
    jlpt:{n:"JLPT (Japanese), held in July and December",links:[["JLPT","https://www.jlpt.jp/e/"]]},
    topik:{n:"TOPIK (Korean)",links:[["TOPIK","https://www.topik.go.kr/"]]}
  },
  // what changes in phase 4–5 by focus
  focus:{
    aerial:{label:"Drones / aerial robots",lx:"Drones",p4:"Drones + control",p5:"Autonomy + research"},
    ground:{label:"Mobile / ground robots",lx:"Autonomy",p4:"Advanced mobile robots",p5:"Autonomy + research",
      items:{D1:["Kinematics of a differential and Ackermann robot","Wheel models, turning radius, why cars can't turn on the spot.",[["Modern Robotics (free book + videos)","https://hades.mech.northwestern.edu/index.php/Modern_Robotics"]]],
        D2:["Localisation on a saved map (AMCL)","Particle filter localisation inside Nav2; measure how fast it recovers.",[["Nav2 documentation","https://docs.nav2.org/"]]],
        D3:["Tune Nav2 controllers and costmaps","Compare two controllers on the same course; log time and path error.",[["Nav2 documentation","https://docs.nav2.org/"]]],
        D4:["Outdoor or larger-scale run","GPS or visual odometry outdoors, or a bigger indoor map.",[["RoboRacer (F1TENTH) course kit","https://f1tenth-coursekit.readthedocs.io/"]]],
        D5:["Autonomous mission: patrol a route and report","Waypoints, obstacle avoidance and a logged report. The gate project.",[["slam_toolbox","https://github.com/SteveMacenski/slam_toolbox"]]]}},
    arms:{label:"Robot arms / manipulation",lx:"Arms",p4:"Arms + manipulation",p5:"Perception + research",
      items:{D1:["Forward and inverse kinematics of a 3-DOF arm","Homogeneous transforms, Jacobians, workspace.",[["Modern Robotics (free book + videos)","https://hades.mech.northwestern.edu/index.php/Modern_Robotics"]]],
        D2:["Simulate an arm with MoveIt 2","Load a URDF, plan around an obstacle in RViz.",[["MoveIt 2 documentation","https://moveit.picknik.ai/main/index.html"]]],
        D3:["ros2_control for a hobby servo arm","Real joints under ROS 2 control.",[["ros2_control","https://control.ros.org/"]]],
        D4:["Pick and place with a camera","Detect an object, compute its pose, grasp it.",[["Robotic Manipulation (MIT)","https://manipulation.mit.edu/"]]],
        D5:["Sort objects by colour, end to end","Perception + planning + control in one demo. The gate project.",[["MoveIt 2 documentation","https://moveit.picknik.ai/main/index.html"]]]}},
    general:{label:"Not sure yet",lx:"Robots",p4:"Pick a platform",p5:"Autonomy + research",
      items:{D1:["Try three platforms in simulation","A drone in PX4 SITL, an arm in MoveIt 2, a rover in Nav2. Keep notes.",[["PX4 simulation","https://docs.px4.io/main/en/simulation/"],["MoveIt 2 documentation","https://moveit.picknik.ai/main/index.html"],["Nav2 documentation","https://docs.nav2.org/"]]]}}
  },
  // free platforms people can prefer; patterns match resource and link URLs
  learn:[["ocw","MIT OpenCourseWare","ocw\\.mit\\.edu|underactuated\\.mit|manipulation\\.mit|vnav\\.mit|missing\\.csail"],["fcc","freeCodeCamp","freecodecamp"],["coursera","Coursera (free audit)","coursera\\.org"],["edx","edX / Harvard CS50","edx\\.org|cs50\\.harvard"],["khan","Khan Academy","khanacademy"],["yt","YouTube teachers","youtube\\.com|3blue1brown|mathworks\\.com/videos"],["docs","Official docs and tutorials","docs\\.|documentation|ros\\.org|px4\\.io|arduino\\.cc|espressif|opencv|nav2|python\\.org"],["books","Free textbooks","fbswiki|lavalle|mml-book|linuxcommand|git-scm\\.com/book|hades\\.mech|asrl\\.utias|udlbook"],["code","Code on GitHub","github\\.com"]],
  // what you already own → parts inventory
  owned:[["arduino","Arduino Uno or compatible","Boards"],["esp32","ESP32 dev board","Boards"],["pi","Raspberry Pi","Computers & cameras"],["sensors","Sensor kit (IMU, ultrasonic, light)","Sensors"],["motors","Motors and a motor driver","Motors & drivers"],["printer","3D printer (or access to one)","Tools"],["meter","Multimeter","Tools"],["drone","A small drone","Drone & flight"]],
  buyMap:{meter:["Digital multimeter"],motors:["TB6612FNG motor driver","Two-wheel robot chassis kit","Encoder gear motor pair"],sensors:["HC-SR04 ultrasonic sensor","MPU-6050 or BMI270 IMU breakout"],esp32:["ESP32 dev board"],pi:["Raspberry Pi + power supply + microSD","Pi camera module"],drone:["Small research drone or sub-250 g kit"]}
};
