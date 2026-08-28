import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { InstitutionManagement } from './components/InstitutionManagement';
import { GlobalConfig } from './components/GlobalConfig';
import { OperationsMonitoring } from './components/OperationsMonitoring';
import { SystemManagement } from './components/SystemManagement';
import { InstitutionDetailPage } from './components/InstitutionDetailPage';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ActiveTab, Institution, ExpiringInstitution, AuditLog, SystemSubModule } from './types';
import {
  initialInstitutions,
  initialExpiringInstitutions,
  initialAuditLogs,
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const saved = localStorage.getItem('admin_active_tab');
    return (saved as ActiveTab) || 'system';
  });

  const [systemSubTab, setSystemSubTab] = useState<SystemSubModule>(() => {
    const saved = localStorage.getItem('admin_system_sub_tab');
    return (saved as SystemSubModule) || 'logs';
  });

  // Secondary Page State (Selected Institution for Detail/Edit View)
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(() => {
    const savedTab = localStorage.getItem('admin_active_tab');
    if (savedTab === 'monitoring' || savedTab === 'system' || !savedTab) {
      return null;
    }
    const saved = localStorage.getItem('admin_selected_inst_id');
    if (saved === 'null') return null;
    return saved ? Number(saved) : null;
  });

  const [isEditingInstitution, setIsEditingInstitution] = useState<boolean>(() => {
    const saved = localStorage.getItem('admin_is_editing_inst');
    return saved === 'true';
  });

  // New Institution Creation Full-Page State
  const [isCreatingInstitution, setIsCreatingInstitution] = useState<boolean>(() => {
    const saved = localStorage.getItem('admin_is_creating_inst');
    return saved === 'true';
  });

  // Core Data States
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [expiringInstitutions] = useState<ExpiringInstitution[]>(
    initialExpiringInstitutions
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Modal States
  const [deletingInstitution, setDeletingInstitution] =
    useState<Institution | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const openInstitutionDetail = (id: number | null, isEdit: boolean = false) => {
    setSelectedInstitutionId(id);
    setIsCreatingInstitution(false);
    setIsEditingInstitution(isEdit);
    localStorage.removeItem('admin_is_creating_inst');
    if (isEdit) {
      localStorage.setItem('admin_is_editing_inst', 'true');
    } else {
      localStorage.removeItem('admin_is_editing_inst');
    }
    if (id !== null) {
      localStorage.setItem('admin_selected_inst_id', String(id));
    } else {
      localStorage.removeItem('admin_selected_inst_id');
    }
  };

  const handleOpenAddInstitution = () => {
    setIsCreatingInstitution(true);
    setIsEditingInstitution(true);
    localStorage.setItem('admin_is_creating_inst', 'true');
    localStorage.removeItem('admin_is_editing_inst');
    setSelectedInstitutionId(null);
    localStorage.removeItem('admin_selected_inst_id');
  };

  const handleCloseAddInstitution = () => {
    setIsCreatingInstitution(false);
    setIsEditingInstitution(false);
    localStorage.setItem('admin_is_creating_inst', 'false');
    localStorage.removeItem('admin_is_editing_inst');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    localStorage.setItem('admin_active_tab', tab);
    openInstitutionDetail(null);
    handleCloseAddInstitution();
  };

  // Handler: Toggle Institution Enabled Status
  const handleToggleStatus = (id: number) => {
    setInstitutions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.enabled;
          showToast(
            `已将【${item.name}】机构状态更改为：${
              newStatus ? '正常启用' : '人工停用'
            }`
          );

          // Add to audit logs
          const newLog: AuditLog = {
            id: `LOG-${Date.now()}`,
            operator: '王飞飞',
            department: '产品二部',
            action: '切换机构状态',
            target: `${item.name} (${newStatus ? '启用' : '停用'})`,
            ip: '192.168.1.104',
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: '成功',
          };
          setAuditLogs((logs) => [newLog, ...logs]);

          return { ...item, enabled: newStatus };
        }
        return item;
      })
    );
  };

  // Handler: Provision expired institution and enable it
  const handleProvisionInstitution = (
    id: number,
    provisionData: {
      status: '正式' | '试用';
      startDate: string;
      endDate: string;
      daysRemaining: number;
    }
  ) => {
    setInstitutions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          showToast(
            `已成功为【${item.name}】开通【${provisionData.status}】服务（有效期至 ${provisionData.endDate}），机构已开启成功！`
          );

          // Add to audit logs
          const newLog: AuditLog = {
            id: `LOG-${Date.now()}`,
            operator: '王飞飞',
            department: '产品二部',
            action: '开通服务并启用机构',
            target: `${item.name} (开通${provisionData.status}服务至 ${provisionData.endDate})`,
            ip: '192.168.1.104',
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: '成功',
          };
          setAuditLogs((logs) => [newLog, ...logs]);

          return {
            ...item,
            status: provisionData.status,
            startDate: provisionData.startDate,
            endDate: provisionData.endDate,
            daysRemaining: provisionData.daysRemaining,
            enabled: true,
          };
        }
        return item;
      })
    );
  };

  // Handler: Save Add or Edit from full-page detail/create view
  const handleSaveInstitution = (formData: Partial<Institution>) => {
    const targetId = formData.id || selectedInstitutionId;

    if (targetId && !isCreatingInstitution) {
      const existing = institutions.find((i) => i.id === targetId);
      const isRulesOnly = Boolean(formData.businessRules && !formData.name);
      
      // Edit / Update existing
      setInstitutions((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? ({ ...item, ...formData } as Institution)
            : item
        )
      );

      const instName = formData.name || existing?.name || '机构';
      showToast(
        isRulesOnly
          ? `【${instName}】业务规则配置已成功保存！`
          : `【${instName}】配置信息更新成功！`
      );

      // Add to audit logs
      const newLog: AuditLog = {
        id: `LOG-${Date.now()}`,
        operator: '王飞飞',
        department: '产品二部',
        action: isRulesOnly ? '配置机构业务规则' : '修改机构配置',
        target: `${instName} (ID: ${targetId})`,
        ip: '192.168.1.104',
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: '成功',
      };
      setAuditLogs((logs) => [newLog, ...logs]);
    } else {
      // Add new
      const newInstId = Date.now();
      const newInst: Institution = {
        id: newInstId,
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
      };
      setInstitutions((prev) => [newInst, ...prev]);
      showToast(`新增机构【${newInst.name}】服务创建成功！`);

      // Add to audit logs
      const newLog: AuditLog = {
        id: `LOG-${Date.now()}`,
        operator: '王飞飞',
        department: '产品二部',
        action: '新增机构',
        target: newInst.name,
        ip: '192.168.1.104',
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: '成功',
      };
      setAuditLogs((logs) => [newLog, ...logs]);

      // Navigate to the newly created institution's detail page or back to list
      openInstitutionDetail(newInstId);
    }
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingInstitution) {
      setInstitutions((prev) =>
        prev.filter((item) => item.id !== deletingInstitution.id)
      );
      showToast(`机构【${deletingInstitution.name}】已被成功删除。`);

      if (selectedInstitutionId === deletingInstitution.id) {
        openInstitutionDetail(null);
      }

      // Add to audit log
      const newLog: AuditLog = {
        id: `LOG-${Date.now()}`,
        operator: '王飞飞',
        department: '产品二部',
        action: '删除机构',
        target: deletingInstitution.name,
        ip: '192.168.1.104',
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: '成功',
      };
      setAuditLogs((logs) => [newLog, ...logs]);

      setDeletingInstitution(null);
    }
  };

  // Find active institution for secondary page
  const activeDetailInstitution = selectedInstitutionId
    ? institutions.find((i) => i.id === selectedInstitutionId)
    : null;

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1890ff] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-bounce">
          <span className="material-symbols-outlined text-[20px]">
            info
          </span>
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar */}
      <Header onLogout={() => showToast('已成功安全退出管理系统')} />

      {/* Main Container Layout */}
      <div className="flex w-full flex-1 pt-[74px]">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          systemSubTab={systemSubTab}
          setSystemSubTab={setSystemSubTab}
        />

        {/* Right Content Body */}
        <main className="flex-1 bg-[#f5f7fa] overflow-y-auto overflow-x-auto min-h-[calc(100vh-74px)]">
          {/* If create mode is open, show the full Add Institution Page */}
          {isCreatingInstitution ? (
            <InstitutionDetailPage
              isCreateMode={true}
              onBack={handleCloseAddInstitution}
              onSave={handleSaveInstitution}
              auditLogs={auditLogs}
            />
          ) : activeDetailInstitution ? (
            /* If secondary institution detail page is open */
            <InstitutionDetailPage
              key={`inst-${activeDetailInstitution.id}-${isEditingInstitution ? 'edit' : 'detail'}`}
              institution={activeDetailInstitution}
              isCreateMode={false}
              initialIsEditing={isEditingInstitution}
              onEditModeChange={(isEdit) => {
                setIsEditingInstitution(isEdit);
                localStorage.setItem('admin_is_editing_inst', isEdit ? 'true' : 'false');
              }}
              onBack={() => openInstitutionDetail(null)}
              onSave={handleSaveInstitution}
              onDelete={(inst) => setDeletingInstitution(inst)}
              onToggleStatus={handleToggleStatus}
              auditLogs={auditLogs}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <DashboardHome
                  expiringInstitutions={expiringInstitutions}
                  onSelectInstitution={(item) => {
                    const matched = institutions.find((i) => i.name === item.name) || institutions[0];
                    if (matched) openInstitutionDetail(matched.id, false);
                  }}
                  setActiveTab={handleTabChange}
                />
              )}

              {activeTab === 'institutions' && (
                <InstitutionManagement
                  institutions={institutions}
                  onAddClick={handleOpenAddInstitution}
                  onEditClick={(inst) => {
                    openInstitutionDetail(inst.id, true);
                  }}
                  onDetailClick={(inst) => {
                    openInstitutionDetail(inst.id, false);
                  }}
                  onDeleteClick={(inst) => setDeletingInstitution(inst)}
                  onToggleStatus={handleToggleStatus}
                  onProvisionInstitution={handleProvisionInstitution}
                />
              )}

              {activeTab === 'config' && <GlobalConfig onShowToast={showToast} />}

              {activeTab === 'monitoring' && <OperationsMonitoring />}

              {activeTab === 'system' && (
                <SystemManagement
                  auditLogs={auditLogs}
                  initialSubTab={systemSubTab}
                  onSubTabChange={(sub) => setSystemSubTab(sub)}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        institution={deletingInstitution}
        onClose={() => setDeletingInstitution(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
