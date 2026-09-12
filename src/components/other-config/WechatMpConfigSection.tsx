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

  // 读取平台运营全局策略控制
  const globalControl = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('mt_global_mp_control_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  }, []);

  const allowCustomOfficialMp = globalControl ? (globalControl.allowCustomOfficialMp ?? true) : true;
  const allowDefaultPlatformMp = globalControl ? (globalControl.allowDefaultPlatformMp ?? true) : true;

  const onSelectMode = (targetMode: WechatMpMode) => {
    if (targetMode === 'custom_official' && !allowCustomOfficialMp) {
      showToast('平台当前策略已关闭机构自有公众号接入，所有机构只能使用默认的“点点速报”', 'warning');
      return;
    }
    if (targetMode === 'platform_default' && !allowDefaultPlatformMp) {
      showToast('平台当前策略要求必须使用机构自有公众号', 'warning');
      return;
    }
    handleModeChange(targetMode);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
      {/* 1. 顶部标题栏与模式切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">微信公众号配置</h3>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                formData.mode === 'platform_default'
                  ? 'bg-blue-50 text-[#1890ff] border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {formData.mode === 'platform_default' ? '平台统配' : '机构自有服务号'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            配置本机构采编人员接收速报通知与审核发稿的微信公众号通道
          </p>
        </div>

        {/* 顶部快捷操作 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunDiagnostics}
            disabled={isTesting}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[15px] ${isTesting ? 'animate-spin text-[#1890ff]' : 'text-gray-500'}`}>
              {isTesting ? 'sync' : 'network_check'}
            </span>
            <span>{isTesting ? '检测中...' : '测试连通性'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-[#1890ff] hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
            <span>查看入驻二维码</span>
          </button>
        </div>
      </div>

      {/* 2. 模式切换分段选择器 */}
      <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-lg max-w-md">
        <button
          type="button"
          onClick={() => onSelectMode('platform_default')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            formData.mode === 'platform_default'
              ? 'bg-white text-[#1890ff] font-bold shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span>点点速报 (平台统配·免配置)</span>
        </button>

        <button
          type="button"
          disabled={!allowCustomOfficialMp}
          onClick={() => onSelectMode('custom_official')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            !allowCustomOfficialMp
              ? 'opacity-50 cursor-not-allowed text-gray-400'
              : formData.mode === 'custom_official'
              ? 'bg-white text-emerald-700 font-bold shadow-2xs cursor-pointer'
              : 'text-gray-600 hover:text-gray-900 cursor-pointer'
          }`}
          title={!allowCustomOfficialMp ? '平台运营策略已统一锁定，暂未开放自有公众号' : ''}
        >
          <span className="material-symbols-outlined text-[15px]">apartment</span>
          <span>机构自有公众号</span>
        </button>
      </div>

      {/* 测试反馈条 */}
      {testResults && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span>公众号连通性测试通过：微信网关通道已就绪，消息推送正常。</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">{testResults.testedAt}</span>
        </div>
      )}

      {/* 3. 对应模式的简洁内容区 */}
      {formData.mode === 'platform_default' ? (
        <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-gray-200/60">
              <span className="text-gray-400 block text-[11px]">公众号名称</span>
              <span className="font-semibold text-gray-900 mt-0.5 block">点点速报 (官方认证服务号)</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200/60">
              <span className="text-gray-400 block text-[11px]">接入方式</span>
              <span className="font-semibold text-blue-600 mt-0.5 block">平台官方统配 · 零门槛即用</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200/60">
              <span className="text-gray-400 block text-[11px]">运行状态</span>
              <span className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                正常运行中
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-gray-500">
            <span>系统已托管接口与消息网关，采编人员直接微信扫码关注即可收发速报通知，无需单位自行维护密钥。</span>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="text-[#1890ff] hover:underline font-medium cursor-pointer shrink-0"
            >
              查看专属入驻二维码 →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  公众号名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.mpName}
                  onChange={(e) => setFormData({ ...formData, mpName: e.target.value })}
                  placeholder="例如：随州融媒发布"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  开发者 AppID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.appId}
                  onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                  placeholder="以 wx 开头"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-gray-700">
                    应用密钥 AppSecret <span className="text-rose-500">*</span>
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
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1890ff]"
                />
              </div>
            </div>

            {/* 可折叠的高级参数 */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[15px] text-gray-400">
                  {showAdvanced ? 'expand_less' : 'tune'}
                </span>
                <span>{showAdvanced ? '收起高级网关参数' : '展开高级网关参数（服务器网关URL、Token等，通常无需修改）'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-2.5 p-3 rounded-lg bg-white border border-gray-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                  <div>
                    <span className="block font-medium text-gray-600 mb-1">服务器网关 URL (自动分配)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={formData.serverUrl}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(formData.serverUrl);
                          showToast('已复制网关 URL！');
                        }}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs font-medium cursor-pointer shrink-0"
                      >
                        复制
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block font-medium text-gray-600 mb-1">Token 验证令牌</span>
                    <input
                      type="text"
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1890ff] text-white hover:bg-blue-600 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>保存配置</span>
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
