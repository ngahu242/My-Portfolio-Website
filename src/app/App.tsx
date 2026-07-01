import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Shield, X, Github, Linkedin, Mail, MessageCircle, Send,
  Download, FileText, Award, BookOpen, ChevronRight, ArrowUpRight,
  Menu, ChevronDown, Loader2, GraduationCap, Briefcase,
  ExternalLink, Phone, ArrowUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// RESUME URLS
// 📄 Update RESUME_VIEW_URL with a Google Drive preview link or Cloudinary PDF.
// 📥 Update RESUME_DOWNLOAD_URL with a direct download link.
// ─────────────────────────────────────────────────────────────────────────────
const RESUME_VIEW_URL = "https://res.cloudinary.com/dqczxob3/image/upload/Ngahu_CV_enbhws.pdf";



const NAV_LINKS = ["About", "Education", "Experience", "Skills", "Projects", "Certifications", "Articles", "Resume", "Contact"];

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "enterprise-lab",
    title: "Enterprise Cybersecurity Lab",
    subtitle: "Full-scale SOC environment simulation",
    description:
      "A production-grade enterprise environment built from scratch — Windows Server, Active Directory, Splunk SIEM, pfSense firewall, Suricata IDS, and red/blue team VMs all networked for realistic threat simulation.",
    tags: ["Windows Server", "Active Directory", "Splunk", "pfSense", "Suricata", "Sysmon", "Kali Linux"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&auto=format",
    overview: "Built a complete enterprise cybersecurity environment consisting of Windows Server 2022 with Active Directory, Windows 11 workstations, Kali Linux as the attacker machine, Splunk Enterprise as the SIEM, Sysmon for endpoint telemetry, pfSense as the perimeter firewall, and Suricata as the network IDS. The environment also includes REMnux and FLARE VM for malware analysis.",
    architecture: "VMware-based virtualized network with segmented VLANs, a DMZ, and a management network. pfSense routes between segments with firewall rules and Suricata inline inspection. All endpoint telemetry flows to Splunk via Universal Forwarder.",
    challenges: "Configuring Suricata in IDS mode on pfSense required custom rule tuning to reduce false positives while maintaining coverage for MITRE ATT&CK techniques. Active Directory replication and DNS misconfiguration caused hours of troubleshooting before stabilizing.",
    lessons: "Log normalization before ingestion into Splunk is critical — poorly structured logs make threat hunting nearly impossible. Sysmon configuration is the foundation of endpoint visibility; the default config provides almost no actionable telemetry.",
    github: "#",
    article: "#",
  },
  {
    id: "malware-analysis",
    title: "Malware Analysis Lab",
    subtitle: "Static & dynamic malware investigation",
    description: "A dedicated, isolated malware analysis environment using FLARE VM and REMnux. Performed static analysis (PE inspection, string extraction, entropy analysis) and dynamic analysis (behavioral monitoring, network traffic capture).",
    tags: ["FLARE VM", "REMnux", "Ghidra", "IDA Free", "Wireshark", "Process Monitor"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop&auto=format",
    overview: "Set up a fully isolated, internet-disconnected malware analysis lab using FLARE VM (Windows-based) for static and dynamic analysis, and REMnux (Linux-based) as a fake internet/network simulator. Analyzed multiple malware families including ransomware droppers and remote access trojans.",
    architecture: "Host-only VMware network with INetSim on REMnux simulating DNS, HTTP, and SMTP. FLARE VM runs malware samples in a controlled, snapshotted environment — snapshots roll back after each session.",
    challenges: "Anti-analysis techniques in modern malware required bypassing VM detection, timing checks, and environment fingerprinting before samples would execute their real payload.",
    lessons: "Static and dynamic analysis are complementary — static analysis reveals code structure while dynamic analysis reveals actual runtime behavior and C2 communication patterns.",
    github: "#",
    article: "#",
  },
  {
    id: "soc-lab",
    title: "SOC Lab",
    subtitle: "SIEM detection engineering & threat hunting",
    description: "Purpose-built SOC environment with Splunk Enterprise as the SIEM. Configured Sysmon endpoint telemetry, created custom detection dashboards, and built use cases for common attack patterns mapped to MITRE ATT&CK.",
    tags: ["Splunk", "Sysmon", "Windows Event Logs", "MITRE ATT&CK", "SPL", "Dashboards"],
    image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=450&fit=crop&auto=format",
    overview: "Deployed Splunk Enterprise as the central SIEM, integrated Sysmon-enriched Windows Event Logs via Universal Forwarder, created custom SPL queries for threat detection, and built operational dashboards. Detection use cases include lateral movement, PowerShell abuse, credential dumping, and persistence mechanisms.",
    architecture: "Splunk Enterprise on Ubuntu Server, Universal Forwarder on all Windows endpoints, Sysmon v14 with SwiftOnSecurity config as the foundation for endpoint telemetry.",
    challenges: "SPL query optimization — naive queries over large datasets caused search times exceeding timeout thresholds. Required index-time field extractions and summary indexing.",
    lessons: "Alert fatigue is real. Building in severity tiers and suppression logic for known-good behavior is as important as writing the detection itself.",
    github: "#",
    article: "#",
  },
  {
    id: "kali-ai-soc",
    title: "Kali AI SOC Copilot",
    subtitle: "AI-powered terminal security assistant",
    description: "An AI-powered Cybersecurity and IT Support Terminal Assistant built for Linux, Kali Linux, and Windows. Combines AI, SOC automation, vulnerability assessment, network scanning, and system health diagnostics in one terminal tool.",
    tags: ["Python", "AI", "Kali Linux", "SOC Automation", "Vulnerability Assessment", "Network Scanning"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop&auto=format",
    overview: "Built an AI-powered terminal assistant designed for SOC analysts and IT support teams. The tool provides intelligent security automation — combining vulnerability assessment, process monitoring, network scanning, and system health analysis — all accessible from the command line on Linux, Kali Linux, or Windows.",
    architecture: "Python-based CLI application integrating an AI language model backend with system-level tools (nmap, ps, netstat, etc.). Modular architecture allows independent feature use or combined security workflows.",
    challenges: "Balancing the AI response quality with real-time system data required careful prompt engineering and streaming response handling to maintain a snappy terminal UX.",
    lessons: "AI dramatically accelerates security triage. Pairing AI reasoning with live system telemetry creates a tool that is far more useful than either alone for SOC-level investigations.",
    github: "#",
    article: "#",
  },
  {
    id: "password-manager",
    title: "Password Manager",
    subtitle: "AES-encrypted CLI credential vault",
    description: "A secure, command-line password manager built with Python using AES encryption (Fernet). Supports encrypted storage, master-password authentication, password generation, and recovery through a safe reset mechanism.",
    tags: ["Python", "AES Encryption", "Fernet", "CLI", "Cryptography", "Security"],
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=450&fit=crop&auto=format",
    overview: "Developed a command-line password manager in Python that uses the Fernet symmetric encryption scheme (AES-128-CBC with HMAC-SHA256). All credentials are stored encrypted at rest, protected by a master password hashed with PBKDF2. Includes secure password generation and a recovery mechanism that does not expose the master password.",
    architecture: "Single-file Python application using the cryptography library. Master password is hashed with PBKDF2-SHA256 before use as the Fernet key. Credentials stored in an encrypted JSON vault on disk.",
    challenges: "Implementing a safe reset/recovery mechanism that allows account recovery without storing the master password or weakening the encryption model.",
    lessons: "Cryptographic correctness is non-trivial — even small implementation mistakes can completely break security. Using well-audited libraries like cryptography.io is essential.",
    github: "#",
    article: "#",
  },
  {
    id: "shareitfree",
    title: "ShareItFree",
    subtitle: "eMobilis Final Project — Community sharing platform (Not fully complete)",
    description: "An online platform designed to help people within local communities share free products, services, and donations — reducing waste, promoting sustainability, and fostering a culture of generosity.",
    tags: ["Python", "Django", "HTML", "CSS", "Bootstrap", "JavaScript"],
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop&auto=format",
    overview: "ShareItFree is a community-driven web platform built as the final project at eMobilis Mobile Technology Institute. It connects people who have items they no longer need with those who could use them. This comprise of free items such as furniture, books, electronics, clothing, basic services such as cleaning, tutoring, pet-sitting, charity donations, and a community forum.",
    architecture: "Full-stack Django (Python) web application with a relational database backend, Bootstrap-responsive frontend, and user authentication system. Deployed with standard Django deployment practices.",
    challenges: "Designing a trust and safety model for an anonymous sharing platform — ensuring genuine listings, preventing spam, and moderating the community forum without a large moderation team.",
    lessons: "Real-world web development requires as much attention to UX and community design as to code quality. The most technically sound feature fails if users do not find it intuitive. Grateful to eMobilis for their training and mentorship throughout this project.",
    github: "#",
    article: "#",
  },
  {
    id: "phishing-detection",
    title: "Phishing Detection System",
    subtitle: "4th Year Final Year Project",
    description: "A machine-learning powered system for detecting phishing URLs and emails, developed as the 4th Year Final Year Project at JKUAT. Combines feature engineering, classification models, and a lightweight web interface.",
    tags: ["Python", "Machine Learning", "NLP", "Django", "Cybersecurity", "JKUAT"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&auto=format",
    overview: "Developed a phishing detection system as the capstone project for the BSc. Mathematics and Computer Science degree at JKUAT. The system analyses URLs and email content using machine learning classifiers to identify phishing attempts, providing a web-based interface for manual checks and bulk analysis.",
    architecture: "Python ML pipeline (scikit-learn) for feature extraction (URL structure, domain age, lexical features) and classification. Django web interface for user interaction. Trained on labelled phishing datasets from PhishTank and OpenPhish.",
    challenges: "Adversarial robustness — phishing sites constantly evolve their URLs and content to evade detection. Balancing precision and recall to minimise both false positives (blocking legit sites) and false negatives (missing phishing attempts).",
    lessons: "Cybersecurity ML models degrade quickly in production as threat actors adapt. Continuous retraining and feature pipeline maintenance are as important as the initial model accuracy.",
    github: "#",
    article: "#",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS
// 📎 For each cert, replace certificateUrl "#" with your actual certificate URL
// ─────────────────────────────────────────────────────────────────────────────
const CERTIFICATIONS = [
  // ── CISCO ──────────────────────────────────────────────────────────────────
  {
    id: "cisco-intro-cybersec",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/Introduction_to_Cybersecurity_certificate_ngahujoseph184-gmail-com_b814a366-1af2-42d9-8f7a-365f83cda644_1_qmsxmv.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "cisco-cybersec-essentials",
    name: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/Cybersecurity_Essentials_certificate_ngahujoseph184-gmail-com_d37b0ef2-807f-47f5-a83c-5d0180b3ee9c_shaght.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "cisco-ctm",
    name: "Cyber Threat Management",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/v1782762472/Cyber_Threat_Management_certificate_ngahujoseph184-gmail-com_464309c9-eb33-4a07-b0fd-66f0fd2fdb8a_hms8wz.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "ccna-intro",
    name: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/CCNA-_Introduction_to_Networks_certificate_ngahujoseph184-gmail-com_ff124b61-05d5-437f-b1c5-452de1d4130c_oix5gp.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "ccna-srwe",
    name: "CCNA: Switching, Routing & Wireless",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_ngahujoseph184-gmail-com_b342e0bb-f31a-436e-9924-0798199742fd_a1qphp.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "ccna-ensa",
    name: "CCNA: Enterprise Networking, Security & Automation",
    issuer: "Cisco Networking Academy",
    date: "2023",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/CCNA-_Enterprise_Networking-_Security-_and_Automation_certificate_ngahujoseph184-gmail-com_d9b1d2d8-29cd-4ca3-8658-76894be0f833_yhxsif.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "cisco-devnet",
    name: "Cisco DevNet Associate",
    issuer: "Cisco Systems",
    date: "2025",
    color: "#1ba0d7",
    group: "Cisco",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/_certificate_ngahujoseph184-gmail-com_91ca088e-85bf-4b29-9730-36900e20a4e7_1_g2r4yc.pdf",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  {
    id: "cisco-jca",
    name: "Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco Networking Academy",
    date: "2026",
    color: "#00bceb",
    group: "Cisco",
    certificateUrl: "https://drive.google.com/file/d/1GTVK6f3OfbiE-7qEROsinJicD9CefSdy/preview?usp=sharing",
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  // ── LETSDEFEND ─────────────────────────────────────────────────────────────
  {
    id: "letsdefend-soc",
    name: "SOC Analyst Learning Path",
    issuer: "LetsDefend",
    date: "2026",
    color: "#3ecf8e",
    group: "LetsDefend",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/d06ffe3f-7110-4000-93d1-5b092c758993_runujs.png",
    credlyUrl: "https://app.letsdefend.io/",
  },
  // ── CENTRI ─────────────────────────────────────────────────────────────────
  {
    id: "centri-btja",
    name: "Blue Team Junior Analyst Pathway",
    issuer: "Centri",
    date: "2026",
    color: "#557c9b",
    group: "Centri",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/Blue_Team_Junior_Analyst_Pathway_Bundle-btja_1_upmzq9.pdf",
    credlyUrl: "#",
  },
  // ── ISC2 ────────────────────────────────────────────────────────────────────
  {
    id: "isc2-intro",
    name: "Introduction to Cybersecurity",
    issuer: "ISC2",
    date: "2023",
    color: "#00a651",
    group: "ISC2",
    certificateUrl: "https://res.cloudinary.com/dqczxob3/image/upload/1747651741181_dqwlup.jpg", // 👈 Upload your ISC2 certificate to Cloudinary and add URL here
    credlyUrl: "https://www.credly.com/users/joseph-ngahu",
  },
  // ── COMPTIA (TO-DO) ────────────────────────────────────────────────────────
  {
    id: "comptia-secplus",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "In Progress",
    color: "#c8202f",
    group: "CompTIA",
    certificateUrl: "#",
    credlyUrl: "#",
    todo: true,
  },
  {
    id: "comptia-cysa",
    name: "CompTIA CySA+",
    issuer: "CompTIA",
    date: "Planned",
    color: "#c8202f",
    group: "CompTIA",
    certificateUrl: "#",
    credlyUrl: "#",
    todo: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────
const EDUCATION = [
  {
    id: "jkuat",
    institution: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    degree: "BSc. Mathematics and Computer Science",
    period: "2019 – 2025",
    note: "Graduated: 5th December 2025",
    description: "Gained a strong foundation in mathematics, algorithms, programming, and computer science principles. Developed a focused interest in cybersecurity, networking, and software development throughout the programme.",
    color: "#00d4aa",
  },
  {
    id: "githumu",
    institution: "Githumu High School",
    degree: "Kenya Certificate of Secondary Education (KCSE)",
    period: "2014 – 2018",
    note: "",
    description: "Completed secondary education with a focus on sciences and mathematics, building the analytical foundation for further studies in computer science.",
    color: "#5b8dee",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORK EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    id: "kirinyaga",
    role: "Information Technology (IT) Support",
    type: "Industrial Attachment",
    company: "Kirinyaga County Government",
    period: "July 2025 – September 2025",
    responsibilities: [
      "Provided technical support for computer systems, networks, and user accounts, ensuring smooth daily operations.",
      "Assisted with system maintenance, access control, and troubleshooting hardware and software issues.",
      "Supported basic network security practices, data protection, and user cyber-safety awareness.",
      "Helped maintain secure, reliable, and efficient IT operations across departments.",
    ],
    tags: ["IT Support", "Network Security", "Troubleshooting", "Access Control", "User Support"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────
const SKILLS = [
  {
    category: "Cybersecurity",
    color: "#00d4aa",
    items: [
      "SIEM & Security Monitoring", "Log Analysis & Investigation", "Threat Detection & Threat Hunting",
      "Incident Detection, Triage & Response", "IoC Analysis", "Malware Analysis Fundamentals",
      "Digital Forensics Fundamentals", "Vulnerability Assessment", "Network Traffic Analysis",
      "MITRE ATT&CK Mapping", "Phishing Email Analysis", "Endpoint Security Monitoring",
      "IDS/IPS Monitoring (Suricata)", "Firewall Config & Monitoring (pfSense)",
      "SOC Operations", "Blue Team Defense", "Cyber Kill Chain",
    ],
  },
  {
    category: "Networking",
    color: "#5b8dee",
    items: [
      "TCP/IP", "DNS & DHCP", "VLANs", "Routing & Switching",
      "IPv4/IPv6", "Network Troubleshooting", "Network Security Fundamentals", "Packet Capture & Analysis",
    ],
  },
  {
    category: "Security & Admin Tools",
    color: "#f59e0b",
    items: [
      "Splunk Enterprise", "Splunk Universal Forwarder", "Wireshark", "Nmap",
      "Suricata IDS", "pfSense", "Nessus", "Burp Suite", "Metasploit Framework",
      "tcpdump", "Git", "GitHub",
    ],
  },
  {
    category: "Operating Systems",
    color: "#8b5cf6",
    items: [
      "Windows 10/11", "Windows Server", "Ubuntu Linux", "Kali Linux", "REMnux", "FLARE VM",
    ],
  },
  {
    category: "System Administration",
    color: "#ec4899",
    items: [
      "Active Directory Administration", "Domain Services", "User & Group Management",
      "Group Policy (GPO)", "DNS & DHCP Configuration", "Access Control & Permissions",
      "Windows Event Logging", "Server Administration",
    ],
  },
  {
    category: "Cloud & Virtualisation",
    color: "#06b6d4",
    items: [
      "VMware Workstation", "VirtualBox", "Virtual Network Design", "Enterprise Lab Deployment",
    ],
  },
  {
    category: "Programming & Scripting",
    color: "#10b981",
    items: [
      "Python", "PowerShell", "Bash Scripting", "HTML", "CSS", "Bootstrap", "Django", "JavaScript",
    ],
  },
  {
    category: "Professional Skills",
    color: "#64748b",
    items: [
      "Security Documentation", "Technical Reporting", "Incident Documentation",
      "Problem Solving", "Analytical Thinking", "Research", "Communication", "Team Collaboration", "Continuous Learning",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES — real Medium articles
// ─────────────────────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    title: "Part 5: Integrating Kali Linux into the Cyber Lab Environment",
    description: "Setting up Kali Linux as the red team attacker machine within the enterprise cybersecurity lab — network integration, tool configuration, and attack simulation.",
    date: "Jun 2026",
    readTime: "5 min read",
    link: "https://medium.com/@ngahu242",
  },
  {
    title: "Part 4: Enterprise Active Directory Structure and Security Policy Framework",
    description: "Configuring Active Directory domain structure, OUs, group policies, and security hardening for a realistic enterprise SOC lab environment.",
    date: "Jun 2026",
    readTime: "5 min read",
    link: "https://medium.com/@ngahu242",
  },
  {
    title: "Part 3: Configuring and Validating the Windows 11 Domain Client",
    description: "Joining Windows 11 workstations to the domain, validating Group Policy application, and preparing endpoints for Sysmon telemetry collection.",
    date: "Jun 2026",
    readTime: "4 min read",
    link: "https://medium.com/@ngahu242",
  },
  {
    title: "Part 2: Configuring the Cyber Lab Environment — Windows Server 2022",
    description: "Step-by-step installation and configuration of Windows Server 2022 with Active Directory Domain Services, DNS, and DHCP for the cybersecurity lab.",
    date: "Jun 2026",
    readTime: "5 min read",
    link: "https://medium.com/@ngahu242",
  },
  {
    title: "Part 1: Network Configuration using pfSense",
    description: "Building the network backbone of the enterprise cybersecurity lab using pfSense firewall rules, VLAN segmentation, and Suricata IDS integration.",
    date: "Jun 2026",
    readTime: "4 min read",
    link: "https://medium.com/@ngahu242",
  },
  {
    title: "Building a Cybersecurity and Malware Analysis Lab Series",
    description: "An introduction to the full series documenting the construction of a production-grade cybersecurity and malware analysis home lab from scratch.",
    date: "Jun 2026",
    readTime: "5 min read",
    link: "https://medium.com/@ngahu242",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI CHATBOT — KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────
const CHAT_RULES: { patterns: string[]; response: string }[] = [
  // ── Identity & Background ───────────────────────────────────────────────────
  {
    patterns: ["who is joseph", "about joseph", "tell me about", "introduce", "background", "summary", "professional summary", "who are you"],
    response: "Joseph Ngahu Kinyanjui is a Mathematics and Computer Science graduate from JKUAT (graduated 5th December 2025) with a deep focus on cybersecurity, SOC operations, and blue team defense.\n\nHe completed an industrial attachment at Kirinyaga County Government (July–September 2025) providing real-world IT support and network security. He has built 7 hands-on projects including enterprise security labs, a malware analysis environment, an AI SOC tool, and a phishing detection system.\n\nJoseph is actively seeking a SOC Analyst or Cybersecurity Analyst role.",
  },
  // ── Hire / Value Questions ──────────────────────────────────────────────────
  {
    patterns: ["why hire joseph", "should i hire", "why should we hire", "is joseph a good candidate", "is joseph qualified", "what makes joseph unique", "joseph got what it takes", "worth hiring", "hire him", "consider joseph", "recommend joseph"],
    response: "Absolutely — here is why Joseph stands out:\n\n✅ Hands-on, not just theoretical: He built a full enterprise SOC lab from scratch — Windows Server, AD, Splunk, pfSense, Suricata — the exact stack used in real SOC environments.\n\n✅ Detection engineering: He writes Splunk SPL detection rules mapped to MITRE ATT&CK, not just monitors dashboards.\n\n✅ Malware analysis: He has practical experience with FLARE VM and REMnux — static and dynamic analysis skills that most entry-level candidates lack.\n\n✅ Continuous learning: Active on TryHackMe, HackTheBox, and LetsDefend. Pursuing CompTIA Security+ and CySA+.\n\n✅ Breadth: Beyond cybersecurity, he writes Python, built web apps in Django, and has a phishing detection ML system as his final year project.\n\n✅ Professional attitude: Proven in a real workplace (Kirinyaga County Government attachment), with documentation and reporting skills.\n\nFor an entry-level SOC Analyst position, Joseph brings rare practical depth.",
  },
  {
    patterns: ["strength", "strengths", "what is joseph good at", "best at", "strongest skill"],
    response: "Joseph's core strengths:\n\n🛡 Threat Detection — MITRE ATT&CK-mapped Splunk rules and custom dashboards built from scratch\n🔬 Malware Analysis — Static and dynamic analysis with FLARE VM and REMnux\n🏗 Lab Building — Designed and deployed a full enterprise SOC environment\n🤖 AI Integration — Built the Kali AI SOC Copilot, applying AI to security automation\n📝 Documentation — Clear technical reporting and incident documentation\n🌐 Networking — CCNA-level depth in routing, switching, and VLANs",
  },
  {
    patterns: ["weakness", "weaknesses", "areas to improve", "what joseph lacks", "experience gap"],
    response: "Like any entry-level professional, Joseph is still building real-world SOC experience. He is transparent about this:\n\n• He has not yet worked in a production SOC, but his lab environment mirrors one closely\n• He is actively bridging this gap through TryHackMe, HackTheBox, LetsDefend, and pursuing CompTIA Security+\n• His industrial attachment at Kirinyaga County Government provided real workplace exposure\n\nHis commitment to continuous learning and self-driven lab work more than compensates for limited formal experience.",
  },
  // ── Education ───────────────────────────────────────────────────────────────
  {
    patterns: ["education", "degree", "university", "jkuat", "school", "graduate", "academic", "qualification", "githumu"],
    response: "Joseph's education:\n\n🎓 Jomo Kenyatta University of Agriculture and Technology (JKUAT)\n   BSc. Mathematics and Computer Science\n   2019 – 2025 | Graduated: 5th December 2025\n\n📚 Githumu High School\n   Kenya Certificate of Secondary Education (KCSE)\n   2014 – 2018",
  },
  // ── Work Experience ─────────────────────────────────────────────────────────
  {
    patterns: ["work experience", "job", "employment", "kirinyaga", "attachment", "internship", "industrial", "work history"],
    response: "Joseph's work experience:\n\n💼 IT Support — Industrial Attachment\n   Kirinyaga County Government\n   July 2025 – September 2025\n\n• Provided technical support for computer systems, networks, and user accounts\n• Assisted with system maintenance, access control, and hardware/software troubleshooting\n• Supported network security practices, data protection, and user cyber-safety awareness\n• Maintained secure, reliable IT operations across departments",
  },
  // ── Practice Platforms ──────────────────────────────────────────────────────
  {
    patterns: ["tryhackme", "hackthebox", "hack the box", "practice", "learning platform", "ctf"],
    response: "Joseph actively practices cybersecurity on:\n\n🔴 TryHackMe — guided learning paths for SOC skills, network security, and ethical hacking\n⬛ HackTheBox — challenge-based platform for offensive and defensive security skills\n🟢 LetsDefend — blue team SOC simulation scenarios and incident response practice\n\nThis ongoing practice ensures his skills remain current and applicable to real-world threat scenarios.",
  },
  // ── Projects ────────────────────────────────────────────────────────────────
  {
    patterns: ["enterprise lab", "enterprise cybersecurity", "cybersecurity lab", "soc environment", "windows server", "active directory", "pfsense", "suricata"],
    response: "Joseph built an enterprise cybersecurity home lab with:\n• Windows Server 2022 + Active Directory\n• Splunk Enterprise (SIEM)\n• Sysmon (endpoint telemetry)\n• pfSense (firewall)\n• Suricata IDS (network intrusion detection)\n• Kali Linux (red team attacker)\n• REMnux + FLARE VM (malware analysis)\n\nThe lab simulates a real SOC environment for threat monitoring, malware analysis, and incident response.",
  },
  {
    patterns: ["soc lab", "siem", "detection engineering", "threat hunting", "spl", "alert", "dashboard"],
    response: "Joseph's SOC Lab is built around Splunk Enterprise with Sysmon integration. He has:\n• Created custom dashboards for threat detection\n• Written SPL queries for threat hunting\n• Configured alert rules and suppression logic\n• Built detection use cases for lateral movement, PowerShell abuse, credential dumping, and persistence — all mapped to MITRE ATT&CK",
  },
  {
    patterns: ["splunk", "sysmon", "log analysis"],
    response: "Joseph has hands-on Splunk experience: dashboard creation, Sysmon log ingestion, SPL query writing, threat hunting, and detection engineering. He has built MITRE ATT&CK-mapped detection rules for common attack patterns.",
  },
  {
    patterns: ["malware", "flare vm", "remnux", "static analysis", "dynamic analysis", "ghidra", "ida"],
    response: "Joseph's Malware Analysis Lab uses FLARE VM and REMnux for static and dynamic malware analysis:\n• PE file inspection, string extraction, entropy analysis\n• Runtime behavioral monitoring and registry change tracking\n• C2 network traffic capture with Wireshark and INetSim\n• Tools: Ghidra, IDA Free, Process Monitor, x64dbg",
  },
  {
    patterns: ["kali ai", "soc copilot", "ai copilot", "terminal assistant", "ai soc"],
    response: "Joseph built the Kali AI SOC Copilot — an AI-powered terminal assistant for Kali Linux, Linux, and Windows combining:\n🧠 AI-powered security reasoning\n🛡 SOC workflow automation\n🔍 Vulnerability assessment\n⚙️ IT support diagnostics\n🌐 Network scanning\n📊 System health analysis",
  },
  {
    patterns: ["password manager", "aes", "fernet", "encryption"],
    response: "Joseph built a CLI password manager in Python using AES/Fernet encryption. Features: encrypted vault at rest, PBKDF2-hashed master password, secure password generation, and a safe recovery mechanism with no plaintext passwords ever stored.",
  },
  {
    patterns: ["shareitfree", "emobilis", "share it free", "community platform"],
    response: "ShareItFree is Joseph's eMobilis final project — a Django/Python web platform for communities to share free items, services, and donations. It promotes sustainability and reduces waste by connecting people with surplus goods to those in need. Built with HTML, CSS, Bootstrap, Python, and Django.",
  },
  {
    patterns: ["phishing detection", "phishing system", "final year project", "final project", "jkuat project"],
    response: "Joseph's 4th Year Final Year Project at JKUAT is a Phishing Detection System — a machine learning powered tool that identifies phishing URLs and emails using feature engineering and classification models. Built with Python, scikit-learn, and a Django web interface. Trained on PhishTank and OpenPhish datasets.",
  },
  {
    patterns: ["project", "projects", "built", "created", "portfolio work"],
    response: "Joseph's 7 projects:\n\n1. 🏢 Enterprise Cybersecurity Lab — full SOC environment\n2. 🦠 Malware Analysis Lab — FLARE VM & REMnux\n3. 📊 SOC Lab — Splunk SIEM & detection engineering\n4. 🤖 Kali AI SOC Copilot — AI terminal security assistant\n5. 🔐 Password Manager — AES-encrypted Python CLI tool\n6. 🤝 ShareItFree — Django community sharing platform (eMobilis)\n7. 🎣 Phishing Detection System — ML-based classifier (JKUAT final year)",
  },
  // ── Certifications ──────────────────────────────────────────────────────────
  {
    patterns: ["certification", "certifications", "certified", "certificate", "credly", "cisco", "comptia", "isc2", "letsdefend", "centri"],
    response: "Joseph's certifications:\n\n📌 Cisco:\n• Introduction to Cybersecurity\n• Cybersecurity Essentials\n• Cyber Threat Management\n• CCNA: Introduction to Networks\n• CCNA: Switching, Routing & Wireless Essentials\n• CCNA: Enterprise Networking, Security & Automation\n• Cisco DevNet Associate\n• Junior Cybersecurity Analyst Career Path\n\n📌 LetsDefend: SOC Analyst Learning Path\n📌 Centri: Blue Team Junior Analyst Pathway\n📌 ISC2: Introduction to Cybersecurity\n\n📌 In Progress: CompTIA Security+, CompTIA CySA+\n\n🏆 Credly: credly.com/users/joseph-ngahu",
  },
  // ── Skills ──────────────────────────────────────────────────────────────────
  {
    patterns: ["skills", "technologies", "tools", "competencies", "tech stack", "technical skills", "what can"],
    response: "Joseph's technical skills:\n\n🛡 Cybersecurity: SIEM, threat detection, malware analysis, incident response, vulnerability assessment, MITRE ATT&CK, IDS/IPS, phishing analysis\n\n🌐 Networking: TCP/IP, DNS, DHCP, VLANs, routing & switching, Wireshark\n\n🔧 Tools: Splunk, Suricata, pfSense, Nmap, Nessus, Burp Suite, Metasploit, Wireshark\n\n🖥 OS: Kali Linux, Windows Server, Ubuntu, REMnux, FLARE VM\n\n💻 Programming: Python, Bash, PowerShell, Django, HTML/CSS, JavaScript\n\n☁️ Virtualisation: VMware, VirtualBox",
  },
  // ── Contact ─────────────────────────────────────────────────────────────────
  {
    patterns: ["contact", "email", "linkedin", "reach", "phone", "call", "whatsapp"],
    response: "You can reach Joseph at:\n\n📧 Email: ngahujoseph184@gmail.com\n📱 Phone/WhatsApp: +254793481366 / +254768936593\n💼 LinkedIn: linkedin.com/in/joseph-ngahu-093a141b0/\n💬 WhatsApp: https://wa.me/254793481366\n\nHe is actively seeking SOC Analyst and Cybersecurity Analyst roles.",
  },
  {
    patterns: ["goal", "career", "looking for", "position", "role", "seeking", "hire", "open to work", "job"],
    response: "Joseph's career goal is to secure a SOC Analyst or Cybersecurity Analyst position where he can apply his hands-on experience in threat detection, SIEM engineering, malware analysis, and incident response. He is blue team focused, based in Kenya, and open to remote and on-site roles.",
  },
  {
    patterns: ["article", "medium", "blog", "write", "published"],
    response: "Joseph writes cybersecurity content on Medium (@ngahu242). Recent series: Building a Cybersecurity and Malware Analysis Lab — 6 published articles covering pfSense network setup, Windows Server configuration, Windows 11 domain client, Active Directory structure, and Kali Linux integration.\n\nView all: medium.com/@ngahu242",
  },
  {
    patterns: ["resume", "cv", "download"],
    response: "You can view and download Joseph's full resume in the Resume section of this portfolio. It covers his BSc from JKUAT, industrial attachment, all certifications, projects, and technical skills.",
  },
  
 // ── Conversation ─────────────────────────────────────────────────────────────────
  {
  patterns: ["hello", "hi", "hey"],
  response:
    "Hello! 👋 Welcome to Joseph's portfolio. Feel free to ask me anything about his cybersecurity journey, projects, certifications, or technical skills."
  },
  {
    patterns: ["thank you", "thanks", "thankyou"],
    response:
      "You're very welcome! 😊 If you'd like to know more about Joseph's experience or qualifications, just ask."
  },
  {
    patterns: ["bye", "goodbye"],
    response:
      "Goodbye! 👋 Thanks for visiting Joseph's portfolio, and have a wonderful day!"
  },
  {
    patterns: ["who are you", "what are you"],
    response:
      "I'm Joseph's AI assistant, designed to answer questions about his professional background, cybersecurity expertise, projects, certifications, and career goals."
  },
  {
    patterns: ["what can you do", "help"],
    response:
      "I can answer questions about Joseph's projects, cybersecurity labs, certifications, technical skills, work experience, education, resume, Medium articles, and contact information."
  },
];

function getChatResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (
    ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
      .some(g => lower === g || lower.startsWith(g))
  ) {
    return "Hello! 👋 I'm Joseph's AI assistant. I can tell you about Joseph's cybersecurity experience, SOC Lab, Malware Analysis Lab, projects, certifications, technical skills, education, and career goals. What would you like to know?";
  }

  // Thank you
  if (
    ["thanks", "thank you", "thankyou", "appreciate it", "cheers"]
      .some(t => lower.includes(t))
  ) {
    return "You're very welcome! 😊 I'm happy to help. Feel free to ask anything else about Joseph's experience, projects, or qualifications.";
  }

  // Goodbye
  if (
    ["bye", "goodbye", "see you", "talk later"]
      .some(b => lower.includes(b))
  ) {
    return "Goodbye! 👋 Thank you for visiting Joseph's portfolio. Have a great day!";
  }

  // How are you
  if (
    ["how are you", "how's it going", "how are things"]
      .some(q => lower.includes(q))
  ) {
    return "I'm doing great, thanks for asking! 😊 I'm here to help you learn more about Joseph's background, cybersecurity projects, and professional experience.";
  }

  // Identity
  if (
    ["who are you", "what are you", "who built you"]
      .some(q => lower.includes(q))
  ) {
    return "I'm Joseph's AI assistant. I was built to help recruiters, hiring managers, and visitors quickly learn about Joseph's cybersecurity journey, technical skills, projects, and career achievements.";
  }

  // Help
  if (
    ["help", "what can you do", "what do you know"]
      .some(q => lower.includes(q))
  ) {
    return `I can answer questions about:

• Joseph's background
• Cybersecurity skills
• Projects
• Certifications
• SOC Lab
• Malware Analysis Lab
• Splunk
• Kali Linux
• Medium articles
• Resume
• Contact information

Try asking:

• Why should I hire Joseph?
• Tell me about his projects.
• What certifications does he have?
• What skills does he have?`;
  }

  // Existing Knowledge Base
  for (const rule of CHAT_RULES) {
    if (rule.patterns.some(p => lower.includes(p))) {
      return rule.response;
    }
  }

  // Off-topic
  const offTopic = [
    "weather",
    "football",
    "movie",
    "music",
    "recipe",
    "crypto",
    "politics",
    "stock",
    "travel"
  ];

  if (offTopic.some(word => lower.includes(word))) {
    return "I'm focused on answering questions about Joseph's professional background, cybersecurity expertise, projects, certifications, and career. Feel free to ask me anything related to his portfolio.";
  }

  // Default
  return `I'm not sure I understood that.

You can ask me things like:

• Tell me about Joseph
• Why should I hire Joseph?
• What cybersecurity projects has he built?
• What certifications does he have?
• What skills does he have?
• How can I contact him?`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="font-mono text-xs text-primary tracking-[0.22em] uppercase">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="font-mono text-xs px-2 py-0.5 rounded border border-primary/25 text-primary/75 bg-primary/5">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });

    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/92 backdrop-blur-lg border-b border-border shadow-lg"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
          <div className="hidden sm:flex flex-col text-[15px] leading-5 whitespace-nowrap">
            <div className="flex items-center">
              <span className="text-primary">┌──(</span>
              <span className="font-bold text-foreground">root</span>
              <span className="text-primary">㉿</span>
              <span className="font-bold text-primary">joseph_ngahu</span>
              <span className="text-primary">)-[~]</span>
            </div>
          
            <div className="flex items-center mt-0.5">
              <span className="text-primary">└─</span>
              <span className="font-bold text-primary">#</span>
              <span className="ml-2 text-primary">whoami</span>
              <span className="ml-1 w-[2px] h-3 bg-primary rounded-full animate-pulse"></span>
            </div>
          </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="font-mono text-[0.70rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <button
          className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-6 py-5 grid grid-cols-2 gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-left font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="min-h-screen flex items-center pt-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: `linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)`, backgroundSize: "72px 72px" }} />
      <div className="absolute top-1/3 -left-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <div className="font-mono text-sm mb-8 leading-7">
            <div className="font-mono text-[15px] leading-6">
            </div>
          </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4 whitespace-nowrap">
              <span className="text-foreground">Joseph</span>{" "}
              <span className="text-primary">Ngahu</span>
            </h1>
            <div className="text-[15px] leading-6">
              <div className="flex items-center gap-0 whitespace-nowrap">
                <span className="text-primary">┌──(</span>
                <span className="font-bold text-foreground">root</span>
                <span className="text-primary">㉿</span>
                <span className="font-bold text-primary">joseph_ngahu</span>
                <span className="text-primary">)-[~]</span>
              </div>
            
              <div className="flex items-center gap-0 mt-0.5">
                <span className="text-primary">└─</span>
                <span className="font-bold text-primary">#</span>
                <span className="ml-2 text-primary">
                  cat profile.txt
                </span>
              </div>
            
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.95rem]">
                Cybersecurity Analyst • SOC Analyst • Blue Team • Malware Analyst
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-card p-5">
              <div className="flex items-center gap-0 whitespace-nowrap">
                <span className="text-primary">┌──(</span>
                <span className="font-bold text-foreground">root</span>
                <span className="text-primary">㉿</span>
                <span className="font-bold text-primary">joseph_ngahu</span>
                <span className="text-primary">)-[~]</span>
              </div>
            
              <div className="flex items-center gap-0 mt-1">
                <span className="text-primary">└─</span>
                <span className="font-bold text-primary">#</span>
                <span className="ml-2 text-primary">
                  cat about_me.txt
                </span>
              </div>
            
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.95rem]">
                <p>Mathematics & Computer Science graduate with a strong focus on cybersecurity, SOC operations, threat detection, malware analysis,incident response, and building enterprise security labs.</p>
              </div>
            </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => scrollTo("projects")} className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs font-semibold tracking-wider hover:bg-primary/88 transition-colors rounded-lg">
              View Projects
            </button>
            <button onClick={() => scrollTo("resume")} className="px-5 py-3 border border-border text-muted-foreground font-mono text-xs font-semibold tracking-wider hover:border-primary/50 hover:text-primary transition-colors rounded-lg flex items-center gap-2">
              <Download size={13} />Resume
            </button>
            <button onClick={() => scrollTo("contact")} className="px-5 py-3 border border-border text-muted-foreground font-mono text-xs font-semibold tracking-wider hover:border-primary/50 hover:text-primary transition-colors rounded-lg">
              Contact
            </button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl border border-primary/15" />
            <div className="absolute -inset-9 rounded-3xl border border-primary/07" />
            <div className="w-72 h-72 md:w-[22rem] md:h-[22rem] rounded-2xl overflow-hidden bg-secondary relative">
              {/* 📸 Replace src with your own photo URL (upload to Cloudinary) */}
              <img src="https://res.cloudinary.com/dqczxob3/image/upload/PXL_20250513_160332801_ajfefj" alt="Joseph Ngahu Kinyanjui — Cybersecurity Analyst" className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)" }} />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent px-4 py-3">
                <p className="font-mono text-[13px] leading-none flex items-center whitespace-nowrap">
                  <span className="text-primary">└─</span>
              
                  <span className="font-bold text-primary">#</span>
              
                  <span className="ml-2 font-semibold text-foreground">
                    root
                  </span>
              
                  <span className="text-primary">㉿</span>
              
                  <span className="font-semibold text-primary">
                    joseph_ngahu
                  </span>
              
                  <span className="text-primary">:~</span>
              
                  <span className="ml-2 text-primary">
                    ./portfolio
                  </span>
              
                  <span className="ml-1 w-[2px] h-3 bg-primary animate-pulse rounded-full"></span>
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-7 bg-card border border-border rounded-xl px-4 py-3 shadow-2xl">
              <p className="font-mono text-xs text-muted-foreground"> projects/ </p> 
              <p className="font-display text-3xl font-bold text-primary"> 7+ </p>
               
            </div>
            <div className="absolute -top-5 -right-5 bg-card border border-border rounded-xl px-4 py-3 shadow-2xl">
              <p className="font-mono text-xs text-muted-foreground"> certifications/ </p> 
              <p className="font-display text-3xl font-bold text-primary"> 11+ </p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => scrollTo("about")} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce" aria-label="Scroll down">
        <ChevronDown size={20} />
      </button>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>About Me</SectionLabel>
        <div className="grid md:grid-cols-5 gap-14 items-start">
          <div className="md:col-span-3">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-7 leading-tight">
              Blue Team Enthusiast.<br /><span className="text-primary">Lab Builder.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.95rem]">
              <p>I am a Mathematics and Computer Science graduate from JKUAT with a deep focus on cybersecurity, SOC operations, and hands-on lab environments. My journey began with curiosity about how systems get compromised and evolved into a passion for defending them.</p>
              <p>I have built enterprise-grade security labs from scratch, configured SIEM platforms, performed malware analysis, and designed detection engineering use cases mapped to MITRE ATT&CK. During my industrial attachment at Kirinyaga County Government, I applied these skills in a real IT environment to support users, secure systems, and maintain network reliability.</p>
              <p>I continuously sharpen my skills on TryHackMe, HackTheBox, and LetsDefend. My goal is to join a SOC team where I can contribute immediately and grow alongside experienced security practitioners.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 gap-3">
            {/* Consolidated Metadata Info Grid (No Map Iframe Hooks) */}
            {[
              { label: "Currently Learning", value: "Blue Team / SOC Operations · Malware Analysis · Enterprise Security . Incident Response & Threat Hunting . Splunk & Security Monitoring . CompTIA Security+" },
              { label: "Practising On", value: "TryHackMe · HackTheBox · LetsDefend" },
              { label: "Career Goal", value: "SOC Analyst / Cybersecurity Analyst" },
              { label: "Location", value: "Kenya" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4">
                <p className="font-mono text-xs text-primary/65 mb-1.5 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm text-foreground leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" className="py-24 bg-card/20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Education</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Academic Background</h2>
        <div className="space-y-5">
          {EDUCATION.map((edu) => (
            <div key={edu.id} className="bg-card border border-border rounded-xl p-7 hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}30` }}>
                  <GraduationCap size={22} style={{ color: edu.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground leading-snug">{edu.institution}</h3>
                      <p className="font-mono text-xs text-primary/70 mt-1">{edu.degree}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-xs text-muted-foreground">{edu.period}</p>
                      {edu.note && <p className="font-mono text-xs text-primary mt-0.5">{edu.note}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">{edu.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Experience</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Work Experience</h2>
        <div className="space-y-5">
          {EXPERIENCE.map((exp) => (
            <div key={exp.id} className="bg-card border border-border rounded-xl p-7 hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{exp.role}</h3>
                      <p className="font-mono text-xs text-primary/70 mt-0.5">{exp.type} &nbsp;·&nbsp; {exp.company}</p>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground flex-shrink-0">{exp.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary/50 flex-shrink-0 mt-0.5">›</span>{r}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => <Tag key={tag} label={tag} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="py-24 bg-card/20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Skills</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Technical Skills</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {SKILLS.map((group) => (
            <div key={group.category} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: group.color }} />
                <h3 className="font-mono text-xs uppercase tracking-widest" style={{ color: group.color }}>
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-lg font-body text-foreground/80"
                    style={{ background: `${group.color}10`, border: `1px solid ${group.color}22` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
type Project = typeof PROJECTS[0];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-background/97 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <button onClick={onClose} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mb-10 transition-colors">
          <X size={13} /> Back to Projects
        </button>
        <div className="rounded-xl overflow-hidden border border-border mb-8 bg-secondary">
          <img src={project.image} alt={project.title} className="w-full h-60 object-cover" />
        </div>
        <p className="font-mono text-xs text-primary/65 mb-2 uppercase tracking-wider">{project.subtitle}</p>
        <h2 className="font-display text-4xl font-bold text-foreground mb-5">{project.title}</h2>
        <div className="flex flex-wrap gap-1.5 mb-10">
          {project.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </div>
        {([
          { title: "Overview", content: project.overview },
          { title: "Architecture", content: project.architecture },
          { title: "Challenges", content: project.challenges },
          { title: "Lessons Learned", content: project.lessons },
        ] as { title: string; content: string }[]).map((s) => (
          <div key={s.title} className="mb-8">
            <h4 className="font-mono text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-primary inline-block" />{s.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed text-[0.95rem]">{s.content}</p>
          </div>
        ))}
        <div className="flex gap-3 pt-6 border-t border-border">
          <a href={project.github} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-mono text-xs hover:border-primary/50 hover:text-primary transition-colors">
            <Github size={13} /> GitHub
          </a>
          <a href={project.article} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-mono text-xs hover:border-primary/50 hover:text-primary transition-colors">
            <BookOpen size={13} /> Medium Article
          </a>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Projects</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">What I've Built</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <article key={project.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/35 transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden bg-secondary flex-shrink-0">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">{project.title}</h3>
                <p className="font-mono text-xs text-primary/65 mb-3">{project.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.slice(0, 5).map((tag) => <Tag key={tag} label={tag} />)}
                  {project.tags.length > 5 && <span className="font-mono text-xs text-muted-foreground px-2 py-0.5">+{project.tags.length - 5}</span>}
                </div>
                <button onClick={() => setSelected(project)} className="flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/75 transition-colors group/btn self-start">
                  Read More <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
type Cert = typeof CERTIFICATIONS[0];

function CertModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasCert = cert.certificateUrl && cert.certificateUrl !== "#";
  const isImage = hasCert && /\.(png|jpg|jpeg|gif|webp)/i.test(cert.certificateUrl);
  const isGoogleDrive = hasCert && cert.certificateUrl.includes("drive.google.com");

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={17} />
        </button>

        <p className="font-mono text-xs text-primary/65 mb-1 uppercase tracking-wider">{cert.issuer}</p>
        <h3 className="font-display text-xl font-bold text-foreground mb-4 leading-snug pr-6">{cert.name}</h3>

        {/* Certificate display */}
        <div className="w-full rounded-xl overflow-hidden mb-5" style={{ background: `${cert.color}08`, border: `1px solid ${cert.color}25` }}>
          {isImage ? (
            <img src={cert.certificateUrl} alt={cert.name} className="w-full object-contain max-h-64" />
          ) : isGoogleDrive ? (
            <iframe src={cert.certificateUrl} className="w-full h-64 border-0" title={cert.name} />
          ) : hasCert ? (
            /* PDF — show placeholder with open button */
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Award size={44} style={{ color: cert.color }} />
              <p className="font-display text-base font-bold text-foreground text-center">{cert.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
              <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg font-mono text-xs hover:opacity-80 transition-opacity" style={{ background: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}40` }}>
                <ExternalLink size={12} /> Open Certificate PDF
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Award size={44} style={{ color: cert.color }} />
              <p className="font-mono text-xs text-muted-foreground/50 mt-2">Certificate not yet uploaded</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {hasCert && !isGoogleDrive && !isImage && (
            <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-mono text-sm font-semibold rounded-lg hover:bg-primary/88 transition-colors">
              <ExternalLink size={13} /> View Certificate
            </a>
          )}
          {hasCert && isImage && (
            <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-mono text-sm font-semibold rounded-lg hover:bg-primary/88 transition-colors">
              <Download size={13} /> View / Download
            </a>
          )}
          {hasCert && isGoogleDrive && (
            <a href={cert.certificateUrl.replace("/preview", "/view")} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-mono text-sm font-semibold rounded-lg hover:bg-primary/88 transition-colors">
              <ExternalLink size={13} /> Open Full Screen
            </a>
          )}
          {!hasCert && (
            <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/25 text-primary-foreground/40 font-mono text-sm font-semibold rounded-lg cursor-not-allowed">
              <Download size={13} /> Not yet uploaded
            </button>
          )}
          {cert.credlyUrl && cert.credlyUrl !== "#" && (
            <a href={cert.credlyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-mono text-xs hover:border-primary/50 hover:text-primary transition-colors">
              <Award size={13} /> Credly
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Certifications() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const groups = CERTIFICATIONS.reduce<Record<string, Cert[]>>((acc, cert) => {
    if (!acc[cert.group]) acc[cert.group] = [];
    acc[cert.group].push(cert);
    return acc;
  }, {});

  return (
    <section id="certifications" className="py-24 bg-card/20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Certifications</SectionLabel>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Credentials</h2>
          <a href="https://www.credly.com/users/joseph-ngahu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-xs text-primary hover:text-primary/80 transition-colors border border-primary/25 rounded-lg px-3 py-2 self-start sm:self-auto">
            <Award size={13} />View all on Credly<ArrowUpRight size={11} />
          </a>
        </div>

        {Object.entries(groups).map(([group, certs]) => (
          <div key={group} className="mb-10">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-3">
              {group}<span className="h-px flex-1 bg-border" />
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {certs.map((cert) => (
                <div key={cert.id} className={`bg-card border rounded-xl p-5 transition-all duration-300 flex flex-col ${cert.todo ? "border-dashed border-border/50 opacity-70" : "border-border hover:border-primary/35"}`}>
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center flex-shrink-0" style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}>
                    <Award size={22} style={{ color: cert.color }} />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-0.5 leading-snug flex-1">{cert.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground mb-0.5">{cert.issuer}</p>
                  <p className="font-mono text-xs mb-4" style={{ color: cert.todo ? "#888" : cert.color }}>{cert.date}</p>
                  {cert.todo ? (
                    <span className="font-mono text-xs text-muted-foreground/50 border border-dashed border-border/40 rounded px-2 py-1 self-start">To-Do</span>
                  ) : (
                    <button onClick={() => setSelected(cert)} className="font-mono text-xs text-primary hover:text-primary/75 transition-colors flex items-center gap-1.5 group/btn mt-auto">
                      View Certificate <ArrowUpRight size={11} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────────────────────────────────────
function Articles() {
  return (
    <section id="articles" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Articles</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Written Work</h2>
        <div className="space-y-3">
          {ARTICLES.map((article, i) => (
            <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-6 bg-card border border-border rounded-xl p-6 hover:border-primary/35 transition-all duration-200 group block">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-muted-foreground mb-2">{article.date}&nbsp;·&nbsp;{article.readTime}</p>
                <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{article.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.description}</p>
              </div>
              <ArrowUpRight size={17} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="https://medium.com/@ngahu242" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
            View all articles on Medium <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUME
// ─────────────────────────────────────────────────────────────────────────────
function Resume() {
  return (
    <section id="resume" className="py-24 bg-card/20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Resume</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Resume</h2>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-secondary/60 border-b border-border px-4 py-2.5 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
              <span className="font-mono text-xs text-muted-foreground ml-2">joseph_ngahu_resume_2025.pdf</span>
            </div>
            {/* Live PDF preview via Cloudinary */}
            <iframe
              src={RESUME_VIEW_URL}
              className="w-full border-0"
              style={{ height: "420px" }}
              title="Joseph Ngahu Kinyanjui — Resume"
            />
          </div>

          <div>
            <div className="space-y-3 mb-9">
              <a
                href={RESUME_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-mono text-sm font-semibold rounded-xl hover:bg-primary/88 transition-colors"
              >
                <FileText size={15} /> View Full Resume
              </a>
            </div>

            <p className="font-mono text-xs text-primary uppercase tracking-wider mb-4">Key Skills Snapshot</p>
            <div className="space-y-3">
              {[
                { category: "SIEM & Detection", skills: ["Splunk Enterprise", "SPL Queries", "Detection Engineering"] },
                { category: "Network Security", skills: ["pfSense", "Suricata IDS", "Wireshark", "CCNA"] },
                { category: "Malware Analysis", skills: ["FLARE VM", "REMnux", "Ghidra"] },
                { category: "Scripting & Dev", skills: ["Python", "Bash", "Django", "JavaScript"] },
              ].map((group) => (
                <div key={group.category} className="bg-card border border-border rounded-xl p-4">
                  <p className="font-mono text-xs text-muted-foreground mb-2.5">{group.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s) => <Tag key={s} label={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);

  const set = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSendError(false);

    // 🔒 Your verified EmailJS API credentials
    const EMAILJS_SERVICE_ID = "service_op7q1iq";
    const EMAILJS_PUBLIC_KEY = "hRDfBs_lr7zv2L-KE";
    
    // 📩 Template 1: Sends the visitor's message details to you
    const MY_NOTIFICATION_TEMPLATE_ID = "template_blvi70a"; 
    
    // ✉️ Template 2: Sends your customized HTML signature confirmation to the visitor
    const AUTO_REPLY_TEMPLATE_ID = "template_uobw7vd";

    // Configuration runtime check safety gate
    const isConfigured = 
      EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" && 
      MY_NOTIFICATION_TEMPLATE_ID !== "YOUR_CONTACT_US_TEMPLATE_ID" && 
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";

    if (!isConfigured) {
      setTimeout(() => { setSubmitted(true); setSubmitting(false); }, 800);
      return;
    }

    // Unified key parameters payload matching dashboard template tags
    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email, 
      message: formData.message,
    };

    try {
      // Step 1: Send the notification email directly to Joseph's inbox
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        MY_NOTIFICATION_TEMPLATE_ID, 
        templateParams, 
        EMAILJS_PUBLIC_KEY
      );

      // Step 2: Fire the beautiful auto-reply message straight back to the visitor
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        AUTO_REPLY_TEMPLATE_ID, 
        templateParams, 
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch (err) {
      console.error("EmailJS execution track error:", err);
      setSendError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Contact</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Get in Touch</h2>
        <div className="grid md:grid-cols-2 gap-14">
          <div>
            {submitted ? (
              <div className="bg-card border border-primary/25 rounded-xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
                  <Shield size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Thanks for reaching out. Joseph will get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", message: "" }); }} className="mt-6 font-mono text-xs text-primary hover:text-primary/75 transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {([
                  { id: "name" as const, label: "Name", type: "text", placeholder: "Your full name" },
                  { id: "email" as const, label: "Email", type: "email", placeholder: "your@email.com" },
                ]).map((field) => (
                  <div key={field.id}>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={formData[field.id]} onChange={set(field.id)} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors font-body" required />
                  </div>
                ))}
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">Message</label>
                  <textarea placeholder="What would you like to discuss? (job opportunity, collaboration, etc.)" rows={5} value={formData.message} onChange={set("message")} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors resize-none font-body" required />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary text-primary-foreground font-mono text-sm font-semibold rounded-lg hover:bg-primary/88 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : "Send Message"}
                </button>
                {sendError && <p className="font-mono text-xs text-destructive text-center">Failed to send. Email directly: ngahujoseph184@gmail.com</p>}
                <p className="font-mono text-xs text-muted-foreground/45 text-center">Your message goes directly to Joseph's inbox.</p>
              </form>
            )}
          </div>

          <div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-[0.95rem]">
              I am actively looking for SOC Analyst and Cybersecurity Analyst roles. Whether you have a position, want to collaborate, or simply want to talk security, feel free to reach out.
            </p>
            <div className="space-y-3">
              {[
                { Icon: Github, label: "GitHub", href: "https://github.com/ngahu242" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/joseph-ngahu-093a141b0/" },
                { Icon: Award, label: "Credly", href: "https://www.credly.com/users/joseph-ngahu" },
                { Icon: BookOpen, label: "Medium", href: "https://medium.com/@ngahu242" },
                { Icon: Phone, label: "Phone / Call", href: "tel:+254793481366" },
                { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/254793481366" },
              ].map(({ Icon, label, handle, href }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/35 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 border border-primary/18 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm text-foreground truncate">{handle}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground ml-auto group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const FOOTER_NAV = [
  { label: "About", id: "about" }, { label: "Projects", id: "projects" },
  { label: "Certifications", id: "certifications" }, { label: "Articles", id: "articles" },
  { label: "Skills", id: "skills" }, { label: "Resume", id: "resume" }, { label: "Contact", id: "contact" },
];

const FOOTER_SOCIAL = [
  { Icon: Github, label: "GitHub", href: "http://github.com/ngahu242" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/joseph-ngahu-093a141b0/" },
  { Icon: Award, label: "Credly", href: "https://www.credly.com/users/joseph-ngahu" },
  { Icon: Mail, label: "Email", href: "mailto:ngahujoseph184@gmail.com" },
];

function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-1">
            <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-primary/12 border border-primary/35 flex items-center justify-center group-hover:bg-primary/22 transition-colors">
                <Shield size={16} className="text-primary" />
              </div>
              <span className="font-mono text-primary font-semibold tracking-wider group-hover:opacity-80 transition-opacity">
                <span className="text-primary/45"> Portfolio</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Cybersecurity Analyst specialising in SOC operations, blue team defense, and threat detection. Based in Kenya.
            </p>
            <div className="flex items-center gap-3">
              {FOOTER_SOCIAL.map(({ Icon, label, href }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">Navigation</p>
            <ul className="space-y-2.5">
              {FOOTER_NAV.map(({ label, id }) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">Get in Touch</p>
            <div className="space-y-3">
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={14} className="flex-shrink-0" />ngahujoseph184@gmail.com
              </a>
              <a href="tel:+254793481366" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={14} className="flex-shrink-0" />+254 793 481 366
              </a>
              <a href="https://www.linkedin.com/in/joseph-ngahu-093a141b0/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={14} className="flex-shrink-0" />linkedin.com/in/joseph-ngahu-093a141b0
              </a>
              <a href="https://wa.me/254793481366" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <svg 
                  xmlns="http://w3.org" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-3.5 h-3.5 flex-shrink-0" /* 👈 Matches lucide size={14} styling constraints */
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                +254 793 481 366
              </a>

            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Joseph Ngahu Kinyanjui. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/50">
            Cybersecurity Analyst &nbsp;·&nbsp; SOC Analyst &nbsp;·&nbsp; Blue Team
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK TO TOP
// ─────────────────────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-24 left-6 z-40 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 shadow-lg transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp size={16} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI CHATBOT
// ─────────────────────────────────────────────────────────────────────────────
interface Message { role: "user" | "assistant"; content: string; }

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "👋 Welcome! I'm Joseph's AI assistant.\n\nI'm Joseph's AI assistant. I can answer questions about his:\n\n• Professional background\n• Cybersecurity projects & labs\n• Technical skills\n• Certifications\n• Work experience\n• Education\n• Career goals\n• Resume & contact information\n\nFeel free to ask me anything!",
};

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, messages]);

  const send = () => {
    const text = input.trim();

    if (!text || loading) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getChatResponse(text),
        },
      ]);

      setLoading(false);
    }, 650);
  };

const SUGGESTIONS = [
  "Tell me about Joseph",
  "Why hire Joseph?",
  "What projects has he built?",
  "What cybersecurity skills does he have?",
  "What certifications does he have?",
  "How can I contact him?"
];
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {showHint && !open && (
          <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl pointer-events-none">
            <p className="font-mono text-xs text-foreground whitespace-nowrap">
              💬 Ask Joseph&apos;s AI
            </p>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/88 transition-all duration-300 ${
            open
              ? "rotate-90 scale-90"
              : "rotate-0 scale-100"
          }`}
          aria-label={open ? "Close chat" : "Open AI chat"}
        >
          {open ? (
            <X
              size={20}
              className="text-primary-foreground"
            />
          ) : (
            <MessageCircle
              size={20}
              className="text-primary-foreground"
            />
          )}
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[400px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{ height: "540px" }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
            <Shield
              size={14}
              className="text-primary"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground font-body">
              Joseph's AI
            </p>

            <p className="font-mono text-xs text-primary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[0.82rem] whitespace-pre-line leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-body"
                    : "bg-secondary text-foreground font-body"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <Loader2
                  size={11}
                  className="text-muted-foreground animate-spin"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  typing...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
                className="font-mono text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-3 border-t border-border flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && send()
            }
            placeholder="Ask anything about Joseph..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors font-body"
          />

          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/88 transition-colors disabled:opacity-35 flex-shrink-0"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="dark bg-background text-foreground min-h-screen font-body antialiased">
      <Nav />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Articles />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
}
