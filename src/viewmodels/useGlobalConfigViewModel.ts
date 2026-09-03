import { FormEvent, useState } from 'react';
import { InstitutionBusinessRules } from '../types';
import { businessRuleStorage } from '../services/businessRuleStorage';

export type GlobalConfigTab = 'business_rules' | 'system_policy';
export type GlobalToastType = 'success' | 'warning' | 'info';

export const useGlobalConfigViewModel = (
  onShowToast?: (msg: string, type?: GlobalToastType) => void
) => {
  const [activeGlobalTab, setActiveGlobalTab] = useState<GlobalConfigTab>('business_rules');
  const [internalToast, setInternalToast] = useState<{
    message: string;
    type: GlobalToastType;
  } | null>(null);
  const [noticeDays, setNoticeDays] = useState(30);
  const [maxTrialDays, setMaxTrialDays] = useState(15);
  const [autoDisableExpired, setAutoDisableExpired] = useState(true);
  const [smsNotification, setSmsNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [systemNoticeText, setSystemNoticeText] = useState(
    '【系统通知】全量媒体速报大数据服务升级完毕，目前运行正常。'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const showToast = (message: string, type: GlobalToastType = 'info') => {
    if (onShowToast) {
      onShowToast(message, type);
      return;
    }
    setInternalToast({ message, type });
    window.setTimeout(() => setInternalToast(null), 3000);
  };

  const handleSaveSystemPolicy = (event: FormEvent) => {
    event.preventDefault();
    setSavedSuccess(true);
    showToast('系统全局运维策略已成功保存！', 'success');
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveGlobalRules = (rules: InstitutionBusinessRules) => {
    businessRuleStorage.saveGlobalRules(rules);
    showToast('全平台业务规则配置已成功保存并设为基准母版！', 'success');
  };

  return {
    state: {
      activeGlobalTab,
      internalToast,
      noticeDays,
      maxTrialDays,
      autoDisableExpired,
      smsNotification,
      emailNotification,
      systemNoticeText,
      savedSuccess,
    },
    actions: {
      setActiveGlobalTab,
      setNoticeDays,
      setMaxTrialDays,
      setAutoDisableExpired,
      setSmsNotification,
      setEmailNotification,
      setSystemNoticeText,
      handleSaveSystemPolicy,
      handleSaveGlobalRules,
      showToast,
    },
  };
};
