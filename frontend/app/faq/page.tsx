"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronDown,
  Factory,
  Headset,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import "swiper/css";
import DemoPopup from "../components/PopupDemo";

const categories = [
  {
    id: "about-hpmc",
    label: "About HPMC",
    icon: Factory,
  },
  {
    id: "extrusion-machines",
    label: "Extrusion Machines",
    icon: Boxes,
  },
  {
    id: "technical-production",
    label: "Technical & Production",
    icon: Settings,
  },
  {
    id: "service-support",
    label: "Service & Support",
    icon: Headset,
  },
];

const faqItems = [
  {
    category: "about-hpmc",
    question: "Who is HPMC?",
    answer:
      "Hindustan Plastics & Machine Corporation (HPMC) is a leading plastic extrusion machinery manufacturer in India with over 50 years of industry experience. HPMC specializes in designing and manufacturing PVC Pipe Plants, HDPE Pipe Extrusion Lines, Twin Screw Extruders, Single Screw Extruders, Recycling Plants, PVC Compounding Plants, Cable Extrusion Machines, and complete plastic processing solutions for domestic and international markets.",
  },
  {
    category: "about-hpmc",
    question: "When was HPMC established?",
    answer:
      "HPMC was established in 1972 and has been serving the plastic extrusion industry for more than five decades. With continuous innovation, engineering expertise, and customer-focused solutions, the company has become a trusted name in plastic processing machinery manufacturing.",
  },
  {
    category: "about-hpmc",
    question: "What products does HPMC manufacture?",
    answer:
      "HPMC manufactures a wide range of plastic extrusion machinery including PVC Pipe Plants, HDPE Pipe Plants, PPR Pipe Plants, CPVC Pipe Plants, PVC Conduit Pipe Plants, Single Screw Extruders, Twin Screw Extruders, Co-Rotating Twin Screw Extruders, Triple Screw Extruders, Recycling Plants, Plastic Pelletizing Plants, PVC Compounding Plants, Cable Extrusion Machines, and PVC Profile Extrusion Lines.",
  },
  {
    category: "about-hpmc",
    question: "Which industries use HPMC extrusion machinery?",
    answer:
      "HPMC machines are widely used in water supply infrastructure, agriculture and irrigation, construction, electrical conduit manufacturing, cable production, polymer compounding, plastic recycling, packaging, industrial piping, and profile extrusion industries.",
  },
  {
    category: "about-hpmc",
    question:
      "What makes HPMC different from other plastic extrusion machine manufacturers?",
    answer:
      "HPMC combines over 50 years of manufacturing experience with modern extrusion technology, robust machine construction, customized solutions, reliable performance, energy-efficient designs, and dedicated after-sales support. The company focuses on delivering long-term value, consistent output quality, and dependable production performance.",
  },
  {
    category: "about-hpmc",
    question: "Does HPMC export plastic extrusion machinery?",
    answer:
      "Yes. HPMC supplies plastic extrusion machinery to customers across multiple international markets. The company supports export projects with machine selection assistance, technical consultation, documentation support, installation guidance, operator training, and after-sales service.",
  },
  {
    category: "about-hpmc",
    question: "Can HPMC provide complete turnkey extrusion solutions?",
    answer:
      "Yes. HPMC provides complete turnkey extrusion projects including machine manufacturing, plant planning assistance, installation support, commissioning, operator training, process optimization, and technical guidance to help customers start production efficiently.",
  },
  {
    category: "about-hpmc",
    question: "Why do manufacturers trust HPMC?",
    answer:
      "Manufacturers trust HPMC because of its proven track record, engineering expertise, high-quality extrusion machinery, transparent business practices, responsive technical support, and successful installations across a wide range of plastic processing applications.",
  },
  {
    category: "extrusion-machines",
    question: "What is a plastic extrusion machine?",
    answer:
      "A plastic extrusion machine is an industrial system that melts, mixes, and shapes plastic raw materials into continuous products such as PVC pipes, HDPE pipes, conduit pipes, profiles, cable insulation, plastic sheets, and recycled plastic pellets. Plastic extrusion technology is widely used in infrastructure, agriculture, construction, cable manufacturing, and polymer processing industries.",
  },
  {
    category: "extrusion-machines",
    question: "Which plastic extrusion machines does HPMC manufacture?",
    answer:
      "HPMC manufactures Single Screw Extruders, Twin Screw Extruders, Co-Rotating Twin Screw Extruders, Co-Rotating Triple Screw Extruders, PVC Pipe Plants, HDPE Pipe Plants, PPR Pipe Plants, CPVC Pipe Plants, PVC Conduit Pipe Plants, Recycling Plants, PVC Compounding Plants, Cable Extrusion Machines, and PVC Profile Extrusion Lines.",
  },
  {
    category: "extrusion-machines",
    question:
      "What is the difference between a Single Screw Extruder and a Twin Screw Extruder?",
    answer:
      "A Single Screw Extruder is commonly used for processing HDPE, LDPE, LLDPE, PP, and PPR materials in pipe, profile, and sheet applications. A Twin Screw Extruder provides better mixing, improved plasticization, higher filler loading capability, and superior process control, making it ideal for PVC pipe manufacturing, CPVC pipes, PVC profiles, and compounding applications.",
  },
  {
    category: "extrusion-machines",
    question: "Which machine is used for PVC pipe manufacturing?",
    answer:
      "PVC pipe manufacturing typically uses Twin Screw Extruders because they provide excellent material fusion, stable processing, high output rates, and consistent pipe quality. HPMC offers complete PVC Pipe Plants for plumbing, agriculture, electrical conduit, and infrastructure applications.",
  },
  {
    category: "extrusion-machines",
    question: "Which machine is used for HDPE pipe manufacturing?",
    answer:
      "HDPE pipe manufacturing commonly uses High-Speed Single Screw Extruders equipped with advanced screw designs, vacuum calibration systems, haul-off units, and automatic cutting systems to ensure high productivity and excellent pipe quality.",
  },
  {
    category: "extrusion-machines",
    question: "What is a PVC Conduit Pipe Plant?",
    answer:
      "A PVC Conduit Pipe Plant is a specialized extrusion line used to manufacture electrical conduit pipes for cable protection and wiring systems. These plants are widely used in residential, commercial, and industrial construction projects.",
  },
  {
    category: "extrusion-machines",
    question: "What is a PPR Pipe Plant used for?",
    answer:
      "A PPR Pipe Plant is used for manufacturing PPR pipes that are commonly installed in hot and cold water distribution systems, plumbing networks, commercial buildings, hospitals, and industrial fluid transportation applications.",
  },
  {
    category: "extrusion-machines",
    question: "What is a CPVC Pipe Plant used for?",
    answer:
      "A CPVC Pipe Plant is designed to manufacture CPVC pipes used in hot water plumbing systems, fire sprinkler installations, industrial fluid transfer, and chemical handling applications where high temperature resistance is required.",
  },
  {
    category: "extrusion-machines",
    question: "What is a Plastic Recycling Plant?",
    answer:
      "A Plastic Recycling Plant processes waste plastic materials and converts them into reusable plastic granules or pellets. Recycling plants help manufacturers reduce raw material costs, improve sustainability, and support circular economy initiatives.",
  },
  {
    category: "extrusion-machines",
    question: "What is a PVC Compounding Plant?",
    answer:
      "A PVC Compounding Plant is used to produce PVC compounds by blending PVC resin with additives, stabilizers, plasticizers, fillers, pigments, and modifiers. These compounds are later used in pipes, cables, profiles, fittings, and various plastic products.",
  },
  {
    category: "extrusion-machines",
    question: "What is a Cable Extrusion Machine?",
    answer:
      "A Cable Extrusion Machine is used for insulation and sheathing of electrical wires and cables. It applies PVC, PE, XLPE, and other polymer materials around conductors to provide protection, insulation, and durability.",
  },
  {
    category: "extrusion-machines",
    question:
      "Can HPMC customize extrusion machinery according to production requirements?",
    answer:
      "Yes. HPMC provides customized extrusion solutions based on material type, production capacity, pipe diameter, profile dimensions, automation level, tooling requirements, and factory layout. Customization helps manufacturers achieve higher productivity and better product quality.",
  },

  {
    category: "technical-production",
    question: "Which materials can be processed on HPMC extrusion machines?",
    answer:
      "Depending on machine configuration, HPMC extrusion machines can process PVC, CPVC, HDPE, LDPE, LLDPE, PP, PPR, PE, ABS, HIPS, PMMA, PA, PC, PS, recycled plastics, engineering plastics, and customized polymer formulations for various industrial applications.",
  },
  {
    category: "technical-production",
    question: "How do I select the right extrusion machine for my project?",
    answer:
      "The ideal extrusion machine depends on the product type, raw material, required output, pipe diameter, profile dimensions, automation level, budget, and future production requirements. HPMC helps customers select the most suitable extrusion solution based on their manufacturing goals.",
  },
  {
    category: "technical-production",
    question: "What output capacity can an extrusion machine achieve?",
    answer:
      "Output capacity varies based on screw diameter, machine model, raw material, die design, cooling system, and processing conditions. HPMC offers extrusion lines ranging from small production systems to high-output industrial plants designed for large-scale manufacturing.",
  },
  {
    category: "technical-production",
    question: "What is barrier screw technology in a Single Screw Extruder?",
    answer:
      "Barrier screw technology improves plastic melting efficiency by separating solid and molten material during processing. This results in better plasticization, improved melt quality, higher output, reduced energy consumption, and more stable production.",
  },
  {
    category: "technical-production",
    question: "What are the advantages of Twin Screw Extruder technology?",
    answer:
      "Twin Screw Extruders provide superior mixing, improved filler dispersion, excellent material fusion, higher output rates, better process control, and consistent product quality. They are widely used in PVC pipe manufacturing, profile extrusion, and compounding applications.",
  },
  {
    category: "technical-production",
    question: "How does a plastic extrusion line work?",
    answer:
      "A plastic extrusion line works by feeding raw material into an extruder where it is melted and homogenized. The molten material passes through a die to form the desired shape, then moves through cooling, haul-off, and cutting systems before becoming a finished product.",
  },
  {
    category: "technical-production",
    question:
      "Can HPMC machines operate continuously for long production runs?",
    answer:
      "Yes. HPMC extrusion machinery is designed for continuous operation with stable processing, reliable output, efficient cooling systems, and durable components that support long production cycles with minimal downtime.",
  },
  {
    category: "technical-production",
    question: "How energy efficient are HPMC extrusion machines?",
    answer:
      "HPMC machines are designed with optimized screw geometry, efficient drive systems, advanced temperature control, and energy-saving technologies that help reduce power consumption while maintaining high production output.",
  },
  {
    category: "technical-production",
    question: "What factors affect extrusion machine output?",
    answer:
      "Extrusion output depends on material properties, screw design, machine size, die configuration, cooling efficiency, operating temperature, production speed, and overall process setup. Proper machine selection and optimization are essential for achieving maximum output.",
  },
  {
    category: "technical-production",
    question: "Can extrusion machines process recycled plastic materials?",
    answer:
      "Yes. HPMC recycling and compounding systems are designed to process recycled plastics including HDPE, LDPE, LLDPE, PP, ABS, HIPS, and other thermoplastic materials while maintaining excellent product quality.",
  },
  {
    category: "technical-production",
    question: "How important is die head design in extrusion?",
    answer:
      "Die head design plays a critical role in determining product quality, dimensional accuracy, wall thickness consistency, surface finish, and material flow distribution during the extrusion process.",
  },
  {
    category: "technical-production",
    question: "What routine maintenance is required for extrusion machinery?",
    answer:
      "Routine maintenance includes checking heaters, thermocouples, gearbox lubrication, screw and barrel wear, cooling systems, electrical panels, motors, drives, filters, die heads, haul-off systems, and cutting units to ensure reliable machine performance and maximum uptime.",
  },
  {
    category: "service-support",
    question: "Does HPMC provide installation support for extrusion machinery?",
    answer:
      "Yes. HPMC provides installation support for PVC Pipe Plants, HDPE Pipe Plants, Twin Screw Extruders, Recycling Plants, Cable Extrusion Machines, and other plastic processing machinery to ensure smooth project execution and production startup.",
  },
  {
    category: "service-support",
    question: "Does HPMC offer machine commissioning services?",
    answer:
      "Yes. HPMC provides commissioning services to verify machine performance, optimize processing parameters, test production output, and ensure the extrusion line operates according to project requirements.",
  },
  {
    category: "service-support",
    question: "Is operator training available after machine installation?",
    answer:
      "Yes. HPMC provides operator training covering machine operation, process optimization, safety procedures, maintenance practices, troubleshooting, and production efficiency improvements.",
  },
  {
    category: "service-support",
    question: "Can I request a machine demonstration before purchasing?",
    answer:
      "Yes. Customers can request a machine demonstration or technical consultation to better understand machine features, production capabilities, output performance, and application suitability.",
  },
  {
    category: "service-support",
    question: "Can I schedule a factory visit to see HPMC machines?",
    answer:
      "Yes. Customers can schedule a factory visit to learn about HPMC's manufacturing capabilities, quality standards, extrusion technologies, and available machinery solutions.",
  },
  {
    category: "service-support",
    question: "Does HPMC provide spare parts for extrusion machines?",
    answer:
      "Yes. HPMC supplies genuine spare parts for extrusion machinery, including screws, barrels, die heads, heaters, motors, gearboxes, control components, cutting systems, and other critical machine parts.",
  },
  {
    category: "service-support",
    question: "How can I get technical support for my extrusion line?",
    answer:
      "Customers can contact HPMC's technical support team for troubleshooting, machine optimization, process guidance, maintenance recommendations, spare parts assistance, and production-related support.",
  },
  {
    category: "service-support",
    question: "Can HPMC engineers visit our facility for technical assistance?",
    answer:
      "Yes. HPMC engineers can provide on-site technical support, machine inspections, troubleshooting, preventive maintenance, performance improvements, and operator guidance when required.",
  },
  {
    category: "service-support",
    question: "Does HPMC provide preventive maintenance support?",
    answer:
      "Yes. HPMC assists customers with preventive maintenance planning, machine health checks, component inspections, and recommended service schedules to maximize machine life and production efficiency.",
  },
  {
    category: "service-support",
    question: "How can I request a quotation for an extrusion machine?",
    answer:
      "Customers can request a quotation by sharing their product type, raw material, required output capacity, dimensions, and production requirements. HPMC then recommends the most suitable machine configuration and commercial proposal.",
  },
  {
    category: "service-support",
    question: "Can HPMC help with extrusion plant expansion projects?",
    answer:
      "Yes. HPMC supports plant expansion projects by recommending upgraded machinery, increased production capacity solutions, automation improvements, and process optimization strategies.",
  },
  {
    category: "service-support",
    question:
      "Does HPMC provide after-sales support for international customers?",
    answer:
      "Yes. HPMC provides remote technical support, documentation assistance, spare parts support, troubleshooting guidance, and commissioning assistance for international customers.",
  },
];

const categoryStats = [
  { value: "50+", label: "Years Experience" },
  { value: "1000+", label: "Installations" },
  { value: "80+", label: "Countries Served" },
  { value: "24/7", label: "Support Focus" },
];

export default function Faq() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        `${item.question} ${item.answer}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/home-hero.png')",
          }}
        />

        <div className="absolute inset-0 bg-white/20" />
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.96),rgba(255,255,255,0.72),rgba(255,255,255,0.1))]" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[760px] pt-24 lg:pt-0">
            <h1 className="text-[34px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[1.02] font-bold text-[#0B1220]">
              Plastic Extrusion Machine
              <span className="text-[#65BC4F]"> FAQs</span>
            </h1>

            <p className="mt-6 text-gray-700 text-sm md:text-lg leading-8 max-w-[650px]">
              Answers about HPMC, plastic extrusion machinery, PVC pipe plants,
              HDPE pipe extrusion lines, twin screw extruders, recycling plants,
              cable extrusion machines, spare parts, installation, training, and
              technical support.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categoryStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_18px_45px_rgba(11,18,32,0.08)] backdrop-blur"
                >
                  <p className="text-2xl font-bold text-[#65BC4F]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[1px] text-gray-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Request a Demo
                </span>

                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowRight size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Search By Topic
              </span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Find the right answer
                <span className="text-[var(--primary)]"> faster</span>
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Browse by company, product, technical, service, and spare parts
                topics. Each answer is written for real customer questions and
                includes important extrusion machinery keywords naturally.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveFaq(0);
              }}
              className={`rounded-2xl border px-5 py-3 text-left transition-all duration-300 hover:-translate-y-1 ${
                activeCategory === "all"
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_18px_45px_rgba(101,188,79,0.22)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] hover:border-[var(--primary)]"
              }`}
            >
              <ShieldCheck size={24} />
              <span className="mt-4 block text-base font-bold">All FAQs</span>
            </button>

            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveFaq(0);
                  }}
                  className={`rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_18px_45px_rgba(101,188,79,0.22)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] hover:border-[var(--primary)]"
                  }`}
                >
                  <Icon size={24} />
                  <span className="mt-4 block text-base font-bold">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <aside className="h-fit rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_20px_60px_rgba(11,18,32,0.07)] lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[2px] text-[var(--primary)]">
                    FAQ Library
                  </p>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {filteredFaqs.length} answers found
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Plastic extrusion machine manufacturer in India",
                  "PVC pipe plant and HDPE pipe extrusion line",
                  "Single screw and twin screw extruder support",
                  "Recycling plant, compounding plant, cable extrusion",
                  "Installation, training, spare parts, troubleshooting",
                ].map((keyword) => (
                  <div
                    key={keyword}
                    className="flex gap-3 rounded-2xl bg-[var(--muted)] p-4"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      {keyword}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpenPopup2(true)}
                className="mt-7 flex w-full items-center justify-between rounded-2xl bg-[var(--primary)] px-5 py-4 font-semibold text-white transition hover:opacity-90"
              >
                Ask an expert
                <ArrowRight size={18} />
              </button>
            </aside>

            <div className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_70px_rgba(11,18,32,0.08)]">
              {filteredFaqs.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    const category = categories.find(
                      (item) => item.id === faq.category,
                    );

                    return (
                      <div
                        key={faq.question}
                        className="transition-all duration-300 hover:bg-[var(--muted)]"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                        >
                          <div className="flex items-start gap-4">
                            <span
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                                isOpen
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
                              }`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div>
                              <h3 className="text-base font-semibold leading-7 text-[var(--text-primary)] sm:text-lg lg:text-xl">
                                {faq.question}
                              </h3>
                            </div>
                          </div>

                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white transition-all duration-300 ${
                              isOpen
                                ? "rotate-180 border-[var(--primary)] text-[var(--primary)]"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            <ChevronDown size={20} />
                          </span>
                        </button>

                        <div
                          className={`grid transition-all duration-500 ease-in-out ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-5 pb-6 pl-[76px] pr-7 leading-8 text-[var(--text-secondary)] sm:px-7 sm:pl-20">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Search size={28} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-[var(--text-primary)]">
                    No matching questions found
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)] leading-7">
                    Try searching for extrusion machine, PVC pipe plant, twin
                    screw extruder, recycling plant, spare parts, installation,
                    or training support.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Need product selection help?",
                text: "Share your material, product size, output requirement, and plant plan. HPMC can suggest the right plastic extrusion machine configuration.",
                icon: Settings,
              },
              {
                title: "Planning a new extrusion project?",
                text: "Discuss PVC pipe plants, HDPE pipe lines, recycling plants, compounding systems, and turnkey extrusion machinery requirements.",
                icon: Factory,
              },
              {
                title: "Need service or spare parts?",
                text: "Get support for machine maintenance, troubleshooting, genuine spare parts, operator training, and field service coordination.",
                icon: Headset,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_18px_45px_rgba(11,18,32,0.06)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-8 text-[var(--text-secondary)]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <DemoPopup open={openPopup} onClose={() => setOpenPopup(false)} />
      <PopupForm open={openPopup2} onClose={() => setOpenPopup2(false)} />
    </div>
  );
}
