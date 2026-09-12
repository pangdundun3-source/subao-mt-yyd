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
    title: '微信公众号配置',
    badge: '运行中',
    icon: 'chat',
    summary: '公众号接入与发稿通道',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'mp_migration',
    title: '人员一键换绑迁移',
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
  const { activeSubTab, showHelpGuide, otherConfig, institutionName } = state;
  const {
    setShowHelpGuide,
    handleSubTabChange,
    handleUpdateWechatMp,
    handleUpdateMigration,
  } = actions;

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      {/* 1. 左侧分类导航菜单 */}
      <div className="w-full lg:w-60 xl:w-64 shrink-0 space-y-3">
        <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-2xs space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-gray-400 select-none">
            其他配置项
          </div>

          {SEGMENT_ITEMS.map((item) => {
            const isActive = activeSubTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSubTabChange(item.key)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-50 text-[#1890ff] font-semibold border border-blue-200/80 shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                      isActive ? 'text-[#1890ff]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-gray-900 group-hover:text-[#1890ff]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-gray-400 font-normal truncate mt-0.5">
                      {item.summary}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-normal shrink-0 ml-1.5 border ${
                    isActive ? item.badgeClass : 'bg-gray-100 text-gray-400 border-transparent'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 右侧主体配置区 */}
      <div className="flex-1 min-w-0 w-full">
        {/* Sub-Tab 1: Wechat MP Config */}
        {activeSubTab === 'wechat_mp' && (
          <WechatMpConfigSection
            institutionName={institution?.name || '随州市网信中心'}
            config={otherConfig.wechatMp || defaultWechatMpConfig}
            onChangeConfig={handleUpdateWechatMp}
            showToast={showToast}
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
          />
        )}
      </div>
    </div>
  );
};
