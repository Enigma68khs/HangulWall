type ControlPanelProps = {
  value: string;
  columns: number;
  tileSize: number;
  speed: number;
  translationStatusLabel: string;
  onChangeValue: (value: string) => void;
  onChangeColumns: (value: number) => void;
  onChangeTileSize: (value: number) => void;
  onChangeSpeed: (value: number) => void;
  onRun: () => void;
  onReset: () => void;
  onReplay: () => void;
  onEnterExhibition: () => void;
};

export function ControlPanel({
  value,
  columns,
  tileSize,
  speed,
  translationStatusLabel,
  onChangeValue,
  onChangeColumns,
  onChangeTileSize,
  onChangeSpeed,
  onRun,
  onReset,
  onReplay,
  onEnterExhibition,
}: ControlPanelProps) {
  return (
    <section className="control-panel relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/35 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:max-w-[440px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,220,170,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(166,96,69,0.14),transparent_30%)]" />
      <div className="relative flex h-full flex-col gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/45">
            Hangul Wall
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-stone-100">
            미디어아트형 한글 타일 전시
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-300/80">
            문장을 입력하면 각 글자가 서로 다른 재질과 장식을 가진 타일로
            변환되어, 전시장 패널처럼 세로 스크린 안에 낙하 정렬됩니다.
          </p>
        </div>

        <label className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-400">
            작품 문장
          </span>
          <textarea
            value={value}
            onChange={(event) => onChangeValue(event.target.value)}
            className="min-h-[180px] rounded-[24px] border border-white/10 bg-white/6 px-5 py-4 text-base leading-7 text-stone-100 outline-none transition focus:border-[#e7b07a]/60 focus:bg-white/10"
            placeholder="한국어 또는 중국어 문장을 입력하세요."
          />
          <p className="text-xs leading-5 text-stone-400/90">
            {translationStatusLabel}
          </p>
        </label>

        <div className="grid gap-4">
          <label className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-stone-400">
              <span>열 개수</span>
              <span className="text-stone-200">{columns}</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              step={1}
              value={columns}
              onChange={(event) => onChangeColumns(Number(event.target.value))}
              className="range-input"
            />
          </label>

          <label className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-stone-400">
              <span>타일 크기</span>
              <span className="text-stone-200">{tileSize}px</span>
            </div>
            <input
              type="range"
              min={58}
              max={104}
              step={2}
              value={tileSize}
              onChange={(event) => onChangeTileSize(Number(event.target.value))}
              className="range-input"
            />
          </label>

          <label className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-stone-400">
              <span>애니메이션 속도</span>
              <span className="text-stone-200">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.1}
              value={speed}
              onChange={(event) => onChangeSpeed(Number(event.target.value))}
              className="range-input"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button onClick={onRun} className="control-button control-button-primary">
            실행
          </button>
          <button onClick={onReplay} className="control-button">
            다시 재생
          </button>
          <button onClick={onReset} className="control-button">
            초기화
          </button>
          <button
            onClick={onEnterExhibition}
            className="control-button control-button-primary"
          >
            전시 시작
          </button>
        </div>
      </div>
    </section>
  );
}
