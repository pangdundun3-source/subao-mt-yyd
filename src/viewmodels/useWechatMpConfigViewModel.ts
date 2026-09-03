import { useState } from 'react';
import type { FormEvent } from 'react';
import { WechatMpConfig, WechatMpMode } from '../types';
import { formatDateTime } from '../shared/date';

interface TestResults {
  tested: boolean;
  accessToken: boolean;
  templateMsg: boolean;
  menuApi: boolean;
  userSync: boolean;
  testedAt: string;
  errorMsg?: string;
}

interface UseWechatMpConfigViewModelOptions {
  institutionName: string;
  config: WechatMpConfig;
  defaultConfig: WechatMpConfig;
  onChangeConfig: (newConfig: WechatMpConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const useWechatMpConfigViewModel = ({
  institutionName,
  config,
  defaultConfig,
  onChangeConfig,
  showToast,
}: UseWechatMpConfigViewModelOptions) => {
  const [formData, setFormData] = useState<WechatMpConfig>(config || defaultConfig);
  const [showSecret, setShowSecret] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleModeChange = (mode: WechatMpMode) => {
    const updated: WechatMpConfig = {
      ...formData,
      mode,
      mpName:
        mode === 'platform_default'
          ? '点点速豹 (平台统配)'
          : formData.mpName || `${institutionName}官方公众号`,
      originalId: mode === 'platform_default' ? 'gh_ddsb_system_default' : formData.originalId,
      appId: mode === 'platform_default' ? 'wx_ddsb_platform_std' : formData.appId,
      authStatus: 'authorized',
    };
    setFormData(updated);
    onChangeConfig(updated);
    showToast(
      mode === 'platform_default'
        ? '已切换为【平台统配·点点速豹】模式（免配置即开即用）'
        : '已切换为【单位自有公众号】模式，只需填写 AppID 与 AppSecret 即可',
      'info'
    );
  };

  const handleRunDiagnostics = () => {
    setIsTesting(true);
    showToast('正在检测微信接口连接状态...', 'info');

    window.setTimeout(() => {
      setIsTesting(false);
      const isSuccess =
        formData.mode === 'platform_default' ||
        (Boolean(formData.appId) && Boolean(formData.appSecret));
      setTestResults({
        tested: true,
        accessToken: isSuccess,
        templateMsg: isSuccess,
        menuApi: isSuccess,
        userSync: isSuccess,
        testedAt: new Date().toLocaleTimeString(),
      });

      if (isSuccess) {
        const updated = {
          ...formData,
          authStatus: 'authorized' as const,
          lastVerifyTime: formatDateTime(),
        };
        setFormData(updated);
        onChangeConfig(updated);
        showToast('微信公众号接口连接正常！', 'success');
      } else {
        showToast('检测未通过：请确认 AppID 与 AppSecret 是否填写正确', 'warning');
      }
    }, 800);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    onChangeConfig(formData);
    showToast('公众号配置已成功保存！', 'success');
  };

  return {
    state: {
      formData,
      showSecret,
      showAdvanced,
      isTesting,
      testResults,
      showQrModal,
    },
    actions: {
      setFormData,
      setShowSecret,
      setShowAdvanced,
      setShowQrModal,
      handleModeChange,
      handleRunDiagnostics,
      handleSave,
    },
  };
};
