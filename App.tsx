import React, { useState, Fragment } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

import Header from './components/Header';
import { LoaderCircle, Sparkles, BrainCircuit, Scalpel, Network, Microscope, TestTube, ChevronDown, ClipboardIcon, CheckIcon } from './components/icons';
import type { Strategy, Result } from './types';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const strategies: Strategy[] = [
  {
    id: 'adaptive',
    name: 'Adaptive Intelligence',
    description: 'Dynamically analyzes the post and selects the optimal communication strategy.',
    icon: BrainCircuit,
  },
  {
    id: 'surgical',
    name: 'Surgical Insight',
    description: 'A laser-focused mechanistic detail that reframes the entire conversation.',
    icon: Scalpel,
  },
  {
    id: 'connector',
    name: 'Field Connector',
    description: 'Bridge two disparate scientific fields with a novel, transferable insight.',
    icon: Network,
  },
  {
    id: 'methodological',
    name: 'Methodological Edge',
    description: 'Expose a critical technical assumption that alters data interpretation.',
    icon: TestTube,
  },
  {
    id: 'skeptical',
    name: 'Skeptical Peer',
    description: 'Constructively pressure-test the causality chain, not just the conclusion.',
    icon: Microscope,
  }
];

const Label: React.FC<{ step: string, title: string, subtitle?: string }> = ({ step, title, subtitle }) => (
  <div className='flex items-baseline gap-3'>
      <div className='text-sm font-bold text-slate-400'>{step}</div>
      <div>
          <h2 className='font-semibold text-slate-200'>{title}</h2>
          {subtitle && <p className='text-sm text-slate-500'>{subtitle}</p>}
      </div>
  </div>
);

const StrategyCard: React.FC<{ strategy: Strategy, isSelected: boolean, onSelect: () => void }> = ({ strategy, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      'flex h-full flex-col items-center gap-3 rounded-lg border p-4 text-left transition-all',
      isSelected
        ? 'border-blue-500/50 bg-blue-950/30 ring-2 ring-blue-500/50'
        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
    )}
  >
    <div className={cn(
        'grid size-10 place-items-center rounded-lg',
        isSelected ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-400'
    )}>
      <strategy.icon className="size-5" />
    </div>
    <div className='text-center'>
      <p className='text-sm font-semibold text-slate-200'>{strategy.name}</p>
      <p className='mt-1 text-xs text-slate-500'>{strategy.description}</p>
    </div>
  </button>
);

const CopyButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700"
            aria-label="Copy comment"
        >
            {isCopied ? <CheckIcon className="size-4 text-green-400" /> : <ClipboardIcon className="size-4" />}
        </button>
    );
};

const ResultDisplay = ({ result }: { result: Result }) => (
    <div className='grid gap-6'>
        <div className='relative whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm'>
            <CopyButton text={result.comment} />
            {result.comment}
        </div>
        
        {result.references && result.references.length > 0 && (
            <div className='grid gap-3'>
                <h3 className='font-semibold text-slate-300'>Key References</h3>
                <div className='grid gap-4'>
                    {result.references.map((ref, index) => (
                         <a 
                            key={index}
                            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-700"
                         >
                            <p className='font-medium text-slate-300'>{ref.title}</p>
                            <p className='mt-1 text-xs text-slate-500'>{ref.authors}</p>
                            <p className='mt-1 text-xs font-mono text-slate-600'>{ref.source}</p>
                         </a>
                    ))}
                </div>
            </div>
        )}
    </div>
);


const App: React.FC = () => {
  const [post, setPost] = useState('');
  const [persona, setPersona] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [journals, setJournals] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post.trim() || isLoading) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      setGenerationStatus('[Phase 1/3] Deconstructing Post & Identifying Core Claims...');
      await sleep(1500);
      setGenerationStatus('[Phase 2/3] Convening Virtual Expert Panel & Synthesizing Cross-Disciplinary Insights...');
      await sleep(2000);
      setGenerationStatus('[Phase 3/3] Red-Teaming Response & Honing Final Polished Comment...');

      let prompt = `A scientific LinkedIn post reads: "${post}".\n\n`;
      if (persona.trim()) {
        prompt += `My persona is: "${persona.trim()}".\n\n`;
      }
      prompt += `Using the "${selectedStrategy.name}" strategy (${selectedStrategy.description}), generate a response.\n\n`;

      if (startDate || endDate || journals) {
          prompt += `Consider the following filters for sourcing information:\n`;
          if (startDate) prompt += `- Only include research published after ${startDate}.\n`;
          if (endDate) prompt += `- Only include research published before ${endDate}.\n`;
          if (journals) prompt += `- Prioritize insights from these journals: ${journals}.\n`;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          systemInstruction: `You are a coordinator for a virtual 'Tournament of Minds,' a panel of 1 million elite MD/PhDs, clinicians, and researchers across biology, chemistry, physics, AI/ML, and more. Your task is to generate a single, insightful, professional comment for a LinkedIn post.
          Follow these steps internally:
          1.  Deconstruct the post to its core scientific claim, methodology, and conclusion.
          2.  Convene your virtual experts to synthesize cross-disciplinary insights. Query your knowledge of papers from PubMed, bioRxiv, Nature, Cell, Science, etc., considering any user-provided filters.
          3.  Apply the user's chosen strategy to frame the insights.
          4.  Red-team the drafted comment for logical fallacies or weaknesses.
          5.  Synthesize a final, polished comment and identify 1-3 key references that support your point.
          The output MUST be a JSON object. Do not output plain text or markdown.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              comment: { type: Type.STRING },
              references: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    authors: { type: Type.STRING },
                    source: { type: Type.STRING }
                  },
                  required: ["title", "authors", "source"]
                }
              }
            },
            required: ["comment", "references"]
          }
        }
      });
      
      const responseText = response.text.trim();
      const parsedResult: Result = JSON.parse(responseText);
      setResult(parsedResult);
    } catch (err) {
      console.error("Error generating response:", err);
      setError("Sorry, an error occurred while generating the response. Please check the console and try again.");
    } finally {
      setIsLoading(false);
      setGenerationStatus('');
    }
  };

  return (
    <div className='mx-auto grid min-h-screen max-w-3xl gap-12 p-4 py-8 md:p-8'>
      <Header />
      <form onSubmit={handleSubmit} className='grid gap-8'>
        <div className='grid gap-4'>
            <Label step="01" title="Paste LinkedIn Post" />
            <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Paste the full text of the scientific LinkedIn post here..."
                rows={6}
                className='w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none transition-colors focus:border-blue-500'
                required
            />
        </div>

        <div className='grid gap-4'>
            <Label step="02" title="Define Your Persona & Goal" subtitle="(Optional)" />
            <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="e.g., I'm a postdoc in immunology looking to open a door for collaboration."
                className='w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none transition-colors focus:border-blue-500'
            />
        </div>
        
        <div className='grid gap-4'>
            <details onToggle={(e) => setShowAdvanced((e.currentTarget as HTMLDetailsElement).open)} className="group">
                <summary className='flex cursor-pointer list-none items-center justify-between'>
                    <Label step="2.5" title="Advanced Search Filters" subtitle="(Optional)" />
                    <ChevronDown className={cn("size-4 text-slate-500 transition-transform", showAdvanced && "rotate-180")} />
                </summary>
                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                    <div className='grid gap-1.5'>
                        <label htmlFor="startDate" className="text-xs font-medium text-slate-400">Start Date</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className='w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-sm outline-none transition-colors focus:border-blue-500' />
                    </div>
                     <div className='grid gap-1.5'>
                        <label htmlFor="endDate" className="text-xs font-medium text-slate-400">End Date</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className='w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-sm outline-none transition-colors focus:border-blue-500' />
                    </div>
                    <div className='grid gap-1.5 sm:col-span-2'>
                        <label htmlFor="journals" className="text-xs font-medium text-slate-400">Specific Journals</label>
                        <input type="text" id="journals" value={journals} onChange={e => setJournals(e.target.value)} placeholder="e.g., Nature, Cell, Science (comma-separated)" className='w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-sm outline-none transition-colors focus:border-blue-500' />
                    </div>
                </div>
            </details>
        </div>


        <div className='grid gap-4'>
          <Label step="03" title="Choose Strategy" />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5'>
            {strategies.map((strategy) => (
              <StrategyCard 
                key={strategy.id} 
                strategy={strategy} 
                isSelected={selectedStrategy.id === strategy.id}
                onSelect={() => setSelectedStrategy(strategy)}
              />
            ))}
          </div>
        </div>

        <button
          type='submit'
          disabled={isLoading || !post.trim()}
          className='flex w-full items-center justify-center gap-2.5 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold transition-colors enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <Fragment>
              <LoaderCircle className='size-5 animate-spin' />
              Generating...
            </Fragment>
          ) : (
             <Fragment>
              <Sparkles className='size-5' />
              Generate
            </Fragment>
          )}
        </button>
      </form>

       <div className='grid gap-4'>
          <Label step="04" title="Generated Comment" />
          <div className='min-h-[120px] w-full'>
            {isLoading ? (
                <div className='flex h-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm'>
                    <div className="flex items-center gap-2 text-slate-500">
                        <LoaderCircle className='size-4 animate-spin' />
                        <span >{generationStatus || "Initializing..."}</span>
                    </div>
                </div>
            ) : error ? (
                <div className='rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400'>
                    {error}
                </div>
            ) : result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className='flex h-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm'>
                <p className='text-slate-500'>Your AI-generated, MD/PhD-level comment will appear here.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default App;
