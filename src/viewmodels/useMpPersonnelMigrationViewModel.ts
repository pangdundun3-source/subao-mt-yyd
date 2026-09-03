import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  MpMigrationConfig,
  MpMigrationStatus,
  MpMigrationTask,
  MpPersonnelMigrationItem,
  WechatMpConfig,
} from '../types';
import { formatDateTime } from '../shared/date';

interface UseMpPersonnelMigrationViewModelOptions {
  institutionName: string;
  mpConfig?: WechatMpConfig;
  migrationConfig?: MpMigrationConfig;
  defaultPersonnel: MpPersonnelMigrationItem[];
  defaultTasks: MpMigrationTask[];
  onChangeMigration: (newConfig: MpMigrationConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const useMpPersonnelMigrationViewModel = ({
  institutionName,
  mpConfig,
  migrationConfig,
  defaultPersonnel,
  defaultTasks,
  onChangeMigration,
  showToast,
}: UseMpPersonnelMigrationViewModelOptions) => {
  const [personnelList, setPersonnelList] = useState(
    migrationConfig?.personnelList || defaultPersonnel
  );
  const [tasks, setTasks] = useState(migrationConfig?.taskHistory || defaultTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MpMigrationStatus>('all');
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [showPrincipleHelp, setShowPrincipleHelp] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [selectedPersonForQr, setSelectedPersonForQr] =
    useState<MpPersonnelMigrationItem | null>(null);

  const targetMpName = mpConfig?.mpName || '单位自有公众号';
  const totalCount = personnelList.length;
  const completedCount = personnelList.filter((person) => person.status === 'completed').length;
  const pendingCount = personnelList.filter(
    (person) => person.status === 'pending_scan' || person.status === 'migrating'
  ).length;
  const notStartedCount = personnelList.filter((person) => person.status === 'not_started').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredList = useMemo(
    () =>
      personnelList.filter((person) => {
        const matchesSearch =
          !searchQuery ||
          person.name.includes(searchQuery) ||
          person.department.includes(searchQuery) ||
          person.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || person.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [personnelList, searchQuery, statusFilter]
  );

  const persistMigration = (
    nextPersonnelList: MpPersonnelMigrationItem[],
    nextTasks = tasks
  ) => {
    setPersonnelList(nextPersonnelList);
    setTasks(nextTasks);
    onChangeMigration({
      enableAutoUnionIdSync: migrationConfig?.enableAutoUnionIdSync ?? true,
      enableSmsNotify: migrationConfig?.enableSmsNotify ?? true,
      enableWechatCardNotify: migrationConfig?.enableWechatCardNotify ?? true,
      personnelList: nextPersonnelList,
      taskHistory: nextTasks,
    });
  };

  const handleRemindPerson = (id: string, name: string) => {
    const updated = personnelList.map((person) =>
      person.id === id
        ? {
            ...person,
            status: 'pending_scan' as const,
            remindCount: person.remindCount + 1,
            lastRemindTime: formatDateTime(),
          }
        : person
    );
    persistMigration(updated);
    showToast(`已向【${name}】发送换绑提醒短信与微信通知！`, 'success');
  };

  const handleManualConfirmMigration = (id: string, name: string) => {
    const updated = personnelList.map((person) =>
      person.id === id
        ? {
            ...person,
            status: 'completed' as const,
            targetOpenId: `oZ4_manual_${Date.now().toString().slice(-8)}`,
            migratedTime: formatDateTime(),
            matchedVia: 'manual' as const,
          }
        : person
    );
    persistMigration(updated);
    showToast(`已人工确认完成【${name}】的换绑！`, 'success');
  };

  const handleLaunchMigrationTask = (event: FormEvent) => {
    event.preventDefault();
    setIsLaunching(true);
    showToast('正在向全员发送换绑通知...', 'info');

    window.setTimeout(() => {
      const now = formatDateTime();
      const newTask: MpMigrationTask = {
        id: `TASK-${Date.now()}`,
        taskBatchNo: `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
        taskName: `【${institutionName}】全员一键换绑迁移任务`,
        sourceMpName: '点点速豹 (平台统配)',
        targetMpName,
        totalPersonnel: totalCount,
        completedCount,
        pendingCount: totalCount - completedCount,
        failedCount: 0,
        channels: ['wechat_card', 'sms', 'qr_poster'],
        status: 'in_progress',
        createdAt: now,
        operator: '当前管理员',
        progressPercentage: completionRate,
        remark: '全员微信卡片与短信提醒',
      };
      const updatedList = personnelList.map((person) => ({
        ...person,
        status: person.status === 'completed' ? ('completed' as const) : ('pending_scan' as const),
        remindCount: person.status === 'completed' ? person.remindCount : person.remindCount + 1,
        lastRemindTime: now,
      }));
      const updatedTasks = [newTask, ...tasks];
      persistMigration(updatedList, updatedTasks);
      setIsLaunching(false);
      setShowLaunchModal(false);
      showToast(`已向 ${totalCount} 位成员下发换绑提醒！成员扫码关注新号即可自动完成绑定。`, 'success');
    }, 800);
  };

  return {
    state: {
      personnelList,
      tasks,
      searchQuery,
      statusFilter,
      showTaskDrawer,
      showPrincipleHelp,
      showLaunchModal,
      isLaunching,
      selectedPersonForQr,
      targetMpName,
      totalCount,
      completedCount,
      pendingCount,
      notStartedCount,
      completionRate,
      filteredList,
    },
    actions: {
      setSearchQuery,
      setStatusFilter,
      setShowTaskDrawer,
      setShowPrincipleHelp,
      setShowLaunchModal,
      setSelectedPersonForQr,
      handleRemindPerson,
      handleManualConfirmMigration,
      handleLaunchMigrationTask,
    },
  };
};
