import React, { useMemo } from 'react';
import {
  ArrowRight,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  PhoneCall,
  RefreshCw,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import { LoginPhase } from '../viewmodels/useAppEntryViewModel';

interface WechatQrLoginProps {
  loginPhase: LoginPhase;
  qrRevision: number;
  onRefreshQr: () => void;
  onSimulateScan: () => void;
}

const QR_SIZE = 29;

const hashSeed = (seed: string) => {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed: number) => {
  let value = seed || 1;

  return () => {
    value = Math.imul(value, 1664525) + 1013904223;
    return (value >>> 0) / 4294967296;
  };
};

const setFinderPattern = (
  matrix: boolean[][],
  xOffset: number,
  yOffset: number
) => {
  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 7; x += 1) {
      const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
      const isCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      matrix[yOffset + y][xOffset + x] = isBorder || isCore;
    }
  }
};

const createQrMatrix = (seedText: string) => {
  const matrix = Array.from({ length: QR_SIZE }, () =>
    Array.from({ length: QR_SIZE }, () => false)
  );
  const reserved = new Set<string>();

  const reserve = (x: number, y: number) => {
    reserved.add(`${x}:${y}`);
  };

  const markFinder = (xOffset: number, yOffset: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        reserve(xOffset + x, yOffset + y);
      }
    }
    setFinderPattern(matrix, xOffset, yOffset);
  };

  markFinder(0, 0);
  markFinder(QR_SIZE - 7, 0);
  markFinder(0, QR_SIZE - 7);

  for (let index = 0; index < QR_SIZE; index += 1) {
    reserve(6, index);
    reserve(index, 6);
    if (index !== 6) {
      matrix[6][index] = index % 2 === 0;
      matrix[index][6] = index % 2 === 0;
    }
  }

  const random = createRandom(hashSeed(seedText));

  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      if (reserved.has(`${x}:${y}`)) {
        continue;
      }

      const edgePadding =
        x < 2 || y < 2 || x > QR_SIZE - 3 || y > QR_SIZE - 3 ? 0.08 : 0;
      const density = 0.38 + edgePadding;
      matrix[y][x] = random() < density;
    }
  }

  return matrix;
};

const statusMeta: Record<
  LoginPhase,
  { tag: string; title: string; note: string; tone: string }
> = {
  waiting: {
    tag: '等待扫码',
    title: '请使用微信扫一扫',
    note: '二维码每次刷新后都会重新生成，确保登录安全。',
    tone: 'bg-[#e8f3ff] text-[#156fd6]',
  },
  scanning: {
    tag: '已扫码',
    title: '正在确认登录',
    note: '请在微信内确认后进入应用端。',
    tone: 'bg-[#eafaf1] text-[#1d8a5b]',
  },
  authenticated: {
    tag: '确认成功',
    title: '正在进入系统',
    note: '页面即将跳转到当前工作区。',
    tone: 'bg-[#eef2ff] text-[#4753d6]',
  },
};

const LoginMark = () => {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f6bcc] text-white shadow-[0_12px_24px_rgba(15,107,204,0.24)]">
      <span className="text-[13px] font-semibold tracking-[0.28em]">MT</span>
    </div>
  );
};

const QrMatrix = ({ seed }: { seed: number }) => {
  const matrix = useMemo(() => createQrMatrix(String(seed)), [seed]);

  return (
    <div
      className="grid aspect-square w-full gap-[2px] rounded-[24px] border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
      style={{ gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {matrix.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={`aspect-square rounded-[1.5px] transition-colors duration-300 ${
              cell ? 'bg-slate-950' : 'bg-transparent'
            }`}
          />
        ))
      )}
    </div>
  );
};

export const WechatQrLogin: React.FC<WechatQrLoginProps> = ({
  loginPhase,
  qrRevision,
  onRefreshQr,
  onSimulateScan,
}) => {
  const meta = statusMeta[loginPhase];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#dfefff] text-[#10324f]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(20,99,180,0.06)_0,rgba(20,99,180,0.06)_1px,transparent_1px,transparent_28px)] opacity-60" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <LoginMark />
            <div>
              <div className="text-[0.95rem] font-semibold tracking-[0.22em] text-[#0f345f]">
                点点速报
              </div>
              <div className="text-[0.78rem] text-[#5d7897]">应用端扫码入口</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-[0.85rem] text-[#496683]">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              <span>技术支持 400-800-1122</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <span>7x24 在线值守</span>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:gap-16">
            <section className="max-w-[40rem]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-[0.82rem] font-medium text-[#156fd6] shadow-[0_8px_20px_rgba(19,112,216,0.08)] backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                <span>企业微信安全登录</span>
              </div>

              <h1 className="mt-6 max-w-[12ch] text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#0b2f51]">
                微信扫码，快速进入应用端
              </h1>

              <p className="mt-6 max-w-[34rem] text-[1rem] leading-8 text-[#52708e]">
                扫码后即可使用微信身份完成登录，直达当前工作区的运营、配置和管理能力。
                页面会保留原有业务节奏，不打断你已经习惯的工作流。
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: '扫码即登',
                    desc: '打开微信扫一扫，登录过程更轻。',
                  },
                  {
                    title: '权限同步',
                    desc: '按账号身份进入对应模块。',
                  },
                  {
                    title: '状态记忆',
                    desc: '刷新后依旧停留在当前会话。',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/60 bg-white/55 p-4 shadow-[0_12px_30px_rgba(20,87,152,0.08)] backdrop-blur-md"
                  >
                    <div className="text-[0.96rem] font-semibold text-[#12395f]">
                      {item.title}
                    </div>
                    <div className="mt-2 text-[0.84rem] leading-6 text-[#5e7690]">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="w-full">
              <div className="rounded-[34px] border border-white/75 bg-white/60 p-5 shadow-[0_24px_70px_rgba(19,88,152,0.16)] backdrop-blur-[18px] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[0.74rem] font-medium uppercase tracking-[0.42em] text-[#6a87a6]">
                      微信扫码登录
                    </div>
                    <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.02em] text-[#10345a]">
                      请打开微信扫一扫
                    </h2>
                  </div>

                  <div className={`rounded-full px-3 py-1 text-[0.78rem] font-medium ${meta.tone}`}>
                    {meta.tag}
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-[#d8e6f4] bg-[#f7fbff] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:p-5">
                  <div className="relative overflow-hidden rounded-[24px] border border-[#dce7f4] bg-white p-4 shadow-[0_8px_24px_rgba(17,70,126,0.06)] sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf6ff] px-3 py-1 text-[0.76rem] font-medium text-[#156fd6]">
                        <ScanLine className="h-4 w-4" />
                        扫码登录
                      </div>
                      <div className="text-[0.76rem] text-[#7a8fa7]">二维码 60 秒有效</div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <div className="w-full max-w-[21rem]">
                        <QrMatrix seed={qrRevision} />
                      </div>
                    </div>

                    {loginPhase !== 'waiting' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center rounded-[24px] border border-white/80 bg-white/90 px-6 py-5 text-center shadow-[0_18px_48px_rgba(15,92,177,0.18)]">
                          {loginPhase === 'scanning' ? (
                            <LoaderCircle className="h-9 w-9 animate-spin text-[#1d8a5b]" />
                          ) : (
                            <CheckCircle2 className="h-10 w-10 text-[#2563eb]" />
                          )}
                          <div className="mt-3 text-[1rem] font-semibold text-[#12395f]">
                            {meta.title}
                          </div>
                          <div className="mt-1 max-w-[16rem] text-[0.84rem] leading-6 text-[#5b7491]">
                            {meta.note}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[0.84rem] leading-6 text-[#5d7690]">
                    {loginPhase === 'waiting' && '使用微信扫一扫左侧二维码，完成登录后系统会自动进入。'}
                    {loginPhase === 'scanning' && '微信端已识别二维码，请确认登录。'}
                    {loginPhase === 'authenticated' && '确认完成，正在载入工作台。'}
                  </div>

                  <button
                    type="button"
                    onClick={onRefreshQr}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c8d9ea] bg-white px-4 py-2 text-[0.84rem] font-medium text-[#145a99] shadow-sm transition hover:border-[#9fc2e8] hover:text-[#0f68c8]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    刷新二维码
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onSimulateScan}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f6bcc] px-5 py-3 text-[0.92rem] font-medium text-white shadow-[0_16px_36px_rgba(15,107,204,0.26)] transition hover:bg-[#0b5cae]"
                  >
                    <ScanLine className="h-4 w-4" />
                    模拟已扫码
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex flex-1 items-center justify-center rounded-full border border-dashed border-[#c7d8ea] bg-white/70 px-4 py-3 text-[0.82rem] text-[#5c7690]">
                    登录后将自动回到当前管理会话
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="px-6 pb-6 text-center text-[0.76rem] text-[#6c88a8] sm:px-8 lg:px-12">
          版权所有 © 2026 速报系统 MT 应用端
        </footer>
      </div>
    </div>
  );
};
