import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  initialAuditLogs,
  initialExpiringInstitutions,
  initialInstitutions,
} from '../data';
import { adminShellStorage } from '../services/adminShellStorage';
import { ActiveTab, AuditLog, ExpiringInstitution, Institution, SystemSubModule } from '../types';

interface InstitutionProvisionData {
  status: '正式' | '试用';
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

const findInstitutionById = (institutions: Institution[], id: number | null) =>
  id ? institutions.find((item) => item.id === id) || null : null;

const findInstitutionByExpiringItem = (
  institutions: Institution[],
  item: ExpiringInstitution
) => institutions.find((institution) => institution.name === item.name) || institutions[0] || null;

const toggleInstitutionEnabled = (institution: Institution): Institution => ({
  ...institution,
  enabled: !institution.enabled,
});

const provisionInstitution = (
  institution: Institution,
  provisionData: InstitutionProvisionData
): Institution => ({
  ...institution,
  ...provisionData,
  enabled: true,
});

const updateInstitution = (
  institution: Institution,
  formData: Partial<Institution>
): Institution => ({ ...institution, ...formData });

const isBusinessRulesOnlyUpdate = (formData: Partial<Institution>) =>
  Boolean(formData.businessRules && !formData.name);

const createInstitutionFromFormData = (
  formData: Partial<Institution>,
  id = Date.now()
): Institution => ({
  id,
  name: formData.name || '新建融媒体机构',
  status: formData.status || '试用',
  location: formData.location || '湖北/随州市',
  category: formData.category || '一类',
  industry: formData.industry || '网信部门',
  salesName: formData.salesName || '廖伟',
  salesPhone: formData.salesPhone || '189****4954',
  enabled: formData.enabled ?? true,
  startDate: formData.startDate || '2026-08-11',
  endDate: formData.endDate || '2026-09-11',
  daysRemaining: formData.daysRemaining || 30,
  unitName: formData.unitName || '新建统筹单元',
  businessRules: formData.businessRules,
});

const createAuditLog = (action: string, target: string): AuditLog => ({
  id: `LOG-${Date.now()}`,
  operator: '王飞飞',
  department: '产品二部',
  action,
  target,
  ip: '192.168.1.104',
  time: new Date().toISOString().replace('T', ' ').substring(0, 19),
  status: '成功',
});

export const useAdminShellViewModel = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() =>
    adminShellStorage.readActiveTab()
  );
  const [systemSubTab, setSystemSubTab] = useState<SystemSubModule>(() =>
    adminShellStorage.readSystemSubTab()
  );
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(() =>
    adminShellStorage.readSelectedInstitutionId()
  );
  const [isEditingInstitution, setIsEditingInstitution] = useState<boolean>(() =>
    adminShellStorage.readIsEditingInstitution()
  );
  const [isCreatingInstitution, setIsCreatingInstitution] = useState<boolean>(() =>
    adminShellStorage.readIsCreatingInstitution()
  );

  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [expiringInstitutions] = useState<ExpiringInstitution[]>(initialExpiringInstitutions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [deletingInstitution, setDeletingInstitution] = useState<Institution | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  const addAuditLog = useCallback((action: string, target: string) => {
    setAuditLogs((logs) => [createAuditLog(action, target), ...logs]);
  }, []);

  const openInstitutionDetail = useCallback((id: number | null, isEdit = false) => {
    setSelectedInstitutionId(id);
    setIsCreatingInstitution(false);
    setIsEditingInstitution(isEdit);

    adminShellStorage.saveIsCreatingInstitution(false);
    adminShellStorage.saveIsEditingInstitution(isEdit);
    adminShellStorage.saveSelectedInstitutionId(id);
  }, []);

  const handleCloseInstitutionDetail = useCallback(() => {
    openInstitutionDetail(null);
  }, [openInstitutionDetail]);

  const handleOpenAddInstitution = useCallback(() => {
    setIsCreatingInstitution(true);
    setIsEditingInstitution(true);
    setSelectedInstitutionId(null);

    adminShellStorage.saveIsCreatingInstitution(true);
    adminShellStorage.saveIsEditingInstitution(true);
    adminShellStorage.saveSelectedInstitutionId(null);
  }, []);

  const handleCloseAddInstitution = useCallback(() => {
    setIsCreatingInstitution(false);
    setIsEditingInstitution(false);

    adminShellStorage.saveIsCreatingInstitution(false);
    adminShellStorage.saveIsEditingInstitution(false);
  }, []);

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      setActiveTab(tab);
      adminShellStorage.saveActiveTab(tab);
      openInstitutionDetail(null);
      handleCloseAddInstitution();
    },
    [handleCloseAddInstitution, openInstitutionDetail]
  );

  const handleSystemSubTabChange = useCallback((subTab: SystemSubModule) => {
    setSystemSubTab(subTab);
    adminShellStorage.saveSystemSubTab(subTab);
  }, []);

  const handleEditModeChange = useCallback((isEdit: boolean) => {
    setIsEditingInstitution(isEdit);
    adminShellStorage.saveIsEditingInstitution(isEdit);
  }, []);

  const handleToggleStatus = useCallback(
    (id: number) => {
      const target = findInstitutionById(institutions, id);
      if (!target) return;

      const nextStatus = !target.enabled;
      setInstitutions((prev) =>
        prev.map((item) => (item.id === id ? toggleInstitutionEnabled(item) : item))
      );
      showToast(
        `已将【${target.name}】机构状态更改为：${nextStatus ? '正常启用' : '人工停用'}`
      );
      addAuditLog('切换机构状态', `${target.name} (${nextStatus ? '启用' : '停用'})`);
    },
    [addAuditLog, institutions, showToast]
  );

  const handleProvisionInstitution = useCallback(
    (id: number, provisionData: InstitutionProvisionData) => {
      const target = findInstitutionById(institutions, id);
      if (!target) return;

      setInstitutions((prev) =>
        prev.map((item) =>
          item.id === id ? provisionInstitution(item, provisionData) : item
        )
      );
      showToast(
        `已成功为【${target.name}】开通【${provisionData.status}】服务（有效期至 ${provisionData.endDate}），机构已开启成功！`
      );
      addAuditLog(
        '开通服务并启用机构',
        `${target.name} (开通${provisionData.status}服务至 ${provisionData.endDate})`
      );
    },
    [addAuditLog, institutions, showToast]
  );

  const handleSaveInstitution = useCallback(
    (formData: Partial<Institution>) => {
      const targetId = formData.id || selectedInstitutionId;

      if (targetId && !isCreatingInstitution) {
        const existing = findInstitutionById(institutions, targetId);
        const rulesOnly = isBusinessRulesOnlyUpdate(formData);

        setInstitutions((prev) =>
          prev.map((item) =>
            item.id === targetId ? updateInstitution(item, formData) : item
          )
        );

        const institutionName = formData.name || existing?.name || '机构';
        showToast(
          rulesOnly
            ? `【${institutionName}】业务规则配置已成功保存！`
            : `【${institutionName}】配置信息更新成功！`
        );
        addAuditLog(
          rulesOnly ? '配置机构业务规则' : '修改机构配置',
          `${institutionName} (ID: ${targetId})`
        );
        return;
      }

      const newInstitution = createInstitutionFromFormData(formData);
      setInstitutions((prev) => [newInstitution, ...prev]);
      showToast(`新增机构【${newInstitution.name}】服务创建成功！`);
      addAuditLog('新增机构', newInstitution.name);
      openInstitutionDetail(newInstitution.id);
    },
    [
      addAuditLog,
      institutions,
      isCreatingInstitution,
      openInstitutionDetail,
      selectedInstitutionId,
      showToast,
    ]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deletingInstitution) return;

    setInstitutions((prev) =>
      prev.filter((item) => item.id !== deletingInstitution.id)
    );
    showToast(`机构【${deletingInstitution.name}】已被成功删除。`);

    if (selectedInstitutionId === deletingInstitution.id) {
      openInstitutionDetail(null);
    }

    addAuditLog('删除机构', deletingInstitution.name);
    setDeletingInstitution(null);
  }, [
    addAuditLog,
    deletingInstitution,
    openInstitutionDetail,
    selectedInstitutionId,
    showToast,
  ]);

  const handleSelectExpiringInstitution = useCallback(
    (item: ExpiringInstitution) => {
      const matched = findInstitutionByExpiringItem(institutions, item);
      if (matched) {
        openInstitutionDetail(matched.id, false);
      }
    },
    [institutions, openInstitutionDetail]
  );

  const activeDetailInstitution = useMemo(
    () => findInstitutionById(institutions, selectedInstitutionId),
    [institutions, selectedInstitutionId]
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return {
    state: {
      activeTab,
      systemSubTab,
      isCreatingInstitution,
      isEditingInstitution,
      institutions,
      expiringInstitutions,
      auditLogs,
      deletingInstitution,
      toastMessage,
      activeDetailInstitution,
    },
    actions: {
      showToast,
      handleTabChange,
      handleSystemSubTabChange,
      handleEditModeChange,
      openInstitutionDetail,
      handleCloseInstitutionDetail,
      handleOpenAddInstitution,
      handleCloseAddInstitution,
      handleToggleStatus,
      handleProvisionInstitution,
      handleSaveInstitution,
      handleConfirmDelete,
      handleSelectExpiringInstitution,
      setDeletingInstitution,
    },
  };
};
