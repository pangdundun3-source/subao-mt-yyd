import React from 'react';
import { WechatMpConfig, WechatMpMode } from '../../types';
import { useWechatMpConfigViewModel } from '../../viewmodels/useWechatMpConfigViewModel';

export const defaultWechatMpConfig: WechatMpConfig = {
  mode: 'custom_official',
  mpName: '随州融媒发布 (官方认证服务号)',
  wechatAccount: 'suizhou_mt_news',
  originalId: 'gh_88392104bf71',
  appId: 'wx78a9103c84df12a9',
  appSecret: '9e3c048b64e5912a7f01c84139281e05',
  serverUrl: 'https://api.subao-mt.gov.cn/wechat/gateway/inst-suizhou-01',
  token: 'SubaoMtSuizhouToken2026',
  encodingAesKey: 'k8d9F73jK19LmNPqRstUVwXyzABcDEfgHIJKLMN2026',
  encryptMode: 'secure',
  authStatus: 'authorized',
  lastVerifyTime: '2026-08-30 22:15:30',
  qrCodeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
  templates: {
    warningTemplateId: 'OPENTM417283910_SUBAO_ALERT_01',
    dispatchTemplateId: 'OPENTM409182374_TASK_DISPATCH_02',
    reviewCompleteTemplateId: 'OPENTM418291034_AUDIT_NOTIFY_03',
    dailyReportTemplateId: 'OPENTM401928371_DAILY_DIGEST_04',
  },
  jsSafeDomains: ['subao-mt.gov.cn', 'm.suizhou.gov.cn', 'app.suizhou-news.cn'],
  ipWhitelist: '120.79.182.55, 114.116.240.89, 139.198.12.30',
  remark: '随州市委网信办官方公众号，已完成微信开放平台与微信认证对接。',
};

interface WechatMpConfigSectionProps {
  institutionName: string;
  config: WechatMpConfig;
  onChangeConfig: (newConfig: WechatMpConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const WechatMpConfigSection: React.FC<WechatMpConfigSectionProps> = ({
  institutionName,
  config,
  onChangeConfig,
  showToast,
}) => {
  const { state, actions } = useWechatMpConfigViewModel({
    institutionName,
    config,
    defaultConfig: defaultWechatMpConfig,
    onChangeConfig,
    showToast,
  });
  const { formData, showSecret, showAdvanced, isTesting, testResults, showQrModal } = state;
  const {
    setFormData,
    setShowSecret,
    setShowAdvanced,
    setShowQrModal,
    handleModeChange,
    handleRunDiagnostics,
    handleSave,
  } = actions;

  return (
    <div className="space-y-4">
      {/* 1. Header Card & Clear Mode Selection */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
              <span>第一步：选择公众号使用方式</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              根据单位实际情况，二选一即可：
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunDiagnostics}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isTesting ? 'animate-spin' : ''}`}>
                {isTesting ? 'sync' : 'network_check'}
              </span>
              <span>{isTesting ? '检测中...' : '测试连接状态'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-[#1890ff] hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              <span>查看关注二维码</span>
            </button>
          </div>
        </div>

        {/* 2 Clear Choice Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
          {/* Choice A: 平台统配点点速豹 */}
          <div
            onClick={() => handleModeChange('platform_default')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              formData.mode === 'platform_default'
                ? 'border-[#1890ff] bg-blue-50/40 ring-2 ring-[#1890ff]/20 shadow-xs'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-100 text-[#1890ff] flex items-center justify-center font-bold text-xs">
                    省
                  </span>
                  <span className="font-bold text-sm text-gray-900">方式一：用平台统配的「点点速豹」</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                  最简单·免配置
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                无需单位申请微信认证，全员直接扫码关注即可收发速报，开通即用。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className={formData.mode === 'platform_default' ? 'text-[#1890ff] font-bold' : 'text-gray-400'}>
                {formData.mode === 'platform_default' ? '✓ 当前已选中此模式' : '点击使用此模式'}
              </span>
              <input
                type="radio"
                name="mpMode"
                checked={formData.mode === 'platform_default'}
                onChange={() => handleModeChange('platform_default')}
                className="accent-[#1890ff]"
              />
            </div>
          </div>

          {/* Choice B: 机构自有独立公众号 */}
          <div
            onClick={() => handleModeChange('custom_official')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              formData.mode === 'custom_official'
                ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    自
                  </span>
                  <span className="font-bold text-sm text-gray-900">方式二：用单位自己的微信公众号</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  单位专属品牌
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                绑定单位官方认证的微信服务号，速报通知将以单位官方名称直接向采编员发送。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className={formData.mode === 'custom_official' ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                {formData.mode === 'custom_official' ? '✓ 当前已选中此模式' : '点击使用此模式'}
              </span>
              <input
                type="radio"
                name="mpMode"
                checked={formData.mode === 'custom_official'}
                onChange={() => handleModeChange('custom_official')}
                className="accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Diagnostics Banner if tested */}
        {testResults && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs animate-fade-in flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>微信连接状态检测成功：公众号已就绪，消息推送通道正常！</span>
            </div>
            <span className="text-[11px] text-emerald-600">检测时间：{testResults.testedAt}</span>
          </div>
        )}
      </div>

      {/* 2. Simplified Parameter Fill Form */}
      {formData.mode === 'platform_default' ? (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1890ff] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <h4 className="text-sm font-bold text-gray-900">当前已启用平台统配「点点速豹」公众号</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            系统已自动配置完成底层接口与消息网关，无需您手动填写任何技术参数。采编人员只需扫码关注平台统配码即可开始工作。
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              <span>查看机构专属入驻二维码</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Essential Simple Inputs (Just 3 fields: Name, AppID, AppSecret) */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#1890ff] rounded-xs" />
                  <span>第二步：填写单位公众号的核心凭证</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  只需登录微信公众平台（mp.weixin.qq.com），复制并填写以下两项即可：
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  1. 公众号名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.mpName}
                  onChange={(e) => setFormData({ ...formData, mpName: e.target.value })}
                  placeholder="例如：随州融媒发布"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  2. 开发者 AppID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.appId}
                  onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                  placeholder="以 wx 开头，例如 wx78a9103c84df12a9"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">
                    3. 应用密钥 AppSecret <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-[11px] text-[#1890ff] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {showSecret ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{showSecret ? '隐藏' : '查看'}</span>
                  </button>
                </div>
                <input
                  type={showSecret ? 'text' : 'password'}
                  required
                  value={formData.appSecret}
                  onChange={(e) => setFormData({ ...formData, appSecret: e.target.value })}
                  placeholder="32位字符密钥"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1890ff]"
                />
              </div>
            </div>

            {/* Optional Collapsible Technical Details for IT staff */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-400">
                  {showAdvanced ? 'expand_less' : 'tune'}
                </span>
                <span>{showAdvanced ? '收起高级服务器与模板消息配置（选填）' : '展开高级技术参数配置（服务器网关/模板消息ID等，通常无需修改）'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-xs space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block font-bold text-gray-700 mb-1">服务器网关 URL (自动分配)</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={formData.serverUrl}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(formData.serverUrl);
                            showToast('已复制网关 URL！');
                          }}
                          className="px-2 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
                        >
                          复制
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block font-bold text-gray-700 mb-1">Token 验证令牌</span>
                      <input
                        type="text"
                        value={formData.token}
                        onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>保存公众号设置</span>
            </button>
          </div>
        </form>
      )}

      {/* QR Code Preview Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-scale-in p-5 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#1890ff]">qr_code_scanner</span>
                <span>单位专属关注入驻二维码</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block mb-3">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                <span className="material-symbols-outlined text-[44px]">qr_code_2</span>
                <span className="text-[11px] font-bold mt-1">{formData.mpName}</span>
                <span className="text-[9px] text-blue-200">扫码直接关注并绑定</span>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              新入驻采编员使用微信扫码关注即可自动完成入驻绑定
            </p>

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  showToast('已下载二维码！');
                  setShowQrModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>下载二维码图片</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
