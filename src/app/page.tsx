// Súbor: src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  const tools = [
    { href: "/primer-designer", title: "Intelligent Primer Designer", description: "Automatically design optimal PCR primers with an animated analysis.", isNew: true },
    { href: "/tools/dna-sequence-tool.html", title: "DNA Sequence Operations", description: "Calculate complement and reverse complement." },
    { href: "/tools/oligo-calculator.html", title: "Oligonucleotide Calculator", description: "Calculate Tm and GC Content for DNA oligos." },
    { href: "/tools/pcr-calculator.html", title: "PCR Protocol Calculator", description: "Generate a tailored PCR protocol." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <header className="py-5 px-4 sm:px-6 lg:px-8 border-b border-border">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-primary text-primary no-underline">MB.</Link>
          <ul className="flex gap-8 items-center font-primary text-lg">
            <li><Link href="/" className="text-primary font-bold no-underline">Home</Link></li>
            <li><Link href="/pathways" className="text-text hover:text-primary no-underline transition-colors">Pathways</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="text-center py-16 sm:py-24 px-4">
            <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent tracking-tighter">
                A Toolkit for Molecular Science
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-text">
                A collection of practical tools and interactive protocols for students and researchers.
            </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-16">
            <div className="bg-card/30 p-8 rounded-lg">
                <h2 className="font-primary text-2xl font-bold mb-4 text-heading">Welcome to MB Online Tools</h2>
                <div className="space-y-4 text-text/90">
                    <p>
                        This platform is designed to simplify the daily computational tasks faced by molecular biologists, biochemists, and students. 
                        Whether you are designing a critical PCR experiment, analyzing a new DNA sequence, or exploring complex signaling pathways, 
                        our suite of intuitive tools is here to help.
                    </p>
                    <p>
                        {/* ▼▼▼ TU JE FINÁLNA OPRAVA APOSTROFU ▼▼▼ */}
                        Our flagship tool, the <strong>Intelligent Primer Designer</strong>, uses advanced heuristics to design optimal PCR primers, 
                        saving you time and increasing your experiment&apos;s success rate. Browse our classic calculators for routine tasks or explore 
                        our interactive pathway diagrams to visualize complex biological processes.
                    </p>
                </div>
            </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-16 sm:pb-24">
            <h2 className="font-primary text-3xl font-bold mb-8 text-center sm:text-left">Available Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.href} className="group block bg-card/50 p-6 rounded-lg border border-border hover:border-white/50 transition-all duration-300 hover:scale-[1.02] relative">
                        {tool.isNew && (
                            <span className="absolute top-3 right-3 bg-primary text-background text-xs font-bold px-2 py-1 rounded-full">NEW</span>
                        )}
                        <h3 className="font-primary text-xl font-bold text-heading mb-2">{tool.title}</h3>
                        <p className="text-text">{tool.description}</p>
                    </Link>
                ))}
            </div>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-border text-sm">
        <p>&copy; 2025 | A fusion of science and code.</p>
      </footer>
    </div>
  );
}