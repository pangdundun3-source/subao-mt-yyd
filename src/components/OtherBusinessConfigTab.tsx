import React, { useState } from 'react';
import {
  Institution,
  InstitutionBusinessRules,
  OtherBusinessConfig,
  WechatMpConfig,
  MpMigrationConfig,
} from '../types';
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
};

export type OtherConfigSubNavKey = 'wechat_mp' | 'mp_migration';

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
  // Local active sub-tab inside "其他配置"
  const [activeSubTab, setActiveSubTab] = useState<OtherConfigSubNavKey>(() => {
    const saved = localStorage.getItem('admin_other_config_sub_tab');
    if (saved === 'wechat_mp' || saved === 'mp_migration') {
      return saved;
    }
    return 'wechat_mp';
  });

  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const handleSubTabChange = (key: OtherConfigSubNavKey) => {
    setActiveSubTab(key);
    localStorage.setItem('admin_other_config_sub_tab', key);
  };

  // Merged otherConfig
  const otherConfig: OtherBusinessConfig = {
    ...defaultOtherBusinessConfig,
    ...(rules.otherConfig || {}),
  };

  const handleUpdateWechatMp = (wechatMp: WechatMpConfig) => {
    const updated: InstitutionBusinessRules = {
      ...rules,
      otherConfig: {
        ...otherConfig,
        wechatMp,
      },
    };
    setRules(updated);
    onSaveRules(updated);
  };

  const handleUpdateMigration = (migration: MpMigrationConfig) => {
    const updated: InstitutionBusinessRules = {
      ...rules,
      otherConfig: {
        ...otherConfig,
        migration,
      },
    };
    setRules(updated);
    onSaveRules(updated);
  };

  return (
    <div className="space-y-4">
      {/* 统一的高集成度顶部控制栏：左侧胶囊切换器 + 右侧功能说明 */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Control 药丸标签切换组 (专业后台主流范式) */}
          <div className="flex items-center p-1 bg-gray-100/90 rounded-xl border border-gray-200/60 overflow-x-auto">
            {SEGMENT_ITEMS.map((item) => {
              const isActive = activeSubTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSubTabChange(item.key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1890ff] shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isActive ? 'text-[#1890ff]' : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                      isActive ? item.badgeClass : 'bg-gray-200/70 text-gray-500 border-transparent'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 右侧：新手场景指引折叠按钮 */}
          <button
            type="button"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="text-xs font-medium text-gray-500 hover:text-[#1890ff] flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-blue-50/60 transition-colors cursor-pointer self-end md:self-auto"
          >
            <span className="material-symbols-outlined text-[15px] text-[#1890ff]">help_outline</span>
            <span>{showHelpGuide ? '收起业务场景说明' : '业务场景说明'}</span>
            <span className="material-symbols-outlined text-[14px]">
              {showHelpGuide ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* 展开的场景使用指引 */}
        {showHelpGuide && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-600 animate-fade-in">
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-0.5">1. 微信公众号配置</span>
              <span>支持开通即用的「点点速豹平台统配」，也支持无缝接入机构自己的微信服务号与发稿通道。</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-0.5">2. 人员一键换绑迁移</span>
              <span>切换公众号后，一键向全员下发换绑提醒，扫码即可绑定新号，历史稿件和权限 100% 保留。</span>
            </div>
          </div>
        )}
      </div>

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
  );
};
