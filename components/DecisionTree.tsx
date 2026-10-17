import React, { useState } from 'react';
import type { DecisionVerdict, ProductInfo } from '../lib/types';
import { 
  ArrowLeft, 
  RotateCcw, 
  Clock, 
  Wrench, 
  Share2, 
  XCircle, 
  ThumbsUp
} from 'lucide-react';

interface DecisionTreeProps {
  product: ProductInfo;
  onFinishRecommendation: (verdict: DecisionVerdict) => void;
  onSwitchToLocalOptions: () => void;
  onSwitchToPauseList: () => void;
  onBackToScorecard: () => void;
}

interface Question {
  id: number;
  question: string;
  subtext: string;
  options: {
    id: string;
    label: string;
    description?: string;
    scoreWeight: number;
    tag?: 'repair' | 'borrow' | 'second_hand' | 'pause' | 'skip' | 'valid';
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Do you already own something that does a similar job?',
    subtext: 'Consider items sitting in your cupboards, closet, or desk drawers.',
    options: [
      { id: '1a', label: 'Yes, works completely fine', description: 'Upgrading purely for new aesthetics or minor novelty', scoreWeight: -3, tag: 'skip' },
      { id: '1b', label: 'Yes, but it is broken or worn out', description: 'It can potentially be fixed or parts replaced', scoreWeight: 0, tag: 'repair' },
      { id: '1c', label: 'Yes, but outdated / lacks a critical feature', description: 'A noticeable limitation in my daily routine', scoreWeight: 1, tag: 'second_hand' },
      { id: '1d', label: 'No, I own nothing like this', description: 'A genuine gap in my daily essentials', scoreWeight: 3, tag: 'valid' },
    ],
  },
  {
    id: 2,
    question: 'How often do you realistically expect to use this?',
    subtext: 'Over-estimating usage frequency is the primary driver of household clutter.',
    options: [
      { id: '2a', label: 'Daily or multiple times a week', description: 'Crucial for day-to-day productivity or living', scoreWeight: 3, tag: 'valid' },
      { id: '2b', label: 'A few times a month', description: 'Occasional routine need', scoreWeight: 1, tag: 'second_hand' },
      { id: '2c', label: 'Only a few times a year or one project', description: 'e.g. power tools, formal wear, camping gear', scoreWeight: -2, tag: 'borrow' },
      { id: '2d', label: 'Unsure / "just in case"', description: 'Speculative purchase without a concrete plan', scoreWeight: -3, tag: 'pause' },
    ],
  },
  {
    id: 3,
    question: 'Is this replacing a broken or malfunctioning item?',
    subtext: 'Many electronics and appliances fail due to inexpensive wearable components.',
    options: [
      { id: '3a', label: 'Yes, and it is impossible or unviable to fix', description: 'Certified dead or repair quote exceeds 70% of new cost', scoreWeight: 2, tag: 'second_hand' },
      { id: '3b', label: 'Yes, but I haven\'t tried getting it repaired yet', description: 'Could just be a blown fuse, battery, or loose wire', scoreWeight: -3, tag: 'repair' },
      { id: '3c', label: 'No, it\'s an addition or impulse upgrade', description: 'Nothing is broken right now', scoreWeight: 0, tag: 'pause' },
    ],
  },
  {
    id: 4,
    question: 'Are you buying it mainly because it\'s on sale, flash deal, or trending?',
    subtext: 'Discounts create artificial urgency to bypass rational evaluation.',
    options: [
      { id: '4a', label: 'Yes, the deal / FOMO is tempting me right now', description: 'If it wasn\'t discounted, I wouldn\'t be looking at it', scoreWeight: -3, tag: 'skip' },
      { id: '4b', label: 'Partially, but I planned to buy this anyway', description: 'It was on my wishlist prior to the sale', scoreWeight: 1, tag: 'pause' },
      { id: '4c', label: 'No, I would pay full retail price for it', description: 'Need is independent of pricing gimmicks', scoreWeight: 3, tag: 'valid' },
    ],
  },
  {
    id: 5,
    question: 'Could you borrow, rent, or buy this second-hand?',
    subtext: 'Circular options divert e-waste and save up to 60% of upfront cash.',
    options: [
      { id: '5a', label: 'Yes, a neighbor, friend, or rental shop has one', description: 'I only need it for a short duration', scoreWeight: -2, tag: 'borrow' },
      { id: '5b', label: 'Yes, refurbished or pre-owned works great for me', description: 'Open to certified second-hand electronics or thrift', scoreWeight: 1, tag: 'second_hand' },
      { id: '5c', label: 'No, hygiene or critical reliability requires brand new', description: 'Must have factory warranty and pristine condition', scoreWeight: 2, tag: 'valid' },
    ],
  },
];

export const DecisionTree: React.FC<DecisionTreeProps> = ({
  product,
  onFinishRecommendation,
  onSwitchToLocalOptions,
  onSwitchToPauseList,
  onBackToScorecard,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [resultVerdict, setResultVerdict] = useState<DecisionVerdict | null>(null);

  const totalQuestions = QUESTIONS.length;
  const currentQ = QUESTIONS[currentStep] ?? QUESTIONS[0];

  if (!currentQ) return null;

  const handleSelectOption = (optionId: string) => {
    const updatedAnswers = { ...selectedAnswers, [currentQ.id]: optionId };
    setSelectedAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      computeFinalVerdict(updatedAnswers);
    }
  };

  const computeFinalVerdict = (answers: Record<number, string>) => {
    let netScore = 0;

    QUESTIONS.forEach((q) => {
      const chosenId = answers[q.id];
      const opt = q.options.find((o) => o.id === chosenId);
      if (opt) {
        netScore += opt.scoreWeight;
      }
    });

    if (answers[3] === '3b') {
      setResultVerdict('repair');
      onFinishRecommendation('repair');
      return;
    }

    if (answers[1] === '1a') {
      setResultVerdict('skip');
      onFinishRecommendation('skip');
      return;
    }

    if (answers[2] === '2c' || answers[5] === '5a') {
      setResultVerdict('borrow');
      onFinishRecommendation('borrow');
      return;
    }

    if (answers[5] === '5b' || answers[1] === '1c') {
      setResultVerdict('second_hand');
      onFinishRecommendation('second_hand');
      return;
    }

    if (answers[4] === '4a' || netScore <= 1) {
      setResultVerdict('wait_30_days');
      onFinishRecommendation('wait_30_days');
      return;
    }

    setResultVerdict('buy_new');
    onFinishRecommendation('buy_new');
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setResultVerdict(null);
  };

  // Verdict Result View
  if (resultVerdict) {
    return (
      <div className="space-y-4 text-[#F4F0FA] font-sans antialiased">
        <div className="flex items-center justify-between pb-2 border-b border-[#3A344E]">
          <button
            onClick={onBackToScorecard}
            className="flex items-center gap-1 text-xs text-[#C8C2D8] hover:text-[#B9A1F5] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Back to Scorecard
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-xs text-[#C8C2D8] hover:text-[#B9A1F5] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.5} /> Retake Quiz
          </button>
        </div>

        {resultVerdict === 'repair' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#B9A1F5] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#B9A1F5]/20 text-[#B9A1F5] flex items-center justify-center mx-auto">
              <Wrench className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B9A1F5]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Attempt Repair First</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                You haven't tried fixing your existing item yet. A quick component or battery service at a local Delhi hub often restores 100% functionality.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onSwitchToLocalOptions}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(185,161,245,0.25)]"
              >
                <Wrench className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} /> Find Nearby Delhi Repair Hubs
              </button>
            </div>
          </div>
        )}

        {resultVerdict === 'borrow' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#F0C987] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#F0C987]/20 text-[#F0C987] flex items-center justify-center mx-auto">
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#F0C987]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Borrow or Rent Locally</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                Since you will only use this a few times a year, buying full price produces closet clutter. Consider renting from a local tool library in Delhi NCR.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onSwitchToLocalOptions}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F0C987] hover:bg-[#f5d7a6] text-[#17151F] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(240,201,135,0.25)]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} /> View Delhi Tool &amp; Rental Hubs
              </button>
            </div>
          </div>
        )}

        {resultVerdict === 'second_hand' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#B9A1F5] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#B9A1F5]/20 text-[#B9A1F5] flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B9A1F5]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Buy Refurbished / Second-Hand</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                You have a genuine utility need, but choosing certified refurbished or pre-owned saves you 30-50% while cutting manufacturing footprint.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onSwitchToLocalOptions}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(185,161,245,0.25)]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} /> Check Refurb &amp; Thrift Hubs
              </button>
            </div>
          </div>
        )}

        {resultVerdict === 'wait_30_days' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#F0C987] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#F0C987]/20 text-[#F0C987] flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#F0C987]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Activate 30-Day Cool Off</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                This purchase exhibits high impulse triggers. Putting it on the 30-day pause shield breaks the dopamine loop. Most shoppers forget about it within two weeks.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onSwitchToPauseList}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F0C987] hover:bg-[#f5d7a6] text-[#17151F] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(240,201,135,0.25)]"
              >
                <Clock className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} /> Save to 30-Day Pause List
              </button>
            </div>
          </div>
        )}

        {resultVerdict === 'skip' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#F08787] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#F08787]/15 text-[#F08787] flex items-center justify-center mx-auto">
              <XCircle className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#F08787]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Skip This Purchase</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                You already own a functional equivalent. Celebrate skipping the impulse and keeping {product.currency}{product.price.toLocaleString('en-IN')} in your savings!
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onSwitchToPauseList}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#292438] hover:bg-[#342E47] text-[#F0C987] border border-[#3A344E] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#F0C987]" strokeWidth={1.5} /> Save to Pause List Just in Case
              </button>
            </div>
          </div>
        )}

        {resultVerdict === 'buy_new' && (
          <div className="p-4 rounded-2xl bg-[#292438] border border-[#B9A1F5] text-center space-y-3 shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
            <div className="w-10 h-10 rounded-full bg-[#B9A1F5]/20 text-[#B9A1F5] flex items-center justify-center mx-auto">
              <ThumbsUp className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B9A1F5]">Recommendation</span>
              <h3 className="text-base font-bold text-[#F4F0FA] mt-0.5">Proceed Mindfully</h3>
              <p className="text-xs text-[#C8C2D8] mt-1 leading-relaxed">
                Your answers reflect a genuine gap and high daily frequency. Ensure you maintain and clean the item routinely to maximize its lifespan.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={onBackToScorecard}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] transition-all cursor-pointer shadow-[0_4px_16px_rgba(185,161,245,0.25)]"
              >
                Review Scorecard &amp; Care Details
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Question View
  return (
    <div className="space-y-3.5 text-[#F4F0FA] font-sans antialiased">
      {/* Top Progress & Back */}
      <div className="space-y-2 pb-1.5 border-b border-[#3A344E]">
        <div className="flex items-center justify-between text-xs text-[#C8C2D8]">
          <button
            onClick={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : onBackToScorecard}
            className="flex items-center gap-1 hover:text-[#B9A1F5] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            {currentStep > 0 ? 'Previous' : 'Scorecard'}
          </button>
          <span className="font-semibold text-[#B9A1F5] text-[11px]">
            Question {currentStep + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#292438] rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-[#B9A1F5] transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Title & Subtext */}
      <div className="space-y-0.5">
        <h3 className="text-xs font-semibold text-[#F4F0FA] leading-snug">
          {currentQ.question}
        </h3>
        <p className="text-[11px] text-[#C8C2D8] leading-relaxed">
          {currentQ.subtext}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {currentQ.options.map((opt) => {
          const isSelected = selectedAnswers[currentQ.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#B9A1F5]/15 border-[#B9A1F5] shadow-[0_4px_16px_rgba(185,161,245,0.15)]'
                  : 'bg-[#292438] hover:bg-[#342E47] border-[#3A344E] hover:border-[#B9A1F5]/50'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'border-[#B9A1F5] bg-[#B9A1F5]'
                    : 'border-[#A69FB8] bg-transparent'
                }`}
              >
                {isSelected && <div className="w-1 h-1 rounded-full bg-[#17151F]" />}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#F4F0FA]">
                  {opt.label}
                </div>
                {opt.description && (
                  <div className="text-[11px] text-[#C8C2D8] leading-normal">
                    {opt.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
