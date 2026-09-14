import React from 'react';
import {
  Institution,
  InstitutionBusinessRules,
  OtherBusinessConfig,
} from '../types';
import { useOtherBusinessConfigViewModel, OtherConfigSubNavKey } from '../viewmodels/useOtherBusinessConfigViewModel';
import {
  WechatMpConfigSection,
  defaultWechatMpConfig,
} from './other-config/WechatMpConfigSection';
import {
  MpPersonnelMigrationSection,
  mockMigrationPersonnel,
  mockMigrationTasks,
} from './other-config/MpPersonnelMigrationSection';
import { defaultQuotaHistory } from './other-config/QrQuotaSection';
import { defaultGlobalMpControlConfig } from './other-config/GlobalOtherConfigDefaultsSection';

export const defaultOtherBusinessConfig: OtherBusinessConfig = {
  qrUsage: {
    totalLimit: 50,
    usedCount: 18,
    warningThreshold: 10,
    allowSelfApply: true,
    historyRecords: defaultQuotaHistory,
  },
  wechatMp: defaultWechatMpConfig,
  migration: {
    enableAutoUnionIdSync: true,
    enableSmsNotify: true,
    enableWechatCardNotify: true,
    personnelList: mockMigrationPersonnel,
    taskHistory: mockMigrationTasks,
  },
  globalMpControl: defaultGlobalMpControlConfig,
};

interface NavSegmentItem {
  key: OtherConfigSubNavKey;
  title: string;
  badge: string;
  icon: string;
  summary: string;
  badgeClass: string;
}

const SEGMENT_ITEMS: NavSegmentItem[] = [
  {
    key: 'wechat_mp',
    title: '公众号配置',
    badge: '运行中',
    icon: 'chat',
    summary: '公众号接入与发稿通道',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'mp_migration',
    title: '人员换绑',
    badge: '3/6人',
    icon: 'swap_horiz',
    summary: '采编人员无损跨号迁移',
    badgeClass: 'bg-blue-50 text-[#1890ff] border-blue-200',
  },
];

interface OtherBusinessConfigTabProps {
  institution?: Institution | null;
  rules: InstitutionBusinessRules;
  setRules: React.Dispatch<React.SetStateAction<InstitutionBusinessRules>>;
  onSaveRules: (rules: InstitutionBusinessRules) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OtherBusinessConfigTab: React.FC<OtherBusinessConfigTabProps> = ({
  institution,
  rules,
  setRules,
  onSaveRules,
  showToast,
}) => {
  const { state, actions } = useOtherBusinessConfigViewModel({
    institution,
    rules,
    setRules,
    onSaveRules,
    defaultOtherBusinessConfig,
    onShowToast: showToast,
  });
  const { activeSubTab, otherConfig } = state;
  const {
    handleSubTabChange,
    handleUpdateWechatMp,
    handleUpdateMigration,
  } = actions;

  const isCustomBound =
    otherConfig.wechatMp?.mode === 'custom_official' &&
    Boolean(otherConfig.wechatMp?.isCustomBound);

  const currentMpName = isCustomBound
    ? otherConfig.wechatMp?.mpName || '随州融媒发布 (官方服务号)'
    : otherConfig.wechatMp?.sourceMpName || '点点速报 (平台统配)';

  return (
    <div className="space-y-4">
      {/* 顶部横向切换导航栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-2xs">
        {/* 横向 Tab 选项 */}
        <div className="inline-flex items-center gap-1 p-1 bg-gray-100/90 rounded-lg border border-gray-200/60">
          {SEGMENT_ITEMS.map((item) => {
            const isActive = activeSubTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSubTabChange(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1890ff] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[17px] ${
                    isActive ? 'text-[#1890ff]' : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* 右侧当前生效公众号展示 */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 rounded-lg border border-gray-200/60 text-xs text-gray-600 shrink-0">
          <span className="material-symbols-outlined text-[16px] text-[#07c160]">chat</span>
          <span>
            当前公众号：<strong className="text-gray-900 font-semibold">{currentMpName}</strong>
          </span>
        </div>
      </div>

      {/* 下方主体配置面板 (全宽显示) */}
      <div className="w-full">
        {/* Sub-Tab 1: Wechat MP Config */}
        {activeSubTab === 'wechat_mp' && (
          <WechatMpConfigSection
            institutionName={institution?.name || '随州市网信中心'}
            config={otherConfig.wechatMp || defaultWechatMpConfig}
            onChangeConfig={handleUpdateWechatMp}
            showToast={showToast}
            onNavigateToMigration={() => handleSubTabChange('mp_migration')}
          />
        )}

        {/* Sub-Tab 2: MP Personnel Batch Migration */}
        {activeSubTab === 'mp_migration' && (
          <MpPersonnelMigrationSection
            institutionName={institution?.name || '随州市网信中心'}
            mpConfig={otherConfig.wechatMp}
            migrationConfig={otherConfig.migration}
            onChangeMigration={handleUpdateMigration}
            showToast={showToast}
            onNavigateToMpConfig={() => handleSubTabChange('wechat_mp')}
          />
        )}
      </div>
    </div>
  );
};
