// Súbor: src/app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  const tools = [
    { href: "/tools/dna-sequence-tool.html", title: "DNA Sequence Operations", description: "Calculate the complement and reverse complement of a DNA sequence." },
    { href: "/tools/oligo-calculator.html", title: "Oligonucleotide Calculator", description: "Calculate properties like Melting Temp (Tm) and GC Content for DNA oligos." },
    { href: "/tools/pcr-calculator.html", title: "PCR Protocol Calculator", description: "Generate a tailored PCR protocol based on your polymerase and primers." },
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

        <section className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24">
            <h2 className="font-primary text-3xl font-bold mb-8 text-center sm:text-left">Available Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tools.map((tool, index) => (
                    <Link href={tool.href} key={index} className="group block bg-card/50 p-6 rounded-lg border border-border hover:border-white/50 transition-all duration-300 hover:scale-[1.02]">
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