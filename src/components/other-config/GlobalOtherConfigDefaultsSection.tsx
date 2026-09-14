import React, { useState, useMemo, useEffect } from 'react';
import {
  MpMigrationConfig,
  WechatMpConfig,
  WechatMpMode,
  GlobalMpControlConfig,
  GlobalMpMigrationMethods,
} from '../../types';
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
  Users,
  ArrowRightLeft,
  Send,
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

interface FormSnapshot {
  allowDefaultPlatformMp: boolean;
  allowCustomOfficialMp: boolean;
  platformMpAppId: string;
  platformOpenIdSubject: string;
  migrationMethods: GlobalMpMigrationMethods;
  dataInheritance: {
    inheritDrafts: boolean;
    inheritAuditLogs: boolean;
    inheritPoints: boolean;
    inheritRoles: boolean;
  };
  migrationGracePeriodDays: number;
  maxDailyRemindCount: number;
  broadcastScope: 'all' | 'new_only';
}

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
  // 当前子 Tab：'mp_rules'（公众号接入规则） | 'migration_rules'（人员换绑迁移规则）
  const [activeGlobalSubTab, setActiveGlobalSubTab] = useState<'mp_rules' | 'migration_rules'>('mp_rules');

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

  // 2. 平台统配「点点速报」母版参数与消息模板
  const [platformMpAppId, setPlatformMpAppId] = useState('wx1182736450918234');
  const [platformOpenIdSubject, setPlatformOpenIdSubject] = useState('点点速报融媒开放平台 (全网统管主体)');

  // 3. 人员换绑迁移方式
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

  // 4. 广播下发生效范围与状态
  const [broadcastScope, setBroadcastScope] = useState<'all' | 'new_only'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(initialControl.updatedAt || null);

  // 记忆初始已保存的基准数据快照（用于比对是否变更）
  const [savedBaseline, setSavedBaseline] = useState<FormSnapshot>(() => ({
    allowDefaultPlatformMp: initialControl.allowDefaultPlatformMp ?? true,
    allowCustomOfficialMp: initialControl.allowCustomOfficialMp ?? true,
    platformMpAppId: 'wx1182736450918234',
    platformOpenIdSubject: '点点速报融媒开放平台 (全网统管主体)',
    migrationMethods: initialControl.migrationMethods || defaultGlobalMpControlConfig.migrationMethods,
    dataInheritance: initialControl.dataInheritance || defaultGlobalMpControlConfig.dataInheritance,
    migrationGracePeriodDays: initialControl.migrationGracePeriodDays || 30,
    maxDailyRemindCount: initialControl.maxDailyRemindCount || 1,
    broadcastScope: 'all',
  }));

  // 当前实时表单快照
  const currentSnapshot: FormSnapshot = useMemo(() => ({
    allowDefaultPlatformMp,
    allowCustomOfficialMp,
    platformMpAppId,
    platformOpenIdSubject,
    migrationMethods,
    dataInheritance,
    migrationGracePeriodDays,
    maxDailyRemindCount,
    broadcastScope,
  }), [
    allowDefaultPlatformMp,
    allowCustomOfficialMp,
    platformMpAppId,
    platformOpenIdSubject,
    migrationMethods,
    dataInheritance,
    migrationGracePeriodDays,
    maxDailyRemindCount,
    broadcastScope,
  ]);

  // 计算是否有未保存变更 (isDirty)
  const isDirty = useMemo(() => {
    return JSON.stringify(currentSnapshot) !== JSON.stringify(savedBaseline);
  }, [currentSnapshot, savedBaseline]);

  // 变更明细概览
  const dirtyDetails = useMemo(() => {
    if (!isDirty) return [];
    const diffs: string[] = [];
    if (
      currentSnapshot.allowDefaultPlatformMp !== savedBaseline.allowDefaultPlatformMp ||
      currentSnapshot.allowCustomOfficialMp !== savedBaseline.allowCustomOfficialMp
    ) {
      diffs.push('公众号接入权限策略');
    }
    if (
      currentSnapshot.platformMpAppId !== savedBaseline.platformMpAppId ||
      currentSnapshot.platformOpenIdSubject !== savedBaseline.platformOpenIdSubject
    ) {
      diffs.push('母版服务号参数');
    }
    if (
      JSON.stringify(currentSnapshot.migrationMethods) !==
      JSON.stringify(savedBaseline.migrationMethods)
    ) {
      diffs.push('人员换绑通路设置');
    }
    if (
      JSON.stringify(currentSnapshot.dataInheritance) !==
      JSON.stringify(savedBaseline.dataInheritance) ||
      currentSnapshot.migrationGracePeriodDays !== savedBaseline.migrationGracePeriodDays ||
      currentSnapshot.maxDailyRemindCount !== savedBaseline.maxDailyRemindCount
    ) {
      diffs.push('数据继承与宽限期');
    }
    if (currentSnapshot.broadcastScope !== savedBaseline.broadcastScope) {
      diffs.push('下发生效范围');
    }
    return diffs;
  }, [isDirty, currentSnapshot, savedBaseline]);

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
    return 'platform_default';
  }, [allowCustomOfficialMp, allowDefaultPlatformMp]);

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

  // 修改特定通道的参数
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

  // 撤销未保存修改（还原为上次保存的基准）
  const handleRevertChanges = () => {
    setAllowDefaultPlatformMp(savedBaseline.allowDefaultPlatformMp);
    setAllowCustomOfficialMp(savedBaseline.allowCustomOfficialMp);
    setPlatformMpAppId(savedBaseline.platformMpAppId);
    setPlatformOpenIdSubject(savedBaseline.platformOpenIdSubject);
    setMigrationMethods(savedBaseline.migrationMethods);
    setDataInheritance(savedBaseline.dataInheritance);
    setMigrationGracePeriodDays(savedBaseline.migrationGracePeriodDays);
    setMaxDailyRemindCount(savedBaseline.maxDailyRemindCount);
    setBroadcastScope(savedBaseline.broadcastScope);
    showToast('已撤销所有未保存的修改，恢复至上次下发生效的配置', 'info');
  };

  // 重置为系统推荐配置
  const handleResetDefaults = () => {
    setAllowDefaultPlatformMp(defaultGlobalMpControlConfig.allowDefaultPlatformMp);
    setAllowCustomOfficialMp(defaultGlobalMpControlConfig.allowCustomOfficialMp);
    setMigrationMethods(defaultGlobalMpControlConfig.migrationMethods);
    setDataInheritance(defaultGlobalMpControlConfig.dataInheritance);
    setMigrationGracePeriodDays(defaultGlobalMpControlConfig.migrationGracePeriodDays);
    setMaxDailyRemindCount(defaultGlobalMpControlConfig.maxDailyRemindCount);
    showToast('已载入全平台推荐母版规则，请点击右上角「保存并下发规则」确认生效', 'info');
  };

  // 保存并下发所有全局配置
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
      showToast('已允许机构使用自备公众号，请至少启用一种人员换绑通道', 'warning');
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
      // 更新基准快照，isDirty 将自动重置为 false（按钮恢复白色）
      setSavedBaseline(currentSnapshot);
      showToast(
        broadcastScope === 'all'
          ? '全平台公众号与人员换绑匹配规则已保存并实时下发至全网在运行机构'
          : '全平台规则已保存生效（仅对后续新建机构生效）',
        'success'
      );
    }, 400);
  };

  const activeMethodsCount = [
    migrationMethods?.autoUnionId,
    migrationMethods?.wechatCard,
    migrationMethods?.smsVerify,
    migrationMethods?.workspaceQr,
  ].filter((m) => Boolean(m?.enabled)).length;

  return (
    <div className="space-y-4 text-gray-800 pb-10" id="global-mp-rebinding-root">
      {/* 1. 顶部控制栏与子模块切换 Tab */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1890ff] flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">全平台公众号接入与换绑规则</h2>
              {isDirty ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  检测到未保存变更 ({dirtyDetails.length}项)
                </span>
              ) : savedTime ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  已全局下发生效 ({savedTime.slice(11, 16)})
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex items-center gap-1 font-medium">
                  规则未修改
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 子模块切换与核心操作 */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200/80">
            <button
              type="button"
              onClick={() => setActiveGlobalSubTab('mp_rules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeGlobalSubTab === 'mp_rules'
                  ? 'bg-white text-[#1890ff] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>公众号接入规则</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGlobalSubTab('migration_rules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeGlobalSubTab === 'migration_rules'
                  ? 'bg-white text-[#1890ff] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>人员换绑迁移规则</span>
            </button>
          </div>

          {/* 核心保存并下发按钮：未变更白色，已变更蓝色 */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isDirty
                ? 'bg-[#1890ff] hover:bg-[#096dd9] text-white shadow-md ring-2 ring-blue-300/60 animate-pulse-subtle'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-2xs'
            }`}
            title={isDirty ? '检测到配置已修改，点击立即保存并下发全局规则' : '当前配置已是最新状态'}
          >
            {isSaving ? (
              <Save className="w-3.5 h-3.5 animate-spin" />
            ) : isDirty ? (
              <Send className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>
              {isSaving
                ? '下发生效中...'
                : isDirty
                ? '保存并下发规则 (待保存)'
                : '已保存'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 子视图 A：全平台公众号接入规则 */}
      {/* ========================================================================= */}
      {activeGlobalSubTab === 'mp_rules' && (
        <div className="space-y-4">
          {/* 模块 1：公众号使用权限配置卡片 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">1. 全平台公众号接入权限策略</h3>
              </div>

              <div className="text-xs px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700 flex items-center gap-1.5">
                <span className="text-gray-400">当前权限管控状态：</span>
                {allowDefaultPlatformMp && allowCustomOfficialMp ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" />
                    双模可选（机构可自主选择接入）
                  </span>
                ) : !allowCustomOfficialMp ? (
                  <span className="text-[#1890ff] font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    统配管控（全网仅允许使用「点点速报」）
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    自备管控（强制机构使用自有认证服务号）
                  </span>
                )}
              </div>
            </div>

            {/* 模式开关选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 开关 1: 平台统配点点速报 */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  allowDefaultPlatformMp
                    ? 'border-blue-200 bg-blue-50/20'
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    使用机构默认的“点点速报”
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1890ff] font-bold">
                    平台统配
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePlatformMp}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    allowDefaultPlatformMp ? 'bg-[#1890ff]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                      allowDefaultPlatformMp ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 开关 2: 机构自有公众号 */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  allowCustomOfficialMp
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    支持使用机构自有的公众号
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                    独立品牌
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleCustomMp}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    allowCustomOfficialMp ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                      allowCustomOfficialMp ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 模块 2：平台统配「点点速报」母版参数定义 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">2. 平台统配「点点速报」母版服务号配置</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] font-bold border border-blue-200">
                母版全局生效
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">统一开发者 AppID</label>
                <input
                  type="text"
                  value={platformMpAppId}
                  onChange={(e) => setPlatformMpAppId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#1E5ABB]"
                  placeholder="wx..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">微信开放平台 OpenPlatform 主体</label>
                <input
                  type="text"
                  value={platformOpenIdSubject}
                  onChange={(e) => setPlatformOpenIdSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#1E5ABB]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 子视图 B：全平台采编人员换绑迁移规则 */}
      {/* ========================================================================= */}
      {activeGlobalSubTab === 'migration_rules' && (
        <div className="space-y-4">
          {/* 模块 1：人员跨号换绑迁移 4 大通路设置 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">1. 人员换绑迁移 4 大通路支持规则</h3>
                  <span className="text-xs text-gray-500">
                    （当前已开启 <strong className="text-emerald-600 font-bold">{activeMethodsCount}</strong> / 4 种通道）
                  </span>
                </div>
              </div>

              {!allowCustomOfficialMp && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded">
                  自有公众号未开启，此通道暂备用
                </span>
              )}
            </div>

            {/* 4 大通道条目化设计 */}
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {/* 通路 1: UnionID 自动静默匹配 */}
              <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1890ff] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        UnionID 自动静默匹配通道
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1890ff] font-bold">
                        首选 · 用户无感
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      机构在同一微信开放平台主体下，采编人员关注新号后系统后台根据微信统一 UnionID 自动识别关联，无需重复登记
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
                    className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                      migrationMethods?.autoUnionId?.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 通路 2: 微信服务通知卡片推送 */}
              <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        微信服务通知卡片推送通道
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                        微信内闭环
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      原公众号向在册人员推送专属换绑卡片，点击一键授权关注单位新公众号即自动完成跨号对账
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>每日推送频次：</span>
                    <select
                      value={migrationMethods?.wechatCard?.pushFrequencyLimit ?? 1}
                      onChange={(e) =>
                        handleUpdateMethodParam('wechatCard', 'pushFrequencyLimit', Number(e.target.value))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:border-[#1890ff]"
                    >
                      <option value={1}>1 次 / 天（防打扰）</option>
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
                      className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                        migrationMethods?.wechatCard?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 通路 3: 短信验证码安全换绑 */}
              <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        短信验证码安全换绑通道
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">
                        离线与紧急兜底
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      向人员登记手机号发送动态验证码与专属换绑短链，覆盖微信离线、取关或更换微信手机号的特殊人员
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>验证码时效：</span>
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
                      className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                        migrationMethods?.smsVerify?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 通路 4: 工作台登录扫码核身 */}
              <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        工作台登录扫码核身通道
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                        PC 引导
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      采编人员登录融媒采编系统后台时弹出换绑二维码，扫码确认即完成新公众号权限绑定
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
                    className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform ${
                      migrationMethods?.workspaceQr?.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 模块 2：数据无损继承与宽限期策略 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">2. 换绑数据无损继承与宽限保护期规则</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 运行参数 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">换绑迁移过渡宽限期</span>
                    <span className="text-[11px] text-gray-500">过渡期内原公众号保持只读接收，防止断档</span>
                  </div>
                  <select
                    value={migrationGracePeriodDays}
                    onChange={(e) => setMigrationGracePeriodDays(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2.5 py-1 text-xs bg-white text-gray-800 font-bold focus:outline-none focus:border-[#1890ff]"
                  >
                    <option value={15}>15 天</option>
                    <option value={30}>30 天（系统推荐）</option>
                    <option value={60}>60 天</option>
                    <option value={90}>90 天</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">未换绑人员每日提醒上限</span>
                    <span className="text-[11px] text-gray-500">避免对在职采编人员造成过度打扰</span>
                  </div>
                  <select
                    value={maxDailyRemindCount}
                    onChange={(e) => setMaxDailyRemindCount(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2.5 py-1 text-xs bg-white text-gray-800 font-bold focus:outline-none focus:border-[#1890ff]"
                  >
                    <option value={1}>1 次 / 天（系统推荐）</option>
                    <option value={2}>2 次 / 天</option>
                    <option value={3}>3 次 / 天</option>
                  </select>
                </div>
              </div>

              {/* 4 大数据继承项 */}
              <div className="p-3.5 rounded-lg bg-gray-50/80 border border-gray-100 space-y-2.5 text-xs">
                <span className="font-bold text-gray-800 block">
                  换绑人员数据结转范围（全平台标准）：
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataInheritance.inheritDrafts}
                      onChange={() => handleToggleInheritance('inheritDrafts')}
                      className="rounded text-[#1890ff] focus:ring-0"
                    />
                    <span className="text-gray-700 font-medium">历史稿件与统计</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataInheritance.inheritAuditLogs}
                      onChange={() => handleToggleInheritance('inheritAuditLogs')}
                      className="rounded text-[#1890ff] focus:ring-0"
                    />
                    <span className="text-gray-700 font-medium">审签留痕与评语</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataInheritance.inheritPoints}
                      onChange={() => handleToggleInheritance('inheritPoints')}
                      className="rounded text-[#1890ff] focus:ring-0"
                    />
                    <span className="text-gray-700 font-medium">积分排名与绩效</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataInheritance.inheritRoles}
                      onChange={() => handleToggleInheritance('inheritRoles')}
                      className="rounded text-[#1890ff] focus:ring-0"
                    />
                    <span className="text-gray-700 font-medium">部门权限与角色</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. 底部下发生效范围配置 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-gray-800">下发生效策略范围：</span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="bottomBroadcastScope"
                value="all"
                checked={broadcastScope === 'all'}
                onChange={() => setBroadcastScope('all')}
                className="accent-[#1890ff]"
              />
              <span className="text-gray-900 font-bold">
                实时应用至全网在运行机构
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="bottomBroadcastScope"
                value="new_only"
                checked={broadcastScope === 'new_only'}
                onChange={() => setBroadcastScope('new_only')}
                className="accent-[#1890ff]"
              />
              <span className="text-gray-600">仅对后续新建机构生效</span>
            </label>
          </div>
          <p className="text-[11px] text-gray-400">
            点击顶部「保存并下发规则」后将同步更新数据库全局母版策略，并按选定范围即时分发至各融媒机构
          </p>
        </div>
      </div>
    </div>
  );
};
