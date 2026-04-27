"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterCharactersByLevels,
  HskCharacter,
  HskLevel,
} from "@/lib/hskCharacters";

type QuizState = "idle" | "running" | "completed";

type HanziWriterLike = {
  setCharacter: (char: string) => void;
  showOutline: () => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  animateCharacter: (options?: { onComplete?: () => void }) => void;
  quiz: (options?: {
    onMistake?: () => void;
    onComplete?: () => void;
    leniency?: number;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
  }) => void;
  cancelQuiz?: () => void;
};

const INITIAL_LEVELS: HskLevel[] = [1, 2, 3];

function pickRandomCharacter(
  entries: HskCharacter[],
  currentHanzi: string
): HskCharacter {
  if (entries.length === 1) {
    return entries[0];
  }

  let candidate = entries[Math.floor(Math.random() * entries.length)];
  while (candidate.hanzi === currentHanzi) {
    candidate = entries[Math.floor(Math.random() * entries.length)];
  }
  return candidate;
}

function getPedagogicalFeedback(mistakes: number): string {
  if (mistakes === 0) {
    return "Perfekt sekvens! Din motorik och minnesbild sitter starkt.";
  }
  if (mistakes <= 2) {
    return "Stabil insats. Repetera en gång till så blir streckordningen automatiserad.";
  }
  return "Bra kämpat. Titta på animationen igen och dela upp tecknet i mindre delar.";
}

export default function Home() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriterLike | null>(null);
  const mistakesRef = useRef(0);

  const [selectedLevels, setSelectedLevels] = useState<HskLevel[]>(INITIAL_LEVELS);
  const [currentCharacter, setCurrentCharacter] = useState<HskCharacter>(
    filterCharactersByLevels(INITIAL_LEVELS)[0]
  );
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [writerReady, setWriterReady] = useState(false);
  const [writerError, setWriterError] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);
  const initialHanziRef = useRef(currentCharacter.hanzi);

  const availableCharacters = useMemo(
    () => filterCharactersByLevels(selectedLevels),
    [selectedLevels]
  );

  const resetForCharacter = useCallback(() => {
    setQuizState("idle");
    setMistakes(0);
    mistakesRef.current = 0;
    setFeedback("");
    setRevealMeaning(false);
  }, []);

  const startQuiz = useCallback(() => {
    if (!writerRef.current) {
      return;
    }

    writerRef.current.cancelQuiz?.();
    writerRef.current.showOutline();
    writerRef.current.hideCharacter();

    resetForCharacter();
    setQuizState("running");

    writerRef.current.quiz({
      leniency: 1,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      onMistake: () => {
        mistakesRef.current += 1;
        setMistakes(mistakesRef.current);
      },
      onComplete: () => {
        const attempts = mistakesRef.current;
        setQuizState("completed");
        setRevealMeaning(true);
        setCompletedCount((prev) => prev + 1);
        setFocusStreak((prev) => (attempts <= 2 ? prev + 1 : 0));
        setFeedback(getPedagogicalFeedback(attempts));
      },
    });
  }, [resetForCharacter]);

  const playAnimation = useCallback(() => {
    if (!writerRef.current) {
      return;
    }

    writerRef.current.cancelQuiz?.();
    setQuizState("idle");
    setFeedback("");
    writerRef.current.showOutline();
    writerRef.current.showCharacter();
    writerRef.current.animateCharacter({
      onComplete: () => {
        writerRef.current?.hideCharacter();
      },
    });
  }, []);

  const nextCharacter = useCallback(() => {
    const next = pickRandomCharacter(availableCharacters, currentCharacter.hanzi);
    setCurrentCharacter(next);
    resetForCharacter();
  }, [availableCharacters, currentCharacter.hanzi, resetForCharacter]);

  const toggleLevel = useCallback((level: HskLevel) => {
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((entry) => entry !== level);
      }
      return [...prev, level].sort((a, b) => a - b) as HskLevel[];
    });
  }, []);

  useEffect(() => {
    if (availableCharacters.some((entry) => entry.hanzi === currentCharacter.hanzi)) {
      return;
    }

    setCurrentCharacter(availableCharacters[0]);
    resetForCharacter();
  }, [availableCharacters, currentCharacter.hanzi, resetForCharacter]);

  useEffect(() => {
    let cancelled = false;

    async function initWriter() {
      if (!boardRef.current) {
        return;
      }

      setWriterError(null);
      setWriterReady(false);
      try {
        const hanziWriterModule = await import("hanzi-writer");
        if (cancelled) {
          return;
        }

        const HanziWriter = hanziWriterModule.default;
        writerRef.current = HanziWriter.create(
          boardRef.current,
          initialHanziRef.current,
          {
          width: 300,
          height: 300,
          padding: 16,
          showCharacter: false,
          showOutline: true,
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 180,
          strokeColor: "#f7c948",
          radicalColor: "#ff5a5f",
          drawingColor: "#ff5a5f",
          outlineColor: "#4a1116",
        }
        ) as HanziWriterLike;

        setWriterReady(true);
      } catch (error) {
        console.error(error);
        setWriterError("Kunde inte ladda skrivytan just nu. Ladda om sidan och försök igen.");
      }
    }

    initWriter();

    return () => {
      cancelled = true;
      writerRef.current?.cancelQuiz?.();
      writerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!writerRef.current) {
      return;
    }

    writerRef.current.cancelQuiz?.();
    writerRef.current.setCharacter(currentCharacter.hanzi);
    writerRef.current.showOutline();
    writerRef.current.hideCharacter();
    resetForCharacter();
  }, [currentCharacter.hanzi, resetForCharacter]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-6 text-[#ffe9a8]">
      <section className="rounded-2xl border border-[#b11b1b] bg-[#110000] p-4 shadow-[0_0_0_1px_#4a1116]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#ff5a5f]">
          Kinesiska tecken · HSK 1-3
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-[#ffd84d]">
          Streck för streck
        </h1>
        <p className="mt-2 text-sm text-[#ffdca3]">
          En pedagogisk tränare där du ser, skriver och reflekterar:{" "}
          <span className="text-[#ff6b6b]">1) observera</span>,{" "}
          <span className="text-[#ff6b6b]">2) imitera</span>,{" "}
          <span className="text-[#ff6b6b]">3) koppla pinyin + betydelse</span>.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-[#b11b1b] bg-[#1a0505] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#ff5a5f]">
          Nivåfilter
        </h2>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3].map((level) => {
            const numericLevel = level as HskLevel;
            const selected = selectedLevels.includes(numericLevel);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(numericLevel)}
                className={`min-h-11 flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-[#ffd84d] bg-[#5a100e] text-[#ffd84d]"
                    : "border-[#5a1a1a] bg-[#150707] text-[#ffbe7b]"
                }`}
              >
                HSK {level}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#ffc67d]">
          Aktiva tecken: {availableCharacters.length} · Välj minst en nivå.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-[#b11b1b] bg-[#120202] p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[#ff8b8f]">Dagens tecken</p>
            <p className="text-5xl font-black text-[#ffd84d]">{currentCharacter.hanzi}</p>
          </div>
          <div className="text-right text-xs text-[#ffbe7b]">
            <p>Nivå HSK {currentCharacter.level}</p>
            <p>Klara tecken: {completedCount}</p>
            <p>Fokusstreak: {focusStreak}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center rounded-xl border border-[#5a1a1a] bg-[#090101] p-2">
          <div ref={boardRef} className="h-[300px] w-[300px]" />
        </div>
        {writerError && (
          <p className="mt-3 rounded-lg border border-[#7f1f1f] bg-[#220909] p-2 text-sm text-[#ffc6c6]">
            {writerError}
          </p>
        )}
        {!writerError && !writerReady && (
          <p className="mt-3 text-sm text-[#ffc67d]">Laddar skrivyta...</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={playAnimation}
            className="min-h-11 rounded-xl border border-[#ffd84d] bg-[#3d0a0a] px-3 py-2 text-sm font-semibold text-[#ffd84d]"
          >
            Visa streckordning
          </button>
          <button
            type="button"
            onClick={startQuiz}
            className="min-h-11 rounded-xl border border-[#ff5a5f] bg-[#6f1212] px-3 py-2 text-sm font-semibold text-[#ffe3a3]"
          >
            Skriv själv nu
          </button>
          <button
            type="button"
            onClick={() => setRevealMeaning(true)}
            className="min-h-11 rounded-xl border border-[#a43c3c] bg-[#1f0707] px-3 py-2 text-sm text-[#ffc67d]"
          >
            Visa pinyin
          </button>
          <button
            type="button"
            onClick={nextCharacter}
            className="min-h-11 rounded-xl border border-[#ffd84d] bg-[#5a100e] px-3 py-2 text-sm font-semibold text-[#ffe9a8]"
          >
            Nästa tecken
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-[#5a1a1a] bg-[#170505] p-3 text-sm text-[#ffd9a0]">
          <p className="font-semibold text-[#ffb347]">Stödrutin för inlärning</p>
          <p className="mt-1">
            {currentCharacter.pedagogyHint}
          </p>
          <p className="mt-2 text-xs text-[#ff9f76]">
            Exempelord: {currentCharacter.exampleWord}
          </p>
        </div>

        {quizState === "running" && (
          <p className="mt-3 text-sm text-[#ffce8f]">
            Skriv i rätt ordning. Felsteg hittills: {mistakes}
          </p>
        )}

        {feedback && (
          <p className="mt-3 rounded-lg border border-[#8a2b2b] bg-[#260808] p-2 text-sm text-[#ffdca3]">
            {feedback}
          </p>
        )}

        {revealMeaning && (
          <div className="mt-3 rounded-xl border border-[#ffd84d] bg-[#2f0a0a] p-3">
            <p className="text-xs uppercase tracking-wide text-[#ff9f76]">
              Pinyin och betydelse
            </p>
            <p className="mt-1 text-2xl font-bold text-[#ffd84d]">{currentCharacter.pinyin}</p>
            <p className="text-sm text-[#ffe3a3]">{currentCharacter.meaningSv}</p>
          </div>
        )}
      </section>
    </main>
  );
}
