import React, { useState } from 'react';
import {
  MpMigrationConfig,
  WechatMpConfig,
  WechatMpMode,
} from '../../types';
import { defaultWechatMpConfig } from './WechatMpConfigSection';

interface GlobalOtherConfigDefaultsSectionProps {
  mpConfig?: WechatMpConfig;
  migrationConfig?: MpMigrationConfig;
  onSaveMpDefaults: (config: WechatMpConfig) => void;
  onSaveMigrationDefaults: (config: MpMigrationConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const GlobalOtherConfigDefaultsSection: React.FC<
  GlobalOtherConfigDefaultsSectionProps
> = ({
  mpConfig,
  migrationConfig,
  onSaveMpDefaults,
  onSaveMigrationDefaults,
  showToast,
}) => {
  const [mode, setMode] = useState<WechatMpMode>(mpConfig?.mode || 'platform_default');
  const [mpName, setMpName] = useState(
    mpConfig?.mpName || defaultWechatMpConfig.mpName
  );
  const [appId, setAppId] = useState(
    mpConfig?.appId || defaultWechatMpConfig.appId
  );
  const [appSecret, setAppSecret] = useState(
    mpConfig?.appSecret || defaultWechatMpConfig.appSecret
  );
  const [showSecret, setShowSecret] = useState(false);

  const [enableAutoUnionIdSync, setEnableAutoUnionIdSync] = useState(
    migrationConfig?.enableAutoUnionIdSync ?? true
  );
  const [enableSmsNotify, setEnableSmsNotify] = useState(
    migrationConfig?.enableSmsNotify ?? true
  );
  const [enableWechatCardNotify, setEnableWechatCardNotify] = useState(
    migrationConfig?.enableWechatCardNotify ?? true
  );

  const [savedSection, setSavedSection] = useState<'mp' | 'migration' | null>(null);

  const handleSaveMp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'custom_official' && (!mpName.trim() || !appId.trim() || !appSecret.trim())) {
      showToast('请完整填写默认公众号名称、AppID 与 AppSecret', 'warning');
      return;
    }

    const baseMp: WechatMpConfig = {
      ...defaultWechatMpConfig,
      ...(mpConfig || {}),
    };
    onSaveMpDefaults({
      ...baseMp,
      mode,
      mpName: mode === 'platform_default' ? '点点速豹 (平台统配)' : mpName.trim(),
      appId: mode === 'platform_default' ? baseMp.appId : appId.trim(),
      appSecret:
        mode === 'platform_default' ? baseMp.appSecret : appSecret.trim(),
      authStatus: baseMp.authStatus || 'authorized',
    });
    setSavedSection('mp');
    showToast(
      mode === 'platform_default'
        ? '已保存：全平台机构默认使用「点点速豹」平台统配公众号'
        : '已保存：全平台机构默认公众号参数模板',
      'success'
    );
    window.setTimeout(() => setSavedSection(null), 3000);
  };

  const handleSaveMigration = (e: React.FormEvent) => {
    e.preventDefault();
    const baseMigration: MpMigrationConfig = migrationConfig || {
      enableAutoUnionIdSync: true,
      enableSmsNotify: true,
      enableWechatCardNotify: true,
      personnelList: [],
      taskHistory: [],
    };
    onSaveMigrationDefaults({
      ...baseMigration,
      enableAutoUnionIdSync,
      enableSmsNotify,
      enableWechatCardNotify,
    });
    setSavedSection('migration');
    showToast('已保存人员一键迁移全局参数，未单独配置的机构将按此默认策略执行', 'success');
    window.setTimeout(() => setSavedSection(null), 3000);
  };

  return (
    <div className="space-y-5 animate-fade-in text-gray-800">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
        <div className="flex items-center gap-3.5 pb-5 border-b border-gray-100">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            <span className="material-symbols-outlined text-[24px]">chat</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-gray-900">全平台公众号与人员迁移通用项</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                平台通用配置
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              配置全平台机构默认公众号使用方式与人员一键迁移全局参数，保存后机构详情页未单独配置时统一继承调用
            </p>
          </div>
        </div>
      </div>

      {/* Card A: 全平台机构默认公众号使用方式 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1890ff] text-[20px]">forum</span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">全平台机构默认公众号使用方式</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                决定新建/未初始化机构进入「业务规则配置 → 其他配置 → 微信公众号配置」时的默认选择
              </p>
            </div>
          </div>
          {savedSection === 'mp' && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-semibold">
              已保存生效
            </span>
          )}
        </div>

        <form onSubmit={handleSaveMp} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setMode('platform_default')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                mode === 'platform_default'
                  ? 'border-[#1890ff] bg-blue-50/40 ring-2 ring-[#1890ff]/20'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-gray-900">方式一：全机构默认用「点点速豹」</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                  推荐·免配置
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                全平台统一使用点点速豹公众号收发速报，机构无需申请微信认证，开通即用。
              </p>
              <div className="mt-3 text-xs text-[#1890ff] font-bold">
                {mode === 'platform_default' ? '✓ 当前为平台默认项' : '点击设为平台默认'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('custom_official')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                mode === 'custom_official'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-gray-900">方式二：默认使用机构自有公众号</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  按机构配置
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                平台统一给机构一份“自有公众号默认参数模板”，机构仍可在详情页覆盖为各自的公众号。
              </p>
              <div className="mt-3 text-xs text-emerald-700 font-bold">
                {mode === 'custom_official' ? '✓ 当前为平台默认项' : '点击设为平台默认'}
              </div>
            </button>
          </div>

          {mode === 'custom_official' && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3.5">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">description</span>
                默认公众号核心参数模板（机构未单独配置时自动填入，机构可自行覆盖）
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">公众号名称 *</label>
                  <input
                    type="text"
                    value={mpName}
                    onChange={(e) => setMpName(e.target.value)}
                    placeholder="如：随州融媒发布"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1890ff] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">开发者 AppID *</label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="以 wx 开头"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1890ff] bg-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">AppSecret *</label>
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-[11px] text-[#1890ff] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {showSecret ? 'visibility_off' : 'visibility'}
                      </span>
                      {showSecret ? '隐藏' : '查看'}
                    </button>
                  </div>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    placeholder="32位字符密钥"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1890ff] bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#1890ff] text-white px-6 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              保存公众号通用项
            </button>
          </div>
        </form>
      </div>

      {/* Card B: 人员一键迁移全局参数 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1890ff] text-[20px]">swap_horiz</span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">人员一键迁移全局参数</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                机构发起全员一键换绑时默认使用的匹配与通知渠道策略
              </p>
            </div>
          </div>
          {savedSection === 'migration' && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-semibold">
              已保存生效
            </span>
          )}
        </div>

        <form onSubmit={handleSaveMigration} className="mt-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-1">迁移路径说明：</span>
            机构在公众号配置中切换到自有公众号后，在「人员一键换绑迁移」中点击发起迁移，系统按下方全局参数向全员下发换绑通知；
            采编员扫码关注新公众号后自动关联老账号，历史稿件、积分与权限 100% 保留。
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                enableAutoUnionIdSync
                  ? 'border-[#1890ff] bg-blue-50/40 ring-2 ring-[#1890ff]/20'
                  : 'border-gray-200 bg-gray-50/40 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={enableAutoUnionIdSync}
                onChange={(e) => setEnableAutoUnionIdSync(e.target.checked)}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-900">UnionID 自动匹配</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    enableAutoUnionIdSync
                      ? 'bg-blue-100 text-[#1890ff]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {enableAutoUnionIdSync ? '已开启' : '已关闭'}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                迁移时优先通过微信 UnionID 静默匹配新旧账号，无需人工干预
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                enableSmsNotify
                  ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                  : 'border-gray-200 bg-gray-50/40 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={enableSmsNotify}
                onChange={(e) => setEnableSmsNotify(e.target.checked)}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-900">短信换绑提醒</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    enableSmsNotify
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {enableSmsNotify ? '已开启' : '已关闭'}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                向待换绑人员手机号发送换绑指引短信，未匹配到微信时兜底通知
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                enableWechatCardNotify
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-gray-50/40 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={enableWechatCardNotify}
                onChange={(e) => setEnableWechatCardNotify(e.target.checked)}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-900">微信换绑卡片</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    enableWechatCardNotify
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {enableWechatCardNotify ? '已开启' : '已关闭'}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                向原公众号关注成员推送换绑模板卡片，点击后直达新公众号换绑
              </p>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#1890ff] text-white px-6 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              保存迁移全局参数
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
