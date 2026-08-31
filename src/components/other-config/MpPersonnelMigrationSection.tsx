import React, { useState, useMemo } from 'react';
import {
  MpMigrationConfig,
  MpPersonnelMigrationItem,
  MpMigrationTask,
  MpMigrationStatus,
  WechatMpConfig,
} from '../../types';

export const mockMigrationPersonnel: MpPersonnelMigrationItem[] = [
  {
    id: 'MIG-USER-001',
    name: '张建国',
    nickname: '建国-随州采编',
    phone: '138****6721',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    department: '新闻采编部',
    role: '速报采编员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_892301984210a',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_781209384112b',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 14:22:10',
    remindCount: 1,
    inheritedRoles: ['速报采编员', '初审编辑'],
    inheritedDraftsCount: 18,
    inheritedPoints: 120,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-002',
    name: '李丽华',
    nickname: '丽华-随州融媒',
    phone: '139****1823',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    department: '新媒体运营中心',
    role: '机构管理员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_119283471029c',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_992182736154k',
    status: 'completed',
    matchedVia: 'wechat_template_card',
    migratedTime: '2026-08-28 15:40:02',
    remindCount: 1,
    inheritedRoles: ['机构超级管理员', '终审发稿'],
    inheritedDraftsCount: 42,
    inheritedPoints: 350,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-003',
    name: '王小伟',
    nickname: '小伟摄影',
    phone: '137****5612',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    department: '影像摄制组',
    role: '速报采编员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_551920384712d',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'pending_scan',
    matchedVia: 'qr_scan',
    remindCount: 2,
    inheritedRoles: ['现场快报员'],
    inheritedDraftsCount: 7,
    inheritedPoints: 45,
    lastRemindTime: '2026-08-29 09:30:00',
  },
  {
    id: 'MIG-USER-004',
    name: '赵子涵',
    nickname: '子涵-热线跟进',
    phone: '136****9928',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    department: '舆情监测科',
    role: '舆情监测员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_772819034812f',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_331928471920m',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 16:10:45',
    remindCount: 1,
    inheritedRoles: ['舆情快报审发'],
    inheritedDraftsCount: 29,
    inheritedPoints: 210,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-005',
    name: '刘志强',
    nickname: '志强-应急报送',
    phone: '135****4419',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    department: '应急联动中心',
    role: '速报采编员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_991823746192e',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'pending_scan',
    matchedVia: 'sms_invite',
    remindCount: 3,
    inheritedRoles: ['应急速报员'],
    inheritedDraftsCount: 12,
    inheritedPoints: 95,
    lastRemindTime: '2026-08-30 08:15:00',
  },
  {
    id: 'MIG-USER-006',
    name: '陈敏',
    nickname: '敏敏-政务播报',
    phone: '133****8871',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    department: '政务新闻部',
    role: '普通成员',
    sourceMp: '点点速豹',
    sourceOpenId: 'o4_ddsb_662819203817h',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'not_started',
    matchedVia: 'manual',
    remindCount: 0,
    inheritedRoles: ['普通成员'],
    inheritedDraftsCount: 0,
    inheritedPoints: 15,
    lastRemindTime: '2026-08-28 10:00:00',
  },
];

export const mockMigrationTasks: MpMigrationTask[] = [
  {
    id: 'TASK-MIG-20260828',
    taskBatchNo: 'BATCH-20260828-01',
    taskName: '随州市网信中心全员换绑任务（点点速豹 -> 随州融媒发布）',
    sourceMpName: '点点速豹 (平台统配)',
    targetMpName: '随州融媒发布 (官方服务号)',
    totalPersonnel: 6,
    completedCount: 3,
    pendingCount: 2,
    failedCount: 1,
    channels: ['wechat_card', 'sms', 'qr_poster'],
    status: 'in_progress',
    createdAt: '2026-08-28 10:00:00',
    operator: '系统管理员 (廖伟)',
    progressPercentage: 50,
    remark: '全员定向推送换绑卡片与短信提醒',
  },
];

interface MpPersonnelMigrationSectionProps {
  institutionName: string;
  mpConfig?: WechatMpConfig;
  migrationConfig?: MpMigrationConfig;
  onChangeMigration: (newConfig: MpMigrationConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const MpPersonnelMigrationSection: React.FC<MpPersonnelMigrationSectionProps> = ({
  institutionName,
  mpConfig,
  migrationConfig,
  onChangeMigration,
  showToast,
}) => {
  const [personnelList, setPersonnelList] = useState<MpPersonnelMigrationItem[]>(
    migrationConfig?.personnelList || mockMigrationPersonnel
  );
  const [tasks, setTasks] = useState<MpMigrationTask[]>(
    migrationConfig?.taskHistory || mockMigrationTasks
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MpMigrationStatus>('all');
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [showPrincipleHelp, setShowPrincipleHelp] = useState(false);

  // Launch New Batch Migration Modal State
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const targetMpName = mpConfig?.mpName || '单位自有公众号';
  const [isLaunching, setIsLaunching] = useState(false);

  // Individual Personnel Migration QR Modal
  const [selectedPersonForQr, setSelectedPersonForQr] = useState<MpPersonnelMigrationItem | null>(null);

  // Quick Stats
  const totalCount = personnelList.length;
  const completedCount = personnelList.filter((p) => p.status === 'completed').length;
  const pendingCount = personnelList.filter((p) => p.status === 'pending_scan' || p.status === 'migrating').length;
  const notStartedCount = personnelList.filter((p) => p.status === 'not_started').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered list
  const filteredList = useMemo(() => {
    return personnelList.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.includes(searchQuery) ||
        p.department.includes(searchQuery) ||
        p.phone.includes(searchQuery);

      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [personnelList, searchQuery, statusFilter]);

  // Handle single user remind
  const handleRemindPerson = (id: string, name: string) => {
    setPersonnelList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'pending_scan',
            remindCount: p.remindCount + 1,
            lastRemindTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
          };
        }
        return p;
      })
    );
    showToast(`已向【${name}】发送换绑提醒短信与微信通知！`, 'success');
  };

  // Handle manual confirm migration
  const handleManualConfirmMigration = (id: string, name: string) => {
    setPersonnelList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'completed',
            targetOpenId: `oZ4_manual_${Date.now().toString().slice(-8)}`,
            migratedTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
            matchedVia: 'manual',
          };
        }
        return p;
      })
    );
    showToast(`已人工确认完成【${name}】的换绑！`, 'success');
  };

  // Handle Launch Batch Migration
  const handleLaunchMigrationTask = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    showToast('正在向全员发送换绑通知...', 'info');

    setTimeout(() => {
      setIsLaunching(false);
      const newTask: MpMigrationTask = {
        id: `TASK-${Date.now()}`,
        taskBatchNo: `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
        taskName: `【${institutionName}】全员一键换绑迁移任务`,
        sourceMpName: '点点速豹 (平台统配)',
        targetMpName: targetMpName,
        totalPersonnel: totalCount,
        completedCount: completedCount,
        pendingCount: totalCount - completedCount,
        failedCount: 0,
        channels: ['wechat_card', 'sms', 'qr_poster'],
        status: 'in_progress',
        createdAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
        operator: '当前管理员',
        progressPercentage: completionRate,
        remark: '全员微信卡片与短信提醒',
      };

      const updatedList = personnelList.map((p) => ({
        ...p,
        status: p.status === 'completed' ? 'completed' : ('pending_scan' as MpMigrationStatus),
        remindCount: p.status === 'completed' ? p.remindCount : p.remindCount + 1,
        lastRemindTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
      }));

      setTasks([newTask, ...tasks]);
      setPersonnelList(updatedList);
      setShowLaunchModal(false);
      showToast(`已向 ${totalCount} 位成员下发换绑提醒！成员扫码关注新号即可自动完成绑定。`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-4 text-gray-800">
      {/* 1. Clear, Simple Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
        {/* Top Title & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1890ff] rounded-xs" />
                <span>人员一键换绑迁移</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1890ff] font-semibold border border-blue-200">
                点点速豹 → {targetMpName}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              单位切换为自有公众号后，点击「一键发起迁移」，采编员扫码关注新公众号即可完成换绑，<strong>原发稿记录与权限自动保留</strong>。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLaunchModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>发起全员一键迁移</span>
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('已向待迁移的成员发送短信与微信催办提醒！', 'success');
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>一键催办待换绑人员</span>
            </button>
          </div>
        </div>

        {/* 3 Step Simple Visual Card Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {/* Status 1: Completed */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900">已完成换绑 ({completedCount}人)</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">已正常在新公众号上岗收发</div>
              </div>
            </div>
            <div className="text-xl font-black font-mono text-emerald-700">
              {completedCount} <span className="text-xs font-normal">人</span>
            </div>
          </div>

          {/* Status 2: Pending Scan */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">pending</span>
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900">等待扫码换绑 ({pendingCount}人)</div>
                <div className="text-[11px] text-amber-700 mt-0.5">已发送短信与微信通知</div>
              </div>
            </div>
            <div className="text-xl font-black font-mono text-amber-700">
              {pendingCount} <span className="text-xs font-normal">人</span>
            </div>
          </div>

          {/* Status 3: Progress Bar */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">全员迁移进度</span>
              <span className="text-xs font-black font-mono text-[#1890ff]">{completionRate}%</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden my-1">
              <div
                className="bg-[#1890ff] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="text-[11px] text-blue-700 flex items-center justify-between">
              <span>总人数: {totalCount} 人</span>
              <span className="text-gray-500">剩余: {totalCount - completedCount} 人</span>
            </div>
          </div>
        </div>

        {/* Explain Card Toggle */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowPrincipleHelp(!showPrincipleHelp)}
            className="text-gray-500 hover:text-[#1890ff] flex items-center gap-1 font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#1890ff]">info</span>
            <span>{showPrincipleHelp ? '收起换绑原理说明' : '采编人员怎么换绑？（点此查看说明）'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTaskDrawer(!showTaskDrawer)}
            className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>查看历史下发日志 ({tasks.length}次)</span>
          </button>
        </div>

        {/* Expandable Explanation */}
        {showPrincipleHelp && (
          <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2 animate-fade-in text-gray-600">
            <div className="font-bold text-gray-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#1890ff]">check_circle</span>
              <span>换绑非常简单，只需 1 步：</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1">
              <li>管理员点击「发起全员一键迁移」后，系统会自动向采编员的微信和手机发送一条换绑指引通知；</li>
              <li>采编员点击链接或扫描新公众号二维码关注，系统自动完成新老账号关联，历史稿件和积分 100% 保留；</li>
              <li>如遇个别人员未收到通知，可点击右侧的「专属迁移码」单独发送给他，或直接点击「人工确认」。</li>
            </ol>
          </div>
        )}
      </div>

      {/* 2. Clear Personnel Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-3.5">
        {/* Table Search & Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-gray-600">group</span>
              <span>机构人员换绑名单列表</span>
            </h4>
            <span className="text-[11px] text-gray-400">（共 {personnelList.length} 人）</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Quick Filter */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                  statusFilter === 'all' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                全部 ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending_scan')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                  statusFilter === 'pending_scan' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                待换绑 ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                  statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                已完成 ({completedCount})
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-gray-400 text-[15px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索姓名或手机号..."
                className="pl-7 pr-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#1890ff] w-40"
              />
            </div>
          </div>
        </div>

        {/* Clean, Legible Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold select-none">
                <tr>
                  <th className="py-2.5 px-4">人员姓名</th>
                  <th className="py-2.5 px-4">部门与角色</th>
                  <th className="py-2.5 px-4">历史保留资产</th>
                  <th className="py-2.5 px-4">换绑状态</th>
                  <th className="py-2.5 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      未找到相关人员
                    </td>
                  </tr>
                ) : (
                  filteredList.map((person) => {
                    const isCompleted = person.status === 'completed';
                    return (
                      <tr key={person.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* 1. Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{person.name}</div>
                              <div className="text-[11px] text-gray-400 font-mono">{person.phone}</div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Dept & Role */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{person.department}</div>
                          <span className="text-[10px] text-gray-500">
                            {person.role}
                          </span>
                        </td>

                        {/* 3. Assets */}
                        <td className="py-3 px-4">
                          <div className="text-gray-600 text-[11px]">
                            稿件: <strong>{person.inheritedDraftsCount}</strong>篇 · 积分: <strong>{person.inheritedPoints}</strong>分
                          </div>
                          <div className="text-[10px] text-emerald-600">权限与稿件已预留</div>
                        </td>

                        {/* 4. Status */}
                        <td className="py-3 px-4">
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                              已成功换绑
                            </span>
                          ) : (
                            <div>
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                待扫码换绑
                              </span>
                              {person.remindCount > 0 && (
                                <span className="text-[10px] text-gray-400 ml-1.5">
                                  (已提醒{person.remindCount}次)
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 5. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {!isCompleted ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRemindPerson(person.id, person.name)}
                                  className="text-xs text-[#1890ff] hover:underline font-semibold cursor-pointer"
                                >
                                  重发提醒
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPersonForQr(person)}
                                  className="text-xs text-purple-600 hover:underline font-semibold cursor-pointer"
                                >
                                  专属二维码
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleManualConfirmMigration(person.id, person.name)}
                                  className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                                >
                                  直接确认
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-gray-400">已就绪</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task Log Drawer / Modal */}
      {showTaskDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-scale-in p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#1890ff]">history</span>
                <span>换绑任务下发记录</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTaskDrawer(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                    <span>{task.taskName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-[#1890ff] rounded">
                      进行中
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    发起时间：{task.createdAt} · 经办人：{task.operator}
                  </div>
                  <div className="text-gray-500 text-[11px] mt-1">
                    迁移进度：已完成 {task.completedCount} / 总计 {task.totalPersonnel} 人（{task.progressPercentage}%）
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => setShowTaskDrawer(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Launch Batch Migration Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-5 py-3.5 bg-[#1890ff] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                <span className="font-bold text-sm">发起全员一键换绑</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLaunchModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleLaunchMigrationTask} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-gray-700 space-y-1">
                <div className="font-bold text-blue-900">迁移路径：点点速豹 → {targetMpName}</div>
                <div className="text-gray-600">系统将自动向全员 <strong>{totalCount}</strong> 位采编人员发送换绑微信卡片与短信提醒。</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs">
                ✓ 历史发稿记录、积分与权限将 100% 自动继承保留，无需重复开通。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLaunching}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">{isLaunching ? 'sync' : 'send'}</span>
                  <span>{isLaunching ? '正在下发...' : '确认立即下发'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual QR Modal */}
      {selectedPersonForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xs overflow-hidden animate-scale-in p-5 text-center">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
              <span className="font-bold text-xs text-gray-900">【{selectedPersonForQr.name}】专属换绑码</span>
              <button
                type="button"
                onClick={() => setSelectedPersonForQr(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block mb-2">
              <div className="w-36 h-36 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                <span className="material-symbols-outlined text-[40px]">qr_code_2</span>
                <span className="text-[10px] font-bold mt-1">{selectedPersonForQr.name} 专属码</span>
                <span className="text-[8px] text-purple-200">扫码直接绑定新公众号</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              请将此码微信发送给该人员，扫码后将自动完成换绑
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`已复制【${selectedPersonForQr.name}】专属换绑短链！`);
                  setSelectedPersonForQr(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 cursor-pointer"
              >
                复制换绑短链
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
