import React, { useState, useMemo } from 'react';
import {
  MpMigrationConfig,
  WechatMpConfig,
  WechatMpMode,
  GlobalMpControlConfig,
  GlobalMpMigrationMethods,
} from '../../types';
import { defaultWechatMpConfig } from './WechatMpConfigSection';
import {
  Building2,
  Smartphone,
  MessageSquare,
  Sparkles,
  QrCode,
  Lock,
  Unlock,
  Save,
  CheckCircle2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const defaultGlobalMpControlConfig: GlobalMpControlConfig = {
  allowDefaultPlatformMp: true,
  allowCustomOfficialMp: true,
  defaultPreferredMode: 'platform_default',
  migrationMethods: {
    autoUnionId: {
      enabled: true,
      title: 'UnionID 自动静默匹配',
      description: '同开放平台主体下关注新号后后台自动映射，用户完全无感',
      requireSameOpenPlatform: true,
    },
    wechatCard: {
      enabled: true,
      title: '微信服务通知卡片推送',
      description: '由原公众号向人员推送换绑通知卡片，点击一键关注新号',
      templateTitle: '【账号迁移】请确认换绑至单位新公众号',
      pushFrequencyLimit: 1,
    },
    smsVerify: {
      enabled: true,
      title: '短信验证码安全换绑',
      description: '向人员登记手机号发送动态验证码与专属换绑链接，用于离线兜底',
      codeExpireMinutes: 10,
      smsSignature: '【点点速报】',
    },
    workspaceQr: {
      enabled: false,
      title: '工作台登录扫码核身',
      description: '采编人员登录 PC/移动端采编后台时弹窗引导微信扫码核身',
      forceOnLogin: false,
    },
  },
  dataInheritance: {
    inheritDrafts: true,
    inheritAuditLogs: true,
    inheritPoints: true,
    inheritRoles: true,
  },
  migrationGracePeriodDays: 30,
  maxDailyRemindCount: 1,
  updatedAt: '2026-09-05 10:00:00',
  updatedBy: '超级系统管理员',
};

interface GlobalOtherConfigDefaultsSectionProps {
  mpConfig?: WechatMpConfig;
  migrationConfig?: MpMigrationConfig;
  globalMpControl?: GlobalMpControlConfig;
  onSaveMpDefaults?: (config: WechatMpConfig) => void;
  onSaveMigrationDefaults?: (config: MpMigrationConfig) => void;
  onSaveGlobalControl?: (
    control: GlobalMpControlConfig,
    mpConfig?: WechatMpConfig,
    migration?: MpMigrationConfig
  ) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const GlobalOtherConfigDefaultsSection: React.FC<
  GlobalOtherConfigDefaultsSectionProps
> = ({
  mpConfig,
  migrationConfig,
  globalMpControl,
  onSaveMpDefaults,
  onSaveMigrationDefaults,
  onSaveGlobalControl,
  showToast,
}) => {
  // 读取已有配置或本地缓存
  const initialControl: GlobalMpControlConfig = useMemo(() => {
    try {
      const saved = localStorage.getItem('mt_global_mp_control_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultGlobalMpControlConfig,
          ...parsed,
          migrationMethods: {
            ...defaultGlobalMpControlConfig.migrationMethods,
            ...(parsed.migrationMethods || {}),
          },
          dataInheritance: {
            ...defaultGlobalMpControlConfig.dataInheritance,
            ...(parsed.dataInheritance || {}),
          },
        };
      }
    } catch {
      // ignore
    }
    return {
      ...defaultGlobalMpControlConfig,
      ...(globalMpControl || {}),
      migrationMethods: {
        ...defaultGlobalMpControlConfig.migrationMethods,
        ...(globalMpControl?.migrationMethods || {}),
      },
      dataInheritance: {
        ...defaultGlobalMpControlConfig.dataInheritance,
        ...(globalMpControl?.dataInheritance || {}),
      },
    };
  }, [globalMpControl]);

  // 1. 公众号使用权限开关与默认模式
  const [allowDefaultPlatformMp, setAllowDefaultPlatformMp] = useState(
    initialControl.allowDefaultPlatformMp ?? true
  );
  const [allowCustomOfficialMp, setAllowCustomOfficialMp] = useState(
    initialControl.allowCustomOfficialMp ?? true
  );
  const [defaultPreferredMode, setDefaultPreferredMode] = useState<WechatMpMode>(
    initialControl.defaultPreferredMode || 'platform_default'
  );

  // 2. 人员换绑迁移方式
  const [migrationMethods, setMigrationMethods] = useState<GlobalMpMigrationMethods>(
    initialControl.migrationMethods || defaultGlobalMpControlConfig.migrationMethods
  );
  const [dataInheritance, setDataInheritance] = useState(
    initialControl.dataInheritance || defaultGlobalMpControlConfig.dataInheritance
  );
  const [migrationGracePeriodDays, setMigrationGracePeriodDays] = useState(
    initialControl.migrationGracePeriodDays || 30
  );
  const [maxDailyRemindCount, setMaxDailyRemindCount] = useState(
    initialControl.maxDailyRemindCount || 1
  );

  // 3. 广播下发生效范围与状态
  const [broadcastScope, setBroadcastScope] = useState<'all' | 'new_only'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(initialControl.updatedAt || null);

  // 约束：至少保留一个公众号选项开启
  const handleTogglePlatformMp = () => {
    if (allowDefaultPlatformMp && !allowCustomOfficialMp) {
      showToast('至少需要保留一种公众号使用方式开启', 'warning');
      return;
    }
    setAllowDefaultPlatformMp(!allowDefaultPlatformMp);
  };

  const handleToggleCustomMp = () => {
    if (allowCustomOfficialMp && !allowDefaultPlatformMp) {
      showToast('至少需要保留一种公众号使用方式开启', 'warning');
      return;
    }
    setAllowCustomOfficialMp(!allowCustomOfficialMp);
  };

  // 自动校准默认选用方式
  const effectivePreferredMode: WechatMpMode = useMemo(() => {
    if (!allowCustomOfficialMp) return 'platform_default';
    if (!allowDefaultPlatformMp) return 'custom_official';
    return defaultPreferredMode;
  }, [allowCustomOfficialMp, allowDefaultPlatformMp, defaultPreferredMode]);

  // 切换人员迁移通道
  const handleToggleMigrationMethod = (
    key: keyof GlobalMpControlConfig['migrationMethods']
  ) => {
    setMigrationMethods((prev) => {
      const current = prev?.[key] || defaultGlobalMpControlConfig.migrationMethods[key];
      return {
        ...prev,
        [key]: {
          ...current,
          enabled: !current?.enabled,
        },
      };
    });
  };

  // 修改特定通道的简单参数（如频次、超时）
  const handleUpdateMethodParam = (
    key: keyof GlobalMpControlConfig['migrationMethods'],
    field: string,
    value: unknown
  ) => {
    setMigrationMethods((prev) => {
      const current = prev?.[key] || defaultGlobalMpControlConfig.migrationMethods[key];
      return {
        ...prev,
        [key]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  // 切换数据继承
  const handleToggleInheritance = (key: keyof typeof dataInheritance) => {
    setDataInheritance((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 重置为默认
  const handleResetDefaults = () => {
    setAllowDefaultPlatformMp(defaultGlobalMpControlConfig.allowDefaultPlatformMp);
    setAllowCustomOfficialMp(defaultGlobalMpControlConfig.allowCustomOfficialMp);
    setDefaultPreferredMode(defaultGlobalMpControlConfig.defaultPreferredMode);
    setMigrationMethods(defaultGlobalMpControlConfig.migrationMethods);
    setDataInheritance(defaultGlobalMpControlConfig.dataInheritance);
    setMigrationGracePeriodDays(defaultGlobalMpControlConfig.migrationGracePeriodDays);
    setMaxDailyRemindCount(defaultGlobalMpControlConfig.maxDailyRemindCount);
    showToast('已恢复为系统推荐默认配置，点击右上角保存后生效', 'info');
  };

  // 保存所有配置
  const handleSaveAll = () => {
    if (!allowDefaultPlatformMp && !allowCustomOfficialMp) {
      showToast('至少需要保留一种公众号使用方式开启', 'warning');
      return;
    }

    const enabledMethodsCount = [
      migrationMethods?.autoUnionId,
      migrationMethods?.wechatCard,
      migrationMethods?.smsVerify,
      migrationMethods?.workspaceQr,
    ].filter((m) => Boolean(m?.enabled)).length;

    if (allowCustomOfficialMp && enabledMethodsCount === 0) {
      showToast('已允许使用自备公众号，请至少启用一种人员换绑通道', 'warning');
      return;
    }

    setIsSaving(true);
    const now = new Date();
    const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newControl: GlobalMpControlConfig = {
      allowDefaultPlatformMp,
      allowCustomOfficialMp,
      defaultPreferredMode: effectivePreferredMode,
      migrationMethods,
      dataInheritance,
      migrationGracePeriodDays,
      maxDailyRemindCount,
      updatedAt: nowStr,
      updatedBy: '超级系统管理员',
    };

    try {
      localStorage.setItem('mt_global_mp_control_config', JSON.stringify(newControl));
    } catch {
      // ignore
    }

    if (onSaveGlobalControl) {
      onSaveGlobalControl(newControl, mpConfig, migrationConfig);
    } else {
      if (onSaveMpDefaults && mpConfig) {
        onSaveMpDefaults({
          ...mpConfig,
          mode: effectivePreferredMode,
        });
      }
      if (onSaveMigrationDefaults && migrationConfig) {
        onSaveMigrationDefaults({
          ...migrationConfig,
          enableAutoUnionIdSync: Boolean(migrationMethods?.autoUnionId?.enabled),
          enableSmsNotify: Boolean(migrationMethods?.smsVerify?.enabled),
          enableWechatCardNotify: Boolean(migrationMethods?.wechatCard?.enabled),
        });
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setSavedTime(nowStr);
      showToast(
        broadcastScope === 'all'
          ? '配置已保存，并已实时应用至全网 48 家机构'
          : '配置已保存（仅对后续新建机构生效）',
        'success'
      );
    }, 300);
  };

  const activeMethodsCount = [
    migrationMethods?.autoUnionId,
    migrationMethods?.wechatCard,
    migrationMethods?.smsVerify,
    migrationMethods?.workspaceQr,
  ].filter((m) => Boolean(m?.enabled)).length;

  return (
    <div className="space-y-5 text-gray-800 pb-10">
      {/* 顶部简明标题与操作栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#1890ff]" />
            <h2 className="text-base font-bold text-gray-900">公众号与人员迁移全局配置</h2>
            {savedTime && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                已生效 ({savedTime.slice(11, 16)})
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            设置全网机构的微信公众号开放权限及采编人员换绑通道与安全规则
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>恢复推荐配置</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 bg-[#1890ff] hover:bg-[#096dd9] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? '保存中...' : '保存全局配置'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块 1：公众号使用权限配置 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">1. 公众号使用权限</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              控制机构可启用的公众号模式，两种方式可独立开启
            </p>
          </div>

          <div className="text-xs px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700 flex items-center gap-1.5">
            <span className="text-gray-400">当前权限结果：</span>
            {allowDefaultPlatformMp && allowCustomOfficialMp ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                双模可选（机构可自主切换）
              </span>
            ) : !allowCustomOfficialMp ? (
              <span className="text-[#1890ff] font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                仅允许使用机构默认的「点点速报」
              </span>
            ) : (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                强制使用机构自有公众号
              </span>
            )}
          </div>
        </div>

        {/* 两个核心开关配置行 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 开关 1: 平台统配点点速报 */}
          <div
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              allowDefaultPlatformMp
                ? 'border-blue-200 bg-blue-50/20'
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900">
                  使用机构默认的“点点速报”
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1890ff] font-medium">
                  平台统配
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                机构开箱即用平台微信服务号，无需自备账号及年审认证
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePlatformMp}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                allowDefaultPlatformMp ? 'bg-[#1890ff]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  allowDefaultPlatformMp ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 开关 2: 机构自有公众号 */}
          <div
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              allowCustomOfficialMp
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900">
                  支持使用机构自有的公众号
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-medium">
                  独立品牌
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                允许机构接入单位官方认证服务号，以单位自身品牌发送通知
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleCustomMp}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                allowCustomOfficialMp ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  allowCustomOfficialMp ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 新建机构默认预选设置 */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-gray-700 font-medium">新建机构初始化默认选用：</div>
          <div className="flex items-center gap-3">
            <label
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all flex items-center gap-1.5 ${
                effectivePreferredMode === 'platform_default'
                  ? 'border-[#1890ff] bg-blue-50 text-[#1890ff] font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="prefMode"
                value="platform_default"
                checked={effectivePreferredMode === 'platform_default'}
                onChange={() => setDefaultPreferredMode('platform_default')}
                className="sr-only"
              />
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>默认使用「点点速报」（推荐）</span>
            </label>

            <label
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all flex items-center gap-1.5 ${
                !allowCustomOfficialMp
                  ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
                  : effectivePreferredMode === 'custom_official'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="prefMode"
                value="custom_official"
                disabled={!allowCustomOfficialMp}
                checked={effectivePreferredMode === 'custom_official'}
                onChange={() => setDefaultPreferredMode('custom_official')}
                className="sr-only"
              />
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>默认使用「机构自有公众号」</span>
              {!allowCustomOfficialMp && <span className="text-[10px] text-gray-400">(未开启)</span>}
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块 2：自有公众号人员换绑迁移通道 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">2. 人员换绑迁移通道</h3>
              <span className="text-xs text-gray-500">
                （当前已启用 <strong className="text-emerald-600 font-bold">{activeMethodsCount}</strong> / 4 种）
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              机构切换为自有公众号时，采编人员一键换绑至新公众号的通路支持
            </p>
          </div>

          {!allowCustomOfficialMp && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded">
              自有公众号未开启，此通道暂备用
            </span>
          )}
        </div>

        {/* 4 大通道清晰条目化列表 */}
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {/* 方案 1: UnionID 自动静默匹配 */}
          <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1890ff] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    UnionID 自动静默匹配
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1890ff] font-medium">
                    首选 · 无感
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  机构在同一微信开放平台主体下，采编员关注新号后系统后台自动识别关联，零操作成本
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleMigrationMethod('autoUnionId')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                migrationMethods?.autoUnionId?.enabled ? 'bg-[#1890ff]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  migrationMethods?.autoUnionId?.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 方案 2: 微信换绑（模板卡片推送） */}
          <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    微信服务通知卡片推送
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-medium">
                    微信内闭环
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  原公众号向在册人员推送换绑模板卡片，点击一键授权关注新号即完成换绑
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>推送上限：</span>
                <select
                  value={migrationMethods?.wechatCard?.pushFrequencyLimit ?? 1}
                  onChange={(e) =>
                    handleUpdateMethodParam('wechatCard', 'pushFrequencyLimit', Number(e.target.value))
                  }
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:border-[#1890ff]"
                >
                  <option value={1}>1 次 / 天</option>
                  <option value={2}>2 次 / 天</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleToggleMigrationMethod('wechatCard')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  migrationMethods?.wechatCard?.enabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    migrationMethods?.wechatCard?.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 方案 3: 短信验证码换绑 */}
          <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    短信验证码安全换绑
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-medium">
                    离线兜底
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  向登记手机号发送动态验证码与专属换绑短链，覆盖微信离线或取关人员
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>有效期：</span>
                <select
                  value={migrationMethods?.smsVerify?.codeExpireMinutes ?? 10}
                  onChange={(e) =>
                    handleUpdateMethodParam('smsVerify', 'codeExpireMinutes', Number(e.target.value))
                  }
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:border-[#1890ff]"
                >
                  <option value={10}>10 分钟</option>
                  <option value={30}>30 分钟</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleToggleMigrationMethod('smsVerify')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  migrationMethods?.smsVerify?.enabled ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    migrationMethods?.smsVerify?.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 方案 4: 工作台扫码核身 */}
          <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    工作台登录扫码核身
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-medium">
                    PC 引导
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  采编人员登录融媒采编系统后台时弹出换绑二维码，扫码确认即完成换绑
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleMigrationMethod('workspaceQr')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                migrationMethods?.workspaceQr?.enabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  migrationMethods?.workspaceQr?.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块 3：迁移规则与数据继承 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">3. 迁移规则与数据继承</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            设置人员换绑宽限周期及人员历史业务数据无损继承范围
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 左侧：运行参数 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
              <div>
                <span className="font-semibold text-gray-800 block">换绑迁移宽限期</span>
                <span className="text-[11px] text-gray-400">宽限期内原公众号仍可只读接收通报</span>
              </div>
              <select
                value={migrationGracePeriodDays}
                onChange={(e) => setMigrationGracePeriodDays(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2.5 py-1 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:border-[#1890ff]"
              >
                <option value={15}>15 天</option>
                <option value={30}>30 天（推荐）</option>
                <option value={60}>60 天</option>
                <option value={90}>90 天</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
              <div>
                <span className="font-semibold text-gray-800 block">未换绑人员每日提醒频次</span>
                <span className="text-[11px] text-gray-400">避免过度打扰，保障工作体验</span>
              </div>
              <select
                value={maxDailyRemindCount}
                onChange={(e) => setMaxDailyRemindCount(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2.5 py-1 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:border-[#1890ff]"
              >
                <option value={1}>1 次 / 天（推荐）</option>
                <option value={2}>2 次 / 天</option>
                <option value={3}>3 次 / 天</option>
              </select>
            </div>
          </div>

          {/* 右侧：数据继承项 */}
          <div className="p-3.5 rounded-lg bg-gray-50/80 border border-gray-100 space-y-2.5 text-xs">
            <span className="font-semibold text-gray-800 block">
              换绑人员数据继承（100% 自动无损继承）：
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dataInheritance.inheritDrafts}
                  onChange={() => handleToggleInheritance('inheritDrafts')}
                  className="rounded text-[#1890ff] focus:ring-0"
                />
                <span className="text-gray-700">历史稿件与统计</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dataInheritance.inheritAuditLogs}
                  onChange={() => handleToggleInheritance('inheritAuditLogs')}
                  className="rounded text-[#1890ff] focus:ring-0"
                />
                <span className="text-gray-700">审签留痕与评语</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dataInheritance.inheritPoints}
                  onChange={() => handleToggleInheritance('inheritPoints')}
                  className="rounded text-[#1890ff] focus:ring-0"
                />
                <span className="text-gray-700">积分排名与绩效</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dataInheritance.inheritRoles}
                  onChange={() => handleToggleInheritance('inheritRoles')}
                  className="rounded text-[#1890ff] focus:ring-0"
                />
                <span className="text-gray-700">部门权限与角色</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块 4：底部下发生效操作栏 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-gray-700">下发生效范围：</span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="radio"
              name="broadcastScope"
              value="all"
              checked={broadcastScope === 'all'}
              onChange={() => setBroadcastScope('all')}
              className="accent-[#1890ff]"
            />
            <span className="text-gray-700 font-medium">
              实时应用至全网在运行机构（48家）
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="radio"
              name="broadcastScope"
              value="new_only"
              checked={broadcastScope === 'new_only'}
              onChange={() => setBroadcastScope('new_only')}
              className="accent-[#1890ff]"
            />
            <span className="text-gray-500">仅对后续新建机构生效</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-5 py-2 bg-[#1890ff] hover:bg-[#096dd9] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
          <span>{isSaving ? '下发保存中...' : '保存并下发全局策略'}</span>
        </button>
      </div>
    </div>
  );
};
