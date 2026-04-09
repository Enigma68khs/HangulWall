"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArtDisplay } from "@/components/ArtDisplay";
import { ControlPanel } from "@/components/ControlPanel";
import { createTileVariants } from "@/lib/tile-generator";
import { layoutTextToGrid } from "@/lib/text-layout";

const DEFAULT_TEXT = "기적은 먼나라 얘기가 아니라 지금 내 삶에 있다. 김완선";
const DEFAULT_COLUMNS = 5;
const DEFAULT_TILE_SIZE = 82;
const DEFAULT_SPEED = 1;

declare global {
  interface Window {
    Translator?: {
      availability: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<"available" | "downloadable" | "downloading" | "unavailable">;
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        monitor?: (monitor: {
          addEventListener: (
            type: "downloadprogress",
            listener: (event: ProgressEvent<EventTarget>) => void
          ) => void;
        }) => void;
      }) => Promise<{
        translate: (input: string) => Promise<string>;
        destroy?: () => void;
      }>;
    };
  }
}

function hasChineseCharacters(input: string) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(input);
}

function hasHangulCharacters(input: string) {
  return /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/.test(input);
}

export default function Page() {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [renderText, setRenderText] = useState(DEFAULT_TEXT);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [tileSize, setTileSize] = useState(DEFAULT_TILE_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [playbackKey, setPlaybackKey] = useState(0);
  const [stage, setStage] = useState<"setup" | "exhibition">("setup");
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [translationStatus, setTranslationStatus] = useState(
    "한국어는 바로 전시되고, 중국어는 지원 브라우저에서 한글로 변환해 전시됩니다."
  );
  const [history, setHistory] = useState<string[]>([DEFAULT_TEXT]);
  const [lastInteractionAt, setLastInteractionAt] = useState(() => Date.now());
  const exhibitionRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(
    () => layoutTextToGrid(renderText, columns),
    [renderText, columns]
  );
  const variants = useMemo(
    () => createTileVariants(layout.cells),
    [layout.cells, playbackKey]
  );

  const translateText = async ({
    source,
    sourceLanguage,
    targetLanguage,
  }: {
    source: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => {
    if (typeof window === "undefined" || !window.Translator) {
      return null;
    }

    const availability = await window.Translator.availability({
      sourceLanguage,
      targetLanguage,
    });

    if (availability === "unavailable") {
      return null;
    }

    const translator = await window.Translator.create({
      sourceLanguage,
      targetLanguage,
    });
    const translated = await translator.translate(source);
    translator.destroy?.();
    return translated.trim().length > 0 ? translated : null;
  };

  const translateIfNeeded = async (source: string) => {
    const normalized = source.trim().length > 0 ? source : DEFAULT_TEXT;
    const hasChinese = hasChineseCharacters(normalized);
    const hasHangul = hasHangulCharacters(normalized);

    if (!hasChinese && !hasHangul) {
      setTranslationStatus(
        "한글이나 중국어가 포함된 문장을 입력하면 두 언어로 함께 전시됩니다."
      );
      return normalized;
    }

    if (!window.Translator) {
      setTranslationStatus(
        "현재 브라우저는 내장 번역을 지원하지 않아 입력 원문만 전시됩니다."
      );
      return normalized;
    }

    try {
      if (hasChinese && !hasHangul) {
        setTranslationStatus("중국어 입력을 한국어와 함께 전시하도록 변환하는 중입니다.");
        const korean = await translateText({
          source: normalized,
          sourceLanguage: "zh",
          targetLanguage: "ko",
        });

        if (!korean) {
          setTranslationStatus(
            "중국어-한국어 번역을 사용할 수 없어 입력 원문만 전시됩니다."
          );
          return normalized;
        }

        setTranslationStatus("중국어와 한국어를 함께 전시 중입니다.");
        return `${korean}\n${normalized}`;
      }

      if (hasHangul && !hasChinese) {
        setTranslationStatus("한국어 입력을 중국어와 함께 전시하도록 변환하는 중입니다.");
        const chinese = await translateText({
          source: normalized,
          sourceLanguage: "ko",
          targetLanguage: "zh",
        });

        if (!chinese) {
          setTranslationStatus(
            "한국어-중국어 번역을 사용할 수 없어 입력 원문만 전시됩니다."
          );
          return normalized;
        }

        setTranslationStatus("한국어와 중국어를 함께 전시 중입니다.");
        return `${normalized}\n${chinese}`;
      }

      if (hasChinese && hasHangul) {
        setTranslationStatus(
          "한국어와 중국어가 함께 포함되어 있어 입력 원문을 그대로 전시합니다."
        );
        return normalized;
      }
    } catch {
      setTranslationStatus(
        "번역 처리에 실패해 입력 원문만 전시됩니다. Chrome 최신 버전에서 다시 시도해 주세요."
      );
    }

    return normalized;
  };

  const handleRun = async () => {
    const translatedText = await translateIfNeeded(input);
    setRenderText(translatedText);
    setHistory((current) =>
      current.includes(translatedText) ? current : [...current, translatedText]
    );
    setLastInteractionAt(Date.now());
    setPlaybackKey((current) => current + 1);
  };

  const handleReset = () => {
    setInput(DEFAULT_TEXT);
    setRenderText(DEFAULT_TEXT);
    setColumns(DEFAULT_COLUMNS);
    setTileSize(DEFAULT_TILE_SIZE);
    setSpeed(DEFAULT_SPEED);
    setTranslationStatus(
      "한국어는 바로 전시되고, 중국어는 지원 브라우저에서 한글로 변환해 전시됩니다."
    );
    setHistory([DEFAULT_TEXT]);
    setLastInteractionAt(Date.now());
    setPlaybackKey((current) => current + 1);
  };

  const handleReplay = () => {
    setLastInteractionAt(Date.now());
    setPlaybackKey((current) => current + 1);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(document.fullscreenElement);
      setIsExhibitionMode(isFullscreen || stage === "exhibition");

      if (!isFullscreen && stage === "exhibition") {
        setStage("setup");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [stage]);

  const enterFullscreen = async () => {
    const container = exhibitionRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      }
      setIsExhibitionMode(true);
    } catch {
      setIsExhibitionMode(true);
    }
  };

  const handleEnterExhibition = async () => {
    await handleRun();
    setStage("exhibition");
    setLastInteractionAt(Date.now());
    await enterFullscreen();
  };

  const handleExitExhibition = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } finally {
      setStage("setup");
      setIsExhibitionMode(false);
    }
  };

  const isSetupStage = stage === "setup";

  useEffect(() => {
    if (isSetupStage || history.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const candidates =
        history.length > 1
          ? history.filter((item) => item !== renderText)
          : history;
      const nextText =
        candidates[Math.floor(Math.random() * candidates.length)] ?? renderText;

      setRenderText(nextText);
      setPlaybackKey((current) => current + 1);
      setLastInteractionAt(Date.now());
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [history, isSetupStage, lastInteractionAt, renderText]);

  return (
    <main
      ref={exhibitionRef}
      className={`min-h-screen transition-all duration-700 ${
        isSetupStage ? "gallery-shell" : "bg-[#090909]"
      }`}
    >
      <div
        className={`mx-auto flex min-h-screen w-full max-w-[1600px] gap-8 px-4 py-4 md:px-8 md:py-8 ${
          isSetupStage
            ? "flex-col xl:flex-row xl:items-stretch"
            : "flex-col items-center justify-between gap-4"
        }`}
      >
        {isSetupStage && (
          <ControlPanel
            value={input}
            columns={columns}
            tileSize={tileSize}
            speed={speed}
            translationStatusLabel={translationStatus}
            onChangeValue={setInput}
            onChangeColumns={setColumns}
            onChangeTileSize={setTileSize}
            onChangeSpeed={setSpeed}
            onRun={handleRun}
            onReset={handleReset}
            onReplay={handleReplay}
            onEnterExhibition={handleEnterExhibition}
          />
        )}

        <div
          className={`relative ${
            isSetupStage
              ? "flex-1"
              : "flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-4"
          }`}
        >
          <ArtDisplay
            key={`${playbackKey}-${renderText}-${columns}-${tileSize}-${speed}`}
            cells={layout.cells}
            rows={layout.rows}
            variants={variants}
            columns={layout.columns}
            tileSize={tileSize}
            speed={speed}
            isExhibitionMode={!isSetupStage}
          />

          {!isSetupStage && (
            <div className="exhibition-bottom-bar">
              <div className="exhibition-input-wrap">
              <div className="exhibition-input-panel">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setLastInteractionAt(Date.now());
                  }}
                  className="exhibition-text-input"
                  placeholder="한국어 또는 중국어 문장을 바로 입력하세요."
                />
                <div className="exhibition-input-actions">
                  <button
                    onClick={handleRun}
                    className="control-button control-button-primary exhibition-apply-button"
                  >
                    적용
                  </button>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
